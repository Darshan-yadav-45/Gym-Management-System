package com.fitflow.service;

import com.fitflow.dto.CoachDto;
import com.fitflow.entity.AiCoach;
import com.fitflow.entity.User;
import com.fitflow.entity.UserCoachPreference;
import com.fitflow.entity.enums.CoachCategory;
import com.fitflow.entity.enums.CoachTier;
import com.fitflow.repository.AiCoachRepository;
import com.fitflow.repository.UserCoachPreferenceRepository;
import com.fitflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoachService {

    private final AiCoachRepository coachRepository;
    private final UserCoachPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    /**
     * Returns all active coaches, optionally filtered by tier/category/gender.
     * Marks the currently selected coach when userEmail is provided.
     */
    public List<CoachDto> getAllCoaches(String tierFilter, String categoryFilter,
                                        String genderFilter, String userEmail) {
        CoachTier tier = parseTier(tierFilter);
        CoachCategory category = parseCategory(categoryFilter);
        String gender = (genderFilter != null && !genderFilter.isBlank()) ? genderFilter.trim() : null;

        List<AiCoach> coaches = coachRepository.findByActiveTrue();

        if (tier != null) {
            coaches = coaches.stream()
                    .filter(c -> c.getTier() == tier)
                    .collect(Collectors.toList());
        }
        if (category != null) {
            coaches = coaches.stream()
                    .filter(c -> c.getPrimaryCategory() == category ||
                            (c.getSupportedCategories() != null && c.getSupportedCategories().contains(category)))
                    .collect(Collectors.toList());
        }
        if (gender != null) {
            coaches = coaches.stream()
                    .filter(c -> c.getGender() != null && c.getGender().equalsIgnoreCase(gender))
                    .collect(Collectors.toList());
        }

        Long selectedCoachId = resolveSelectedCoachId(userEmail);

        return coaches.stream().map(coach -> {
            CoachDto dto = CoachDto.from(coach);
            dto.setSelected(coach.getId().equals(selectedCoachId));
            return dto;
        }).collect(Collectors.toList());
    }

    /** Returns a single coach by ID. */
    public CoachDto getCoachById(Long coachId) {
        AiCoach coach = coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach not found with id: " + coachId));
        return CoachDto.from(coach);
    }

    /**
     * Returns the current user's selected coach preference, or null if none selected.
     */
    public CoachDto getUserCoachPreference(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return preferenceRepository.findByUserId(user.getId())
                .map(pref -> {
                    CoachDto dto = CoachDto.from(pref.getCoach());
                    dto.setSelected(true);
                    return dto;
                })
                .orElse(null);
    }

    /**
     * Selects a FREE coach for the authenticated user.
     * Never creates duplicate preference records — upserts.
     */
    @Transactional
    public CoachDto selectCoach(String email, Long coachId) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AiCoach coach = coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach not found with id: " + coachId));

        if (!coach.isActive()) {
            throw new RuntimeException("This coach is currently unavailable.");
        }

        if (coach.getTier() == CoachTier.PREMIUM) {
            throw new RuntimeException(
                    "This is a premium coach. An active premium subscription is required. " +
                    "Please use the premium selection endpoint.");
        }

        UserCoachPreference preference = preferenceRepository.findByUserId(user.getId())
                .orElse(UserCoachPreference.builder().user(user).build());
        preference.setCoach(coach);
        preferenceRepository.save(preference);

        CoachDto dto = CoachDto.from(coach);
        dto.setSelected(true);
        return dto;
    }

    /**
     * Selects a PREMIUM coach — caller must have verified hasPremiumAccess = true.
     */
    @Transactional
    public CoachDto selectPremiumCoach(String email, Long coachId, boolean hasPremiumAccess) {
        if (!hasPremiumAccess) {
            throw new RuntimeException(
                    "This is a premium coach. An active premium subscription is required. " +
                    "Visit your account to view available plans.");
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AiCoach coach = coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach not found with id: " + coachId));

        if (!coach.isActive()) {
            throw new RuntimeException("This coach is currently unavailable.");
        }

        UserCoachPreference preference = preferenceRepository.findByUserId(user.getId())
                .orElse(UserCoachPreference.builder().user(user).build());
        preference.setCoach(coach);
        preferenceRepository.save(preference);

        CoachDto dto = CoachDto.from(coach);
        dto.setSelected(true);
        return dto;
    }

    /** Returns total count of users who have a coach selected */
    public long getTotalCoachSelections() {
        return preferenceRepository.count();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Long resolveSelectedCoachId(String userEmail) {
        if (userEmail == null) return null;
        Optional<User> userOpt = userRepository.findByEmail(userEmail.trim().toLowerCase());
        if (userOpt.isEmpty()) return null;
        return preferenceRepository.findByUserId(userOpt.get().getId())
                .map(pref -> pref.getCoach().getId())
                .orElse(null);
    }

    private CoachTier parseTier(String value) {
        if (value == null || value.isBlank()) return null;
        try { return CoachTier.valueOf(value.toUpperCase()); } catch (IllegalArgumentException e) { return null; }
    }

    private CoachCategory parseCategory(String value) {
        if (value == null || value.isBlank()) return null;
        try { return CoachCategory.valueOf(value.toUpperCase()); } catch (IllegalArgumentException e) { return null; }
    }
}
