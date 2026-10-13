package com.fitflow.controller;

import com.fitflow.dto.ProfileRequest;
import com.fitflow.dto.UserResponse;
import com.fitflow.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/profile", "/api/v1/profile"})
public class ProfileController {

    private final ProfileService profileService;
    private final com.fitflow.service.AuthService authService;

    public ProfileController(ProfileService profileService, com.fitflow.service.AuthService authService) {
        this.profileService = profileService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.getMe(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<UserResponse> saveProfile(Authentication authentication, @RequestBody ProfileRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(profileService.saveProfile(authentication.getName(), request));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(Authentication authentication, @RequestBody ProfileRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(profileService.updateProfile(authentication.getName(), request));
    }
}
