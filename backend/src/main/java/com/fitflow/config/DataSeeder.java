package com.fitflow.config;

import com.fitflow.entity.Exercise;
import com.fitflow.entity.User;
import com.fitflow.entity.enums.EquipmentType;
import com.fitflow.entity.enums.ExperienceLevel;
import com.fitflow.entity.enums.Role;
import com.fitflow.entity.enums.TargetMuscle;
import com.fitflow.repository.ExerciseRepository;
import com.fitflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedExercises();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@fitflow.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            User trainer = User.builder()
                    .name("Trainer User")
                    .email("trainer@fitflow.com")
                    .password(passwordEncoder.encode("trainer123"))
                    .role(Role.TRAINER)
                    .build();

            User member = User.builder()
                    .name("Member User")
                    .email("member@fitflow.com")
                    .password(passwordEncoder.encode("member123"))
                    .role(Role.MEMBER)
                    .build();

            userRepository.saveAll(List.of(admin, trainer, member));
            System.out.println("Users seeded.");
        }
    }

    private void seedExercises() {
        List<Exercise> defaultExercises = List.of(
            Exercise.builder().name("Push-up").muscleGroup(TargetMuscle.CHEST).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Dumbbell Bench Press").muscleGroup(TargetMuscle.CHEST).equipment(EquipmentType.DUMBBELLS).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Diamond Push-up").muscleGroup(TargetMuscle.TRICEPS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Chest Dip on Bench").muscleGroup(TargetMuscle.TRICEPS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Triceps Dip on Floor").muscleGroup(TargetMuscle.TRICEPS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Bench Dip on Floor").muscleGroup(TargetMuscle.TRICEPS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Cable Rope Pushdown").muscleGroup(TargetMuscle.TRICEPS).equipment(EquipmentType.FULL_GYM).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(12).build(),
            Exercise.builder().name("Barbell Bench Press").muscleGroup(TargetMuscle.CHEST).equipment(EquipmentType.FULL_GYM).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Dumbbell Squeeze Bench Press").muscleGroup(TargetMuscle.CHEST).equipment(EquipmentType.DUMBBELLS).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Bodyweight Squat").muscleGroup(TargetMuscle.QUADS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(60).defaultSets(3).defaultReps(15).build(),
            Exercise.builder().name("Plank").muscleGroup(TargetMuscle.ABS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(60).defaultSets(3).defaultReps(1).build(),
            Exercise.builder().name("Glute Bridge").muscleGroup(TargetMuscle.GLUTES).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(60).defaultSets(3).defaultReps(15).build(),
            Exercise.builder().name("Lunges").muscleGroup(TargetMuscle.QUADS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(60).defaultSets(3).defaultReps(12).build(),
            Exercise.builder().name("Lat Pulldown").muscleGroup(TargetMuscle.LATS).equipment(EquipmentType.FULL_GYM).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Leg Press").muscleGroup(TargetMuscle.QUADS).equipment(EquipmentType.FULL_GYM).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(12).build(),
            Exercise.builder().name("Dumbbell Curl").muscleGroup(TargetMuscle.BICEPS).equipment(EquipmentType.DUMBBELLS).difficulty(ExperienceLevel.BEGINNER).durationSeconds(60).defaultSets(3).defaultReps(12).build()
        );

        if (exerciseRepository.count() == 0) {
            exerciseRepository.saveAll(defaultExercises);
            System.out.println("Exercises seeded.");
        } else {
            // Seed any missing target exercises
            for (Exercise ex : defaultExercises) {
                if (exerciseRepository.findByNameIgnoreCase(ex.getName()).isEmpty()) {
                    exerciseRepository.save(ex);
                }
            }
        }
    }
}
