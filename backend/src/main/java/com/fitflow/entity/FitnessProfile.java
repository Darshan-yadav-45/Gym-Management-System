package com.fitflow.entity;

import com.fitflow.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "fitness_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FitnessProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Double heightCm;
    
    private Double weightKg;
    
    private Double bmi;

    private String location;
    
    private String designation;

    @Enumerated(EnumType.STRING)
    private Occupation occupation;

    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel;

    @Enumerated(EnumType.STRING)
    private Environment environment;

    @Enumerated(EnumType.STRING)
    private FitnessGoal fitnessGoal;

    @Enumerated(EnumType.STRING)
    private ExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    private WorkoutPreference workoutPreference;

    private String preferredWorkoutTime;

    @Enumerated(EnumType.STRING)
    private DietPreference dietPreference;

    @ElementCollection(targetClass = TargetMuscle.class)
    @CollectionTable(name = "target_muscles", joinColumns = @JoinColumn(name = "profile_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "muscle")
    @Builder.Default
    private Set<TargetMuscle> targetMuscles = new HashSet<>();
    
    @OneToOne(mappedBy = "fitnessProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private WorkoutPreferenceDetails workoutPreferenceDetails;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
