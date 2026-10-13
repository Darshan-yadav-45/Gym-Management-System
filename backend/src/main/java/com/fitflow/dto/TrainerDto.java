package com.fitflow.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class TrainerDto {
    private Long id;
    private String name;
    private String specialization;
    private Integer experienceYears;
    private String bio;
    private String profileImageUrl;
    private String availability;
    private List<String> tags; // Specializations can be converted to tags
}
