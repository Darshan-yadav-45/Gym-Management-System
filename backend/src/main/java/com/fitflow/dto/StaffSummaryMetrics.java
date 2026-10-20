package com.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffSummaryMetrics {
    private long totalTrainers;
    private long activeTrainers;
    private long inactiveTrainers;
    private long totalTrainingStaff;
    private long trainersAvailableNow;
    private long trainersHiredThisMonth;
}
