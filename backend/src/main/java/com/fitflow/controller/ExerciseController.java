package com.fitflow.controller;

import com.fitflow.entity.Exercise;
import com.fitflow.entity.enums.EquipmentType;
import com.fitflow.entity.enums.ExperienceLevel;
import com.fitflow.entity.enums.TargetMuscle;
import com.fitflow.repository.ExerciseRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseRepository exerciseRepository;

    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String muscle,
            @RequestParam(required = false) String equipment) {

        List<Exercise> list = exerciseRepository.findAll();

        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            list = list.stream()
                    .filter(e -> e.getName().toLowerCase().contains(q) ||
                            (e.getMuscleGroup() != null && e.getMuscleGroup().name().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        if (muscle != null && !muscle.trim().isEmpty() && !muscle.equalsIgnoreCase("all")) {
            list = list.stream()
                    .filter(e -> e.getMuscleGroup() != null && e.getMuscleGroup().name().equalsIgnoreCase(muscle.trim()))
                    .collect(Collectors.toList());
        }

        if (equipment != null && !equipment.trim().isEmpty() && !equipment.equalsIgnoreCase("all")) {
            list = list.stream()
                    .filter(e -> e.getEquipment() != null && e.getEquipment().name().equalsIgnoreCase(equipment.trim()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(list);
    }

    @PostMapping("/custom")
    public ResponseEntity<Exercise> createCustomExercise(@RequestBody CustomExerciseRequest req) {
        TargetMuscle muscle = TargetMuscle.CHEST;
        if (req.getMuscleGroup() != null) {
            try {
                muscle = TargetMuscle.valueOf(req.getMuscleGroup().toUpperCase());
            } catch (Exception ignored) {}
        }

        EquipmentType equipment = EquipmentType.NO_EQUIPMENT;
        if (req.getEquipment() != null) {
            try {
                equipment = EquipmentType.valueOf(req.getEquipment().toUpperCase());
            } catch (Exception ignored) {}
        }

        Exercise exercise = Exercise.builder()
                .name(req.getName())
                .description(req.getDescription())
                .muscleGroup(muscle)
                .equipment(equipment)
                .difficulty(ExperienceLevel.INTERMEDIATE)
                .defaultSets(req.getDefaultSets() != null ? req.getDefaultSets() : 3)
                .defaultReps(req.getDefaultReps() != null ? req.getDefaultReps() : 10)
                .durationSeconds(60)
                .build();

        Exercise saved = exerciseRepository.save(exercise);
        return ResponseEntity.ok(saved);
    }

    @Data
    public static class CustomExerciseRequest {
        private String name;
        private String description;
        private String muscleGroup;
        private String equipment;
        private Integer defaultSets;
        private Integer defaultReps;
    }
}
