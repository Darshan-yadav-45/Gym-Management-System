package com.fitflow.repository;

import com.fitflow.entity.GymStaff;
import com.fitflow.entity.enums.EmploymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GymStaffRepository extends JpaRepository<GymStaff, Long> {

    Optional<GymStaff> findByStaffId(String staffId);

    Optional<GymStaff> findByEmailIgnoreCase(String email);

    boolean existsByStaffId(String staffId);

    boolean existsByEmailIgnoreCase(String email);

    long countByEmploymentStatus(EmploymentStatus status);

    @Query("SELECT COUNT(s) FROM GymStaff s WHERE LOWER(s.designation) LIKE '%trainer%'")
    long countTrainers();

    @Query("SELECT COUNT(s) FROM GymStaff s WHERE LOWER(s.designation) LIKE '%trainer%' AND s.employmentStatus = :status")
    long countTrainersByStatus(@Param("status") EmploymentStatus status);

    @Query("SELECT COUNT(s) FROM GymStaff s WHERE s.joiningDate >= :since")
    long countHiredSince(@Param("since") LocalDate since);

    @Query("SELECT s FROM GymStaff s WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.staffId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(s.designation) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR s.employmentStatus = :status)")
    Page<GymStaff> searchStaff(@Param("query") String query,
                               @Param("status") EmploymentStatus status,
                               Pageable pageable);

    List<GymStaff> findByEmploymentStatus(EmploymentStatus status);
}
