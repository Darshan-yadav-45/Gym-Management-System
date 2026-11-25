package com.fitflow.controller;

import com.fitflow.repository.EmailDeliveryLogRepository;
import com.fitflow.repository.UserRepository;
import com.fitflow.repository.UserSubscriptionRepository;
import com.fitflow.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admin-only controller for email testing and diagnostics.
 * Test emails are only sent to the requesting admin's own address —
 * never mass-sent to all users.
 */
@RestController
@RequestMapping("/api/admin/email")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminEmailController {

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final EmailDeliveryLogRepository emailLogRepository;

    private final UserSubscriptionRepository subscriptionRepository;
    private final com.fitflow.service.SmsService smsService;

    @org.springframework.beans.factory.annotation.Value("${fitflow.mail.from-email:${fitflow.admin.email:appu12813@gmail.com}}")
    private String adminSenderEmail;

    /**
     * GET /api/admin/email/recipients
     * Returns the configured deadline notification recipient list.
     */
    @GetMapping("/recipients")
    public ResponseEntity<?> getNotificationRecipients() {
        var recipients = emailService.getDeadlineNotificationRecipients();
        return ResponseEntity.ok(Map.of(
                "recipients", recipients,
                "count", recipients.size(),
                "reminderDays", 7,
                "configuredStatus", "CONFIGURED"
        ));
    }

    /**
     * POST /api/admin/email/send-deadline-reminders
     * Manually triggers deadline reminder delivery to the configured recipient list.
     * Can trigger for all expiring/expired subscriptions or a specific subscriptionId.
     */
    @PostMapping("/send-deadline-reminders")
    public ResponseEntity<?> sendDeadlineReminders(@RequestBody(required = false) Map<String, Object> request) {
        Long subscriptionId = null;
        if (request != null && request.containsKey("subscriptionId") && request.get("subscriptionId") != null) {
            try {
                subscriptionId = Long.valueOf(request.get("subscriptionId").toString());
            } catch (NumberFormatException ignored) {}
        }

        int totalSent = 0;
        int totalSkipped = 0;
        int totalFailed = 0;

        if (subscriptionId != null) {
            var subOpt = subscriptionRepository.findById(subscriptionId);
            if (subOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Subscription record not found."));
            }
            var result = emailService.sendDeadlineToRecipients(subOpt.get(), EmailService.TYPE_MANUAL_REMINDER);
            totalSent = (int) result.getOrDefault("sent", 0);
            totalSkipped = (int) result.getOrDefault("skipped", 0);
            totalFailed = (int) result.getOrDefault("failed", 0);
        } else {
            // Find all expiring soon and expired subscriptions
            var today = java.time.LocalDate.now();
            var expiring = subscriptionRepository.findExpiringBetween(today, today.plusDays(7));
            var expired = subscriptionRepository.findByStatus(com.fitflow.entity.enums.SubscriptionStatus.EXPIRED);

            java.util.List<com.fitflow.entity.UserSubscription> allTargets = new java.util.ArrayList<>();
            allTargets.addAll(expiring);
            allTargets.addAll(expired);

            if (allTargets.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "No subscriptions currently requiring deadline notification.",
                        "sent", 0, "skipped", 0, "failed", 0,
                        "recipients", emailService.getDeadlineNotificationRecipients()
                ));
            }

            for (var sub : allTargets) {
                var res = emailService.sendDeadlineToRecipients(sub, EmailService.TYPE_MANUAL_REMINDER);
                totalSent += (int) res.getOrDefault("sent", 0);
                totalSkipped += (int) res.getOrDefault("skipped", 0);
                totalFailed += (int) res.getOrDefault("failed", 0);
            }
        }

        String summary = String.format("Deadline notification batch executed: %d sent, %d skipped, %d failed across %d configured recipient(s).",
                totalSent, totalSkipped, totalFailed, emailService.getDeadlineNotificationRecipients().size());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", summary,
                "sent", totalSent,
                "skipped", totalSkipped,
                "failed", totalFailed,
                "recipients", emailService.getDeadlineNotificationRecipients()
        ));
    }

    /**
     * POST /api/admin/email/send-user-reminder/{userId}
     * Sends a reminder specifically for a given member to both the user and the deadline recipient list,
     * and dispatches an SMS alert to the member's phone number from Admin.
     */
    @PostMapping("/send-user-reminder/{userId}")
    public ResponseEntity<?> sendUserReminder(@PathVariable Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        var subOpt = subscriptionRepository.findByUserId(userId);
        if (subOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "User does not have an active or tracked subscription record."
            ));
        }

        var sub = subOpt.get();
        String planName = sub.getPlan() != null ? sub.getPlan().getName() : "Membership Plan";

        // Send to member if expiry date exists
        if (sub.getEndDate() != null) {
            emailService.sendExpiryReminder7Day(user, planName, sub.getEndDate());
        }

        // Also alert the configured admin deadline emails
        var adminResult = emailService.sendDeadlineToRecipients(sub, EmailService.TYPE_MANUAL_REMINDER);

        // Also dispatch SMS alert to member if phone number is present
        Map<String, Object> smsResult = null;
        if (user.getPhone() != null && !user.getPhone().isBlank()) {
            String smsBody = String.format("FitFlow Alert from Admin (%s): Hi %s, your %s subscription %s. Please renew to keep your membership active.",
                    adminSenderEmail, user.getName(), planName, sub.getEndDate() != null ? "expires on " + sub.getEndDate() : "has expired");
            smsResult = smsService.sendSmsNotification(user.getPhone(), smsBody, adminSenderEmail);
        }

        String summary = "Dispatched reminder for user " + user.getName() + " to member email and " +
                emailService.getDeadlineNotificationRecipients().size() + " configured admin recipient(s).";
        if (smsResult != null) {
            summary += " SMS alert also dispatched to " + user.getPhone() + " from Admin (" + adminSenderEmail + ").";
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", summary,
                "adminResult", adminResult,
                "smsResult", smsResult != null ? smsResult : Map.of("status", "NO_PHONE_REGISTERED")
        ));
    }

    /**
     * POST /api/admin/email/send-user-sms/{userId}
     * Sends an SMS alert directly to a member's phone number from Admin.
     */
    @PostMapping("/send-user-sms/{userId}")
    public ResponseEntity<?> sendUserSms(@PathVariable Long userId, @RequestBody(required = false) Map<String, String> body) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getPhone() == null || user.getPhone().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "User " + user.getName() + " does not have a registered phone number for SMS."
            ));
        }

        String message = (body != null && body.containsKey("message") && body.get("message") != null && !body.get("message").isBlank())
                ? body.get("message")
                : "FitFlow Alert from Admin (" + adminSenderEmail + "): Hi " + user.getName() + ", please check your FitFlow gym account for your latest updates.";

        var smsResult = smsService.sendSmsNotification(user.getPhone(), message, adminSenderEmail);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "SMS alert dispatched to " + user.getPhone() + " for " + user.getName() + " from Admin (" + adminSenderEmail + ").",
                "smsResult", smsResult
        ));
    }

    /**
     * GET /api/admin/email/sms-status
     * Returns optional SMS service status without exposing provider secrets.
     */
    @GetMapping("/sms-status")
    public ResponseEntity<?> getSmsStatus() {
        return ResponseEntity.ok(smsService.getStatus());
    }

    /**
     * POST /api/admin/email/test
     * Sends a test email to the authenticated admin's own email address only.
     * Returns an honest error if SMTP is not configured.
     */
    @PostMapping("/test")
    public ResponseEntity<?> sendTestEmail(Authentication auth) {
        var admin = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        try {
            emailService.sendTestEmail(admin.getEmail(), admin.getName());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Test email sent to " + admin.getEmail()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * GET /api/admin/email/status
     * Returns SMTP configuration status without exposing credentials.
     */
    @GetMapping("/status")
    public ResponseEntity<?> getEmailStatus() {
        long sent = emailLogRepository.countByDeliveryStatus("SENT");
        long failed = emailLogRepository.countByDeliveryStatus("FAILED");
        long skipped = emailLogRepository.countByDeliveryStatus("SKIPPED");
        long pending = emailLogRepository.countByDeliveryStatus("PENDING");

        return ResponseEntity.ok(Map.of(
                "totalSent", sent,
                "totalFailed", failed,
                "totalSkipped", skipped,
                "totalPending", pending,
                "emailEnabled", emailService.isEmailEnabled(),
                "note", "SKIPPED emails indicate SMTP is not yet configured or duplicate send was avoided."
        ));
    }

    /**
     * GET /api/admin/email/memberships
     * Returns comprehensive user membership table data and notification metrics
     * for the Membership Email Notifications panel.
     */
    @GetMapping("/memberships")
    public ResponseEntity<?> getMembershipNotificationOverview() {
        var users = userRepository.findAll();
        var subscriptions = subscriptionRepository.findAll();
        var today = java.time.LocalDate.now();
        var twoDaysOut = today.plusDays(2);

        Map<Long, com.fitflow.entity.UserSubscription> subMap = subscriptions.stream()
                .filter(s -> s.getUser() != null)
                .collect(Collectors.toMap(s -> s.getUser().getId(), s -> s, (a, b) -> a));

        List<Map<String, Object>> memberRows = new ArrayList<>();
        long activeCount = 0;
        long expiring2DaysCount = 0;
        long expiredCount = 0;

        for (var u : users) {
            var sub = subMap.get(u.getId());
            String planName = (sub != null && sub.getPlan() != null) ? sub.getPlan().getName() : "Free Home Pack";
            String startDateStr = (sub != null && sub.getStartDate() != null) ? sub.getStartDate().toString() : "—";
            String endDateStr = (sub != null && sub.getEndDate() != null) ? sub.getEndDate().toString() : "—";

            String status = "FREE";
            boolean isExpiring2Days = false;
            if (sub != null) {
                if (sub.getStatus() == com.fitflow.entity.enums.SubscriptionStatus.ACTIVE) {
                    activeCount++;
                    if (sub.getEndDate() != null) {
                        if (sub.getEndDate().isBefore(today)) {
                            status = "EXPIRED";
                            expiredCount++;
                        } else if (!sub.getEndDate().isAfter(twoDaysOut)) {
                            status = "EXPIRING_SOON";
                            isExpiring2Days = true;
                            expiring2DaysCount++;
                        } else {
                            status = "ACTIVE";
                        }
                    } else {
                        status = "ACTIVE";
                    }
                } else if (sub.getStatus() == com.fitflow.entity.enums.SubscriptionStatus.EXPIRED) {
                    status = "EXPIRED";
                    expiredCount++;
                } else {
                    status = sub.getStatus().name();
                }
            }

            // Retrieve latest email log for this user
            var latestLog = emailLogRepository.findTopByUserIdOrderByCreatedAtDesc(u.getId());
            String emailStatus = latestLog.map(com.fitflow.entity.EmailDeliveryLog::getDeliveryStatus).orElse("NONE");
            String lastSentAt = latestLog.map(l -> l.getCreatedAt() != null ? l.getCreatedAt().toString() : "—").orElse("—");
            String lastType = latestLog.map(com.fitflow.entity.EmailDeliveryLog::getNotificationType).orElse("—");
            String errorMsg = latestLog.map(l -> l.getProviderResponse() != null ? l.getProviderResponse() : "").orElse("");

            java.util.Map<String, Object> row = new java.util.HashMap<>();
            row.put("userId", u.getId());
            row.put("userName", u.getName());
            row.put("email", u.getEmail());
            row.put("membershipType", planName);
            row.put("startDate", startDateStr);
            row.put("expiryDate", endDateStr);
            row.put("status", status);
            row.put("isExpiring2Days", isExpiring2Days);
            row.put("emailStatus", emailStatus);
            row.put("lastEmailSentAt", lastSentAt);
            row.put("lastEmailType", lastType);
            row.put("errorMsg", errorMsg);
            memberRows.add(row);
        }

        long sentCount = emailLogRepository.countByDeliveryStatus("SENT");
        long failedCount = emailLogRepository.countByDeliveryStatus("FAILED");

        Map<String, Object> summary = Map.of(
                "totalUsers", users.size(),
                "activeMemberships", activeCount,
                "expiringWithin2Days", expiring2DaysCount,
                "expiredMemberships", expiredCount,
                "emailsSentSuccessfully", sentCount,
                "emailsFailed", failedCount
        );

        return ResponseEntity.ok(Map.of(
                "summary", summary,
                "memberships", memberRows
        ));
    }

    /**
     * POST /api/admin/email/send-reminder-2day/{userId}
     * Sends the 2-day membership expiry notification to an individual user.
     */
    @PostMapping("/send-reminder-2day/{userId}")
    public ResponseEntity<?> sendIndividual2DayReminder(@PathVariable Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        var sub = subscriptionRepository.findByUserId(userId).orElse(null);
        String planName = (sub != null && sub.getPlan() != null) ? sub.getPlan().getName() : "Premium Membership";
        java.time.LocalDate expiryDate = (sub != null && sub.getEndDate() != null) ? sub.getEndDate() : java.time.LocalDate.now().plusDays(2);

        emailService.sendExpiryReminder2Day(user, planName, expiryDate);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "2-Day expiry reminder processed for " + user.getName() + " (" + user.getEmail() + ")."
        ));
    }

    /**
     * POST /api/admin/email/send-expired-notice/{userId}
     * Sends the expired membership notification to an individual user.
     */
    @PostMapping("/send-expired-notice/{userId}")
    public ResponseEntity<?> sendIndividualExpiredNotice(@PathVariable Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        var sub = subscriptionRepository.findByUserId(userId).orElse(null);
        String planName = (sub != null && sub.getPlan() != null) ? sub.getPlan().getName() : "Premium Membership";
        java.time.LocalDate expiryDate = (sub != null && sub.getEndDate() != null) ? sub.getEndDate() : java.time.LocalDate.now().minusDays(1);

        emailService.sendSubscriptionExpired(user, planName, expiryDate);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Membership expired notification processed for " + user.getName() + " (" + user.getEmail() + ")."
        ));
    }

    /**
     * POST /api/admin/email/send-bulk
     * Sends bulk 2-day reminders or expired notifications to selected users.
     */
    @PostMapping("/send-bulk")
    public ResponseEntity<?> sendBulkReminders(@RequestBody Map<String, Object> body) {
        List<?> rawIds = (List<?>) body.get("userIds");
        String notificationType = (String) body.getOrDefault("type", "2DAY");

        if (rawIds == null || rawIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "No user IDs provided for bulk sending."));
        }

        int sent = 0;
        int failed = 0;
        for (Object item : rawIds) {
            try {
                Long uid = Long.valueOf(item.toString());
                var userOpt = userRepository.findById(uid);
                if (userOpt.isPresent()) {
                    var u = userOpt.get();
                    var sub = subscriptionRepository.findByUserId(uid).orElse(null);
                    String planName = (sub != null && sub.getPlan() != null) ? sub.getPlan().getName() : "Premium Membership";
                    if ("EXPIRED".equalsIgnoreCase(notificationType)) {
                        java.time.LocalDate d = (sub != null && sub.getEndDate() != null) ? sub.getEndDate() : java.time.LocalDate.now().minusDays(1);
                        emailService.sendSubscriptionExpired(u, planName, d);
                    } else {
                        java.time.LocalDate d = (sub != null && sub.getEndDate() != null) ? sub.getEndDate() : java.time.LocalDate.now().plusDays(2);
                        emailService.sendExpiryReminder2Day(u, planName, d);
                    }
                    sent++;
                }
            } catch (Exception e) {
                failed++;
            }
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", String.format("Bulk delivery completed: %d processed, %d errors.", sent, failed),
                "sentCount", sent,
                "failedCount", failed
        ));
    }

    /**
     * POST /api/admin/email/retry/{logId}
     * Retries sending a previously failed email from the audit log.
     */
    @PostMapping("/retry/{logId}")
    public ResponseEntity<?> retryEmailNotification(@PathVariable Long logId) {
        try {
            var result = emailService.retryEmail(logId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
