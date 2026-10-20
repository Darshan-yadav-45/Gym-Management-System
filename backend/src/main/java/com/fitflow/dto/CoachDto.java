package com.fitflow.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fitflow.entity.AiCoach;
import com.fitflow.entity.enums.CoachCategory;
import com.fitflow.entity.enums.CoachTier;
import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CoachDto {
    private Long id;
    private String displayName;
    private String gender;
    private String avatarUrl;
    private String specialization;
    private String description;
    private String coachingStyle;
    private String experienceDescription;
    private String tier;
    private String primaryCategory;
    private Set<String> supportedCategories;
    private boolean active;
    /** True when this is the currently selected coach for the requesting user */
    private Boolean selected;

    public static CoachDto from(AiCoach coach) {
        return CoachDto.builder()
                .id(coach.getId())
                .displayName(coach.getDisplayName())
                .gender(coach.getGender())
                .avatarUrl(coach.getAvatarUrl())
                .specialization(coach.getSpecialization())
                .description(coach.getDescription())
                .coachingStyle(coach.getCoachingStyle())
                .experienceDescription(coach.getExperienceDescription())
                .tier(coach.getTier().name())
                .primaryCategory(coach.getPrimaryCategory().name())
                .supportedCategories(
                        coach.getSupportedCategories().stream()
                                .map(CoachCategory::name)
                                .collect(Collectors.toSet()))
                .active(coach.isActive())
                .build();
    }
}
