package dev.max.invana.controllers;

import dev.max.invana.dtos.RegisterUserDto;
import dev.max.invana.entities.User;
import dev.max.invana.services.JwtService;
import dev.max.invana.services.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

/**
 * @author Max
 * @since 10/3/2024
 */

@RequestMapping("/api/users")
@Slf4j
@RestController
@AllArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<User>> allUsers() {
        return ResponseEntity.ok(userService.allUsers());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody RegisterUserDto dto) {
        try {
            User user = userService.createUser(dto, User.Role.valueOf(dto.getRole().toUpperCase()));
            return ResponseEntity.ok(user);
        } catch (AccessDeniedException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = (User) authentication.getPrincipal();

        if(user.getId().equalsIgnoreCase(id) || user.getRole().equals(User.Role.USER)) {
            log.info("Deleting User with following ID: " + id);
            userService.deleteUser(id);
            return ResponseEntity.ok("Successfully deleted User!");
        }

        return ResponseEntity.badRequest().body("You are not allowed to delete this user!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();

        if(authUser.getId().equalsIgnoreCase(id) || authUser.getRole().equals(User.Role.ADMIN)) {
            User user = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(user);
        }

        return ResponseEntity.badRequest().body(null);
    }

}