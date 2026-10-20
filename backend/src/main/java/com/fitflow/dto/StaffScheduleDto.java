package com.fitflow.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StaffScheduleDto {
    private Long id;
    private Long staffId;
    private String staffCode;
    private String staffName;
    private String staffDesignation;
    private String shiftName;
    private String dayOfWeek;
    private String specificDate;
    private String startTime;
    private String endTime;
    private Boolean isRecurring;
    private Boolean isRestDay;
    private String notes;
    private String createdAt;
    private String updatedAt;
}
