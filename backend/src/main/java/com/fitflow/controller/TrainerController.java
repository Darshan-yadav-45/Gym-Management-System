package com.fitflow.controller;

import com.fitflow.dto.TrainerDto;
import com.fitflow.entity.Trainer;
import com.fitflow.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerRepository trainerRepository;

    @GetMapping
    public ResponseEntity<List<TrainerDto>> getAllTrainers() {
        List<TrainerDto> trainers = trainerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(trainers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainerDto> getTrainerById(@PathVariable Long id) {
        return trainerRepository.findById(id)
                .map(trainer -> ResponseEntity.ok(mapToDto(trainer)))
                .orElse(ResponseEntity.notFound().build());
    }

    private TrainerDto mapToDto(Trainer trainer) {
        List<String> tags = trainer.getSpecialization() != null 
            ? Arrays.asList(trainer.getSpecialization().split(","))
            : List.of();
            
        return TrainerDto.builder()
                .id(trainer.getId())
                .name(trainer.getUser().getName())
                .specialization(trainer.getSpecialization())
                .experienceYears(trainer.getExperienceYears())
                .bio(trainer.getBio())
                .profileImageUrl(trainer.getProfileImageUrl())
                .availability(trainer.getAvailability())
                .tags(tags)
                .build();
    }
}
