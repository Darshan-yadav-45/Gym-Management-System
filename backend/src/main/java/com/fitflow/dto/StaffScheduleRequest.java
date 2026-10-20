package com.fitflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StaffScheduleRequest {

    @NotNull(message = "Staff ID is required")
    private Long staffId;

    @NotBlank(message = "Shift name is required")
    private String shiftName; // e.g. "Morning Shift"

    private String dayOfWeek; // e.g. "MONDAY"

    private String specificDate; // YYYY-MM-DD

    @NotBlank(message = "Start time is required")
    private String startTime; // "06:00"

    @NotBlank(message = "End time is required")
    private String endTime; // "14:00"

    private Boolean isRecurring;

    private Boolean isRestDay;

    private String notes;
}
