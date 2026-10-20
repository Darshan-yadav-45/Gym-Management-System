package com.fitflow.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TrainerApplicationDto {
    private Long id;
    private String referenceNumber;
    private Long vacancyId;
    private String vacancyTitle;
    private String vacancyDepartment;
    private String vacancyDeadline;
    private String fullName;
    private String email;
    private String phone;
    private String currentLocation;
    private String desiredPosition;
    private Integer experienceYears;
    private String specialization;
    private String educationalQualifications;
    private String fitnessCertifications;
    private String previousExperience;
    private String professionalSummary;
    private String availabilityDate;
    private String resumeFileName;
    private String resumeUrl;
    private String portfolioUrl;
    private Boolean consentGiven;
    private String status;
    private String internalNotes;
    private String interviewDate;
    private String interviewTime;
    private String interviewLocation;
    private String interviewNotes;
    private Boolean convertedToStaff;
    private Long convertedStaffId;
    private String createdAt;
    private String updatedAt;
    private List<ApplicationStatusHistoryDto> statusHistory;
}
