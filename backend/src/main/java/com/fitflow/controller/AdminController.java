package com.fitflow.controller;

import com.fitflow.dto.AdminDashboardMetrics;
import com.fitflow.dto.EmailLogDto;
import com.fitflow.dto.SubscriptionDto;
import com.fitflow.dto.UserAdminDto;
import com.fitflow.entity.EmailDeliveryLog;
import com.fitflow.entity.User;
import com.fitflow.entity.UserSubscription;
import com.fitflow.entity.enums.SubscriptionStatus;
import com.fitflow.repository.AiCoachRepository;
import com.fitflow.repository.EmailDeliveryLogRepository;
import com.fitflow.repository.UserCoachPreferenceRepository;
import com.fitflow.repository.UserRepository;
import com.fitflow.repository.UserSubscriptionRepository;
import com.fitflow.repository.FitnessProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admin-only REST controller.
 * All endpoints require ROLE_ADMIN — enforced both in SecurityConfig and
 * via @PreAuthorize to ensure double protection.
 *
 * Never exposes passwords, tokens, or raw authentication data.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final UserSubscriptionRepository subscriptionRepository;
    private final UserCoachPreferenceRepository coachPreferenceRepository;
    private final AiCoachRepository coachRepository;
    private final EmailDeliveryLogRepository emailLogRepository;
    private final FitnessProfileRepository profileRepository;

    // ── Dashboard Metrics ────────────────────────────────────────────────────

    /**
     * GET /api/admin/dashboard/metrics
     * Returns live platform metrics from PostgreSQL.
     */
    @GetMapping("/dashboard/metrics")
    public ResponseEntity<AdminDashboardMetrics> getDashboardMetrics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream()
                .filter(User::isEnabled).count();
        long disabledUsers = totalUsers - activeUsers;

        long freeSubscribers = subscriptionRepository.countByStatus(SubscriptionStatus.FREE);
        long activeSubscriptions = subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);
        long expiredSubscriptions = subscriptionRepository.countByStatus(SubscriptionStatus.EXPIRED);
        long expiringSoon = subscriptionRepository.countByStatus(SubscriptionStatus.EXPIRING_SOON);
        long cancelled = subscriptionRepository.countByStatus(SubscriptionStatus.CANCELLED);
        long premiumSubscribers = activeSubscriptions + expiringSoon;
        long usersRequiringFollowUp = expiringSoon + expiredSubscriptions;

        long coachSelections = coachPreferenceRepository.count();
        long emailsSent = emailLogRepository.countByDeliveryStatus("SENT");
        long emailsFailed = emailLogRepository.countByDeliveryStatus("FAILED");

        // New registrations this calendar month
        LocalDate firstOfMonth = LocalDate.now().withDayOfMonth(1);
        long newThisMonth = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null
                        && !u.getCreatedAt().toLocalDate().isBefore(firstOfMonth))
                .count();

        AdminDashboardMetrics metrics = AdminDashboardMetrics.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .disabledUsers(disabledUsers)
                .freeSubscribers(freeSubscribers)
                .premiumSubscribers(premiumSubscribers)
                .activeSubscriptions(activeSubscriptions)
                .expiredSubscriptions(expiredSubscriptions)
                .expiringSoonSubscriptions(expiringSoon)
                .cancelledSubscriptions(cancelled)
                .usersRequiringFollowUp(usersRequiringFollowUp)
                .coachSelectionsTotal(coachSelections)
                .emailsSent(emailsSent)
                .emailsFailed(emailsFailed)
                .newRegistrationsThisMonth(newThisMonth)
                .build();

        return ResponseEntity.ok(metrics);
    }

    // ── User Management ──────────────────────────────────────────────────────

    /**
     * GET /api/admin/users?page=0&size=20&search=john&status=ACTIVE
     * Returns paginated user list with subscription, plan, and coach info.
     */
    @GetMapping("/users")
    public ResponseEntity<Page<UserAdminDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        Pageable pageable = PageRequest.of(page, size);
        List<User> allUsers = userRepository.findAll();

        // Server-side search filter
        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            allUsers = allUsers.stream()
                    .filter(u -> u.getName().toLowerCase().contains(q)
                            || u.getEmail().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }

        // Server-side subscription status filter (ACTIVE, EXPIRING_SOON, EXPIRED, FREE)
        if (status != null && !status.isBlank()) {
            String st = status.trim().toUpperCase();
            allUsers = allUsers.stream().filter(u -> {
                var sub = subscriptionRepository.findByUserId(u.getId());
                String userSubStatus = sub.map(s -> s.getStatus().name()).orElse("FREE");
                return userSubStatus.equalsIgnoreCase(st);
            }).collect(Collectors.toList());
        }

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), allUsers.size());
        List<User> pageContent = (start < allUsers.size()) ? allUsers.subList(start, end) : List.of();

        List<UserAdminDto> dtos = pageContent.stream()
                .map(this::toUserAdminDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new PageImpl<>(dtos, pageable, allUsers.size()));
    }

    /**
     * GET /api/admin/members?page=0&size=20&search=john&status=ACTIVE
     * Dedicated endpoint returning only ordinary gym members (role = MEMBER).
     */
    @GetMapping("/members")
    public ResponseEntity<Page<UserAdminDto>> getMembers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        Pageable pageable = PageRequest.of(page, size);
        List<User> members = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.fitflow.entity.enums.Role.MEMBER)
                .collect(Collectors.toList());

        // Search filter
        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            members = members.stream()
                    .filter(u -> u.getName().toLowerCase().contains(q)
                            || u.getEmail().toLowerCase().contains(q)
                            || (u.getPhone() != null && u.getPhone().contains(q)))
                    .collect(Collectors.toList());
        }

        // Status filter (ACTIVE, INACTIVE, EXPIRED, FREE, EXPIRING_SOON)
        if (status != null && !status.isBlank()) {
            String st = status.trim().toUpperCase();
            if ("INACTIVE".equalsIgnoreCase(st)) {
                members = members.stream().filter(u -> !u.isEnabled()).collect(Collectors.toList());
            } else {
                members = members.stream().filter(u -> {
                    var sub = subscriptionRepository.findByUserId(u.getId());
                    String subStatus = sub.map(s -> s.getStatus().name()).orElse("FREE");
                    return subStatus.equalsIgnoreCase(st);
                }).collect(Collectors.toList());
            }
        }

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), members.size());
        List<User> pageContent = (start < members.size()) ? members.subList(start, end) : List.of();

        List<UserAdminDto> dtos = pageContent.stream()
                .map(this::toUserAdminDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new PageImpl<>(dtos, pageable, members.size()));
    }

    /**
     * GET /api/admin/users/{id}
     * Returns a single user's admin details.
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(toUserAdminDto(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/admin/users/{id}/toggle-status
     * Activates or deactivates a user account.
     * Cannot be used on ADMIN accounts for safety.
     */
    @PostMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Cannot modify admin account status via this endpoint."));
        }

        user.setEnabled(!user.isEnabled());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "userId", id,
                "enabled", user.isEnabled(),
                "message", user.isEnabled() ? "Account activated." : "Account deactivated."
        ));
    }

    // ── Subscription Management ──────────────────────────────────────────────

    /**
     * GET /api/admin/subscriptions?page=0&size=20&status=ACTIVE
     */
    @GetMapping("/subscriptions")
    public ResponseEntity<Page<SubscriptionDto>> getSubscriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {

        Pageable pageable = PageRequest.of(page, size);
        List<UserSubscription> all = subscriptionRepository.findAll();

        if (status != null && !status.isBlank()) {
            try {
                SubscriptionStatus s = SubscriptionStatus.valueOf(status.toUpperCase());
                all = all.stream().filter(sub -> sub.getStatus() == s).collect(Collectors.toList());
            } catch (IllegalArgumentException ignored) {}
        }

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), all.size());
        List<UserSubscription> pageContent = (start < all.size()) ? all.subList(start, end) : List.of();

        List<SubscriptionDto> dtos = pageContent.stream()
                .map(this::toSubscriptionDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new PageImpl<>(dtos, pageable, all.size()));
    }

    // ── Email History ─────────────────────────────────────────────────────────

    /**
     * GET /api/admin/emails?page=0&size=20
     * Returns paginated email delivery history.
     */
    @GetMapping("/emails")
    public ResponseEntity<?> getEmailHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<EmailDeliveryLog> logs = emailLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        List<EmailLogDto> dtos = logs.getContent().stream()
                .map(this::toEmailLogDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new PageImpl<>(dtos, pageable, logs.getTotalElements()));
    }

    /**
     * GET /api/admin/subscriptions/deadlines
     * Returns upcoming deadlines and expired subscriptions.
     */
    @GetMapping("/subscriptions/deadlines")
    public ResponseEntity<?> getSubscriptionDeadlines() {
        LocalDate today = LocalDate.now();
        LocalDate in7Days = today.plusDays(7);

        List<UserSubscription> expiringSoon = subscriptionRepository.findExpiringBetween(today, in7Days);
        List<UserSubscription> expired = subscriptionRepository.findByStatus(SubscriptionStatus.EXPIRED);

        List<SubscriptionDto> expiringDtos = expiringSoon.stream().map(this::toSubscriptionDto).collect(Collectors.toList());
        List<SubscriptionDto> expiredDtos = expired.stream().map(this::toSubscriptionDto).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
            "expiringSoon", expiringDtos,
            "expired", expiredDtos,
            "totalRequiringAction", expiringDtos.size() + expiredDtos.size()
        ));
    }

    // ── Internal mappers ─────────────────────────────────────────────────────

    private UserAdminDto toUserAdminDto(User user) {
        var subOpt = subscriptionRepository.findByUserId(user.getId());
        var prefOpt = coachPreferenceRepository.findByUserId(user.getId());
        var profileOpt = profileRepository.findByUserId(user.getId());
        var lastEmailOpt = emailLogRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId());

        String lastNotification = lastEmailOpt
                .map(l -> l.getDeliveryStatus() + " (" + l.getNotificationType() + ")")
                .orElse("None");

        Long remainingDays = null;
        if (subOpt.isPresent() && subOpt.get().getEndDate() != null) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), subOpt.get().getEndDate());
            remainingDays = Math.max(0, days);
        }

        return UserAdminDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .accountStatus(user.isEnabled() ? "ACTIVE" : "INACTIVE")
                .registeredAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .subscriptionPlanName(subOpt.map(s -> s.getPlan() != null ? s.getPlan().getName() : "Free Plan").orElse("Free Plan"))
                .subscriptionStartDate(subOpt.flatMap(s -> java.util.Optional.ofNullable(s.getStartDate())).map(LocalDate::toString).orElse(null))
                .subscriptionStatus(subOpt.map(s -> s.getStatus().name()).orElse("FREE"))
                .subscriptionEndDate(subOpt.flatMap(s -> java.util.Optional.ofNullable(s.getEndDate()))
                        .map(LocalDate::toString).orElse(null))
                .remainingDays(remainingDays)
                .lastNotificationStatus(lastNotification)
                .selectedCoachName(prefOpt.map(p -> p.getCoach().getDisplayName()).orElse(null))
                .fitnessGoal(profileOpt.flatMap(p -> java.util.Optional.ofNullable(p.getFitnessGoal()))
                        .map(Enum::name).orElse(null))
                .experienceLevel(profileOpt.flatMap(p -> java.util.Optional.ofNullable(p.getExperienceLevel()))
                        .map(Enum::name).orElse(null))
                .build();
    }

    private SubscriptionDto toSubscriptionDto(UserSubscription s) {
        boolean isPremiumActive = s.getStatus() == SubscriptionStatus.ACTIVE
                && s.getEndDate() != null && !s.getEndDate().isBefore(LocalDate.now());

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

    private EmailLogDto toEmailLogDto(EmailDeliveryLog log) {
        return EmailLogDto.builder()
                .id(log.getId())
                .userId(log.getUser() != null ? log.getUser().getId() : null)
                .userName(log.getUser() != null ? log.getUser().getName() : null)
                .userEmail(log.getUser() != null ? log.getUser().getEmail() : null)
                .recipientEmail(log.getRecipientEmail())
                .notificationType(log.getNotificationType())
                .scheduledDate(log.getScheduledDate())
                .deliveryStatus(log.getDeliveryStatus())
                .subject(log.getSubject())
                .providerResponse(log.getProviderResponse())
                .errorMessage(log.getProviderResponse())
                .attemptCount(log.getAttemptCount())
                .lastAttemptAt(log.getLastAttemptAt())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
