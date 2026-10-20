package com.fitflow.controller;

import com.fitflow.dto.*;
import com.fitflow.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminStaffController {

    private final StaffService staffService;

    // ── Staff Directory Endpoints ────────────────────────────────────────────

    @GetMapping("/staff")
    public ResponseEntity<Page<GymStaffDto>> searchStaff(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(staffService.searchStaff(search, status, page, size, true));
    }

    @GetMapping("/staff/summary")
    public ResponseEntity<StaffSummaryMetrics> getStaffSummary() {
        return ResponseEntity.ok(staffService.getStaffSummaryMetrics());
    }

    @GetMapping("/staff/{id}")
    public ResponseEntity<GymStaffDto> getStaffMember(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id, true));
    }

    @PostMapping("/staff")
    public ResponseEntity<GymStaffDto> createStaff(@Valid @RequestBody GymStaffRequest request) {
        return ResponseEntity.ok(staffService.createStaff(request));
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<GymStaffDto> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody GymStaffRequest request) {
        return ResponseEntity.ok(staffService.updateStaff(id, request));
    }

    @PatchMapping("/staff/{id}/status")
    public ResponseEntity<GymStaffDto> updateStaffStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        LocalDate resignationDate = (body.containsKey("resignationDate") && body.get("resignationDate") != null && !body.get("resignationDate").isBlank())
                ? LocalDate.parse(body.get("resignationDate")) : null;

        return ResponseEntity.ok(staffService.updateStaffStatus(id, status, resignationDate));
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Staff member deleted successfully."));
    }

    // ── Staff Schedules Endpoints ────────────────────────────────────────────

    @GetMapping("/staff-schedules")
    public ResponseEntity<List<StaffScheduleDto>> getAllSchedules(
            @RequestParam(required = false) Long staffId) {
        if (staffId != null) {
            return ResponseEntity.ok(staffService.getSchedulesByStaffId(staffId));
        }
        return ResponseEntity.ok(staffService.getAllSchedules());
    }

    @PostMapping("/staff-schedules")
    public ResponseEntity<StaffScheduleDto> createSchedule(@Valid @RequestBody StaffScheduleRequest request) {
        return ResponseEntity.ok(staffService.createSchedule(request));
    }

    @PutMapping("/staff-schedules/{id}")
    public ResponseEntity<StaffScheduleDto> updateSchedule(
            @PathVariable Long id,
            @RequestBody StaffScheduleRequest request) {
        return ResponseEntity.ok(staffService.updateSchedule(id, request));
    }

    @DeleteMapping("/staff-schedules/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        staffService.deleteSchedule(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Schedule deleted successfully."));
    }
}
