package com.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationSummaryMetrics {
    private long totalApplications;
    private long newApplications;
    private long underReview;
    private long shortlisted;
    private long interviewScheduled;
    private long selected;
    private long rejected;
    private long withdrawn;
}
