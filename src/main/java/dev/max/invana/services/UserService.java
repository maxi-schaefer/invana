package dev.max.invana.services;

import dev.max.invana.dtos.RegisterUserDto;
import dev.max.invana.entities.User;
import dev.max.invana.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.beans.PropertyDescriptor;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * @author Max
 * @since 10/3/2024
 */

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();

        userRepo.findAll().forEach(users::add);

        return users;
    }

    public void deleteUser(String id) {
        Optional<User> user = userRepo.findById(id);
        user.ifPresent(userRepo::delete);
    }

    public User updateUser(String id, User updatedUser) {
        Optional<User> dbUser = userRepo.findById(id);

        if(dbUser.isPresent()) {
            User existing = dbUser.get();

            if(!existing.getEmail().equals(updatedUser.getEmail()) && userRepo.findByEmail(updatedUser.getEmail()).isPresent()) {
                throw new RuntimeException("An User with this email already exists");
            }

            if(updatedUser.getPassword() != null) {
                updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }

            BeanUtils.copyProperties(updatedUser, existing, getNullPropertyNames(updatedUser));

            return userRepo.save(existing);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }

    private String[] getNullPropertyNames(User source) {
        // Use BeanUtils or any utility to get null property names
        return Arrays.stream(BeanUtils.getPropertyDescriptors(User.class))
                .filter(pd -> {
                    try {
                        return pd.getReadMethod().invoke(source) == null;
                    } catch (Exception e) {
                        return false;
                    }
                })
                .map(PropertyDescriptor::getName)
                .toArray(String[]::new);
    }

    public User createUser(RegisterUserDto dto, User.Role role) throws AccessDeniedException {
        User.Role finalRole = (role == null) ? User.Role.USER : role;

        // Only allow admins to assign ADMIN role
        if(finalRole == User.Role.ADMIN && !isCurrentUserAdmin()) {
            throw new AccessDeniedException("Only admins can create admin users.");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(finalRole);

        return userRepo.save(user);
    }

    public boolean isCurrentUserAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return user.getRole() == User.Role.ADMIN;
    }
}