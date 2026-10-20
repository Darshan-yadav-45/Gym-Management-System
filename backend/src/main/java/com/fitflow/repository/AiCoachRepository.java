package com.fitflow.repository;

import com.fitflow.entity.AiCoach;
import com.fitflow.entity.enums.CoachCategory;
import com.fitflow.entity.enums.CoachTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiCoachRepository extends JpaRepository<AiCoach, Long> {

    List<AiCoach> findByActiveTrue();

    List<AiCoach> findByTierAndActiveTrue(CoachTier tier);

    List<AiCoach> findByPrimaryCategoryAndActiveTrue(CoachCategory category);

    @Query("SELECT c FROM AiCoach c WHERE c.active = true " +
           "AND (:tier IS NULL OR c.tier = :tier) " +
           "AND (:category IS NULL OR c.primaryCategory = :category OR :category MEMBER OF c.supportedCategories) " +
           "AND (:gender IS NULL OR LOWER(c.gender) = LOWER(:gender))")
    List<AiCoach> findFiltered(
            @Param("tier") CoachTier tier,
            @Param("category") CoachCategory category,
            @Param("gender") String gender
    );

    boolean existsByDisplayName(String displayName);
}
