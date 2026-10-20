package com.fitflow.entity;

import com.fitflow.entity.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainer_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String referenceNumber; // e.g. APP-2026-8921

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacancy_id", nullable = false)
    private JobVacancy vacancy;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String currentLocation;

    private String desiredPosition;

    @Builder.Default
    private Integer experienceYears = 0;

    private String specialization;

    private String educationalQualifications;

    private String fitnessCertifications;

    @Column(columnDefinition = "TEXT")
    private String previousExperience;

    @Column(columnDefinition = "TEXT")
    private String professionalSummary;

    private LocalDate availabilityDate;

    private String resumeFileName;

    private String resumeFilePath;

    private String portfolioUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean consentGiven = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Column(columnDefinition = "TEXT")
    private String internalNotes;

    private LocalDate interviewDate;

    private String interviewTime;

    private String interviewLocation; // In-person address or Video Meeting Link

    @Column(columnDefinition = "TEXT")
    private String interviewNotes;

    @Builder.Default
    private Boolean convertedToStaff = false;

    private Long convertedStaffId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
