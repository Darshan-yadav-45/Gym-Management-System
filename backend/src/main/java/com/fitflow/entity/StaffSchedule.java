package com.fitflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private GymStaff staff;

    @Column(nullable = false)
    private String shiftName; // e.g. "Morning Shift", "Evening Shift", "Strength Conditioning Slot"

    private String dayOfWeek; // e.g. "MONDAY", "TUESDAY", etc.

    private LocalDate specificDate; // For specific date schedules

    @Column(nullable = false)
    private String startTime; // e.g. "06:00"

    @Column(nullable = false)
    private String endTime; // e.g. "14:00"

    @Builder.Default
    private Boolean isRecurring = true;

    @Builder.Default
    private Boolean isRestDay = false;

    private String notes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
