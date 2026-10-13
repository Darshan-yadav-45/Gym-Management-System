package com.fitflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DailyMetricRequest {

    @NotNull(message = "Water intake is required")
    @Min(value = 0, message = "Water intake cannot be negative")
    private Integer waterIntakeMl;

    @NotNull(message = "Steps count is required")
    @Min(value = 0, message = "Steps count cannot be negative")
    private Integer stepsCount;

    @NotNull(message = "Protein grams is required")
    @Min(value = 0, message = "Protein grams cannot be negative")
    private Integer proteinGrams;

    private LocalDate recordDate;
}
