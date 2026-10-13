package com.fitflow.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workout_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id", nullable = false)
    private WorkoutPlan workoutPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    private Integer dayNumber;
    
    private Integer sets;
    
    private Integer reps;
    
    private Integer durationSeconds;
    
    private Integer restSeconds;
    
    private Integer orderIndex;
}
