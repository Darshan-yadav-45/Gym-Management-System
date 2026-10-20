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
public class JobVacancyDto {
    private Long id;
    private String title;
    private String department;
    private String specialization;
    private Integer vacanciesCount;
    private Integer filledCount;
    private Integer remainingPositions;
    private String jobDescription;
    private String requiredQualifications;
    private Integer minExperience;
    private Integer preferredExperience;
    private String employmentType;
    private String salaryRange;
    private Boolean isSalaryPublished;
    private String location;
    private String openingDate;
    private String deadlineDate;
    private String expectedJoiningDate;
    private String workingDaysShift;
    private String status;
    private Boolean isCurrentlyOpen;
    private Long applicationsCount;
    private String createdAt;
    private String updatedAt;
}
