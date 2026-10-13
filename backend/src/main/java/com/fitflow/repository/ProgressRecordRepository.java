package com.fitflow.repository;

import com.fitflow.entity.ProgressRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressRecordRepository extends JpaRepository<ProgressRecord, Long> {
    List<ProgressRecord> findByUserIdOrderByRecordedAtDesc(Long userId);
}
