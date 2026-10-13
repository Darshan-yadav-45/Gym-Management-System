package com.fitflow.controller;

import com.fitflow.dto.AppointmentRequest;
import com.fitflow.entity.Appointment;
import com.fitflow.entity.Trainer;
import com.fitflow.entity.User;
import com.fitflow.entity.enums.AppointmentStatus;
import com.fitflow.repository.AppointmentRepository;
import com.fitflow.repository.TrainerRepository;
import com.fitflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;

    @PostMapping
    public ResponseEntity<?> createAppointment(Authentication authentication, @RequestBody AppointmentRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User member = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        Appointment appointment = Appointment.builder()
                .member(member)
                .trainer(trainer)
                .appointmentDate(request.getAppointmentDate())
                .startTime(request.getStartTime())
                .trainingType(request.getTrainingType())
                .sessionType(request.getSessionType())
                .notes(request.getNotes())
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAppointment);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User member = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Appointment> appointments = appointmentRepository.findByMemberId(member.getId());
        return ResponseEntity.ok(appointments);
    }
}
