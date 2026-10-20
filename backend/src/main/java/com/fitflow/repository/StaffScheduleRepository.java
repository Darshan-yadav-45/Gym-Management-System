package com.fitflow.repository;

import com.fitflow.entity.StaffSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffScheduleRepository extends JpaRepository<StaffSchedule, Long> {

    List<StaffSchedule> findByStaffId(Long staffId);

    @Query("SELECT s FROM StaffSchedule s JOIN FETCH s.staff ORDER BY s.dayOfWeek, s.startTime")
    List<StaffSchedule> findAllWithStaff();

    @Query("SELECT s FROM StaffSchedule s WHERE s.staff.id = :staffId AND " +
           "(s.dayOfWeek = :dayOfWeek OR s.specificDate = :date)")
    List<StaffSchedule> findPotentialConflicts(@Param("staffId") Long staffId,
                                               @Param("dayOfWeek") String dayOfWeek,
                                               @Param("date") LocalDate date);
}
