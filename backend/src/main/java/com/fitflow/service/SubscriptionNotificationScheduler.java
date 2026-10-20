package com.fitflow.service;

import com.fitflow.entity.UserSubscription;
import com.fitflow.entity.enums.SubscriptionStatus;
import com.fitflow.repository.UserSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Runs scheduled jobs for subscription lifecycle management and email notifications.
 *
 * Jobs:
 *  1. Daily at 08:00 — mark expired subscriptions as EXPIRED
 *  2. Daily at 08:05 — send 7-day expiry reminder emails (idempotent)
 *  3. Daily at 08:10 — send expiry confirmation emails (idempotent)
 *
 * All email sends go through EmailService which enforces idempotency via
 * the email_delivery_logs unique constraint — no duplicate notifications.
 *
 * Scheduling does NOT block login or fitness tracking.
 * SMTP failures are caught and logged — they do not crash the scheduler.
 *
 * Requires @EnableScheduling on FitFlowApplication.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SubscriptionNotificationScheduler {

    private final UserSubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;
    private final EmailService emailService;

    /**
     * Step 1 — Mark overdue ACTIVE subscriptions as EXPIRED.
     * Runs daily at 08:00 server time.
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void markExpiredSubscriptions() {
        log.info("[Scheduler] Running markExpiredSubscriptions...");
        try {
            int count = subscriptionService.processExpiredSubscriptions();
            log.info("[Scheduler] Marked {} subscriptions as EXPIRED.", count);
        } catch (Exception e) {
            log.error("[Scheduler] Error in markExpiredSubscriptions: {}", e.getMessage());
        }
    }

    /**
     * Step 2 — Send 7-day expiry reminder emails.
     * Runs daily at 08:05. Idempotent — won't re-send if already sent.
     */
    @Scheduled(cron = "0 5 8 * * *")
    public void sendExpiryReminders() {
        log.info("[Scheduler] Running sendExpiryReminders (7-day)...");
        LocalDate today = LocalDate.now();
        LocalDate in7Days = today.plusDays(7);

        try {
            List<UserSubscription> expiring = subscriptionRepository.findExpiringBetween(today, in7Days);
            log.info("[Scheduler] Found {} subscriptions expiring within 7 days.", expiring.size());

            for (UserSubscription sub : expiring) {
                try {
                    String planName = sub.getPlan() != null ? sub.getPlan().getName() : "Premium Plan";
                    emailService.sendExpiryReminder7Day(sub.getUser(), planName, sub.getEndDate());
                    emailService.sendDeadlineToRecipients(sub, EmailService.TYPE_ADMIN_DEADLINE_ALERT);
                } catch (Exception e) {
                    // Log per-user error and continue — don't stop the whole batch
                    log.error("[Scheduler] Failed to send reminder to user {}: {}",
                            sub.getUser().getEmail(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("[Scheduler] Error in sendExpiryReminders: {}", e.getMessage());
        }
    }

    /**
     * Step 3 — Send expiry confirmation emails to newly expired subscriptions.
     * Runs daily at 08:10. Idempotent — won't re-send if already sent.
     */
    @Scheduled(cron = "0 10 8 * * *")
    public void sendExpiryConfirmations() {
        log.info("[Scheduler] Running sendExpiryConfirmations...");
        LocalDate yesterday = LocalDate.now().minusDays(1);

        try {
            // Find subscriptions that expired yesterday (endDate == yesterday) and are now EXPIRED
            List<UserSubscription> recentlyExpired = subscriptionRepository
                    .findByStatus(SubscriptionStatus.EXPIRED)
                    .stream()
                    .filter(s -> s.getEndDate() != null && s.getEndDate().equals(yesterday))
                    .toList();

            log.info("[Scheduler] Found {} subscriptions expired yesterday.", recentlyExpired.size());

            for (UserSubscription sub : recentlyExpired) {
                try {
                    String planName = sub.getPlan() != null ? sub.getPlan().getName() : "Premium Plan";
                    emailService.sendSubscriptionExpired(sub.getUser(), planName, sub.getEndDate());
                    emailService.sendDeadlineToRecipients(sub, EmailService.TYPE_ADMIN_DEADLINE_ALERT);
                } catch (Exception e) {
                    log.error("[Scheduler] Failed to send expiry email to user {}: {}",
                            sub.getUser().getEmail(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("[Scheduler] Error in sendExpiryConfirmations: {}", e.getMessage());
        }
    }
}
