package com.fitflow.service;

import com.fitflow.dto.OnboardingRequest;
import com.fitflow.dto.OnboardingResponse;
import com.fitflow.entity.FitnessProfile;
import com.fitflow.entity.User;
import com.fitflow.entity.WorkoutPlan;
import com.fitflow.entity.WorkoutPreferenceDetails;
import com.fitflow.repository.FitnessProfileRepository;
import com.fitflow.repository.UserRepository;
import com.fitflow.repository.WorkoutPreferenceDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class OnboardingService {

    private final UserRepository userRepository;
    private final FitnessProfileRepository fitnessProfileRepository;
    private final WorkoutPreferenceDetailsRepository preferenceDetailsRepository;
    private final FitnessCalculationService calculationService;
    private final WorkoutRecommendationService recommendationService;

    @Transactional
    public OnboardingResponse processOnboarding(String email, OnboardingRequest request) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double bmi = calculationService.calculateBmi(request.getWeightKg(), request.getHeightCm());

        FitnessProfile profile = user.getFitnessProfile();
        if (profile == null) {
            profile = fitnessProfileRepository.findByUserId(user.getId()).orElse(null);
        }
        if (profile == null) {
            profile = new FitnessProfile();
            profile.setUser(user);
        }

        profile.setAge(request.getAge());
        if (request.getGender() != null) {
            profile.setGender(request.getGender());
        }
        profile.setHeightCm(request.getHeightCm());
        profile.setWeightKg(request.getWeightKg());
        profile.setBmi(bmi);
        if (request.getOccupation() != null) {
            profile.setOccupation(request.getOccupation());
        }
        profile.setActivityLevel(request.getActivityLevel());
        profile.setEnvironment(request.getEnvironment());
        profile.setFitnessGoal(request.getFitnessGoal());
        profile.setExperienceLevel(request.getExperienceLevel());
        profile.setWorkoutPreference(request.getWorkoutPreference());
        profile.setPreferredWorkoutTime(request.getPreferredWorkoutTime());
        profile.setDietPreference(request.getDietPreference());
        if (request.getTargetMuscles() != null) {
            profile.setTargetMuscles(new HashSet<>(request.getTargetMuscles()));
        }
                
        profile = fitnessProfileRepository.save(profile);
        user.setFitnessProfile(profile);

        WorkoutPreferenceDetails prefs = profile.getWorkoutPreferenceDetails();
        if (prefs == null) {
            prefs = preferenceDetailsRepository.findByFitnessProfileId(profile.getId()).orElse(null);
        }
        if (prefs == null) {
            prefs = new WorkoutPreferenceDetails();
            prefs.setFitnessProfile(profile);
        }
        prefs.setWorkoutsPerWeek(request.getWorkoutsPerWeek());
        prefs.setPreferredTime(request.getPreferredWorkoutTime());
        prefs.setEquipmentType(request.getEquipmentType());
        prefs.setWorkoutLocation(request.getWorkoutPreference());
        if (prefs.getDurationMinutes() == null) {
            prefs.setDurationMinutes(45);
        }
                
        prefs = preferenceDetailsRepository.save(prefs);
        profile.setWorkoutPreferenceDetails(prefs);

        WorkoutPlan plan = recommendationService.generateInitialWorkoutPlan(user, profile, prefs, request);

        return OnboardingResponse.builder()
                .success(true)
                .message("Fitness profile created successfully")
                .userId(user.getId())
                .profileId(profile.getId())
                .bmi(bmi)
                .workoutPlanId(plan.getId())
                .nextRoute("/dashboard")
                .build();
    }
}
