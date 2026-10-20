package com.fitflow.controller;

import com.fitflow.dto.*;
import com.fitflow.service.RecruitmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminRecruitmentController {

    private final RecruitmentService recruitmentService;

    // ── Vacancies Endpoints ──────────────────────────────────────────────────

    @GetMapping("/vacancies")
    public ResponseEntity<Page<JobVacancyDto>> searchVacancies(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(recruitmentService.searchVacancies(search, status, page, size));
    }

    @GetMapping("/vacancies/summary")
    public ResponseEntity<RecruitmentSummaryMetrics> getRecruitmentSummary() {
        return ResponseEntity.ok(recruitmentService.getRecruitmentSummaryMetrics());
    }

    @GetMapping("/vacancies/{id}")
    public ResponseEntity<JobVacancyDto> getVacancy(@PathVariable Long id) {
        return ResponseEntity.ok(recruitmentService.getAdminVacancyById(id));
    }

    @PostMapping("/vacancies")
    public ResponseEntity<JobVacancyDto> createVacancy(@Valid @RequestBody JobVacancyRequest request) {
        return ResponseEntity.ok(recruitmentService.createVacancy(request));
    }

    @PutMapping("/vacancies/{id}")
    public ResponseEntity<JobVacancyDto> updateVacancy(
            @PathVariable Long id,
            @Valid @RequestBody JobVacancyRequest request) {
        return ResponseEntity.ok(recruitmentService.updateVacancy(id, request));
    }

    @PatchMapping("/vacancies/{id}/status")
    public ResponseEntity<JobVacancyDto> updateVacancyStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(recruitmentService.updateVacancyStatus(id, status));
    }

    @DeleteMapping("/vacancies/{id}")
    public ResponseEntity<?> deleteVacancy(@PathVariable Long id) {
        recruitmentService.deleteVacancy(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Vacancy processed/deleted successfully."));
    }

    // ── Applications Endpoints ───────────────────────────────────────────────

    @GetMapping("/applications")
    public ResponseEntity<Page<TrainerApplicationDto>> searchApplications(
            @RequestParam(required = false) Long vacancyId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(recruitmentService.searchApplications(vacancyId, status, search, page, size));
    }

    @GetMapping("/applications/summary")
    public ResponseEntity<ApplicationSummaryMetrics> getApplicationSummary() {
        return ResponseEntity.ok(recruitmentService.getApplicationSummaryMetrics());
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<TrainerApplicationDto> getApplication(@PathVariable Long id) {
        return ResponseEntity.ok(recruitmentService.getApplicationById(id));
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<TrainerApplicationDto> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String status = body.get("status");
        String reason = body.getOrDefault("reason", "Status updated by admin");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        String adminEmail = (auth != null) ? auth.getName() : "Administrator";
        return ResponseEntity.ok(recruitmentService.updateApplicationStatus(id, status, reason, adminEmail));
    }

    @PostMapping("/applications/{id}/interviews")
    public ResponseEntity<TrainerApplicationDto> scheduleInterview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String date = body.get("date");
        String time = body.get("time");
        String location = body.getOrDefault("location", "FitFlow Gym");
        String notes = body.getOrDefault("notes", "");
        if (date == null || date.isBlank()) {
            return ResponseEntity.badRequest().body(null);
        }
        String adminEmail = (auth != null) ? auth.getName() : "Administrator";
        return ResponseEntity.ok(recruitmentService.scheduleInterview(id, date, time, location, notes, adminEmail));
    }

    @PostMapping("/applications/{id}/notes")
    public ResponseEntity<TrainerApplicationDto> addNote(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String note = body.get("note");
        if (note == null || note.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        String adminEmail = (auth != null) ? auth.getName() : "Administrator";
        return ResponseEntity.ok(recruitmentService.addApplicationNote(id, note, adminEmail));
    }

    @PostMapping("/applications/{id}/convert-to-staff")
    public ResponseEntity<GymStaffDto> convertToStaff(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        Double salary = null;
        if (body.containsKey("monthlySalary") && body.get("monthlySalary") != null) {
            salary = Double.valueOf(body.get("monthlySalary").toString());
        }
        String designation = (String) body.get("designation");
        String shift = (String) body.get("shiftSchedule");
        LocalDate joining = (body.containsKey("joiningDate") && body.get("joiningDate") != null)
                ? LocalDate.parse(body.get("joiningDate").toString()) : LocalDate.now();

        String adminEmail = (auth != null) ? auth.getName() : "Administrator";
        return ResponseEntity.ok(recruitmentService.convertToStaff(id, salary, designation, shift, joining, adminEmail));
    }

    @GetMapping("/applications/{id}/resume")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) {
        TrainerApplicationDto app = recruitmentService.getApplicationById(id);
        Resource file = recruitmentService.getResumeFile(id);

        String filename = app.getResumeFileName() != null ? app.getResumeFileName() : "resume.pdf";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }
}
