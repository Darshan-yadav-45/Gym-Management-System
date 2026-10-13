package com.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OnboardingResponse {
    private boolean success;
    private String message;
    private Long userId;
    private Long profileId;
    private Double bmi;
    private Long workoutPlanId;
    private String nextRoute;
}
