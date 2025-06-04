package dev.max.invana.controllers;

import dev.max.invana.dtos.RegisterUserDto;
import dev.max.invana.dtos.UpdatePasswordDto;
import dev.max.invana.entities.User;
import dev.max.invana.services.FileService;
import dev.max.invana.services.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
    private final FileService fileService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<User>> allUsers() {
        return ResponseEntity.ok(userService.allUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<User> createUser(@RequestPart("user") RegisterUserDto dto, @RequestPart(value="avatar", required = false)MultipartFile avatarFile) {
        try {
            String avatarFilename = fileService.saveAvatarFile(avatarFile);
            User user = userService.createUser(dto, User.Role.valueOf(dto.getRole().toUpperCase()), avatarFilename);
            return ResponseEntity.ok(user);
        } catch (AccessDeniedException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/avatars/{filename:.+}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String filename) {
        String contentType = fileService.getAvatarFileContentType(filename);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream")).body(fileService.getAvatarFile(filename));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable String id, @RequestBody UpdatePasswordDto request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();

        if (authUser.getId().equalsIgnoreCase(id) || authUser.getRole() == User.Role.ADMIN) {
            userService.updatePassword(id, request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully.");
        }

        return ResponseEntity.status(403).body("Not authorized to update this user's password.");
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

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestPart("user") User updatedUser, @RequestPart(value="avatar", required = false) MultipartFile avatarFile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();

        if(authUser.getId().equalsIgnoreCase(id) || authUser.getRole().equals(User.Role.ADMIN)) {

            String avatarFilename = fileService.saveAvatarFile(avatarFile);
            updatedUser.setAvatar(avatarFilename);
            User user = userService.updateUser(id, updatedUser);

            System.out.println("Received user: " + updatedUser.getFullName() + ":" + updatedUser.getPassword());
            System.out.println("Received file: " + (avatarFile != null ? avatarFile.getOriginalFilename() : "null"));

            return ResponseEntity.ok(user);
        }

        return ResponseEntity.badRequest().body(null);
    }

}