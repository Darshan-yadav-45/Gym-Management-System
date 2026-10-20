package com.fitflow.service;

import com.fitflow.entity.EmailDeliveryLog;
import com.fitflow.entity.User;
import com.fitflow.entity.UserSubscription;
import com.fitflow.repository.EmailDeliveryLogRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Handles real SMTP email delivery via JavaMailSender.
 * Emails are only sent when SMTP is properly configured.
 * Every send attempt is logged in email_delivery_logs for auditing.
 * 
 * Setup requires:
 *   SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM_NAME env vars.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailDeliveryLogRepository deliveryLogRepository;

    @Value("${fitflow.mail.from-email:${spring.mail.username:appu12813@gmail.com}}")
    private String fromEmail;

    @Value("${fitflow.mail.from-name:FitFlow}")
    private String fromName;

    @Value("${fitflow.mail.enabled:false}")
    private boolean emailEnabled;

    @Value("${fitflow.mail.deadline-notification-emails:appu12813@gmail.com,yadavdarshan922@gmail.com,darshankm703@gmail.com,lakalkakaakaaa@gmail.com}")
    private String deadlineNotificationEmails;

    // ── Notification type constants ─────────────────────────────────────────
    public static final String TYPE_REGISTRATION_WELCOME   = "REGISTRATION_WELCOME";
    public static final String TYPE_SUBSCRIPTION_EXPIRY_7D = "SUBSCRIPTION_EXPIRY_7D";
    public static final String TYPE_SUBSCRIPTION_EXPIRED   = "SUBSCRIPTION_EXPIRED";
    public static final String TYPE_SUBSCRIPTION_RENEWED   = "SUBSCRIPTION_RENEWED";
    public static final String TYPE_ADMIN_DEADLINE_ALERT   = "ADMIN_DEADLINE_ALERT";
    public static final String TYPE_MANUAL_REMINDER        = "MANUAL_REMINDER";

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Sends the registration welcome email.
     * Idempotent — skips if an email of this type was already sent today.
     */
    public void sendRegistrationWelcome(User user) {
        String type = TYPE_REGISTRATION_WELCOME;
        LocalDate today = LocalDate.now();

        if (isDuplicate(user.getId(), type, today)) {
            log.info("Skipping duplicate {} email for user {}", type, user.getEmail());
            return;
        }

        String subject = "Welcome to FitFlow — Your Account is Ready";
        String body = buildWelcomeEmailBody(user.getName());

        sendAndLog(user, type, today, subject, body);
    }

    /**
     * Sends the 7-day expiry reminder email.
     * Idempotent per (user, type, expiryDate).
     */
    public void sendExpiryReminder7Day(User user, String planName, LocalDate expiryDate) {
        String type = TYPE_SUBSCRIPTION_EXPIRY_7D;

        if (isDuplicate(user.getId(), type, expiryDate)) {
            log.info("Skipping duplicate {} email for user {}", type, user.getEmail());
            return;
        }

        String subject = "Your FitFlow subscription expires in 7 days";
        String body = buildExpiryReminderBody(user.getName(), planName, expiryDate.toString());

        sendAndLog(user, type, expiryDate, subject, body);
    }

    /**
     * Sends the subscription expired email.
     * Idempotent per (user, type, expiryDate).
     */
    public void sendSubscriptionExpired(User user, String planName, LocalDate expiryDate) {
        String type = TYPE_SUBSCRIPTION_EXPIRED;

        if (isDuplicate(user.getId(), type, expiryDate)) {
            log.info("Skipping duplicate {} email for user {}", type, user.getEmail());
            return;
        }

        String subject = "Your FitFlow subscription has expired";
        String body = buildExpiredEmailBody(user.getName(), planName, expiryDate.toString());

        sendAndLog(user, type, expiryDate, subject, body);
    }

    /**
     * Sends a test email to a single address. Admin-only — called from AdminEmailController.
     * Does NOT create a delivery log entry (test emails are not tracked).
     */
    public void sendTestEmail(String toEmail, String toName) {
        if (!emailEnabled) {
            throw new RuntimeException(
                    "Live SMTP is not enabled yet. To send real outbound emails from " + fromEmail +
                    ", configure your 16-character Google App Password in SMTP_PASSWORD / application.properties and set fitflow.mail.enabled=true.");
        }
        try {
            String subject = "FitFlow Email Configuration Test";
            String body = buildTestEmailBody(toName);
            sendHtmlEmail(toEmail, subject, body);
            log.info("Test email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send test email to {}: {}", toEmail, e.getMessage());
            String err = e.getMessage() != null ? e.getMessage() : e.toString();
            if (err.toLowerCase().contains("authentication failed") || err.contains("535")) {
                throw new RuntimeException("Gmail SMTP Authentication Failed: Google requires a 16-character App Password (not your personal Gmail password). Please generate one at https://myaccount.google.com/apppasswords and enter it in application.properties under spring.mail.password.");
            }
            throw new RuntimeException("Test email failed: " + err);
        }
    }

    public boolean isEmailEnabled() {
        return emailEnabled;
    }

    /**
     * Returns the list of configured deadline notification recipient addresses.
     * Guaranteed to contain the requested recipient addresses:
     * appu12813@gmail.com, yadavdarshan922@gmail.com, darshankm703@gmail.com, lakalkakaakaaa@gmail.com
     */
    public List<String> getDeadlineNotificationRecipients() {
        if (deadlineNotificationEmails == null || deadlineNotificationEmails.isBlank()) {
            return List.of("appu12813@gmail.com", "yadavdarshan922@gmail.com", "darshankm703@gmail.com", "lakalkakaakaaa@gmail.com");
        }
        return Arrays.stream(deadlineNotificationEmails.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    /**
     * Sends deadline alert to the configured notification recipients for a given subscription.
     * Records attempt in email_delivery_logs with delivery status (SENT / SKIPPED / FAILED).
     * Safe and idempotent.
     */
    public Map<String, Object> sendDeadlineToRecipients(UserSubscription sub, String alertType) {
        List<String> recipients = getDeadlineNotificationRecipients();
        int sent = 0;
        int failed = 0;
        int skipped = 0;

        String planName = sub.getPlan() != null ? sub.getPlan().getName() : "Membership Plan";
        String expiryDateStr = sub.getEndDate() != null ? sub.getEndDate().toString() : "N/A";
        String subscriberName = sub.getUser().getName();
        String subject = "FitFlow Subscription Deadline Alert — " + subscriberName + " (" + sub.getStatus() + ")";
        String htmlBody = buildDeadlineAlertEmailBody(subscriberName, sub.getUser().getEmail(), planName, expiryDateStr, sub.getStatus().name());

        LocalDate today = LocalDate.now();

        for (String recipient : recipients) {
            String type = alertType + "_" + recipient;
            if (isDuplicate(sub.getUser().getId(), type, today)) {
                log.info("Skipping already sent deadline reminder to {} for user {}", recipient, sub.getUser().getEmail());
                skipped++;
                continue;
            }

            EmailDeliveryLog logEntry = deliveryLogRepository
                    .findByUserIdAndNotificationTypeAndScheduledDate(sub.getUser().getId(), type, today)
                    .orElseGet(() -> EmailDeliveryLog.builder()
                            .user(sub.getUser())
                            .notificationType(type)
                            .scheduledDate(today)
                            .recipientEmail(recipient)
                            .subject(subject)
                            .deliveryStatus("PENDING")
                            .attemptCount(0)
                            .build());
            logEntry.setSubject(subject);
            logEntry.setDeliveryStatus("PENDING");
            logEntry = deliveryLogRepository.save(logEntry);

            if (!emailEnabled) {
                logEntry.setDeliveryStatus("SKIPPED");
                logEntry.setProviderResponse("Email delivery skipped: SMTP is not enabled in application.properties / environment.");
                logEntry.setLastAttemptAt(LocalDateTime.now());
                logEntry.setAttemptCount(1);
                deliveryLogRepository.save(logEntry);
                skipped++;
                continue;
            }

            try {
                logEntry.setAttemptCount(logEntry.getAttemptCount() + 1);
                logEntry.setLastAttemptAt(LocalDateTime.now());
                sendHtmlEmail(recipient, subject, htmlBody);
                logEntry.setDeliveryStatus("SENT");
                logEntry.setProviderResponse("Accepted by SMTP server");
                deliveryLogRepository.save(logEntry);
                sent++;
            } catch (Exception e) {
                logEntry.setDeliveryStatus("FAILED");
                String errMsg = e.getMessage() != null ? e.getMessage() : e.toString();
                if (errMsg.toLowerCase().contains("authentication failed") || errMsg.contains("535")) {
                    errMsg = "Gmail SMTP Authentication Failed: Google requires a 16-character App Password (not your personal Gmail password).";
                }
                logEntry.setProviderResponse("Failed: " + errMsg);
                deliveryLogRepository.save(logEntry);
                failed++;
            }
        }

        return Map.of(
            "sent", sent,
            "skipped", skipped,
            "failed", failed,
            "recipients", recipients,
            "emailEnabled", emailEnabled
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────────────

    private boolean isDuplicate(Long userId, String type, LocalDate date) {
        return deliveryLogRepository.existsByUserIdAndNotificationTypeAndScheduledDateAndDeliveryStatus(
                userId, type, date, "SENT");
    }

    private void sendAndLog(User user, String type, LocalDate scheduledDate,
                            String subject, String htmlBody) {
        EmailDeliveryLog logEntry = deliveryLogRepository
                .findByUserIdAndNotificationTypeAndScheduledDate(user.getId(), type, scheduledDate)
                .orElseGet(() -> EmailDeliveryLog.builder()
                        .user(user)
                        .notificationType(type)
                        .scheduledDate(scheduledDate)
                        .recipientEmail(user.getEmail())
                        .subject(subject)
                        .deliveryStatus("PENDING")
                        .attemptCount(0)
                        .build());
        logEntry.setSubject(subject);
        logEntry.setDeliveryStatus("PENDING");
        logEntry = deliveryLogRepository.save(logEntry);

        if (!emailEnabled) {
            logEntry.setDeliveryStatus("SKIPPED");
            logEntry.setProviderResponse("Email not configured. Set SMTP env vars to enable delivery.");
            logEntry.setLastAttemptAt(LocalDateTime.now());
            logEntry.setAttemptCount(1);
            deliveryLogRepository.save(logEntry);
            log.warn("Email not configured — {} email for {} was logged but not sent.", type, user.getEmail());
            return;
        }

        logEntry.setAttemptCount(logEntry.getAttemptCount() + 1);
        logEntry.setLastAttemptAt(LocalDateTime.now());

        try {
            sendHtmlEmail(user.getEmail(), subject, htmlBody);
            logEntry.setDeliveryStatus("SENT");
            logEntry.setProviderResponse("Accepted by SMTP server");
            log.info("Email {} sent to {}", type, user.getEmail());
        } catch (Exception e) {
            logEntry.setDeliveryStatus("FAILED");
            // Only log the message, not the full exception stack with credentials
            String errMsg = e.getMessage() != null ? e.getMessage() : e.toString();
            if (errMsg.toLowerCase().contains("authentication failed") || errMsg.contains("535")) {
                errMsg = "Gmail SMTP Authentication Failed: Google requires a 16-character App Password (not your personal Gmail password).";
            }
            logEntry.setProviderResponse("Send failed: " + errMsg);
            log.error("Failed to send {} email to {}: {}", type, user.getEmail(), e.getMessage());
        } finally {
            deliveryLogRepository.save(logEntry);
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail, fromName);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Email templates (inline HTML)
    // ─────────────────────────────────────────────────────────────────────────

    private String buildWelcomeEmailBody(String name) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family:sans-serif;background:#0b0c10;color:#e5e7eb;margin:0;padding:0">
            <div style="max-width:560px;margin:40px auto;background:#14151b;border-radius:16px;overflow:hidden;border:1px solid #ffffff10">
              <div style="background:#ef233c;padding:32px 40px">
                <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;letter-spacing:2px">
                  FIT<span style="font-style:italic">FLOW</span>
                </h1>
                <p style="color:#fff;margin:8px 0 0;opacity:.85;font-size:13px;text-transform:uppercase;letter-spacing:1px">
                  Your account is ready
                </p>
              </div>
              <div style="padding:40px">
                <h2 style="color:#fff;font-size:20px;margin:0 0 16px">Welcome, %s!</h2>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  Your FitFlow account has been created. You are currently on the <strong style="color:#fff">Free Plan</strong>.
                </p>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  Get started by completing your fitness profile and selecting your AI coach from the coach directory.
                </p>
                <a href="#" style="display:inline-block;background:#ef233c;color:#fff;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:1px;text-transform:uppercase">
                  Go to Dashboard
                </a>
                <p style="color:#4b5563;font-size:12px;margin:32px 0 0">
                  This is an automated message from FitFlow. Please do not reply to this email.
                </p>
              </div>
            </div>
            </body></html>
            """.formatted(name);
    }

    private String buildExpiryReminderBody(String name, String planName, String endDate) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family:sans-serif;background:#0b0c10;color:#e5e7eb;margin:0;padding:0">
            <div style="max-width:560px;margin:40px auto;background:#14151b;border-radius:16px;overflow:hidden;border:1px solid #ffffff10">
              <div style="background:#f59e0b;padding:32px 40px">
                <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;letter-spacing:2px">
                  FIT<span style="font-style:italic">FLOW</span>
                </h1>
                <p style="color:#fff;margin:8px 0 0;opacity:.85;font-size:13px;text-transform:uppercase;letter-spacing:1px">
                  Subscription expiring soon
                </p>
              </div>
              <div style="padding:40px">
                <h2 style="color:#fff;font-size:20px;margin:0 0 16px">Hello, %s</h2>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  Your <strong style="color:#fff">%s</strong> subscription will expire on
                  <strong style="color:#f59e0b">%s</strong>.
                </p>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  To continue accessing premium coaches and features, please renew your subscription before that date.
                </p>
                <a href="#" style="display:inline-block;background:#ef233c;color:#fff;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:1px;text-transform:uppercase">
                  Renew Now
                </a>
                <p style="color:#4b5563;font-size:12px;margin:32px 0 0">
                  This is an automated message from FitFlow. Please do not reply.
                </p>
              </div>
            </div>
            </body></html>
            """.formatted(name, planName, endDate);
    }

    private String buildExpiredEmailBody(String name, String planName, String endDate) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family:sans-serif;background:#0b0c10;color:#e5e7eb;margin:0;padding:0">
            <div style="max-width:560px;margin:40px auto;background:#14151b;border-radius:16px;overflow:hidden;border:1px solid #ffffff10">
              <div style="background:#1f2937;padding:32px 40px">
                <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;letter-spacing:2px">
                  FIT<span style="font-style:italic">FLOW</span>
                </h1>
                <p style="color:#9ca3af;margin:8px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:1px">
                  Subscription update
                </p>
              </div>
              <div style="padding:40px">
                <h2 style="color:#fff;font-size:20px;margin:0 0 16px">Hello, %s</h2>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  Your <strong style="color:#fff">%s</strong> subscription ended on
                  <strong style="color:#ef4444">%s</strong>.
                </p>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  Your account remains available under the free features currently offered by FitFlow.
                  Premium features may require an active eligible subscription.
                </p>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  If you would like to continue premium access, visit your FitFlow account to review the available plans.
                </p>
                <a href="#" style="display:inline-block;background:#ef233c;color:#fff;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:1px;text-transform:uppercase">
                  View Plans
                </a>
                <p style="color:#4b5563;font-size:12px;margin:32px 0 0">
                  Thank you for being part of FitFlow. This is an automated message — please do not reply.
                </p>
              </div>
            </div>
            </body></html>
            """.formatted(name, planName, endDate);
    }

    private String buildTestEmailBody(String name) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family:sans-serif;background:#0b0c10;color:#e5e7eb;margin:0;padding:0">
            <div style="max-width:560px;margin:40px auto;background:#14151b;border-radius:16px;overflow:hidden;border:1px solid #ffffff10">
              <div style="background:#10b981;padding:32px 40px">
                <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;letter-spacing:2px">
                  FIT<span style="font-style:italic">FLOW</span>
                </h1>
                <p style="color:#fff;margin:8px 0 0;opacity:.85;font-size:13px;text-transform:uppercase;letter-spacing:1px">
                  Email configuration test
                </p>
              </div>
              <div style="padding:40px">
                <h2 style="color:#fff;font-size:20px;margin:0 0 16px">Hello, %s</h2>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  ✅ Your FitFlow SMTP configuration is working correctly. Email delivery is operational.
                </p>
                <p style="color:#4b5563;font-size:12px;margin:32px 0 0">
                  This is a test message sent via the FitFlow admin panel.
                </p>
              </div>
            </div>
            </body></html>
            """.formatted(name);
    }

    private String buildDeadlineAlertEmailBody(String subscriberName, String subscriberEmail,
                                              String planName, String endDate, String status) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family:sans-serif;background:#0b0c10;color:#e5e7eb;margin:0;padding:0">
            <div style="max-width:580px;margin:40px auto;background:#14151b;border-radius:16px;overflow:hidden;border:1px solid #ffffff15">
              <div style="background:#ef233c;padding:32px 40px">
                <h1 style="color:#fff;margin:0;font-size:26px;font-weight:900;letter-spacing:2px">
                  FIT<span style="font-style:italic">FLOW</span>
                </h1>
                <p style="color:#fff;margin:6px 0 0;opacity:.9;font-size:12px;text-transform:uppercase;letter-spacing:1px">
                  Admin Subscription Deadline Alert
                </p>
              </div>
              <div style="padding:36px">
                <h2 style="color:#fff;font-size:18px;margin:0 0 16px">Subscription Deadline Notification</h2>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 20px">
                  A FitFlow subscription is approaching or has reached its deadline. Please review the details below:
                </p>
                <div style="background:#1b1e2a;border-radius:12px;padding:20px;margin:0 0 24px;border:1px solid #ffffff10">
                  <p style="margin:0 0 8px;font-size:13px;color:#9ca3af">Subscriber: <strong style="color:#fff">%s</strong> (%s)</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#9ca3af">Plan: <strong style="color:#fff">%s</strong></p>
                  <p style="margin:0 0 8px;font-size:13px;color:#9ca3af">Expiry Date: <strong style="color:#f59e0b">%s</strong></p>
                  <p style="margin:0;font-size:13px;color:#9ca3af">Current Status: <strong style="color:#ef233c">%s</strong></p>
                </div>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  <strong>Recommended Next Action:</strong> Open the FitFlow Admin Console to inspect the subscriber record, coordinate renewal communications, or review membership entitlements.
                </p>
                <p style="color:#4b5563;font-size:11px;margin:28px 0 0;border-top:1px solid #ffffff10;padding-top:16px">
                  Automated notification sent to designated administrators: %s.
                </p>
              </div>
            </div>
            </body></html>
            """.formatted(subscriberName, subscriberEmail, planName, endDate, status, String.join(", ", getDeadlineNotificationRecipients()));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Recruitment Notifications
    // ─────────────────────────────────────────────────────────────────────────

    public void sendApplicationAcknowledgement(String toEmail, String applicantName, String jobTitle, String referenceNumber) {
        if (!emailEnabled) {
            log.info("Email delivery skipped (SMTP disabled): Application acknowledgement for {}", toEmail);
            return;
        }
        try {
            String subject = "FitFlow Careers — Application Received (" + referenceNumber + ")";
            String body = buildApplicationReceivedBody(applicantName, jobTitle, referenceNumber);
            sendHtmlEmail(toEmail, subject, body);
            log.info("Application acknowledgement sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send application acknowledgement to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendInterviewInvitation(String toEmail, String applicantName, String jobTitle, String date, String time, String location, String notes) {
        if (!emailEnabled) {
            log.info("Email delivery skipped (SMTP disabled): Interview invitation for {}", toEmail);
            return;
        }
        try {
            String subject = "FitFlow Careers — Interview Invitation for " + jobTitle;
            String body = buildInterviewInvitationBody(applicantName, jobTitle, date, time, location, notes);
            sendHtmlEmail(toEmail, subject, body);
            log.info("Interview invitation sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send interview invitation to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendApplicationStatusUpdate(String toEmail, String applicantName, String jobTitle, String status, String note) {
        if (!emailEnabled) {
            log.info("Email delivery skipped (SMTP disabled): Status update for {}", toEmail);
            return;
        }
        try {
            String subject = "FitFlow Careers — Application Update (" + status + ")";
            String body = buildApplicationStatusUpdateBody(applicantName, jobTitle, status, note);
            sendHtmlEmail(toEmail, subject, body);
            log.info("Application status update sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send application status update to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildApplicationReceivedBody(String name, String jobTitle, String ref) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family:sans-serif;background:#0b0c10;color:#e5e7eb;margin:0;padding:0">
            <div style="max-width:560px;margin:40px auto;background:#14151b;border-radius:16px;overflow:hidden;border:1px solid #ffffff10">
              <div style="background:#ef233c;padding:32px 40px">
                <h1 style="color:#fff;margin:0;font-size:26px;font-weight:900;letter-spacing:2px">FITFLOW CAREERS</h1>
                <p style="color:#fff;margin:6px 0 0;opacity:.9;font-size:12px;text-transform:uppercase">Application Received</p>
              </div>
              <div style="padding:36px">
                <h2 style="color:#fff;font-size:18px;margin:0 0 16px">Hello, %s</h2>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 20px">
                  Thank you for applying for the position of <strong style="color:#fff">%s</strong> at FitFlow Gym.
                </p>
                <div style="background:#1b1e2a;border-radius:12px;padding:16px;margin:0 0 20px;border:1px solid #ffffff10">
                  <p style="margin:0;font-size:13px;color:#9ca3af">Application Reference: <strong style="color:#ef233c;font-family:monospace">%s</strong></p>
                </div>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  Our recruitment team is reviewing your profile and credentials. If your background aligns with our requirements, we will contact you regarding the next steps.
                </p>
                <p style="color:#4b5563;font-size:11px;margin:24px 0 0;border-top:1px solid #ffffff10;padding-top:16px">
                  FitFlow Recruitment Operations — Please keep your reference number for future inquiries.
                </p>
              </div>
            </div>
            </body></html>
            """.formatted(name, jobTitle, ref);
    }

    private String buildInterviewInvitationBody(String name, String jobTitle, String date, String time, String location, String notes) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family:sans-serif;background:#0b0c10;color:#e5e7eb;margin:0;padding:0">
            <div style="max-width:560px;margin:40px auto;background:#14151b;border-radius:16px;overflow:hidden;border:1px solid #ffffff10">
              <div style="background:#10b981;padding:32px 40px">
                <h1 style="color:#fff;margin:0;font-size:26px;font-weight:900;letter-spacing:2px">FITFLOW CAREERS</h1>
                <p style="color:#fff;margin:6px 0 0;opacity:.9;font-size:12px;text-transform:uppercase">Interview Invitation</p>
              </div>
              <div style="padding:36px">
                <h2 style="color:#fff;font-size:18px;margin:0 0 16px">Hello, %s</h2>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 20px">
                  We are pleased to invite you for an interview for the <strong style="color:#fff">%s</strong> opportunity!
                </p>
                <div style="background:#1b1e2a;border-radius:12px;padding:16px;margin:0 0 20px;border:1px solid #ffffff10">
                  <p style="margin:0 0 8px;font-size:13px;color:#9ca3af">Date: <strong style="color:#fff">%s</strong></p>
                  <p style="margin:0 0 8px;font-size:13px;color:#9ca3af">Time: <strong style="color:#fff">%s</strong></p>
                  <p style="margin:0 0 8px;font-size:13px;color:#9ca3af">Location / Link: <strong style="color:#10b981">%s</strong></p>
                  <p style="margin:0;font-size:13px;color:#9ca3af">Notes: <span style="color:#e5e7eb">%s</span></p>
                </div>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 24px">
                  Please be available at least 5 minutes prior to the scheduled time. Let us know if you need to reschedule.
                </p>
                <p style="color:#4b5563;font-size:11px;margin:24px 0 0;border-top:1px solid #ffffff10;padding-top:16px">
                  FitFlow Recruitment Team.
                </p>
              </div>
            </div>
            </body></html>
            """.formatted(name, jobTitle, date != null ? date : "TBD", time != null ? time : "TBD", location != null ? location : "FitFlow Gym", notes != null ? notes : "No additional instructions");
    }

    private String buildApplicationStatusUpdateBody(String name, String jobTitle, String status, String note) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family:sans-serif;background:#0b0c10;color:#e5e7eb;margin:0;padding:0">
            <div style="max-width:560px;margin:40px auto;background:#14151b;border-radius:16px;overflow:hidden;border:1px solid #ffffff10">
              <div style="background:#3b82f6;padding:32px 40px">
                <h1 style="color:#fff;margin:0;font-size:26px;font-weight:900;letter-spacing:2px">FITFLOW CAREERS</h1>
                <p style="color:#fff;margin:6px 0 0;opacity:.9;font-size:12px;text-transform:uppercase">Application Update</p>
              </div>
              <div style="padding:36px">
                <h2 style="color:#fff;font-size:18px;margin:0 0 16px">Hello, %s</h2>
                <p style="color:#9ca3af;font-size:14px;line-height:1.6;margin:0 0 20px">
                  Your application for <strong style="color:#fff">%s</strong> has been updated to:
                </p>
                <div style="background:#1b1e2a;border-radius:12px;padding:16px;margin:0 0 20px;border:1px solid #ffffff10">
                  <p style="margin:0 0 8px;font-size:14px;color:#9ca3af">Status: <strong style="color:#3b82f6;font-size:16px">%s</strong></p>
                  <p style="margin:0;font-size:13px;color:#9ca3af">Feedback / Remarks: <span style="color:#e5e7eb">%s</span></p>
                </div>
                <p style="color:#4b5563;font-size:11px;margin:24px 0 0;border-top:1px solid #ffffff10;padding-top:16px">
                  FitFlow Recruitment Team.
                </p>
              </div>
            </div>
            </body></html>
            """.formatted(name, jobTitle, status, note != null ? note : "Your application status has been updated in our system.");
    }
}
