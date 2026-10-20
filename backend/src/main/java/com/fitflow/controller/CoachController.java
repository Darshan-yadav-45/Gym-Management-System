package com.fitflow.controller;

import com.fitflow.dto.CoachDto;
import com.fitflow.dto.SubscriptionDto;
import com.fitflow.service.CoachService;
import com.fitflow.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coaches")
@RequiredArgsConstructor
public class CoachController {

    private final CoachService coachService;
    private final SubscriptionService subscriptionService;

    /**
     * GET /api/coaches?tier=FREE&category=YOGA_FLEXIBILITY&gender=female
     * Returns all active coaches with optional filters.
     * The requesting user's selected coach is flagged with selected=true.
     */
    @GetMapping
    public ResponseEntity<List<CoachDto>> getAllCoaches(
            @RequestParam(required = false) String tier,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String gender,
            Authentication auth) {

        String userEmail = (auth != null) ? auth.getName() : null;
        List<CoachDto> coaches = coachService.getAllCoaches(tier, category, gender, userEmail);
        return ResponseEntity.ok(coaches);
    }

    /**
     * GET /api/coaches/{id}
     * Returns a single coach profile.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CoachDto> getCoach(@PathVariable Long id) {
        return ResponseEntity.ok(coachService.getCoachById(id));
    }

    /**
     * GET /api/coaches/my-coach
     * Returns the authenticated user's selected coach, or 204 if none selected.
     */
    @GetMapping("/my-coach")
    public ResponseEntity<?> getMyCoach(Authentication auth) {
        CoachDto coach = coachService.getUserCoachPreference(auth.getName());
        if (coach == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(coach);
    }

    /**
     * POST /api/coaches/{id}/select
     * Selects a coach for the authenticated user.
     * FREE coaches: available to all.
     * PREMIUM coaches: requires active premium subscription — checked server-side.
     */
    @PostMapping("/{id}/select")
    public ResponseEntity<?> selectCoach(@PathVariable Long id, Authentication auth) {
        try {
            CoachDto coach = coachService.getCoachById(id);

            if ("PREMIUM".equals(coach.getTier())) {
                boolean hasPremium = subscriptionService.hasPremiumAccess(auth.getName());
                CoachDto result = coachService.selectPremiumCoach(auth.getName(), id, hasPremium);
                return ResponseEntity.ok(result);
            } else {
                CoachDto result = coachService.selectCoach(auth.getName(), id);
                return ResponseEntity.ok(result);
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * GET /api/coaches/my-subscription
     * Returns the authenticated user's subscription status.
     */
    @GetMapping("/my-subscription")
    public ResponseEntity<SubscriptionDto> getMySubscription(Authentication auth) {
        return ResponseEntity.ok(subscriptionService.getMySubscription(auth.getName()));
    }
}
