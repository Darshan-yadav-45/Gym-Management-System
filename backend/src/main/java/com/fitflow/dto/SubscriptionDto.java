package com.fitflow.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubscriptionDto {
    private Long subscriptionId;
    private Long userId;
    private String userName;
    private String userEmail;
    private String planName;
    private String status;
    private String startDate;
    private String endDate;
    private boolean autoRenew;
    private boolean isPremiumActive;
}
