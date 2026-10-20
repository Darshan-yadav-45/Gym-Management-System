package com.fitflow.repository;

import com.fitflow.entity.UserCoachPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCoachPreferenceRepository extends JpaRepository<UserCoachPreference, Long> {

    Optional<UserCoachPreference> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
