package com.fitflow.service;

import com.fitflow.dto.DailyMetricRequest;
import com.fitflow.dto.DailyMetricResponse;
import com.fitflow.entity.DailyMetric;
import com.fitflow.entity.User;
import com.fitflow.repository.DailyMetricRepository;
import com.fitflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyMetricService {

    public static final int DEFAULT_WATER_TARGET_ML = 3000;
    public static final int DEFAULT_STEPS_TARGET = 10000;
    public static final int DEFAULT_PROTEIN_TARGET_G = 140;

    private final DailyMetricRepository dailyMetricRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DailyMetricResponse getTodayMetrics(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        LocalDate today = LocalDate.now();
        return dailyMetricRepository.findByUserIdAndRecordDate(user.getId(), today)
                .map(this::mapToResponse)
                .orElseGet(() -> buildDefaultResponse(user.getId(), today));
    }

    @Transactional(readOnly = true)
    public DailyMetricResponse getTodayMetricsForUser(String email, Long requestedUserId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (!user.getId().equals(requestedUserId) && user.getRole() != com.fitflow.entity.enums.Role.ADMIN) {
            throw new SecurityException("Unauthorized access: Cannot access another user's metrics");
        }

        LocalDate today = LocalDate.now();
        return dailyMetricRepository.findByUserIdAndRecordDate(requestedUserId, today)
                .map(this::mapToResponse)
                .orElseGet(() -> buildDefaultResponse(requestedUserId, today));
    }

    @Transactional
    public DailyMetricResponse logMetrics(String email, DailyMetricRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        LocalDate date = request.getRecordDate() != null ? request.getRecordDate() : LocalDate.now();

        DailyMetric metric = dailyMetricRepository.findByUserIdAndRecordDate(user.getId(), date)
                .orElse(null);

        if (metric != null) {
            metric.setWaterIntakeMl(request.getWaterIntakeMl());
            metric.setStepsCount(request.getStepsCount());
            metric.setProteinGrams(request.getProteinGrams());
            metric.recalculateCalculatedFields();
        } else {
            metric = DailyMetric.builder()
                    .user(user)
                    .recordDate(date)
                    .waterIntakeMl(request.getWaterIntakeMl())
                    .stepsCount(request.getStepsCount())
                    .proteinGrams(request.getProteinGrams())
                    .build();
            metric.recalculateCalculatedFields();
        }

        DailyMetric saved = dailyMetricRepository.save(metric);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DailyMetricResponse> getHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return dailyMetricRepository.findByUserIdOrderByRecordDateDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DailyMetricResponse mapToResponse(DailyMetric m) {
        int water = m.getWaterIntakeMl() != null ? m.getWaterIntakeMl() : 0;
        int steps = m.getStepsCount() != null ? m.getStepsCount() : 0;
        int protein = m.getProteinGrams() != null ? m.getProteinGrams() : 0;

        int waterTarget = DEFAULT_WATER_TARGET_ML;
        int stepsTarget = DEFAULT_STEPS_TARGET;
        int proteinTarget = DEFAULT_PROTEIN_TARGET_G;

        int waterRemaining = Math.max(0, waterTarget - water);
        int stepsRemaining = Math.max(0, stepsTarget - steps);
        int proteinRemaining = Math.max(0, proteinTarget - protein);

        double waterPct = Math.min(100.0, Math.round(((double) water / waterTarget * 100.0) * 10.0) / 10.0);
        double stepsPct = Math.min(100.0, Math.round(((double) steps / stepsTarget * 100.0) * 10.0) / 10.0);
        double proteinPct = Math.min(100.0, Math.round(((double) protein / proteinTarget * 100.0) * 10.0) / 10.0);

        return DailyMetricResponse.builder()
                .id(m.getId())
                .userId(m.getUser().getId())
                .recordDate(m.getRecordDate())
                .waterIntakeMl(water)
                .waterTargetMl(waterTarget)
                .waterRemainingMl(waterRemaining)
                .waterProgressPercentage(waterPct)
                .stepsCount(steps)
                .stepsTarget(stepsTarget)
                .stepsRemaining(stepsRemaining)
                .stepsProgressPercentage(stepsPct)
                .distanceKm(m.getDistanceKm() != null ? m.getDistanceKm() : 0.0)
                .caloriesBurned(m.getCaloriesBurned() != null ? m.getCaloriesBurned() : 0)
                .proteinGrams(protein)
                .proteinTargetGrams(proteinTarget)
                .proteinRemainingGrams(proteinRemaining)
                .proteinProgressPercentage(proteinPct)
                .build();
    }

    private DailyMetricResponse buildDefaultResponse(Long userId, LocalDate date) {
        return DailyMetricResponse.builder()
                .id(null)
                .userId(userId)
                .recordDate(date)
                .waterIntakeMl(0)
                .waterTargetMl(DEFAULT_WATER_TARGET_ML)
                .waterRemainingMl(DEFAULT_WATER_TARGET_ML)
                .waterProgressPercentage(0.0)
                .stepsCount(0)
                .stepsTarget(DEFAULT_STEPS_TARGET)
                .stepsRemaining(DEFAULT_STEPS_TARGET)
                .stepsProgressPercentage(0.0)
                .distanceKm(0.0)
                .caloriesBurned(0)
                .proteinGrams(0)
                .proteinTargetGrams(DEFAULT_PROTEIN_TARGET_G)
                .proteinRemainingGrams(DEFAULT_PROTEIN_TARGET_G)
                .proteinProgressPercentage(0.0)
                .build();
    }
}
