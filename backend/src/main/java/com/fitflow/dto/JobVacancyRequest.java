package com.fitflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobVacancyRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    private String department;

    private String specialization;

    @NotNull(message = "Vacancies count is required")
    @Min(value = 1, message = "Vacancies count must be at least 1")
    private Integer vacanciesCount;

    private Integer filledCount;

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    private String requiredQualifications;

    private Integer minExperience;

    private Integer preferredExperience;

    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT

    private String salaryRange;

    private Boolean isSalaryPublished;

    private String location;

    @NotBlank(message = "Opening date is required")
    private String openingDate; // YYYY-MM-DD

    @NotBlank(message = "Deadline date is required")
    private String deadlineDate; // YYYY-MM-DD

    private String expectedJoiningDate;

    private String workingDaysShift;

    private String status; // DRAFT, SCHEDULED, OPEN, CLOSED, CANCELLED
}
