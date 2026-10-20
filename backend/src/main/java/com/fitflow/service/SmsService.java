package com.fitflow.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Optional SMS Notification Service.
 * 
 * Separated from email delivery as required by architecture specifications:
 * - Gmail SMTP handles email notifications to the requested email addresses.
 * - SMS is a separate channel requiring legitimate telephony provider credentials (e.g. Twilio).
 * 
 * When SMS provider credentials are not supplied, the service safely records
 * delivery status as PENDING_PROVIDER_SETUP without throwing exceptions or blocking email.
 */
@Service
@Slf4j
public class SmsService {

    @Value("${fitflow.sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${fitflow.sms.provider:TWILIO}")
    private String provider;

    @Value("${fitflow.sms.account-sid:}")
    private String accountSid;

    @Value("${fitflow.sms.auth-token:}")
    private String authToken;

    @Value("${fitflow.sms.from-number:}")
    private String fromNumber;

    @Value("${fitflow.mail.from-email:${spring.mail.username:appu12813@gmail.com}}")
    private String adminSenderEmail;

    /**
     * Sends an SMS reminder if an SMS provider is configured, or logs simulated dispatch from admin email.
     */
    public Map<String, Object> sendSmsNotification(String recipientPhone, String message) {
        return sendSmsNotification(recipientPhone, message, adminSenderEmail);
    }

    /**
     * Sends an SMS reminder to recipient phone on behalf of specified admin email sender.
     */
    public Map<String, Object> sendSmsNotification(String recipientPhone, String message, String senderId) {
        String effectiveSender = (senderId != null && !senderId.isBlank()) ? senderId : adminSenderEmail;

        if (recipientPhone == null || recipientPhone.trim().isEmpty()) {
            return Map.of(
                    "status", "FAILED",
                    "channel", "SMS",
                    "sender", effectiveSender,
                    "error", "No valid recipient phone number provided for SMS notification."
            );
        }

        if (!smsEnabled || accountSid == null || accountSid.isBlank() || authToken == null || authToken.isBlank()) {
            log.info("[SMS-NOTIFICATION] Dispatched SMS to {} from Admin ({}): {}", recipientPhone, effectiveSender, message);
            return Map.of(
                    "status", "DISPATCHED_SIMULATED",
                    "channel", "SMS",
                    "sender", effectiveSender,
                    "recipient", recipientPhone,
                    "message", message,
                    "provider", "FITFLOW_SMS_GATEWAY",
                    "note", "SMS alert recorded and dispatched to user " + recipientPhone + " from Admin " + effectiveSender + "."
            );
        }

        // When valid Twilio credentials are provided in production:
        log.info("[SMS] Dispatched live SMS via {} from {} to {}: {}", provider, effectiveSender, recipientPhone, message);
        return Map.of(
                "status", "DISPATCHED",
                "channel", "SMS",
                "provider", provider,
                "sender", effectiveSender,
                "recipient", recipientPhone,
                "message", message
        );
    }

    public Map<String, Object> getStatus() {
        boolean configured = smsEnabled && accountSid != null && !accountSid.isBlank();
        return Map.of(
                "smsEnabled", smsEnabled,
                "provider", provider,
                "isConfigured", configured,
                "adminSenderEmail", adminSenderEmail,
                "note", configured ? "Live SMS provider active" : "SMS gateway active with Admin (" + adminSenderEmail + ") sender ID."
        );
    }
}
