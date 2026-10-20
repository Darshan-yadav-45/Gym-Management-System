package com.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatusHistoryDto {
    private Long id;
    private String fromStatus;
    private String toStatus;
    private String changedBy;
    private String reasonOrNotes;
    private String createdAt;
}
