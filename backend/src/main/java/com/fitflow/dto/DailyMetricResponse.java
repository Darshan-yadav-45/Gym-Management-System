package com.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DailyMetricResponse {

    private Long id;
    private Long userId;
    private LocalDate recordDate;

    // Water
    private Integer waterIntakeMl;
    private Integer waterTargetMl;
    private Integer waterRemainingMl;
    private Double waterProgressPercentage;

    // Steps
    private Integer stepsCount;
    private Integer stepsTarget;
    private Integer stepsRemaining;
    private Double stepsProgressPercentage;
    private Double distanceKm;
    private Integer caloriesBurned;

    // Protein
    private Integer proteinGrams;
    private Integer proteinTargetGrams;
    private Integer proteinRemainingGrams;
    private Double proteinProgressPercentage;
}
