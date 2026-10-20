package com.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailLogDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String recipientEmail;
    private String notificationType;
    private LocalDate scheduledDate;
    private String deliveryStatus;
    private String subject;
    private String providerResponse;
    private String errorMessage;
    private int attemptCount;
    private LocalDateTime lastAttemptAt;
    private LocalDateTime createdAt;
}
