package com.fitflow.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;

@Service
public class AiAssistantService {
    
    public Map<String, String> getAdvice(String message) {
        Map<String, String> response = new HashMap<>();
        
        // Fallback response for AI Assistant if no API keys are used.
        if (message.toLowerCase().contains("home") || message.toLowerCase().contains("can't go to gym")) {
            response.put("reply", "No worries! If you can't make it to the gym, try a 15-minute home workout: Push-ups, Squats, Planks, and Lunges.");
        } else if (message.toLowerCase().contains("diet") || message.toLowerCase().contains("food")) {
            response.put("reply", "Remember to stay hydrated and eat enough protein to support your muscle recovery. I am a fitness assistant, not a doctor!");
        } else {
            response.put("reply", "That's a great question! Stay consistent with your routine. Can I help you track a workout or water today?");
        }
        
        return response;
    }
}
