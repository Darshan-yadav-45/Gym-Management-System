package com.fitflow.controller;

import com.fitflow.dto.WaterLogRequest;
import com.fitflow.entity.WaterLog;
import com.fitflow.service.WaterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/water")
@RequiredArgsConstructor
public class WaterController {

    private final WaterService waterService;

    @PostMapping
    public ResponseEntity<WaterLog> logWater(Authentication authentication, @Valid @RequestBody WaterLogRequest request) {
        return ResponseEntity.ok(waterService.logWater(authentication.getName(), request));
    }

    @GetMapping("/today")
    public ResponseEntity<Integer> getTodayWater(Authentication authentication) {
        return ResponseEntity.ok(waterService.getTodayWater(authentication.getName()));
    }
}
