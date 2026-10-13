package com.fitflow.service;

import com.fitflow.entity.Exercise;
import com.fitflow.entity.enums.EquipmentType;
import com.fitflow.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final ExerciseRepository exerciseRepository;

    public List<Exercise> getHomeAlternativeWorkout() {
        List<Exercise> noEquipmentExercises = exerciseRepository.findByEquipment(EquipmentType.NO_EQUIPMENT);
        
        // Simple strategy: take the first 5 for a quick 15-minute home workout
        return noEquipmentExercises.stream()
                .limit(5)
                .collect(Collectors.toList());
    }
}
