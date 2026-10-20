package com.fitflow.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TrainerApplicationRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
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

    private String portfolioUrl;

    @AssertTrue(message = "You must consent to the privacy policy and application processing")
    private Boolean consentGiven;
}
