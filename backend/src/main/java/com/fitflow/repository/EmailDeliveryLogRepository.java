package com.fitflow.repository;

import com.fitflow.entity.EmailDeliveryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface EmailDeliveryLogRepository extends JpaRepository<EmailDeliveryLog, Long> {

    /**
     * Checks if a notification of this type was already scheduled for this user on this date.
     * Used to enforce idempotency — prevents duplicate emails.
     */
    boolean existsByUserIdAndNotificationTypeAndScheduledDate(
            Long userId, String notificationType, LocalDate scheduledDate);

    boolean existsByUserIdAndNotificationTypeAndScheduledDateAndDeliveryStatus(
            Long userId, String notificationType, LocalDate scheduledDate, String deliveryStatus);

    Optional<EmailDeliveryLog> findByUserIdAndNotificationTypeAndScheduledDate(
            Long userId, String notificationType, LocalDate scheduledDate);

    Page<EmailDeliveryLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<EmailDeliveryLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Optional<EmailDeliveryLog> findTopByUserIdOrderByCreatedAtDesc(Long userId);

    long countByDeliveryStatus(String deliveryStatus);
}
