package com.fitflow.repository;

import com.fitflow.entity.WaterLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WaterLogRepository extends JpaRepository<WaterLog, Long> {
    List<WaterLog> findByUserIdAndLoggedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
