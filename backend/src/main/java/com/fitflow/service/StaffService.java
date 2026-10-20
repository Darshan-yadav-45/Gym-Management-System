package com.fitflow.service;

import com.fitflow.dto.*;
import com.fitflow.entity.GymStaff;
import com.fitflow.entity.StaffSchedule;
import com.fitflow.entity.User;
import com.fitflow.entity.enums.EmploymentStatus;
import com.fitflow.entity.enums.EmploymentType;
import com.fitflow.entity.enums.Role;
import com.fitflow.repository.GymStaffRepository;
import com.fitflow.repository.StaffScheduleRepository;
import com.fitflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffService {

    private final GymStaffRepository staffRepository;
    private final StaffScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Staff Directory ──────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<GymStaffDto> searchStaff(String query, String statusStr, int page, int size, boolean includeSalary) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        EmploymentStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = EmploymentStatus.valueOf(statusStr.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Page<GymStaff> staffPage = staffRepository.searchStaff(query, status, pageable);
        return staffPage.map(s -> toDto(s, includeSalary));
    }

    @Transactional(readOnly = true)
    public GymStaffDto getStaffById(Long id, boolean includeSalary) {
        GymStaff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff member not found with ID: " + id));
        return toDto(staff, includeSalary);
    }

    @Transactional
    public GymStaffDto createStaff(GymStaffRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (staffRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("A staff member with email " + email + " already exists.");
        }

        String staffId = request.getStaffId();
        if (staffId == null || staffId.isBlank()) {
            long count = staffRepository.count() + 1;
            boolean isTrainer = request.getDesignation() != null &&
                    request.getDesignation().toLowerCase().contains("trainer");
            staffId = String.format("%s-%03d", isTrainer ? "TRN" : "STF", count);
        } else {
            staffId = staffId.trim().toUpperCase();
            if (staffRepository.existsByStaffId(staffId)) {
                throw new RuntimeException("Staff ID " + staffId + " is already assigned.");
            }
        }

        LocalDate joining = (request.getJoiningDate() != null && !request.getJoiningDate().isBlank())
                ? LocalDate.parse(request.getJoiningDate())
                : LocalDate.now();

        EmploymentType empType = EmploymentType.FULL_TIME;
        if (request.getEmploymentType() != null) {
            try {
                empType = EmploymentType.valueOf(request.getEmploymentType().toUpperCase());
            } catch (Exception ignored) {}
        }

        EmploymentStatus empStatus = EmploymentStatus.ACTIVE;
        if (request.getEmploymentStatus() != null) {
            try {
                empStatus = EmploymentStatus.valueOf(request.getEmploymentStatus().toUpperCase());
            } catch (Exception ignored) {}
        }

        // Check or create associated User account for login (role TRAINER)
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null && request.getDesignation() != null &&
                request.getDesignation().toLowerCase().contains("trainer")) {
            user = User.builder()
                    .name(request.getFullName())
                    .email(email)
                    .phone(request.getPhone())
                    .password(passwordEncoder.encode("trainer123"))
                    .role(Role.TRAINER)
                    .enabled(empStatus == EmploymentStatus.ACTIVE)
                    .build();
            user = userRepository.save(user);
        }

        GymStaff staff = GymStaff.builder()
                .staffId(staffId)
                .user(user)
                .fullName(request.getFullName().trim())
                .email(email)
                .phone(request.getPhone())
                .designation(request.getDesignation().trim())
                .specialization(request.getSpecialization())
                .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 1)
                .qualifications(request.getQualifications())
                .employmentType(empType)
                .joiningDate(joining)
                .resignationDate(request.getResignationDate() != null && !request.getResignationDate().isBlank() ? LocalDate.parse(request.getResignationDate()) : null)
                .monthlySalary(request.getMonthlySalary())
                .employmentStatus(empStatus)
                .shiftSchedule(request.getShiftSchedule() != null ? request.getShiftSchedule() : "General Shift (08:00 - 17:00)")
                .profileImageUrl(request.getProfileImageUrl())
                .bio(request.getBio())
                .emergencyContact(request.getEmergencyContact())
                .applicationId(request.getApplicationId())
                .build();

        staff = staffRepository.save(staff);
        log.info("Created new staff member: {} ({}) with Staff ID: {}", staff.getFullName(), staff.getEmail(), staff.getStaffId());
        return toDto(staff, true);
    }

    @Transactional
    public GymStaffDto updateStaff(Long id, GymStaffRequest request) {
        GymStaff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff member not found with ID: " + id));

        String newEmail = request.getEmail().trim().toLowerCase();
        if (!staff.getEmail().equalsIgnoreCase(newEmail) && staffRepository.existsByEmailIgnoreCase(newEmail)) {
            throw new RuntimeException("Another staff member with email " + newEmail + " already exists.");
        }

        staff.setFullName(request.getFullName().trim());
        staff.setEmail(newEmail);
        staff.setPhone(request.getPhone());
        staff.setDesignation(request.getDesignation().trim());
        staff.setSpecialization(request.getSpecialization());
        if (request.getExperienceYears() != null) staff.setExperienceYears(request.getExperienceYears());
        staff.setQualifications(request.getQualifications());

        if (request.getEmploymentType() != null) {
            try {
                staff.setEmploymentType(EmploymentType.valueOf(request.getEmploymentType().toUpperCase()));
            } catch (Exception ignored) {}
        }

        if (request.getJoiningDate() != null && !request.getJoiningDate().isBlank()) {
            staff.setJoiningDate(LocalDate.parse(request.getJoiningDate()));
        }

        if (request.getResignationDate() != null && !request.getResignationDate().isBlank()) {
            staff.setResignationDate(LocalDate.parse(request.getResignationDate()));
        } else if (request.getResignationDate() != null && request.getResignationDate().isBlank()) {
            staff.setResignationDate(null);
        }

        if (request.getMonthlySalary() != null) {
            staff.setMonthlySalary(request.getMonthlySalary());
        }

        if (request.getEmploymentStatus() != null) {
            try {
                staff.setEmploymentStatus(EmploymentStatus.valueOf(request.getEmploymentStatus().toUpperCase()));
            } catch (Exception ignored) {}
        }

        if (request.getShiftSchedule() != null) staff.setShiftSchedule(request.getShiftSchedule());
        if (request.getProfileImageUrl() != null) staff.setProfileImageUrl(request.getProfileImageUrl());
        if (request.getBio() != null) staff.setBio(request.getBio());
        if (request.getEmergencyContact() != null) staff.setEmergencyContact(request.getEmergencyContact());

        staff = staffRepository.save(staff);
        return toDto(staff, true);
    }

    @Transactional
    public GymStaffDto updateStaffStatus(Long id, String statusStr, LocalDate resignationDate) {
        GymStaff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff member not found with ID: " + id));

        EmploymentStatus newStatus = EmploymentStatus.valueOf(statusStr.trim().toUpperCase());
        staff.setEmploymentStatus(newStatus);
        if (newStatus == EmploymentStatus.RESIGNED && resignationDate != null) {
            staff.setResignationDate(resignationDate);
        } else if (newStatus == EmploymentStatus.ACTIVE) {
            staff.setResignationDate(null);
        }

        // Sync with User enabled status if linked
        if (staff.getUser() != null) {
            staff.getUser().setEnabled(newStatus == EmploymentStatus.ACTIVE);
            userRepository.save(staff.getUser());
        }

        staff = staffRepository.save(staff);
        return toDto(staff, true);
    }

    @Transactional
    public void deleteStaff(Long id) {
        GymStaff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff member not found with ID: " + id));
        staffRepository.delete(staff);
        log.info("Deleted staff member ID: {}", id);
    }

    @Transactional(readOnly = true)
    public StaffSummaryMetrics getStaffSummaryMetrics() {
        long totalStaff = staffRepository.count();
        long activeStaff = staffRepository.countByEmploymentStatus(EmploymentStatus.ACTIVE);
        long inactiveStaff = totalStaff - activeStaff;
        long totalTrainers = staffRepository.countTrainers();

        LocalDate firstOfMonth = LocalDate.now().withDayOfMonth(1);
        long hiredThisMonth = staffRepository.countHiredSince(firstOfMonth);

        // Approximate trainers currently available (active trainers)
        long availableNow = staffRepository.countTrainersByStatus(EmploymentStatus.ACTIVE);

        return StaffSummaryMetrics.builder()
                .totalTrainers(totalTrainers)
                .activeTrainers(staffRepository.countTrainersByStatus(EmploymentStatus.ACTIVE))
                .inactiveTrainers(totalTrainers - staffRepository.countTrainersByStatus(EmploymentStatus.ACTIVE))
                .totalTrainingStaff(totalStaff)
                .trainersAvailableNow(availableNow)
                .trainersHiredThisMonth(hiredThisMonth)
                .build();
    }

    // ── Staff Scheduling ─────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<StaffScheduleDto> getAllSchedules() {
        return scheduleRepository.findAllWithStaff().stream()
                .map(this::toScheduleDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StaffScheduleDto> getSchedulesByStaffId(Long staffId) {
        return scheduleRepository.findByStaffId(staffId).stream()
                .map(this::toScheduleDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StaffScheduleDto createSchedule(StaffScheduleRequest request) {
        GymStaff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + request.getStaffId()));

        LocalDate specDate = (request.getSpecificDate() != null && !request.getSpecificDate().isBlank())
                ? LocalDate.parse(request.getSpecificDate()) : null;

        // Check for time overlap conflict
        List<StaffSchedule> conflicts = scheduleRepository.findPotentialConflicts(
                staff.getId(), request.getDayOfWeek(), specDate);

        for (StaffSchedule existing : conflicts) {
            if (isOverlapping(existing.getStartTime(), existing.getEndTime(), request.getStartTime(), request.getEndTime())) {
                throw new RuntimeException(String.format("Shift conflict: %s already has assigned shift '%s' (%s - %s) on %s",
                        staff.getFullName(), existing.getShiftName(), existing.getStartTime(), existing.getEndTime(),
                        request.getDayOfWeek() != null ? request.getDayOfWeek() : specDate));
            }
        }

        StaffSchedule schedule = StaffSchedule.builder()
                .staff(staff)
                .shiftName(request.getShiftName())
                .dayOfWeek(request.getDayOfWeek())
                .specificDate(specDate)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .isRecurring(request.getIsRecurring() != null ? request.getIsRecurring() : true)
                .isRestDay(request.getIsRestDay() != null ? request.getIsRestDay() : false)
                .notes(request.getNotes())
                .build();

        schedule = scheduleRepository.save(schedule);
        return toScheduleDto(schedule);
    }

    @Transactional
    public StaffScheduleDto updateSchedule(Long id, StaffScheduleRequest request) {
        StaffSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + id));

        if (request.getShiftName() != null) schedule.setShiftName(request.getShiftName());
        if (request.getDayOfWeek() != null) schedule.setDayOfWeek(request.getDayOfWeek());
        if (request.getSpecificDate() != null && !request.getSpecificDate().isBlank()) {
            schedule.setSpecificDate(LocalDate.parse(request.getSpecificDate()));
        }
        if (request.getStartTime() != null) schedule.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) schedule.setEndTime(request.getEndTime());
        if (request.getIsRecurring() != null) schedule.setIsRecurring(request.getIsRecurring());
        if (request.getIsRestDay() != null) schedule.setIsRestDay(request.getIsRestDay());
        if (request.getNotes() != null) schedule.setNotes(request.getNotes());

        schedule = scheduleRepository.save(schedule);
        return toScheduleDto(schedule);
    }

    @Transactional
    public void deleteSchedule(Long id) {
        StaffSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + id));
        scheduleRepository.delete(schedule);
    }

    // ── Helper Mappers ───────────────────────────────────────────────────────

    public GymStaffDto toDto(GymStaff s, boolean includeSalary) {
        return GymStaffDto.builder()
                .id(s.getId())
                .staffId(s.getStaffId())
                .userId(s.getUser() != null ? s.getUser().getId() : null)
                .fullName(s.getFullName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .designation(s.getDesignation())
                .specialization(s.getSpecialization())
                .experienceYears(s.getExperienceYears())
                .qualifications(s.getQualifications())
                .employmentType(s.getEmploymentType() != null ? s.getEmploymentType().name() : "FULL_TIME")
                .joiningDate(s.getJoiningDate() != null ? s.getJoiningDate().toString() : null)
                .resignationDate(s.getResignationDate() != null ? s.getResignationDate().toString() : null)
                .monthlySalary(includeSalary ? s.getMonthlySalary() : null)
                .employmentStatus(s.getEmploymentStatus() != null ? s.getEmploymentStatus().name() : "ACTIVE")
                .shiftSchedule(s.getShiftSchedule())
                .profileImageUrl(s.getProfileImageUrl())
                .bio(s.getBio())
                .emergencyContact(s.getEmergencyContact())
                .applicationId(s.getApplicationId())
                .createdAt(s.getCreatedAt() != null ? s.getCreatedAt().toString() : null)
                .updatedAt(s.getUpdatedAt() != null ? s.getUpdatedAt().toString() : null)
                .build();
    }

    private StaffScheduleDto toScheduleDto(StaffSchedule s) {
        return StaffScheduleDto.builder()
                .id(s.getId())
                .staffId(s.getStaff().getId())
                .staffCode(s.getStaff().getStaffId())
                .staffName(s.getStaff().getFullName())
                .staffDesignation(s.getStaff().getDesignation())
                .shiftName(s.getShiftName())
                .dayOfWeek(s.getDayOfWeek())
                .specificDate(s.getSpecificDate() != null ? s.getSpecificDate().toString() : null)
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .isRecurring(s.getIsRecurring())
                .isRestDay(s.getIsRestDay())
                .notes(s.getNotes())
                .createdAt(s.getCreatedAt() != null ? s.getCreatedAt().toString() : null)
                .updatedAt(s.getUpdatedAt() != null ? s.getUpdatedAt().toString() : null)
                .build();
    }

    private boolean isOverlapping(String startA, String endA, String startB, String endB) {
        try {
            LocalTime sA = LocalTime.parse(startA);
            LocalTime eA = LocalTime.parse(endA);
            LocalTime sB = LocalTime.parse(startB);
            LocalTime eB = LocalTime.parse(endB);
            return sA.isBefore(eB) && sB.isBefore(eA);
        } catch (Exception e) {
            return false;
        }
    }
}
