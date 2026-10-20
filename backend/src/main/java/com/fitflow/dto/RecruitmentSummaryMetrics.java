package com.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentSummaryMetrics {
    private long totalPublishedVacancies;
    private long scheduledVacancies;
    private long currentlyOpenVacancies;
    private long closedVacancies;
    private long totalPositionsAvailable;
    private long totalApplicationsReceived;
    private long vacanciesApproachingDeadline;
}
