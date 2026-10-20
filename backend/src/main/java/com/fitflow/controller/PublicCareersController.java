package com.fitflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitflow.dto.JobVacancyDto;
import com.fitflow.dto.TrainerApplicationDto;
import com.fitflow.dto.TrainerApplicationRequest;
import com.fitflow.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/careers")
@RequiredArgsConstructor
@Slf4j
public class PublicCareersController {

    private final RecruitmentService recruitmentService;
    private final ObjectMapper objectMapper;

    /**
     * GET /api/careers/vacancies
     * Public endpoint: Lists all active, published hiring opportunities.
     */
    @GetMapping("/vacancies")
    public ResponseEntity<List<JobVacancyDto>> getOpenVacancies() {
        return ResponseEntity.ok(recruitmentService.getPublicOpenVacancies());
    }

    /**
     * GET /api/careers/vacancies/{id}
     * Public endpoint: Detailed view of a single open vacancy.
     */
    @GetMapping("/vacancies/{id}")
    public ResponseEntity<JobVacancyDto> getVacancyDetails(@PathVariable Long id) {
        return ResponseEntity.ok(recruitmentService.getPublicVacancyById(id));
    }

    /**
     * POST /api/careers/vacancies/{id}/applications
     * Public endpoint: Accepts candidate application with optional resume attachment.
     * Supports both multipart/form-data and application/json requests.
     */
    @PostMapping(value = "/vacancies/{id}/applications", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<TrainerApplicationDto> submitApplicationMultipart(
            @PathVariable Long id,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam(value = "currentLocation", required = false) String currentLocation,
            @RequestParam(value = "desiredPosition", required = false) String desiredPosition,
            @RequestParam(value = "experienceYears", required = false) Integer experienceYears,
            @RequestParam(value = "specialization", required = false) String specialization,
            @RequestParam(value = "educationalQualifications", required = false) String educationalQualifications,
            @RequestParam(value = "fitnessCertifications", required = false) String fitnessCertifications,
            @RequestParam(value = "previousExperience", required = false) String previousExperience,
            @RequestParam(value = "professionalSummary", required = false) String professionalSummary,
            @RequestParam(value = "availabilityDate", required = false) String availabilityDate,
            @RequestParam(value = "portfolioUrl", required = false) String portfolioUrl,
            @RequestParam(value = "consentGiven", defaultValue = "true") Boolean consentGiven,
            @RequestPart(value = "resume", required = false) MultipartFile resume) {

        TrainerApplicationRequest req = new TrainerApplicationRequest();
        req.setFullName(fullName);
        req.setEmail(email);
        req.setPhone(phone);
        req.setCurrentLocation(currentLocation);
        req.setDesiredPosition(desiredPosition);
        req.setExperienceYears(experienceYears);
        req.setSpecialization(specialization);
        req.setEducationalQualifications(educationalQualifications);
        req.setFitnessCertifications(fitnessCertifications);
        req.setPreviousExperience(previousExperience);
        req.setProfessionalSummary(professionalSummary);
        req.setAvailabilityDate(availabilityDate);
        req.setPortfolioUrl(portfolioUrl);
        req.setConsentGiven(consentGiven);

        return ResponseEntity.ok(recruitmentService.submitApplication(id, req, resume));
    }

    /**
     * Fallback for raw JSON application submissions without file upload.
     */
    @PostMapping(value = "/vacancies/{id}/applications", consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<TrainerApplicationDto> submitApplicationJson(
            @PathVariable Long id,
            @RequestBody TrainerApplicationRequest request) {
        return ResponseEntity.ok(recruitmentService.submitApplication(id, request, null));
    }
}
