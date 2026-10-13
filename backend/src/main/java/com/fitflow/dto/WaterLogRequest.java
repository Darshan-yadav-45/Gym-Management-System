package com.fitflow.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class WaterLogRequest {
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Integer amountMl;
}
