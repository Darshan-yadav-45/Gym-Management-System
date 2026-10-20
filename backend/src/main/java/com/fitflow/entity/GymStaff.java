package com.fitflow.entity;

import com.fitflow.entity.enums.EmploymentStatus;
import com.fitflow.entity.enums.EmploymentType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "gym_staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GymStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String staffId; // e.g. TRN-001, STF-001

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String designation; // e.g. "Senior Personal Trainer", "Floor Coach", "Fitness Instructor"

    private String specialization; // e.g. "Weight Loss, Strength Training"

    @Builder.Default
    private Integer experienceYears = 1;

    @Column(columnDefinition = "TEXT")
    private String qualifications; // e.g. "ACE Certified, CPR/AED, ISSA"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EmploymentType employmentType = EmploymentType.FULL_TIME;

    @Column(nullable = false)
    private LocalDate joiningDate;

    private LocalDate resignationDate;

    // Confidential salary field — restricted to authorized administrators
    private Double monthlySalary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EmploymentStatus employmentStatus = EmploymentStatus.ACTIVE;

    private String shiftSchedule; // e.g. "Morning Shift (06:00 - 14:00)"

    private String profileImageUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String emergencyContact;

    private Long applicationId; // Link to hiring application if converted

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
