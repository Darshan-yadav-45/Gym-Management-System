package com.fitflow.controller;

import com.fitflow.dto.OnboardingRequest;
import com.fitflow.dto.OnboardingResponse;
import com.fitflow.service.OnboardingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final OnboardingService onboardingService;

    @PostMapping
    public ResponseEntity<OnboardingResponse> submitOnboarding(
            Authentication authentication,
            @RequestBody OnboardingRequest request) {
            
        OnboardingResponse response = onboardingService.processOnboarding(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }
}
