package com.fitflow.config;

import com.fitflow.entity.*;
import com.fitflow.entity.enums.*;
import com.fitflow.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/**
 * Seeds initial data on startup.
 * All seed operations are idempotent — safe to run repeatedly.
 * NEVER drops tables or deletes existing records.
 */
@Component
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final TrainerRepository trainerRepository;
    private final AiCoachRepository aiCoachRepository;
    private final UserSubscriptionRepository subscriptionRepository;
    private final MembershipPlanRepository planRepository;
    private final FitnessProfileRepository fitnessProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.fitflow.repository.GymStaffRepository staffRepository;
    private final com.fitflow.repository.JobVacancyRepository vacancyRepository;
    private final com.fitflow.repository.TrainerApplicationRepository applicationRepository;
    private final com.fitflow.repository.StaffScheduleRepository scheduleRepository;
    private final com.fitflow.repository.ApplicationStatusHistoryRepository statusHistoryRepository;

    @Value("${fitflow.admin.seed-enabled:${ADMIN_SEED_ENABLED:true}}")
    private boolean adminSeedEnabled;

    @Value("${fitflow.admin.email:${ADMIN_EMAIL:appu12813@gmail.com}}")
    private String adminEmail;

    @Value("${fitflow.admin.password:${ADMIN_INITIAL_PASSWORD:Lulu@3002}}")
    private String adminPassword;

    @Value("${fitflow.demo.seed-enabled:${DEMO_SEED_ENABLED:true}}")
    private boolean demoSeedEnabled;

    public DataSeeder(UserRepository userRepository,
                      ExerciseRepository exerciseRepository,
                      TrainerRepository trainerRepository,
                      AiCoachRepository aiCoachRepository,
                      UserSubscriptionRepository subscriptionRepository,
                      MembershipPlanRepository planRepository,
                      FitnessProfileRepository fitnessProfileRepository,
                      PasswordEncoder passwordEncoder,
                      com.fitflow.repository.GymStaffRepository staffRepository,
                      com.fitflow.repository.JobVacancyRepository vacancyRepository,
                      com.fitflow.repository.TrainerApplicationRepository applicationRepository,
                      com.fitflow.repository.StaffScheduleRepository scheduleRepository,
                      com.fitflow.repository.ApplicationStatusHistoryRepository statusHistoryRepository) {
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.trainerRepository = trainerRepository;
        this.aiCoachRepository = aiCoachRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.fitnessProfileRepository = fitnessProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.staffRepository = staffRepository;
        this.vacancyRepository = vacancyRepository;
        this.applicationRepository = applicationRepository;
        this.scheduleRepository = scheduleRepository;
        this.statusHistoryRepository = statusHistoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedPlans();
        seedUsers();
        seedDemoUsers();
        seedExercises();
        seedTrainers();
        seedAiCoaches();
        seedStaffAndRecruitment();
    }

    private void seedPlans() {
        List<MembershipPlan> defaultPlans = List.of(
            MembershipPlan.builder().name("Free Plan").price(0.0).durationMonths(0).description("Access to basic bodyweight workouts & community coaches").features("Free AI coaches,Basic tracking").build(),
            MembershipPlan.builder().name("Standard Monthly Plan").price(19.99).durationMonths(1).description("Standard gym access with full workout tracking").features("All standard workouts,Gym machines,Basic AI analytics").build(),
            MembershipPlan.builder().name("Premium Pro Plan").price(49.99).durationMonths(3).description("Advanced training with dedicated premium AI coaches").features("All premium AI coaches,Hypertrophy & strength periodization,Diet guide").build(),
            MembershipPlan.builder().name("Premium Annual Plan").price(149.99).durationMonths(12).description("Full 12-month transformation membership").features("All coaches,Unlimited analytics,Priority support").build(),
            MembershipPlan.builder().name("VIP All-Access Plan").price(299.99).durationMonths(12).description("Elite fitness concierge access with personal human trainer booking").features("All VIP features,Human trainer access,Custom meal plans").build()
        );

        for (MembershipPlan plan : defaultPlans) {
            if (planRepository.findByNameIgnoreCase(plan.getName()).isEmpty()) {
                planRepository.save(plan);
            }
        }
    }

    private void seedUsers() {
        if (!adminSeedEnabled) {
            log.info("Admin seeding is disabled via fitflow.admin.seed-enabled / ADMIN_SEED_ENABLED.");
            return;
        }

        // 1. Seed or preserve Admin
        String normalizedAdminEmail = adminEmail.trim().toLowerCase();
        var existingAdmin = userRepository.findByEmail(normalizedAdminEmail);
        if (existingAdmin.isEmpty()) {
            User admin = User.builder()
                    .name("FitFlow Administrator")
                    .email(normalizedAdminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Configured admin seeded: {} with role ADMIN.", normalizedAdminEmail);
        } else {
            User admin = existingAdmin.get();
            admin.setRole(Role.ADMIN);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEnabled(true);
            userRepository.save(admin);
            log.info("Configured admin {} verified and role/password updated.", normalizedAdminEmail);
        }

        // 2. Default Trainer (if missing)
        if (userRepository.findByEmail("trainer@fitflow.com").isEmpty()) {
            User trainer = User.builder()
                    .name("Trainer User")
                    .email("trainer@fitflow.com")
                    .password(passwordEncoder.encode("trainer123"))
                    .role(Role.TRAINER)
                    .build();
            userRepository.save(trainer);
        }

        // 3. Default Member (if missing)
        if (userRepository.findByEmail("member@fitflow.com").isEmpty()) {
            User member = User.builder()
                    .name("Member User")
                    .email("member@fitflow.com")
                    .password(passwordEncoder.encode("member123"))
                    .role(Role.MEMBER)
                    .build();
            member = userRepository.save(member);

            // Give default member a free plan
            MembershipPlan freePlan = planRepository.findByNameIgnoreCase("Free Plan").orElse(null);
            UserSubscription sub = UserSubscription.builder()
                    .user(member)
                    .plan(freePlan)
                    .status(SubscriptionStatus.FREE)
                    .startDate(LocalDate.now())
                    .build();
            subscriptionRepository.save(sub);
        }
    }

    /**
     * Seeds 5 clearly identified demonstration users with diverse subscription statuses
     * for development / demonstration environments.
     * All dates are calculated dynamically relative to LocalDate.now().
     * Safe & idempotent — checks userRepository.findByEmail() before creating.
     */
    private void seedDemoUsers() {
        if (!demoSeedEnabled) {
            log.info("Demonstration user seeding is disabled via fitflow.demo.seed-enabled / DEMO_SEED_ENABLED.");
            return;
        }

        LocalDate today = LocalDate.now();
        MembershipPlan freePlan = planRepository.findByNameIgnoreCase("Free Plan").orElse(null);
        MembershipPlan monthlyPlan = planRepository.findByNameIgnoreCase("Standard Monthly Plan").orElse(null);
        MembershipPlan proPlan = planRepository.findByNameIgnoreCase("Premium Pro Plan").orElse(null);
        MembershipPlan annualPlan = planRepository.findByNameIgnoreCase("Premium Annual Plan").orElse(null);
        MembershipPlan vipPlan = planRepository.findByNameIgnoreCase("VIP All-Access Plan").orElse(null);

        // Demo User 01: Active
        createDemoUserIfNotExists(
            "Demo User 01 [Test Record]",
            "demo1@example.com",
            "Demo123!",
            FitnessGoal.BUILD_MUSCLE,
            ExperienceLevel.INTERMEDIATE,
            proPlan,
            SubscriptionStatus.ACTIVE,
            today.minusDays(30),
            today.plusDays(60)
        );

        // Demo User 02: Expiring soon (e.g. 4 days left)
        createDemoUserIfNotExists(
            "Demo User 02 [Test Record]",
            "demo2@example.com",
            "Demo123!",
            FitnessGoal.WEIGHT_LOSS,
            ExperienceLevel.ADVANCED,
            annualPlan,
            SubscriptionStatus.EXPIRING_SOON,
            today.minusDays(361),
            today.plusDays(4)
        );

        // Demo User 03: Expired (e.g. expired 5 days ago)
        createDemoUserIfNotExists(
            "Demo User 03 [Test Record]",
            "demo3@example.com",
            "Demo123!",
            FitnessGoal.MAINTAIN_WEIGHT,
            ExperienceLevel.BEGINNER,
            monthlyPlan,
            SubscriptionStatus.EXPIRED,
            today.minusDays(35),
            today.minusDays(5)
        );

        // Demo User 04: Free plan
        createDemoUserIfNotExists(
            "Demo User 04 [Test Record]",
            "demo4@example.com",
            "Demo123!",
            FitnessGoal.GENERAL_FITNESS,
            ExperienceLevel.BEGINNER,
            freePlan,
            SubscriptionStatus.FREE,
            today.minusDays(15),
            null
        );

        // Demo User 05: Active (VIP access)
        createDemoUserIfNotExists(
            "Demo User 05 [Test Record]",
            "demo5@example.com",
            "Demo123!",
            FitnessGoal.STRENGTH,
            ExperienceLevel.INTERMEDIATE,
            vipPlan,
            SubscriptionStatus.ACTIVE,
            today.minusDays(10),
            today.plusDays(180)
        );
    }

    private void createDemoUserIfNotExists(String name,
                                           String email,
                                           String rawPassword,
                                           FitnessGoal goal,
                                           ExperienceLevel experience,
                                           MembershipPlan plan,
                                           SubscriptionStatus status,
                                           LocalDate startDate,
                                           LocalDate endDate) {
        String normalizedEmail = email.trim().toLowerCase();
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            return; // Already exists, never overwrite
        }

        User user = User.builder()
                .name(name)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(rawPassword))
                .role(Role.MEMBER)
                .enabled(true)
                .build();
        user = userRepository.save(user);

        // Fitness Profile
        FitnessProfile profile = FitnessProfile.builder()
                .user(user)
                .fitnessGoal(goal)
                .experienceLevel(experience)
                .age(28)
                .gender(Gender.MALE)
                .heightCm(178.0)
                .weightKg(75.0)
                .bmi(23.7)
                .activityLevel(ActivityLevel.MODERATE)
                .build();
        fitnessProfileRepository.save(profile);

        // Subscription record
        UserSubscription sub = UserSubscription.builder()
                .user(user)
                .plan(plan)
                .status(status)
                .startDate(startDate)
                .endDate(endDate)
                .autoRenew(status == SubscriptionStatus.ACTIVE)
                .build();
        subscriptionRepository.save(sub);

        log.info("Seeded demonstration user: {} ({}) with status: {}", name, normalizedEmail, status);
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
            Exercise.builder().name("Dumbbell Curl").muscleGroup(TargetMuscle.BICEPS).equipment(EquipmentType.DUMBBELLS).difficulty(ExperienceLevel.BEGINNER).durationSeconds(60).defaultSets(3).defaultReps(12).build(),
            Exercise.builder().name("Dumbbell Shoulder Press").muscleGroup(TargetMuscle.SHOULDERS).equipment(EquipmentType.DUMBBELLS).difficulty(ExperienceLevel.INTERMEDIATE).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Jumping Jacks").muscleGroup(TargetMuscle.CALVES).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(60).defaultSets(3).defaultReps(25).build(),
            Exercise.builder().name("Downward-Facing Dog (Yoga)").muscleGroup(TargetMuscle.HAMSTRINGS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(45).defaultSets(3).defaultReps(1).build(),
            Exercise.builder().name("Warrior II Pose (Yoga)").muscleGroup(TargetMuscle.QUADS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(45).defaultSets(3).defaultReps(1).build(),
            Exercise.builder().name("Cat-Cow Spine Mobility").muscleGroup(TargetMuscle.TRAPS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(60).defaultSets(3).defaultReps(10).build(),
            Exercise.builder().name("Standing Hamstring Stretch").muscleGroup(TargetMuscle.HAMSTRINGS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(45).defaultSets(3).defaultReps(1).build(),
            Exercise.builder().name("Cobra Core Stretch").muscleGroup(TargetMuscle.ABS).equipment(EquipmentType.NO_EQUIPMENT).difficulty(ExperienceLevel.BEGINNER).durationSeconds(45).defaultSets(3).defaultReps(1).build()
        );

        if (exerciseRepository.count() == 0) {
            exerciseRepository.saveAll(defaultExercises);
            log.info("Exercises seeded.");
        } else {
            for (Exercise ex : defaultExercises) {
                if (exerciseRepository.findByNameIgnoreCase(ex.getName()).isEmpty()) {
                    exerciseRepository.save(ex);
                }
            }
        }
    }

    private void seedTrainers() {
        if (trainerRepository.count() == 0) {
            User humanTrainerUser = userRepository.findByEmail("trainer@fitflow.com").orElse(null);
            if (humanTrainerUser != null) {
                Trainer humanTrainer = Trainer.builder()
                        .user(humanTrainerUser)
                        .specialization("Strength,Muscle Building,Gym Training")
                        .experienceYears(8)
                        .bio("Elite certified strength coach helping you achieve maximum peak power and athletic performance.")
                        .profileImageUrl("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500")
                        .availability("Mon-Fri 06:00 - 20:00")
                        .build();
                trainerRepository.save(humanTrainer);
                log.info("Human trainer seeded.");
            }
        }
    }

    /**
     * Seeds 14 diverse AI coach profiles.
     * These are fictional AI personas — not real professionals.
     * All are clearly labelled as AI coaches.
     * Seeding is idempotent — checks by displayName before inserting.
     */
    private void seedAiCoaches() {
        List<AiCoach> coaches = List.of(

            // ─── FREE COACHES ────────────────────────────────────────────────

            AiCoach.builder()
                .displayName("ARIA")
                .gender("FEMALE")
                .avatarUrl("https://images.unsplash.com/photo-1609899537878-48b5de5f9a95?q=80&w=400")
                .specialization("General Fitness & Beginner Training")
                .description("ARIA is your friendly AI fitness guide, perfect for anyone just starting their fitness journey. She combines science-backed routines with encouragement and clarity.")
                .coachingStyle("Patient, motivating, step-by-step guidance with clear explanations for every exercise.")
                .experienceDescription("Trained with data from 50,000+ beginner fitness sessions.")
                .tier(CoachTier.FREE)
                .primaryCategory(CoachCategory.GENERAL_FITNESS)
                .supportedCategories(Set.of(
                    CoachCategory.GENERAL_FITNESS, CoachCategory.BEGINNER_FRIENDLY, CoachCategory.HOME_WORKOUTS))
                .active(true).build(),

            AiCoach.builder()
                .displayName("BLAZE")
                .gender("MALE")
                .avatarUrl("https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400")
                .specialization("Weight Loss & Fat Burn")
                .description("BLAZE specializes in sustainable fat-loss strategies combining cardio, HIIT, and resistance training. He focuses on real results without extreme restrictions.")
                .coachingStyle("High-energy, no-nonsense coaching with data-driven progress tracking.")
                .experienceDescription("Optimized for cardio-resistance hybrid training programs.")
                .tier(CoachTier.FREE)
                .primaryCategory(CoachCategory.WEIGHT_LOSS)
                .supportedCategories(Set.of(
                    CoachCategory.WEIGHT_LOSS, CoachCategory.CARDIO_ENDURANCE, CoachCategory.HOME_WORKOUTS))
                .active(true).build(),

            AiCoach.builder()
                .displayName("LUNA")
                .gender("FEMALE")
                .avatarUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400")
                .specialization("Yoga, Flexibility & Mindfulness")
                .description("LUNA guides you through yoga flows from beginner to advanced, focusing on flexibility, breathing, balance, and mental clarity. She makes yoga accessible for everyone.")
                .coachingStyle("Calm, mindful, and supportive — connects breath with movement for a holistic experience.")
                .experienceDescription("Trained across 200+ yoga styles including Vinyasa, Hatha, and Yin.")
                .tier(CoachTier.FREE)
                .primaryCategory(CoachCategory.YOGA_FLEXIBILITY)
                .supportedCategories(Set.of(
                    CoachCategory.YOGA_FLEXIBILITY, CoachCategory.RECOVERY_STRETCHING, CoachCategory.MOBILITY_RECOVERY))
                .active(true).build(),

            AiCoach.builder()
                .displayName("TITAN")
                .gender("MALE")
                .avatarUrl("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400")
                .specialization("Muscle Building & Weight Gain")
                .description("TITAN specializes in healthy weight gain through progressive overload, optimized nutrition education, and compound lifting. He designs programs for sustainable muscle growth.")
                .coachingStyle("Direct, goal-focused coaching with detailed exercise form breakdowns and progressive plans.")
                .experienceDescription("Built on hypertrophy science and progressive strength programming data.")
                .tier(CoachTier.FREE)
                .primaryCategory(CoachCategory.WEIGHT_GAIN)
                .supportedCategories(Set.of(
                    CoachCategory.WEIGHT_GAIN, CoachCategory.MUSCLE_BUILDING, CoachCategory.GYM_WORKOUTS))
                .active(true).build(),

            AiCoach.builder()
                .displayName("NOVA")
                .gender("FEMALE")
                .avatarUrl("https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400")
                .specialization("Home Workouts & Bodyweight Training")
                .description("NOVA proves you don't need a gym to get fit. She designs effective bodyweight and minimal-equipment programs for any space, schedule, or fitness level.")
                .coachingStyle("Creative, adaptive, and resourceful — maximizing results with what you have at home.")
                .experienceDescription("Specialized in no-equipment and minimal-equipment training progressions.")
                .tier(CoachTier.FREE)
                .primaryCategory(CoachCategory.HOME_WORKOUTS)
                .supportedCategories(Set.of(
                    CoachCategory.HOME_WORKOUTS, CoachCategory.BEGINNER_FRIENDLY, CoachCategory.GENERAL_FITNESS))
                .active(true).build(),

            AiCoach.builder()
                .displayName("REX")
                .gender("MALE")
                .avatarUrl("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400")
                .specialization("Cardio & Endurance Training")
                .description("REX is built for endurance athletes and cardio enthusiasts. From beginner walks to marathon prep, he guides you through structured cardio progressions and VO2 max improvement.")
                .coachingStyle("Data-driven and encouraging — tracks heart rate zones, pace, and recovery metrics.")
                .experienceDescription("Trained on endurance sport performance data including running, cycling, and swimming.")
                .tier(CoachTier.FREE)
                .primaryCategory(CoachCategory.CARDIO_ENDURANCE)
                .supportedCategories(Set.of(
                    CoachCategory.CARDIO_ENDURANCE, CoachCategory.WEIGHT_LOSS, CoachCategory.GENERAL_FITNESS))
                .active(true).build(),

            AiCoach.builder()
                .displayName("SERENE")
                .gender("FEMALE")
                .avatarUrl("https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=400")
                .specialization("Recovery, Stretching & Rest-Day Guidance")
                .description("SERENE focuses on what happens between workouts — recovery protocols, active rest, stretching routines, and sleep optimization to help you come back stronger.")
                .coachingStyle("Gentle, restorative, and evidence-based — teaches the importance of recovery in performance.")
                .experienceDescription("Specialized in sports recovery science and mobility rehabilitation protocols.")
                .tier(CoachTier.FREE)
                .primaryCategory(CoachCategory.RECOVERY_STRETCHING)
                .supportedCategories(Set.of(
                    CoachCategory.RECOVERY_STRETCHING, CoachCategory.YOGA_FLEXIBILITY, CoachCategory.MOBILITY_RECOVERY))
                .active(true).build(),

            AiCoach.builder()
                .displayName("GRACE")
                .gender("FEMALE")
                .avatarUrl("https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=400")
                .specialization("Senior-Friendly & Low-Impact Exercise")
                .description("GRACE specializes in safe, effective exercise for older adults and those with joint sensitivity. She adapts every routine for comfort and longevity.")
                .coachingStyle("Gentle, clear, and supportive — safety-first approach with modifications for every fitness level.")
                .experienceDescription("Trained on senior fitness research and low-impact exercise science.")
                .tier(CoachTier.FREE)
                .primaryCategory(CoachCategory.SENIOR_LOW_IMPACT)
                .supportedCategories(Set.of(
                    CoachCategory.SENIOR_LOW_IMPACT, CoachCategory.RECOVERY_STRETCHING, CoachCategory.BEGINNER_FRIENDLY))
                .active(true).build(),

            // ─── PREMIUM COACHES ─────────────────────────────────────────────

            AiCoach.builder()
                .displayName("FORGE")
                .gender("MALE")
                .avatarUrl("https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400")
                .specialization("Strength Training & Powerlifting")
                .description("FORGE is an elite strength AI designed for serious lifters. He programs periodized powerlifting cycles, tracks one-rep maxes, and optimizes your Big 3 performance.")
                .coachingStyle("Technical, precise, and demanding — expects commitment and delivers elite-level programming.")
                .experienceDescription("Built on world-class powerlifting and strength sport periodization data.")
                .tier(CoachTier.PREMIUM)
                .primaryCategory(CoachCategory.STRENGTH_TRAINING)
                .supportedCategories(Set.of(
                    CoachCategory.STRENGTH_TRAINING, CoachCategory.MUSCLE_BUILDING, CoachCategory.GYM_WORKOUTS))
                .active(true).build(),

            AiCoach.builder()
                .displayName("VEGA")
                .gender("FEMALE")
                .avatarUrl("https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=400")
                .specialization("Sports Conditioning & Athletic Performance")
                .description("VEGA designs sport-specific conditioning programs for competitive athletes. She covers agility, speed, power, endurance, and sport-specific movement patterns.")
                .coachingStyle("Analytical and competitive — uses periodization science to peak your performance for events.")
                .experienceDescription("Trained on multi-sport athletic conditioning and performance optimization data.")
                .tier(CoachTier.PREMIUM)
                .primaryCategory(CoachCategory.SPORTS_CONDITIONING)
                .supportedCategories(Set.of(
                    CoachCategory.SPORTS_CONDITIONING, CoachCategory.STRENGTH_TRAINING, CoachCategory.CARDIO_ENDURANCE))
                .active(true).build(),

            AiCoach.builder()
                .displayName("APEX")
                .gender("MALE")
                .avatarUrl("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400")
                .specialization("Gym Workouts & Hypertrophy")
                .description("APEX is your premium gym AI, mastering the full range of gym equipment. He designs split programs, tracks volume, and optimizes training stimulus for maximum hypertrophy.")
                .coachingStyle("Scientific and results-driven — tracks every variable for optimal growth and progression.")
                .experienceDescription("Trained on advanced gym programming, hypertrophy research, and body composition science.")
                .tier(CoachTier.PREMIUM)
                .primaryCategory(CoachCategory.GYM_WORKOUTS)
                .supportedCategories(Set.of(
                    CoachCategory.GYM_WORKOUTS, CoachCategory.MUSCLE_BUILDING, CoachCategory.STRENGTH_TRAINING))
                .active(true).build(),

            AiCoach.builder()
                .displayName("MAYA")
                .gender("FEMALE")
                .avatarUrl("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=400")
                .specialization("Nutrition Education & Healthy Eating")
                .description("MAYA provides evidence-based nutrition education to complement your training. She explains macros, meal timing, and healthy eating patterns — without unrealistic diet claims.")
                .coachingStyle("Informative and realistic — focuses on sustainable habits and education over quick fixes.")
                .experienceDescription("Built on sports nutrition science and evidence-based dietary guidelines. Not a medical dietitian.")
                .tier(CoachTier.PREMIUM)
                .primaryCategory(CoachCategory.NUTRITION_EDUCATION)
                .supportedCategories(Set.of(
                    CoachCategory.NUTRITION_EDUCATION, CoachCategory.WEIGHT_LOSS, CoachCategory.WEIGHT_GAIN))
                .active(true).build(),

            AiCoach.builder()
                .displayName("CORE")
                .gender("MALE")
                .avatarUrl("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400")
                .specialization("Core Training & Posture Correction")
                .description("CORE is dedicated to building a strong foundation — targeting core stability, posture alignment, and functional strength that supports every other activity you do.")
                .coachingStyle("Detail-oriented and methodical — each session builds upon the last with precise cueing.")
                .experienceDescription("Specialized in core biomechanics, posture correction, and functional movement patterns.")
                .tier(CoachTier.PREMIUM)
                .primaryCategory(CoachCategory.CORE_POSTURE)
                .supportedCategories(Set.of(
                    CoachCategory.CORE_POSTURE, CoachCategory.RECOVERY_STRETCHING, CoachCategory.MOBILITY_RECOVERY))
                .active(true).build(),

            AiCoach.builder()
                .displayName("ZEN")
                .gender("FEMALE")
                .avatarUrl("https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400")
                .specialization("Mobility, Flexibility & Movement Quality")
                .description("ZEN bridges the gap between strength training and mindful movement. She designs mobility routines, corrective exercises, and movement quality sessions for athletes and desk workers alike.")
                .coachingStyle("Flowing, purposeful, and holistic — treats the body as an integrated system.")
                .experienceDescription("Trained on functional movement screening, mobility science, and corrective exercise data.")
                .tier(CoachTier.PREMIUM)
                .primaryCategory(CoachCategory.MOBILITY_RECOVERY)
                .supportedCategories(Set.of(
                    CoachCategory.MOBILITY_RECOVERY, CoachCategory.YOGA_FLEXIBILITY, CoachCategory.RECOVERY_STRETCHING))
                .active(true).build()
        );

        int seeded = 0;
        for (AiCoach coach : coaches) {
            if (!aiCoachRepository.existsByDisplayName(coach.getDisplayName())) {
                aiCoachRepository.save(coach);
                seeded++;
            }
        }
        if (seeded > 0) {
            log.info("Seeded {} new AI coaches.", seeded);
        }
    }

    private void seedStaffAndRecruitment() {
        if (!demoSeedEnabled) {
            log.info("Staff & Recruitment demo seeding is disabled.");
            return;
        }

        LocalDate today = LocalDate.now();

        // 1. Seed Demo Staff
        if (staffRepository.count() == 0) {
            List<GymStaff> demoStaffList = List.of(
                GymStaff.builder()
                    .staffId("TRN-001")
                    .fullName("Marcus Vance [Demo Staff]")
                    .email("marcus.vance@fitflowdemo.com")
                    .phone("9819208401")
                    .designation("Senior Head Coach & Trainer")
                    .specialization("Hypertrophy & Strength Training")
                    .experienceYears(8)
                    .qualifications("CSCS, ACE Certified Master Trainer, B.Sc Exercise Science")
                    .employmentType(EmploymentType.FULL_TIME)
                    .joiningDate(today.minusMonths(14))
                    .monthlySalary(4500.0)
                    .employmentStatus(EmploymentStatus.ACTIVE)
                    .shiftSchedule("Morning Shift (06:00 - 14:00)")
                    .profileImageUrl("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500")
                    .bio("Specialist in biomechanics, progressive overload strength cycles, and physique transformation.")
                    .emergencyContact("9819208400")
                    .build(),

                GymStaff.builder()
                    .staffId("TRN-002")
                    .fullName("Elena Rostova [Demo Staff]")
                    .email("elena.rostova@fitflowdemo.com")
                    .phone("9819208402")
                    .designation("Yoga & Functional Mobility Trainer")
                    .specialization("Vinyasa Flow, Mobility, Core Stability")
                    .experienceYears(5)
                    .qualifications("RYT-500 Yoga Alliance Certified, NASM-CPT")
                    .employmentType(EmploymentType.FULL_TIME)
                    .joiningDate(today.minusMonths(8))
                    .monthlySalary(3800.0)
                    .employmentStatus(EmploymentStatus.ACTIVE)
                    .shiftSchedule("Evening Shift (14:00 - 22:00)")
                    .profileImageUrl("https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=500")
                    .bio("Passionate about mind-body connectivity, functional spine health, and athletic flexibility.")
                    .emergencyContact("9819208400")
                    .build(),

                GymStaff.builder()
                    .staffId("TRN-003")
                    .fullName("David Chen [Demo Staff]")
                    .email("david.chen@fitflowdemo.com")
                    .phone("9819208403")
                    .designation("Athletic Performance Coach")
                    .specialization("Sports Conditioning, Speed & Agility, CrossFit")
                    .experienceYears(6)
                    .qualifications("CrossFit Level 2, ISSA Strength Coach, CPR/AED")
                    .employmentType(EmploymentType.CONTRACT)
                    .joiningDate(today.minusMonths(4))
                    .monthlySalary(4200.0)
                    .employmentStatus(EmploymentStatus.ACTIVE)
                    .shiftSchedule("General Shift (08:00 - 17:00)")
                    .profileImageUrl("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500")
                    .bio("Former competitive athlete helping gym members peak their athletic power and conditioning.")
                    .emergencyContact("9819208400")
                    .build(),

                GymStaff.builder()
                    .staffId("STF-004")
                    .fullName("Sarah Jenkins [Demo Staff]")
                    .email("sarah.jenkins@fitflowdemo.com")
                    .phone("9819208404")
                    .designation("Fitness Instructor & Nutrition Lead")
                    .specialization("Weight Loss, Diet Coaching, HIIT")
                    .experienceYears(4)
                    .qualifications("Precision Nutrition Level 1, ACE-CPT")
                    .employmentType(EmploymentType.FULL_TIME)
                    .joiningDate(today.minusDays(20))
                    .monthlySalary(3400.0)
                    .employmentStatus(EmploymentStatus.ACTIVE)
                    .shiftSchedule("Morning Shift (07:00 - 15:00)")
                    .profileImageUrl("https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=500")
                    .bio("Combines metabolic resistance training with sensible, sustainable macronutrient coaching.")
                    .emergencyContact("9819208400")
                    .build()
            );

            staffRepository.saveAll(demoStaffList);
            log.info("Seeded {} demonstration staff members.", demoStaffList.size());
        }

        // 2. Seed Demo Vacancies
        if (vacancyRepository.count() == 0) {
            JobVacancy v1 = JobVacancy.builder()
                .title("Senior Strength & Conditioning Trainer")
                .department("Personal Training & Strength")
                .specialization("Strength Training, Hypertrophy, Periodization")
                .vacanciesCount(3)
                .filledCount(1)
                .jobDescription("FitFlow is seeking an elite Strength and Conditioning Coach to guide our members, manage custom periodization cycles, and conduct one-on-one personal training sessions with premium athletes.")
                .requiredQualifications("CSCS, ACE or NASM certification, CPR/AED, minimum 3 years of coaching experience in strength athletics or gym coaching.")
                .minExperience(3)
                .preferredExperience(5)
                .employmentType(EmploymentType.FULL_TIME)
                .salaryRange("$3,800 - $5,200 / month")
                .isSalaryPublished(true)
                .location("FitFlow Central Gym, Main Branch")
                .openingDate(today.minusDays(12))
                .deadlineDate(today.plusDays(18))
                .expectedJoiningDate(today.plusDays(35))
                .workingDaysShift("Mon - Fri, Morning (06:00 - 14:00)")
                .status(VacancyStatus.OPEN)
                .build();

            JobVacancy v2 = JobVacancy.builder()
                .title("Yoga, Flexibility & Core Specialist")
                .department("Group Fitness & Mindful Movement")
                .specialization("Vinyasa, Yin Yoga, Core Stability, Mobility")
                .vacanciesCount(2)
                .filledCount(0)
                .jobDescription("Lead restorative mobility sessions, daily dynamic yoga classes, and posture correction clinics for our gym community in a state-of-the-art studio.")
                .requiredQualifications("RYT-200 or RYT-500 Yoga Alliance Certification with solid biomechanics understanding.")
                .minExperience(2)
                .preferredExperience(4)
                .employmentType(EmploymentType.PART_TIME)
                .salaryRange("$2,200 - $3,000 / month")
                .isSalaryPublished(true)
                .location("FitFlow West Studio")
                .openingDate(today.minusDays(6))
                .deadlineDate(today.plusDays(24))
                .expectedJoiningDate(today.plusDays(40))
                .workingDaysShift("Mon - Thu, Evening (16:00 - 20:00)")
                .status(VacancyStatus.OPEN)
                .build();

            JobVacancy v3 = JobVacancy.builder()
                .title("Weekend Floor Fitness Instructor")
                .department("Floor Operations")
                .specialization("General Fitness, Machine Guidance, Member Safety")
                .vacanciesCount(2)
                .filledCount(0)
                .jobDescription("Support gym members during peak weekend training hours, demonstrate proper exercise form on machines, and maintain safety standards.")
                .requiredQualifications("Certified Fitness Trainer or Kinesiology background.")
                .minExperience(1)
                .preferredExperience(2)
                .employmentType(EmploymentType.PART_TIME)
                .salaryRange("$1,200 - $1,600 / month")
                .isSalaryPublished(false)
                .location("FitFlow Central Gym")
                .openingDate(today.plusDays(5))
                .deadlineDate(today.plusDays(30))
                .expectedJoiningDate(today.plusDays(45))
                .workingDaysShift("Sat - Sun (08:00 - 18:00)")
                .status(VacancyStatus.SCHEDULED)
                .build();

            List<JobVacancy> savedVacancies = vacancyRepository.saveAll(List.of(v1, v2, v3));
            log.info("Seeded {} demonstration job vacancies.", savedVacancies.size());

            // 3. Seed Demo Applications
            if (applicationRepository.count() == 0) {
                TrainerApplication app1 = TrainerApplication.builder()
                    .referenceNumber("APP-2026-1042")
                    .vacancy(savedVacancies.get(0))
                    .fullName("Vikram Malhotra [Demo Applicant]")
                    .email("vikram.malhotra@testdemo.com")
                    .phone("9876543210")
                    .currentLocation("Bangalore, Karnataka")
                    .desiredPosition("Senior Strength Trainer")
                    .experienceYears(4)
                    .specialization("Powerlifting, Hypertrophy Periodization")
                    .educationalQualifications("B.Sc Sports Science, Bangalore University")
                    .fitnessCertifications("ISSA Certified Personal Trainer, CPR/AED")
                    .previousExperience("Head Trainer at Titan Fitness (2022 - 2024), 100+ member transformations.")
                    .professionalSummary("Driven strength specialist dedicated to injury prevention and barbell periodization.")
                    .availabilityDate(today.plusDays(20))
                    .consentGiven(true)
                    .status(ApplicationStatus.SHORTLISTED)
                    .internalNotes("Strong portfolio and competitive powerlifting background. Top candidate for Interview.")
                    .build();

                TrainerApplication app2 = TrainerApplication.builder()
                    .referenceNumber("APP-2026-2098")
                    .vacancy(savedVacancies.get(0))
                    .fullName("Ananya Sharma [Demo Applicant]")
                    .email("ananya.sharma@testdemo.com")
                    .phone("9845123456")
                    .currentLocation("Bangalore, Karnataka")
                    .desiredPosition("Strength & Conditioning Coach")
                    .experienceYears(5)
                    .specialization("Athletic Conditioning, Olympic Weightlifting")
                    .educationalQualifications("M.Sc Exercise Physiology")
                    .fitnessCertifications("CSCS (NSCA), USAW Level 1")
                    .previousExperience("Lead Strength Coach for university track and field team.")
                    .professionalSummary("Evidence-based conditioning coach with deep focus on VO2 max and velocity-based lifting.")
                    .availabilityDate(today.plusDays(15))
                    .consentGiven(true)
                    .status(ApplicationStatus.INTERVIEW_SCHEDULED)
                    .interviewDate(today.plusDays(3))
                    .interviewTime("11:00 AM")
                    .interviewLocation("FitFlow Central Gym - Conference Room B")
                    .interviewNotes("Focus interview on periodization methodology and client retention strategies.")
                    .internalNotes("Excellent credentials. Interview scheduled.")
                    .build();

                TrainerApplication app3 = TrainerApplication.builder()
                    .referenceNumber("APP-2026-3011")
                    .vacancy(savedVacancies.get(1))
                    .fullName("Rohan Kapoor [Demo Applicant]")
                    .email("rohan.kapoor@testdemo.com")
                    .phone("9731234567")
                    .currentLocation("Bangalore, Karnataka")
                    .desiredPosition("Yoga & Flexibility Instructor")
                    .experienceYears(3)
                    .specialization("Vinyasa Flow, Spine Rehabilitation")
                    .educationalQualifications("Diploma in Yogic Sciences")
                    .fitnessCertifications("RYT-500 Yoga Alliance")
                    .previousExperience("Instructor at Nirvana Wellness Studio.")
                    .professionalSummary("Passionate about functional mobility and breathwork for high-stress professionals.")
                    .availabilityDate(today.plusDays(10))
                    .consentGiven(true)
                    .status(ApplicationStatus.SUBMITTED)
                    .internalNotes("New application received. Initial review pending.")
                    .build();

                List<TrainerApplication> savedApps = applicationRepository.saveAll(List.of(app1, app2, app3));

                // Add status histories
                for (TrainerApplication a : savedApps) {
                    ApplicationStatusHistory h = ApplicationStatusHistory.builder()
                        .application(a)
                        .fromStatus(null)
                        .toStatus(a.getStatus())
                        .changedBy("System Seeder")
                        .reasonOrNotes("Initial record created.")
                        .build();
                    statusHistoryRepository.save(h);
                }

                log.info("Seeded {} demonstration applications.", savedApps.size());
            }
        }

        // 4. Seed Demo Staff Schedules
        if (scheduleRepository.count() == 0 && staffRepository.count() > 0) {
            List<GymStaff> staffList = staffRepository.findAll();
            GymStaff s1 = staffList.get(0);
            GymStaff s2 = staffList.size() > 1 ? staffList.get(1) : s1;

            List<StaffSchedule> schedules = List.of(
                StaffSchedule.builder().staff(s1).shiftName("Morning Shift").dayOfWeek("MONDAY").startTime("06:00").endTime("14:00").isRecurring(true).isRestDay(false).notes("Gym floor supervision & PT").build(),
                StaffSchedule.builder().staff(s1).shiftName("Morning Shift").dayOfWeek("TUESDAY").startTime("06:00").endTime("14:00").isRecurring(true).isRestDay(false).notes("Gym floor supervision & PT").build(),
                StaffSchedule.builder().staff(s1).shiftName("Morning Shift").dayOfWeek("WEDNESDAY").startTime("06:00").endTime("14:00").isRecurring(true).isRestDay(false).notes("Gym floor supervision & PT").build(),
                StaffSchedule.builder().staff(s1).shiftName("Morning Shift").dayOfWeek("THURSDAY").startTime("06:00").endTime("14:00").isRecurring(true).isRestDay(false).notes("Gym floor supervision & PT").build(),
                StaffSchedule.builder().staff(s1).shiftName("Morning Shift").dayOfWeek("FRIDAY").startTime("06:00").endTime("14:00").isRecurring(true).isRestDay(false).notes("Gym floor supervision & PT").build(),
                StaffSchedule.builder().staff(s1).shiftName("Rest Day").dayOfWeek("SATURDAY").startTime("00:00").endTime("00:00").isRecurring(true).isRestDay(true).notes("Scheduled Rest").build(),
                StaffSchedule.builder().staff(s1).shiftName("Rest Day").dayOfWeek("SUNDAY").startTime("00:00").endTime("00:00").isRecurring(true).isRestDay(true).notes("Scheduled Rest").build(),

                StaffSchedule.builder().staff(s2).shiftName("Evening Shift").dayOfWeek("MONDAY").startTime("14:00").endTime("22:00").isRecurring(true).isRestDay(false).notes("Yoga classes & recovery floor").build(),
                StaffSchedule.builder().staff(s2).shiftName("Evening Shift").dayOfWeek("TUESDAY").startTime("14:00").endTime("22:00").isRecurring(true).isRestDay(false).notes("Yoga classes & recovery floor").build(),
                StaffSchedule.builder().staff(s2).shiftName("Evening Shift").dayOfWeek("WEDNESDAY").startTime("14:00").endTime("22:00").isRecurring(true).isRestDay(false).notes("Yoga classes & recovery floor").build(),
                StaffSchedule.builder().staff(s2).shiftName("Evening Shift").dayOfWeek("THURSDAY").startTime("14:00").endTime("22:00").isRecurring(true).isRestDay(false).notes("Yoga classes & recovery floor").build(),
                StaffSchedule.builder().staff(s2).shiftName("Evening Shift").dayOfWeek("FRIDAY").startTime("14:00").endTime("22:00").isRecurring(true).isRestDay(false).notes("Yoga classes & recovery floor").build()
            );

            scheduleRepository.saveAll(schedules);
            log.info("Seeded {} demonstration staff shift schedules.", schedules.size());
        }
    }
}
