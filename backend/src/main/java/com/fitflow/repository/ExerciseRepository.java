package com.fitflow.repository;

import com.fitflow.entity.Exercise;
import com.fitflow.entity.enums.EquipmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByEquipment(EquipmentType equipment);
    Optional<Exercise> findByNameIgnoreCase(String name);
}
