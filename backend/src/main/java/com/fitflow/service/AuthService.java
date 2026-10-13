package com.fitflow.service;

import com.fitflow.dto.AuthResponse;
import com.fitflow.dto.LoginRequest;
import com.fitflow.dto.RegisterRequest;
import com.fitflow.dto.UserResponse;
import com.fitflow.entity.User;
import com.fitflow.entity.enums.Role;
import com.fitflow.repository.UserRepository;
import com.fitflow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final com.fitflow.repository.FitnessProfileRepository fitnessProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new RuntimeException("Email already exist");
        }

        var user = User.builder()
                .name(request.getName().trim())
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() != null && !request.getPhone().isBlank() ? request.getPhone().trim() : null)
                .role(Role.MEMBER)
                .enabled(true)
                .build();
        
        user = userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .success(true)
                .message("Account created successfully")
                .userId(user.getId())
                .nextStep("/profile-setup")
                .token(jwtToken)
                .user(mapToUserResponse(user))
                .profileCompleted(false)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        var userOptional = userRepository.findByEmail(cleanEmail);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid mail ID");
        }
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            cleanEmail,
                            request.getPassword()
                    )
            );
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new RuntimeException("Wrong password");
        }
        
        var user = userOptional.get();
                
        var jwtToken = jwtService.generateToken(user);
        
        boolean profileCompleted = user.getFitnessProfile() != null || 
                fitnessProfileRepository.findByUserId(user.getId()).isPresent();
        
        return AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .token(jwtToken)
                .userId(user.getId())
                .user(mapToUserResponse(user))
                .profileCompleted(profileCompleted)
                .build();
    }
    
    public UserResponse getMe(String email) {
        var user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    public UserResponse mapToUserResponse(User user) {
        var response = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
                
        if (user.getSports() != null && !user.getSports().isEmpty()) {
            response.setSports(user.getSports().stream().map(Enum::name).toList());
        }
        
        var profile = user.getFitnessProfile();
        if (profile == null) {
            profile = fitnessProfileRepository.findByUserId(user.getId()).orElse(null);
        }
        if (profile != null) {
            response.setAge(profile.getAge());
            if (profile.getGender() != null) {
                response.setGender(profile.getGender().name());
            }
            response.setHeightCm(profile.getHeightCm());
            response.setWeightKg(profile.getWeightKg());
            response.setBmi(profile.getBmi());
            response.setLocation(profile.getLocation());
            response.setDesignation(profile.getDesignation());
        }
        return response;
    }
}
