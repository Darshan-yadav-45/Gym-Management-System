package com.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private Boolean success;
    private String message;
    private Long userId;
    private String nextStep;
    private String token;
    private UserResponse user;
    private Boolean profileCompleted;
}
