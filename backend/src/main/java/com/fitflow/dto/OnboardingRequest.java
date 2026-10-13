package com.fitflow.dto;

import com.fitflow.entity.enums.*;
import lombok.Data;

import java.util.List;

@Data
public class OnboardingRequest {
    private Gender gender;
    private Double heightCm;
    private Double weightKg;
    private Integer age;
    private Occupation occupation;
    private ActivityLevel activityLevel;
    private Environment environment;
    private FitnessGoal fitnessGoal;
    private ExperienceLevel experienceLevel;
    private WorkoutPreference workoutPreference;
    private String preferredWorkoutTime;
    private DietPreference dietPreference;
    private Integer workoutsPerWeek;
    private EquipmentType equipmentType;
    private List<TargetMuscle> targetMuscles;
    private List<DayOfWeek> selectedDays;
}
