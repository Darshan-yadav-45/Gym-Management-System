package com.fitflow.service;

import com.fitflow.dto.*;
import com.fitflow.entity.ApplicationStatusHistory;
import com.fitflow.entity.GymStaff;
import com.fitflow.entity.JobVacancy;
import com.fitflow.entity.TrainerApplication;
import com.fitflow.entity.enums.ApplicationStatus;
import com.fitflow.entity.enums.EmploymentStatus;
import com.fitflow.entity.enums.EmploymentType;
import com.fitflow.entity.enums.VacancyStatus;
import com.fitflow.repository.ApplicationStatusHistoryRepository;
import com.fitflow.repository.GymStaffRepository;
import com.fitflow.repository.JobVacancyRepository;
import com.fitflow.repository.TrainerApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecruitmentService {

    private final JobVacancyRepository vacancyRepository;
    private final TrainerApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final GymStaffRepository staffRepository;
    private final EmailService emailService;

    private static final String UPLOAD_DIR = "uploads/resumes";
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "doc", "docx");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // ── Public Vacancy Browsing ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<JobVacancyDto> getPublicOpenVacancies() {
        LocalDate today = LocalDate.now();
        List<JobVacancy> vacancies = vacancyRepository.findPublicOpenVacancies(today);
        return vacancies.stream()
                .map(v -> toVacancyDto(v, false, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobVacancyDto getPublicVacancyById(Long id) {
        JobVacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found with ID: " + id));

        if (!vacancy.isCurrentlyOpen()) {
            throw new RuntimeException("This opportunity is no longer accepting public applications.");
        }
        return toVacancyDto(vacancy, false, false);
    }

    // ── Admin Vacancy Management ─────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<JobVacancyDto> searchVacancies(String query, String statusStr, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        VacancyStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = VacancyStatus.valueOf(statusStr.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Page<JobVacancy> pageResult = vacancyRepository.searchVacancies(query, status, pageable);
        return pageResult.map(v -> toVacancyDto(v, true, true));
    }

    @Transactional(readOnly = true)
    public JobVacancyDto getAdminVacancyById(Long id) {
        JobVacancy v = vacancyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vacancy not found with ID: " + id));
        return toVacancyDto(v, true, true);
    }

    @Transactional
    public JobVacancyDto createVacancy(JobVacancyRequest req) {
        LocalDate opening = LocalDate.parse(req.getOpeningDate());
        LocalDate deadline = LocalDate.parse(req.getDeadlineDate());

        if (deadline.isBefore(opening)) {
            throw new RuntimeException("Application deadline date cannot be before the opening date.");
        }

        EmploymentType empType = EmploymentType.FULL_TIME;
        if (req.getEmploymentType() != null) {
            try {
                empType = EmploymentType.valueOf(req.getEmploymentType().toUpperCase());
            } catch (Exception ignored) {}
        }

        VacancyStatus status = VacancyStatus.OPEN;
        if (req.getStatus() != null) {
            try {
                status = VacancyStatus.valueOf(req.getStatus().toUpperCase());
            } catch (Exception ignored) {}
        } else {
            // Automatically determine: if opening date is future, set to SCHEDULED
            if (opening.isAfter(LocalDate.now())) {
                status = VacancyStatus.SCHEDULED;
            }
        }

        JobVacancy vacancy = JobVacancy.builder()
                .title(req.getTitle().trim())
                .department(req.getDepartment())
                .specialization(req.getSpecialization())
                .vacanciesCount(req.getVacanciesCount())
                .filledCount(0)
                .jobDescription(req.getJobDescription())
                .requiredQualifications(req.getRequiredQualifications())
                .minExperience(req.getMinExperience() != null ? req.getMinExperience() : 1)
                .preferredExperience(req.getPreferredExperience())
                .employmentType(empType)
                .salaryRange(req.getSalaryRange())
                .isSalaryPublished(req.getIsSalaryPublished() != null ? req.getIsSalaryPublished() : false)
                .location(req.getLocation() != null ? req.getLocation() : "FitFlow Gym")
                .openingDate(opening)
                .deadlineDate(deadline)
                .expectedJoiningDate(req.getExpectedJoiningDate() != null && !req.getExpectedJoiningDate().isBlank() ? LocalDate.parse(req.getExpectedJoiningDate()) : null)
                .workingDaysShift(req.getWorkingDaysShift())
                .status(status)
                .build();

        vacancy = vacancyRepository.save(vacancy);
        log.info("Created new vacancy: '{}' (ID: {}) with status: {}", vacancy.getTitle(), vacancy.getId(), vacancy.getStatus());
        return toVacancyDto(vacancy, true, true);
    }

    @Transactional
    public JobVacancyDto updateVacancy(Long id, JobVacancyRequest req) {
        JobVacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vacancy not found with ID: " + id));

        LocalDate opening = LocalDate.parse(req.getOpeningDate());
        LocalDate deadline = LocalDate.parse(req.getDeadlineDate());

        if (deadline.isBefore(opening)) {
            throw new RuntimeException("Application deadline date cannot be before the opening date.");
        }

        vacancy.setTitle(req.getTitle().trim());
        vacancy.setDepartment(req.getDepartment());
        vacancy.setSpecialization(req.getSpecialization());
        vacancy.setVacanciesCount(req.getVacanciesCount());
        vacancy.setJobDescription(req.getJobDescription());
        vacancy.setRequiredQualifications(req.getRequiredQualifications());
        if (req.getMinExperience() != null) vacancy.setMinExperience(req.getMinExperience());
        vacancy.setPreferredExperience(req.getPreferredExperience());

        if (req.getEmploymentType() != null) {
            try {
                vacancy.setEmploymentType(EmploymentType.valueOf(req.getEmploymentType().toUpperCase()));
            } catch (Exception ignored) {}
        }

        vacancy.setSalaryRange(req.getSalaryRange());
        if (req.getIsSalaryPublished() != null) vacancy.setIsSalaryPublished(req.getIsSalaryPublished());
        if (req.getLocation() != null) vacancy.setLocation(req.getLocation());
        vacancy.setOpeningDate(opening);
        vacancy.setDeadlineDate(deadline);
        if (req.getExpectedJoiningDate() != null && !req.getExpectedJoiningDate().isBlank()) {
            vacancy.setExpectedJoiningDate(LocalDate.parse(req.getExpectedJoiningDate()));
        }
        vacancy.setWorkingDaysShift(req.getWorkingDaysShift());

        if (req.getStatus() != null) {
            try {
                vacancy.setStatus(VacancyStatus.valueOf(req.getStatus().toUpperCase()));
            } catch (Exception ignored) {}
        }

        vacancy = vacancyRepository.save(vacancy);
        return toVacancyDto(vacancy, true, true);
    }

    @Transactional
    public JobVacancyDto updateVacancyStatus(Long id, String statusStr) {
        JobVacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vacancy not found with ID: " + id));

        VacancyStatus newStatus = VacancyStatus.valueOf(statusStr.trim().toUpperCase());
        vacancy.setStatus(newStatus);
        vacancy = vacancyRepository.save(vacancy);
        return toVacancyDto(vacancy, true, true);
    }

    @Transactional
    public void deleteVacancy(Long id) {
        JobVacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vacancy not found with ID: " + id));

        if (vacancy.getFilledCount() > 0) {
            throw new RuntimeException("Cannot delete vacancy with hired positions. Change status to CLOSED or CANCELLED instead.");
        }

        long appCount = applicationRepository.countByVacancyId(id);
        if (appCount > 0) {
            // Soft cancel instead of deleting to preserve application audit records
            vacancy.setStatus(VacancyStatus.CANCELLED);
            vacancyRepository.save(vacancy);
            log.info("Vacancy ID {} has {} applications — cancelled instead of hard deleted to preserve audit history.", id, appCount);
        } else {
            vacancyRepository.delete(vacancy);
            log.info("Deleted vacancy ID: {}", id);
        }
    }

    @Transactional(readOnly = true)
    public RecruitmentSummaryMetrics getRecruitmentSummaryMetrics() {
        long totalVacancies = vacancyRepository.count();
        long scheduled = vacancyRepository.countByStatus(VacancyStatus.SCHEDULED);
        long open = vacancyRepository.countByStatus(VacancyStatus.OPEN);
        long closed = vacancyRepository.countByStatus(VacancyStatus.CLOSED);

        Long positions = vacancyRepository.countTotalPositionsAvailable();
        long totalPositions = positions != null ? positions : 0;
        long totalApps = applicationRepository.count();

        LocalDate today = LocalDate.now();
        long approaching = vacancyRepository.countApproachingDeadline(today, today.plusDays(7));

        return RecruitmentSummaryMetrics.builder()
                .totalPublishedVacancies(totalVacancies)
                .scheduledVacancies(scheduled)
                .currentlyOpenVacancies(open)
                .closedVacancies(closed)
                .totalPositionsAvailable(totalPositions)
                .totalApplicationsReceived(totalApps)
                .vacanciesApproachingDeadline(approaching)
                .build();
    }

    // ── Application Submission & Processing ──────────────────────────────────

    @Transactional
    public TrainerApplicationDto submitApplication(Long vacancyId,
                                                   TrainerApplicationRequest req,
                                                   MultipartFile resumeFile) {
        JobVacancy vacancy = vacancyRepository.findById(vacancyId)
                .orElseThrow(() -> new RuntimeException("Vacancy not found with ID: " + vacancyId));

        if (!vacancy.isCurrentlyOpen()) {
            throw new RuntimeException("This vacancy is no longer accepting applications (Deadline passed or position filled).");
        }

        String email = req.getEmail().trim().toLowerCase();
        if (applicationRepository.existsByVacancyIdAndEmailIgnoreCase(vacancyId, email)) {
            throw new RuntimeException("You have already submitted an application for this vacancy with email " + email);
        }

        // Handle safe resume upload
        String savedFileName = null;
        String savedFilePath = null;
        if (resumeFile != null && !resumeFile.isEmpty()) {
            if (resumeFile.getSize() > MAX_FILE_SIZE) {
                throw new RuntimeException("Resume file exceeds 10MB size limit.");
            }

            String originalName = resumeFile.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase();
            }

            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                throw new RuntimeException("Invalid file format. Only PDF, DOC, and DOCX resumes are accepted.");
            }

            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String safeUniqueName = UUID.randomUUID().toString() + "." + extension;
                Path destination = uploadPath.resolve(safeUniqueName);
                Files.copy(resumeFile.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

                savedFileName = originalName;
                savedFilePath = destination.toString();
            } catch (IOException e) {
                log.error("Failed to store resume file: {}", e.getMessage());
                throw new RuntimeException("Failed to upload resume file. Please try again.");
            }
        }

        // Generate unique reference number: APP-YYYY-RANDOM4
        int year = LocalDate.now().getYear();
        String randomSuffix = String.format("%04d", new Random().nextInt(10000));
        String referenceNumber = "APP-" + year + "-" + randomSuffix;
        while (applicationRepository.findByReferenceNumber(referenceNumber).isPresent()) {
            randomSuffix = String.format("%04d", new Random().nextInt(10000));
            referenceNumber = "APP-" + year + "-" + randomSuffix;
        }

        LocalDate avail = (req.getAvailabilityDate() != null && !req.getAvailabilityDate().isBlank())
                ? LocalDate.parse(req.getAvailabilityDate()) : null;

        TrainerApplication app = TrainerApplication.builder()
                .referenceNumber(referenceNumber)
                .vacancy(vacancy)
                .fullName(req.getFullName().trim())
                .email(email)
                .phone(req.getPhone().trim())
                .currentLocation(req.getCurrentLocation())
                .desiredPosition(req.getDesiredPosition() != null ? req.getDesiredPosition() : vacancy.getTitle())
                .experienceYears(req.getExperienceYears() != null ? req.getExperienceYears() : 0)
                .specialization(req.getSpecialization())
                .educationalQualifications(req.getEducationalQualifications())
                .fitnessCertifications(req.getFitnessCertifications())
                .previousExperience(req.getPreviousExperience())
                .professionalSummary(req.getProfessionalSummary())
                .availabilityDate(avail)
                .resumeFileName(savedFileName)
                .resumeFilePath(savedFilePath)
                .portfolioUrl(req.getPortfolioUrl())
                .consentGiven(req.getConsentGiven() != null ? req.getConsentGiven() : true)
                .status(ApplicationStatus.SUBMITTED)
                .build();

        app = applicationRepository.save(app);

        // Record initial status history audit trail
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(app)
                .fromStatus(null)
                .toStatus(ApplicationStatus.SUBMITTED)
                .changedBy("Candidate (" + email + ")")
                .reasonOrNotes("Application submitted successfully via Careers portal.")
                .build();
        statusHistoryRepository.save(history);

        log.info("Application submitted: Ref {} by {} for Vacancy '{}'", referenceNumber, email, vacancy.getTitle());

        // Dispatch acknowledgement email (safe — fails silently if SMTP unconfigured)
        emailService.sendApplicationAcknowledgement(email, app.getFullName(), vacancy.getTitle(), referenceNumber);

        return toApplicationDto(app, true);
    }

    @Transactional(readOnly = true)
    public Page<TrainerApplicationDto> searchApplications(Long vacancyId,
                                                          String statusStr,
                                                          String query,
                                                          int page,
                                                          int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        ApplicationStatus status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = ApplicationStatus.valueOf(statusStr.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Page<TrainerApplication> result = applicationRepository.searchApplications(vacancyId, status, query, pageable);
        return result.map(a -> toApplicationDto(a, false));
    }

    @Transactional(readOnly = true)
    public TrainerApplicationDto getApplicationById(Long id) {
        TrainerApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + id));
        return toApplicationDto(app, true);
    }

    @Transactional
    public TrainerApplicationDto updateApplicationStatus(Long id,
                                                         String newStatusStr,
                                                         String reason,
                                                         String adminEmail) {
        TrainerApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + id));

        ApplicationStatus fromStatus = app.getStatus();
        ApplicationStatus toStatus = ApplicationStatus.valueOf(newStatusStr.trim().toUpperCase());

        app.setStatus(toStatus);
        app = applicationRepository.save(app);

        // Record audit trail
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(app)
                .fromStatus(fromStatus)
                .toStatus(toStatus)
                .changedBy(adminEmail != null ? adminEmail : "Administrator")
                .reasonOrNotes(reason)
                .build();
        statusHistoryRepository.save(history);

        // Send candidate status update notification
        if (toStatus == ApplicationStatus.SHORTLISTED || toStatus == ApplicationStatus.SELECTED || toStatus == ApplicationStatus.REJECTED) {
            emailService.sendApplicationStatusUpdate(app.getEmail(), app.getFullName(), app.getVacancy().getTitle(), toStatus.name(), reason);
        }

        log.info("Application {} status updated: {} -> {} by {}", app.getReferenceNumber(), fromStatus, toStatus, adminEmail);
        return toApplicationDto(app, true);
    }

    @Transactional
    public TrainerApplicationDto scheduleInterview(Long id,
                                                    String dateStr,
                                                    String timeStr,
                                                    String location,
                                                    String notes,
                                                    String adminEmail) {
        TrainerApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + id));

        LocalDate interviewDate = LocalDate.parse(dateStr);
        app.setInterviewDate(interviewDate);
        app.setInterviewTime(timeStr);
        app.setInterviewLocation(location);
        app.setInterviewNotes(notes);

        ApplicationStatus fromStatus = app.getStatus();
        app.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        app = applicationRepository.save(app);

        // Audit trail
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(app)
                .fromStatus(fromStatus)
                .toStatus(ApplicationStatus.INTERVIEW_SCHEDULED)
                .changedBy(adminEmail != null ? adminEmail : "Administrator")
                .reasonOrNotes("Interview scheduled for " + dateStr + " at " + timeStr + " (" + location + ")")
                .build();
        statusHistoryRepository.save(history);

        // Dispatch interview email
        emailService.sendInterviewInvitation(app.getEmail(), app.getFullName(), app.getVacancy().getTitle(),
                dateStr, timeStr, location, notes);

        return toApplicationDto(app, true);
    }

    @Transactional
    public TrainerApplicationDto addApplicationNote(Long id, String note, String adminEmail) {
        TrainerApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + id));

        String timestamp = LocalDateTime.now().toString().replace('T', ' ').substring(0, 19);
        String formattedNote = String.format("[%s by %s]: %s", timestamp, adminEmail != null ? adminEmail : "Admin", note);

        if (app.getInternalNotes() != null && !app.getInternalNotes().isBlank()) {
            app.setInternalNotes(app.getInternalNotes() + "\n" + formattedNote);
        } else {
            app.setInternalNotes(formattedNote);
        }

        app = applicationRepository.save(app);
        return toApplicationDto(app, true);
    }

    /**
     * Converts a selected candidate into an active GymStaff member.
     * Guaranteed transactional and idempotent — prevents duplicate staff records.
     */
    @Transactional
    public GymStaffDto convertToStaff(Long applicationId,
                                      Double monthlySalary,
                                      String designation,
                                      String shiftSchedule,
                                      LocalDate joiningDate,
                                      String adminEmail) {
        TrainerApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));

        if (Boolean.TRUE.equals(app.getConvertedToStaff())) {
            throw new RuntimeException("Candidate has already been converted to staff (Staff ID: " + app.getConvertedStaffId() + ")");
        }

        JobVacancy vacancy = app.getVacancy();
        if (vacancy.getFilledCount() >= vacancy.getVacanciesCount()) {
            throw new RuntimeException("Vacancy position limit already reached (" + vacancy.getFilledCount() + "/" + vacancy.getVacanciesCount() + ")");
        }

        // Generate Staff ID (e.g. TRN-005)
        long count = staffRepository.count() + 1;
        String staffId = String.format("TRN-%03d", count);
        while (staffRepository.existsByStaffId(staffId)) {
            count++;
            staffId = String.format("TRN-%03d", count);
        }

        GymStaff staff = GymStaff.builder()
                .staffId(staffId)
                .fullName(app.getFullName())
                .email(app.getEmail())
                .phone(app.getPhone())
                .designation(designation != null && !designation.isBlank() ? designation : vacancy.getTitle())
                .specialization(app.getSpecialization() != null ? app.getSpecialization() : vacancy.getSpecialization())
                .experienceYears(app.getExperienceYears() != null ? app.getExperienceYears() : 1)
                .qualifications(app.getFitnessCertifications() != null ? app.getFitnessCertifications() : app.getEducationalQualifications())
                .employmentType(vacancy.getEmploymentType())
                .joiningDate(joiningDate != null ? joiningDate : LocalDate.now())
                .monthlySalary(monthlySalary)
                .employmentStatus(EmploymentStatus.ACTIVE)
                .shiftSchedule(shiftSchedule != null ? shiftSchedule : "General Shift (08:00 - 17:00)")
                .emergencyContact(app.getPhone())
                .applicationId(app.getId())
                .build();

        staff = staffRepository.save(staff);

        // Update application
        app.setConvertedToStaff(true);
        app.setConvertedStaffId(staff.getId());
        app.setStatus(ApplicationStatus.SELECTED);
        applicationRepository.save(app);

        // Increment vacancy filled count
        vacancy.setFilledCount(vacancy.getFilledCount() + 1);
        if (vacancy.getFilledCount() >= vacancy.getVacanciesCount()) {
            vacancy.setStatus(VacancyStatus.CLOSED);
        }
        vacancyRepository.save(vacancy);

        // Audit log
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(app)
                .fromStatus(ApplicationStatus.SELECTED)
                .toStatus(ApplicationStatus.SELECTED)
                .changedBy(adminEmail != null ? adminEmail : "Administrator")
                .reasonOrNotes("Hired and converted to Gym Staff member: " + staff.getStaffId())
                .build();
        statusHistoryRepository.save(history);

        log.info("Candidate {} successfully converted to Gym Staff (Staff ID: {}) for Vacancy '{}'",
                app.getFullName(), staff.getStaffId(), vacancy.getTitle());

        return toStaffDto(staff);
    }

    @Transactional(readOnly = true)
    public ApplicationSummaryMetrics getApplicationSummaryMetrics() {
        return ApplicationSummaryMetrics.builder()
                .totalApplications(applicationRepository.count())
                .newApplications(applicationRepository.countByStatus(ApplicationStatus.SUBMITTED))
                .underReview(applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW))
                .shortlisted(applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED))
                .interviewScheduled(applicationRepository.countByStatus(ApplicationStatus.INTERVIEW_SCHEDULED))
                .selected(applicationRepository.countByStatus(ApplicationStatus.SELECTED))
                .rejected(applicationRepository.countByStatus(ApplicationStatus.REJECTED))
                .withdrawn(applicationRepository.countByStatus(ApplicationStatus.WITHDRAWN))
                .build();
    }

    @Transactional(readOnly = true)
    public Resource getResumeFile(Long applicationId) {
        TrainerApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));

        if (app.getResumeFilePath() == null || app.getResumeFilePath().isBlank()) {
            throw new RuntimeException("No resume file recorded for this application.");
        }

        try {
            Path file = Paths.get(app.getResumeFilePath());
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Resume file could not be read on the server.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error accessing resume file: " + e.getMessage());
        }
    }

    // ── Helper Mappers ───────────────────────────────────────────────────────

    private JobVacancyDto toVacancyDto(JobVacancy v, boolean includePrivateFields, boolean includeCount) {
        Long apps = includeCount ? applicationRepository.countByVacancyId(v.getId()) : null;
        return JobVacancyDto.builder()
                .id(v.getId())
                .title(v.getTitle())
                .department(v.getDepartment())
                .specialization(v.getSpecialization())
                .vacanciesCount(v.getVacanciesCount())
                .filledCount(v.getFilledCount())
                .remainingPositions(v.getRemainingPositions())
                .jobDescription(v.getJobDescription())
                .requiredQualifications(v.getRequiredQualifications())
                .minExperience(v.getMinExperience())
                .preferredExperience(v.getPreferredExperience())
                .employmentType(v.getEmploymentType() != null ? v.getEmploymentType().name() : "FULL_TIME")
                .salaryRange((v.getIsSalaryPublished() || includePrivateFields) ? v.getSalaryRange() : null)
                .isSalaryPublished(includePrivateFields ? v.getIsSalaryPublished() : null)
                .location(v.getLocation())
                .openingDate(v.getOpeningDate() != null ? v.getOpeningDate().toString() : null)
                .deadlineDate(v.getDeadlineDate() != null ? v.getDeadlineDate().toString() : null)
                .expectedJoiningDate(v.getExpectedJoiningDate() != null ? v.getExpectedJoiningDate().toString() : null)
                .workingDaysShift(v.getWorkingDaysShift())
                .status(v.getStatus() != null ? v.getStatus().name() : "OPEN")
                .isCurrentlyOpen(v.isCurrentlyOpen())
                .applicationsCount(apps)
                .createdAt(v.getCreatedAt() != null ? v.getCreatedAt().toString() : null)
                .updatedAt(v.getUpdatedAt() != null ? v.getUpdatedAt().toString() : null)
                .build();
    }

    private TrainerApplicationDto toApplicationDto(TrainerApplication a, boolean includeHistory) {
        List<ApplicationStatusHistoryDto> historyDtos = null;
        if (includeHistory) {
            historyDtos = statusHistoryRepository.findByApplicationIdOrderByCreatedAtDesc(a.getId())
                    .stream()
                    .map(h -> ApplicationStatusHistoryDto.builder()
                            .id(h.getId())
                            .fromStatus(h.getFromStatus() != null ? h.getFromStatus().name() : null)
                            .toStatus(h.getToStatus().name())
                            .changedBy(h.getChangedBy())
                            .reasonOrNotes(h.getReasonOrNotes())
                            .createdAt(h.getCreatedAt() != null ? h.getCreatedAt().toString() : null)
                            .build())
                    .collect(Collectors.toList());
        }

        return TrainerApplicationDto.builder()
                .id(a.getId())
                .referenceNumber(a.getReferenceNumber())
                .vacancyId(a.getVacancy().getId())
                .vacancyTitle(a.getVacancy().getTitle())
                .vacancyDepartment(a.getVacancy().getDepartment())
                .vacancyDeadline(a.getVacancy().getDeadlineDate() != null ? a.getVacancy().getDeadlineDate().toString() : null)
                .fullName(a.getFullName())
                .email(a.getEmail())
                .phone(a.getPhone())
                .currentLocation(a.getCurrentLocation())
                .desiredPosition(a.getDesiredPosition())
                .experienceYears(a.getExperienceYears())
                .specialization(a.getSpecialization())
                .educationalQualifications(a.getEducationalQualifications())
                .fitnessCertifications(a.getFitnessCertifications())
                .previousExperience(a.getPreviousExperience())
                .professionalSummary(a.getProfessionalSummary())
                .availabilityDate(a.getAvailabilityDate() != null ? a.getAvailabilityDate().toString() : null)
                .resumeFileName(a.getResumeFileName())
                .resumeUrl(a.getResumeFileName() != null ? "/api/admin/applications/" + a.getId() + "/resume" : null)
                .portfolioUrl(a.getPortfolioUrl())
                .consentGiven(a.getConsentGiven())
                .status(a.getStatus() != null ? a.getStatus().name() : "SUBMITTED")
                .internalNotes(a.getInternalNotes())
                .interviewDate(a.getInterviewDate() != null ? a.getInterviewDate().toString() : null)
                .interviewTime(a.getInterviewTime())
                .interviewLocation(a.getInterviewLocation())
                .interviewNotes(a.getInterviewNotes())
                .convertedToStaff(a.getConvertedToStaff())
                .convertedStaffId(a.getConvertedStaffId())
                .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null)
                .updatedAt(a.getUpdatedAt() != null ? a.getUpdatedAt().toString() : null)
                .statusHistory(historyDtos)
                .build();
    }

    private GymStaffDto toStaffDto(GymStaff s) {
        return GymStaffDto.builder()
                .id(s.getId())
                .staffId(s.getStaffId())
                .fullName(s.getFullName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .designation(s.getDesignation())
                .specialization(s.getSpecialization())
                .experienceYears(s.getExperienceYears())
                .employmentType(s.getEmploymentType() != null ? s.getEmploymentType().name() : "FULL_TIME")
                .joiningDate(s.getJoiningDate() != null ? s.getJoiningDate().toString() : null)
                .monthlySalary(s.getMonthlySalary())
                .employmentStatus(s.getEmploymentStatus() != null ? s.getEmploymentStatus().name() : "ACTIVE")
                .shiftSchedule(s.getShiftSchedule())
                .applicationId(s.getApplicationId())
                .build();
    }
}
