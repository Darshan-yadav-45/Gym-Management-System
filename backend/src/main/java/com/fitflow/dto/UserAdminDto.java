package com.fitflow.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserAdminDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean enabled;
    private String registeredAt;
    private String subscriptionPlanName;
    private String subscriptionStartDate;
    private String subscriptionStatus;
    private String subscriptionEndDate;
    private String lastNotificationStatus;
    private String selectedCoachName;
    private String fitnessGoal;
    private String experienceLevel;
    private Long remainingDays;
    private String accountStatus;
}
