package com.fitflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GymStaffRequest {
    private String staffId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotBlank(message = "Designation is required")
    private String designation;

    private String specialization;

    private Integer experienceYears;

    private String qualifications;

    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT

    private String joiningDate; // YYYY-MM-DD

    private String resignationDate;

    private Double monthlySalary;

    private String employmentStatus; // ACTIVE, INACTIVE, ON_LEAVE, RESIGNED

    private String shiftSchedule;

    private String profileImageUrl;

    private String bio;

    private String emergencyContact;

    private Long applicationId;
}
