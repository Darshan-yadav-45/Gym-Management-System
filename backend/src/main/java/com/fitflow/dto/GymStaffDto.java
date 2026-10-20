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
public class GymStaffDto {
    private Long id;
    private String staffId;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String designation;
    private String specialization;
    private Integer experienceYears;
    private String qualifications;
    private String employmentType;
    private String joiningDate;
    private String resignationDate;
    private Double monthlySalary; // Only provided to authorized admins
    private String employmentStatus;
    private String shiftSchedule;
    private String profileImageUrl;
    private String bio;
    private String emergencyContact;
    private Long applicationId;
    private String createdAt;
    private String updatedAt;
}
