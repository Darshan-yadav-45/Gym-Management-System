package com.fitflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Stores which AI coach a user has selected.
 * One preference record per user — updated in place when coach changes.
 * Never creates duplicates; changing coach updates the existing record.
 */
@Entity
@Table(name = "user_coach_preferences",
        uniqueConstraints = @UniqueConstraint(columnNames = "user_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCoachPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coach_id", nullable = false)
    private AiCoach coach;

    @CreationTimestamp
    private LocalDateTime selectedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
