package com.fitflow.repository;

import com.fitflow.entity.TrainerApplication;
import com.fitflow.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainerApplicationRepository extends JpaRepository<TrainerApplication, Long> {

    Optional<TrainerApplication> findByReferenceNumber(String referenceNumber);

    boolean existsByVacancyIdAndEmailIgnoreCase(Long vacancyId, String email);

    long countByStatus(ApplicationStatus status);

    long countByVacancyId(Long vacancyId);

    List<TrainerApplication> findByVacancyId(Long vacancyId);

    @Query("SELECT a FROM TrainerApplication a WHERE " +
           "(:vacancyId IS NULL OR a.vacancy.id = :vacancyId) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(a.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(a.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(a.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(a.referenceNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(a.desiredPosition) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(a.specialization) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<TrainerApplication> searchApplications(@Param("vacancyId") Long vacancyId,
                                                @Param("status") ApplicationStatus status,
                                                @Param("query") String query,
                                                Pageable pageable);
}
