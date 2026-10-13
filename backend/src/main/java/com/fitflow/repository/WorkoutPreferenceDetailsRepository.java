package com.fitflow.repository;

import com.fitflow.entity.WorkoutPreferenceDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkoutPreferenceDetailsRepository extends JpaRepository<WorkoutPreferenceDetails, Long> {
    Optional<WorkoutPreferenceDetails> findByFitnessProfileId(Long profileId);
}
