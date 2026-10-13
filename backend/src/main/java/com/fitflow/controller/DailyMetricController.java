package com.fitflow.controller;

import com.fitflow.dto.DailyMetricRequest;
import com.fitflow.dto.DailyMetricResponse;
import com.fitflow.service.DailyMetricService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DailyMetricController {

    private final DailyMetricService dailyMetricService;

    public DailyMetricController(DailyMetricService dailyMetricService) {
        this.dailyMetricService = dailyMetricService;
    }

    // Supports both /api/v1/metrics/log and /api/metrics/log
    @PostMapping({"/api/v1/metrics/log", "/api/metrics/log"})
    public ResponseEntity<DailyMetricResponse> logMetrics(
            Authentication authentication,
            @Valid @RequestBody DailyMetricRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        DailyMetricResponse response = dailyMetricService.logMetrics(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }

    // Supports both /api/v1/metrics/today and /api/metrics/today
    @GetMapping({"/api/v1/metrics/today", "/api/metrics/today"})
    public ResponseEntity<DailyMetricResponse> getTodayMetrics(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        DailyMetricResponse response = dailyMetricService.getTodayMetrics(authentication.getName());
        return ResponseEntity.ok(response);
    }

    // Supports /api/v1/metrics/today/{userId} and /api/metrics/today/{userId} with authorization check
    @GetMapping({"/api/v1/metrics/today/{userId}", "/api/metrics/today/{userId}"})
    public ResponseEntity<?> getTodayMetricsByUserId(
            Authentication authentication,
            @PathVariable Long userId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            DailyMetricResponse response = dailyMetricService.getTodayMetricsForUser(authentication.getName(), userId);
            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // History endpoint
    @GetMapping({"/api/v1/metrics/history", "/api/metrics/history"})
    public ResponseEntity<List<DailyMetricResponse>> getMetricsHistory(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<DailyMetricResponse> response = dailyMetricService.getHistory(authentication.getName());
        return ResponseEntity.ok(response);
    }
}
