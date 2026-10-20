package com.fitflow.repository;

import com.fitflow.entity.JobVacancy;
import com.fitflow.entity.enums.VacancyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobVacancyRepository extends JpaRepository<JobVacancy, Long> {

    List<JobVacancy> findByStatus(VacancyStatus status);

    long countByStatus(VacancyStatus status);

    @Query("SELECT v FROM JobVacancy v WHERE v.status = 'OPEN' AND " +
           "(v.openingDate IS NULL OR v.openingDate <= :today) AND " +
           "(v.deadlineDate IS NULL OR v.deadlineDate >= :today) AND " +
           "(v.vacanciesCount > v.filledCount) ORDER BY v.createdAt DESC")
    List<JobVacancy> findPublicOpenVacancies(@Param("today") LocalDate today);

    @Query("SELECT v FROM JobVacancy v WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(v.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(v.department) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(v.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(v.location) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR v.status = :status)")
    Page<JobVacancy> searchVacancies(@Param("query") String query,
                                     @Param("status") VacancyStatus status,
                                     Pageable pageable);

    @Query("SELECT COUNT(v) FROM JobVacancy v WHERE v.status = 'OPEN' AND v.deadlineDate BETWEEN :today AND :soon")
    long countApproachingDeadline(@Param("today") LocalDate today, @Param("soon") LocalDate soon);

    @Query("SELECT SUM(v.vacanciesCount - v.filledCount) FROM JobVacancy v WHERE v.status = 'OPEN'")
    Long countTotalPositionsAvailable();
}
