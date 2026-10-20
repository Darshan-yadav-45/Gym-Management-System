package com.fitflow.entity;

import com.fitflow.entity.enums.EmploymentType;
import com.fitflow.entity.enums.VacancyStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_vacancies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobVacancy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String department; // e.g. "Personal Training", "Group Fitness", "Strength & Conditioning"

    private String specialization; // e.g. "Strength, Hypertrophy, Weight Loss"

    @Column(nullable = false)
    @Builder.Default
    private Integer vacanciesCount = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer filledCount = 0;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String jobDescription;

    @Column(columnDefinition = "TEXT")
    private String requiredQualifications;

    @Builder.Default
    private Integer minExperience = 1;

    private Integer preferredExperience;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EmploymentType employmentType = EmploymentType.FULL_TIME;

    private String salaryRange; // e.g. "$3,500 - $4,500 / month"

    @Builder.Default
    private Boolean isSalaryPublished = false;

    private String location; // e.g. "FitFlow Central Gym, Main Branch"

    @Column(nullable = false)
    private LocalDate openingDate;

    @Column(nullable = false)
    private LocalDate deadlineDate;

    private LocalDate expectedJoiningDate;

    private String workingDaysShift; // e.g. "Mon - Fri, Morning (06:00 - 14:00)"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VacancyStatus status = VacancyStatus.OPEN;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /**
     * Checks if the vacancy is currently accepting public applications.
     */
    public boolean isCurrentlyOpen() {
        if (status != VacancyStatus.OPEN) return false;
        LocalDate today = LocalDate.now();
        if (openingDate != null && today.isBefore(openingDate)) return false;
        if (deadlineDate != null && today.isAfter(deadlineDate)) return false;
        return (vacanciesCount - filledCount) > 0;
    }

    public int getRemainingPositions() {
        return Math.max(0, vacanciesCount - filledCount);
    }
}
