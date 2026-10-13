package com.fitflow.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProfileRequest {
    private Integer age;
    private String gender;
    private Double heightCm;
    private Double weightKg;
    private String location;
    private String designation;
    private List<String> sports;
    
    // Additional fields that might be updated
    private String name;
    private String phone;
}
