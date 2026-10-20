package com.fitflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Tracks every email notification attempt sent by the system.
 * Used to prevent duplicate notifications and to provide audit history.
 * The unique constraint on (user_id, notification_type, scheduled_date) is the
 * primary idempotency guard against sending the same notification twice.
 */
@Entity
@Table(name = "email_delivery_logs",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_email_log_user_type_date",
                columnNames = {"user_id", "notification_type", "scheduled_date"}
        ))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailDeliveryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** e.g. REGISTRATION_WELCOME, SUBSCRIPTION_EXPIRY_7D, SUBSCRIPTION_EXPIRED */
    @Column(nullable = false)
    private String notificationType;

    /** The logical date this notification is for (e.g. expiry date, registration date) */
    @Column(nullable = false)
    private LocalDate scheduledDate;

    /** PENDING, SENT, FAILED, SKIPPED */
    @Column(nullable = false)
    @Builder.Default
    private String deliveryStatus = "PENDING";

    private String recipientEmail;

    private String subject;

    /** Short provider response or error message */
    @Column(columnDefinition = "TEXT")
    private String providerResponse;

    @Builder.Default
    private int attemptCount = 0;

    private LocalDateTime lastAttemptAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
