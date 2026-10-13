package com.fitflow.controller;

import com.fitflow.dto.ProgressRequest;
import com.fitflow.entity.ProgressRecord;
import com.fitflow.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping
    public ResponseEntity<ProgressRecord> logProgress(Authentication authentication, @RequestBody ProgressRequest request) {
        return ResponseEntity.ok(progressService.logProgress(authentication.getName(), request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProgressRecord>> getMyProgress(Authentication authentication) {
        return ResponseEntity.ok(progressService.getMyProgress(authentication.getName()));
    }
}
