package com.fitflow.service;

import com.fitflow.dto.SubscriptionDto;
import com.fitflow.entity.User;
import com.fitflow.entity.UserSubscription;
import com.fitflow.entity.enums.SubscriptionStatus;
import com.fitflow.repository.UserRepository;
import com.fitflow.repository.UserSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final UserSubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    /**
     * Returns or creates a FREE subscription record for the user.
     * Called during registration to establish the subscription row.
     */
    @Transactional
    public UserSubscription getOrCreateFreeSubscription(User user) {
        return subscriptionRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserSubscription sub = UserSubscription.builder()
                            .user(user)
                            .status(SubscriptionStatus.FREE)
                            .startDate(LocalDate.now())
                            .build();
                    return subscriptionRepository.save(sub);
                });
    }

    /**
     * Returns true if the user currently has an active premium subscription.
     * This is the server-side check used to gate premium features and premium coaches.
     */
    public boolean hasPremiumAccess(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserSubscription> sub = subscriptionRepository.findByUserId(user.getId());
        if (sub.isEmpty()) return false;

        UserSubscription s = sub.get();
        return s.getStatus() == SubscriptionStatus.ACTIVE
                && s.getEndDate() != null
                && !s.getEndDate().isBefore(LocalDate.now());
    }

    /**
     * Returns the subscription DTO for the authenticated user.
     */
    public SubscriptionDto getMySubscription(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserSubscription sub = subscriptionRepository.findByUserId(user.getId())
                .orElseGet(() -> getOrCreateFreeSubscription(user));

        return toDto(sub);
    }

    /**
     * Marks expired ACTIVE subscriptions as EXPIRED.
     * Called by the scheduler — safe to call repeatedly.
     */
    @Transactional
    public int processExpiredSubscriptions() {
        var expired = subscriptionRepository.findExpiredButNotUpdated(LocalDate.now());
        for (UserSubscription s : expired) {
            s.setStatus(SubscriptionStatus.EXPIRED);
        }
        subscriptionRepository.saveAll(expired);
        return expired.size();
    }

    /**
     * Marks subscriptions expiring within 7 days as EXPIRING_SOON.
     * Called by the scheduler.
     */
    @Transactional
    public int processExpiringSoon() {
        LocalDate today = LocalDate.now();
        LocalDate in7Days = today.plusDays(7);
        var expiring = subscriptionRepository.findExpiringBetween(today, in7Days);
        for (UserSubscription s : expiring) {
            s.setStatus(SubscriptionStatus.EXPIRING_SOON);
        }
        subscriptionRepository.saveAll(expiring);
        return expiring.size();
    }

    private SubscriptionDto toDto(UserSubscription s) {
        boolean isPremiumActive = s.getStatus() == SubscriptionStatus.ACTIVE
                && s.getEndDate() != null
                && !s.getEndDate().isBefore(LocalDate.now());

        return SubscriptionDto.builder()
                .subscriptionId(s.getId())
                .userId(s.getUser().getId())
                .userName(s.getUser().getName())
                .userEmail(s.getUser().getEmail())
                .planName(s.getPlan() != null ? s.getPlan().getName() : "Free Plan")
                .status(s.getStatus().name())
                .startDate(s.getStartDate() != null ? s.getStartDate().toString() : null)
                .endDate(s.getEndDate() != null ? s.getEndDate().toString() : null)
                .autoRenew(s.isAutoRenew())
                .isPremiumActive(isPremiumActive)
                .build();
    }
}
