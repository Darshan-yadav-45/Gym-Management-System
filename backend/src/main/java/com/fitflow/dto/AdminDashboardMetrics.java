package com.fitflow.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminDashboardMetrics {
    // User counts
    private long totalUsers;
    private long activeUsers;
    private long disabledUsers;

    // Subscription counts
    private long freeSubscribers;
    private long premiumSubscribers;
    private long activeSubscriptions;
    private long expiredSubscriptions;
    private long expiringSoonSubscriptions;
    private long cancelledSubscriptions;
    private long usersRequiringFollowUp;

    // Coach counts
    private long coachSelectionsTotal;

    // Email counts
    private long emailsSent;
    private long emailsFailed;

    // Recent activity
    private long newRegistrationsThisMonth;
}
