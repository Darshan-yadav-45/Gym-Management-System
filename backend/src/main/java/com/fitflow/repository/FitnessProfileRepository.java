package com.fitflow.repository;

import com.fitflow.entity.FitnessProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FitnessProfileRepository extends JpaRepository<FitnessProfile, Long> {
    Optional<FitnessProfile> findByUserId(Long userId);
}
