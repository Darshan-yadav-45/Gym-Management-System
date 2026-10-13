package com.fitflow.repository;

import com.fitflow.entity.DailyMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyMetricRepository extends JpaRepository<DailyMetric, Long> {
    Optional<DailyMetric> findByUserIdAndRecordDate(Long userId, LocalDate recordDate);
    List<DailyMetric> findByUserIdOrderByRecordDateDesc(Long userId);
}
