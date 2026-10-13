package com.fitflow.entity;

import com.fitflow.entity.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    private LocalDate appointmentDate;
    
    private LocalTime startTime;
    
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String trainingType;
    
    private String sessionType;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
