package com.fitflow.service;

import com.fitflow.dto.ProfileRequest;
import com.fitflow.dto.UserResponse;
import com.fitflow.entity.FitnessProfile;
import com.fitflow.entity.User;
import com.fitflow.entity.enums.Gender;
import com.fitflow.entity.enums.Sport;
import com.fitflow.repository.FitnessProfileRepository;
import com.fitflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final FitnessProfileRepository fitnessProfileRepository;
    private final AuthService authService; // for mapping response

    @Transactional
    public UserResponse saveProfile(String email, ProfileRequest request) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        FitnessProfile profile = user.getFitnessProfile();
        if (profile == null) {
            profile = fitnessProfileRepository.findByUserId(user.getId()).orElse(null);
        }
        if (profile == null) {
            profile = new FitnessProfile();
            profile.setUser(user);
        }

        updateProfileFields(profile, user, request);

        profile = fitnessProfileRepository.save(profile);
        user.setFitnessProfile(profile);
        userRepository.save(user);

        return authService.getMe(email);
    }

    @Transactional
    public UserResponse updateProfile(String email, ProfileRequest request) {
        return saveProfile(email, request);
    }

    private void updateProfileFields(FitnessProfile profile, User user, ProfileRequest request) {
        if (request.getAge() != null) profile.setAge(request.getAge());
        if (request.getGender() != null && !request.getGender().isBlank()) {
            String g = request.getGender().trim().toUpperCase().replace(" ", "_");
            if (g.contains("FEMALE")) {
                profile.setGender(Gender.FEMALE);
            } else if (g.contains("MALE")) {
                profile.setGender(Gender.MALE);
            } else {
                profile.setGender(Gender.OTHER);
            }
        }
        if (request.getHeightCm() != null) profile.setHeightCm(request.getHeightCm());
        if (request.getWeightKg() != null) profile.setWeightKg(request.getWeightKg());

        if (profile.getHeightCm() != null && profile.getWeightKg() != null && profile.getHeightCm() > 0) {
            double hMeters = profile.getHeightCm() / 100.0;
            double bmi = Math.round((profile.getWeightKg() / (hMeters * hMeters)) * 10.0) / 10.0;
            profile.setBmi(bmi);
        }

        if (request.getLocation() != null) profile.setLocation(request.getLocation().trim());
        if (request.getDesignation() != null && !request.getDesignation().isBlank()) {
            profile.setDesignation(request.getDesignation().trim());
            String d = request.getDesignation().trim().toUpperCase();
            if (d.contains("STUDENT")) {
                profile.setOccupation(com.fitflow.entity.enums.Occupation.STUDENT);
            } else if (d.contains("BUSINESS")) {
                profile.setOccupation(com.fitflow.entity.enums.Occupation.BUSINESS_OWNER);
            } else if (d.contains("ATHLETE")) {
                profile.setOccupation(com.fitflow.entity.enums.Occupation.ATHLETE);
            } else if (d.contains("HOMEMAKER")) {
                profile.setOccupation(com.fitflow.entity.enums.Occupation.HOMEMAKER);
            } else if (d.contains("DEVELOPER") || d.contains("EMPLOYEE") || d.contains("TEACHER") || d.contains("OFFICE")) {
                profile.setOccupation(com.fitflow.entity.enums.Occupation.OFFICE_WORKER);
            } else {
                profile.setOccupation(com.fitflow.entity.enums.Occupation.OTHER);
            }
        }

        if (request.getSports() != null) {
            Set<Sport> sportSet = request.getSports().stream()
                    .filter(s -> s != null && !s.trim().isBlank() && !s.trim().equalsIgnoreCase("NONE"))
                    .map(s -> {
                        String clean = s.trim().toUpperCase().replace(" ", "_");
                        try {
                            return Sport.valueOf(clean);
                        } catch (IllegalArgumentException e) {
                            return Sport.OTHER;
                        }
                    })
                    .collect(Collectors.toSet());
            user.setSports(sportSet);
        }
        
        // Update user fields if provided
        if (request.getName() != null && !request.getName().trim().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isBlank()) {
            user.setPhone(request.getPhone().trim());
        }
    }
}
