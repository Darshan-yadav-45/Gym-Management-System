package com.fitflow.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    private Long trainerId;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private String trainingType;
    private String sessionType;
    private String notes;
}
