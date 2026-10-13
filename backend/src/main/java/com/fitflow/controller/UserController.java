package com.fitflow.controller;

import com.fitflow.dto.UserResponse;
import com.fitflow.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/users", "/api/v1/users"})
public class UserController {

    private final AuthService authService;
    private final com.fitflow.service.ProfileService profileService;

    public UserController(AuthService authService, com.fitflow.service.ProfileService profileService) {
        this.authService = authService;
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.getMe(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(
            Authentication authentication,
            @RequestBody com.fitflow.dto.ProfileRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(profileService.updateProfile(authentication.getName(), request));
    }
}
