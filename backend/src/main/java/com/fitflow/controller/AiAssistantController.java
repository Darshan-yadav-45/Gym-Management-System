package com.fitflow.controller;

import com.fitflow.service.AiAssistantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/assistant")
    public ResponseEntity<Map<String, String>> askAssistant(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "");
        return ResponseEntity.ok(aiAssistantService.getAdvice(message));
    }
}
