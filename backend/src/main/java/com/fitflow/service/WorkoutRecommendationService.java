package com.fitflow.service;

import com.fitflow.dto.OnboardingRequest;
import com.fitflow.entity.*;
import com.fitflow.repository.ExerciseRepository;
import com.fitflow.repository.WorkoutPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutRecommendationService {

    private final ExerciseRepository exerciseRepository;
    private final WorkoutPlanRepository workoutPlanRepository;

    @Transactional
    public WorkoutPlan generateInitialWorkoutPlan(User user, FitnessProfile profile, WorkoutPreferenceDetails prefs, OnboardingRequest request) {
        WorkoutPlan plan = WorkoutPlan.builder()
                .user(user)
                .name("Personalized " + request.getExperienceLevel().name() + " Plan")
                .description("Generated based on your fitness profile")
                .goal(request.getFitnessGoal())
                .difficulty(request.getExperienceLevel())
                .durationWeeks(4)
                .active(true)
                .build();
                
        // Save to get ID
        plan = workoutPlanRepository.save(plan);
        
        // Fetch matching exercises
        List<Exercise> availableExercises = exerciseRepository.findByEquipment(request.getEquipmentType());
        
        if(availableExercises.isEmpty()) {
            availableExercises = exerciseRepository.findAll(); // Fallback
        }
        
        // Generate a simple routine using available exercises (taking max 6 for now)
        int order = 1;
        for (int i = 0; i < Math.min(6, availableExercises.size()); i++) {
            Exercise ex = availableExercises.get(i);
            WorkoutExercise we = WorkoutExercise.builder()
                    .workoutPlan(plan)
                    .exercise(ex)
                    .dayNumber(1)
                    .sets(ex.getDefaultSets() != null ? ex.getDefaultSets() : 3)
                    .reps(ex.getDefaultReps() != null ? ex.getDefaultReps() : 10)
                    .durationSeconds(ex.getDurationSeconds() != null ? ex.getDurationSeconds() : 60)
                    .restSeconds(60)
                    .orderIndex(order++)
                    .build();
            plan.getExercises().add(we);
        }
        
        return workoutPlanRepository.save(plan);
    }
}
