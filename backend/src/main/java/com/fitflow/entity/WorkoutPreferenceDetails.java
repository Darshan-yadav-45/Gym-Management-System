package com.fitflow.entity;

import com.fitflow.entity.enums.EquipmentType;
import com.fitflow.entity.enums.WorkoutPreference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workout_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPreferenceDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private FitnessProfile fitnessProfile;

    private Integer workoutsPerWeek;
    
    private String preferredTime;
    
    private Integer durationMinutes;
    
    @Enumerated(EnumType.STRING)
    private WorkoutPreference workoutLocation;
    
    @Enumerated(EnumType.STRING)
    private EquipmentType equipmentType;
}
