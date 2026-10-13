package com.fitflow.controller;

import com.fitflow.entity.Exercise;
import com.fitflow.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @GetMapping("/home-alternative")
    public ResponseEntity<List<Exercise>> getHomeAlternative() {
        return ResponseEntity.ok(workoutService.getHomeAlternativeWorkout());
    }
}
