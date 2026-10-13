package com.fitflow.dto;

import com.fitflow.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private Integer age;
    private String gender;
    private Double heightCm;
    private Double weightKg;
    private Double bmi;
    private String location;
    private String designation;
    private List<String> sports;
}
