package com.fitflow.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class FitnessCalculationService {

    public Double calculateBmi(Double weightKg, Double heightCm) {
        if (weightKg == null || heightCm == null || heightCm == 0) {
            return null;
        }
        
        double heightMeters = heightCm / 100.0;
        double bmi = weightKg / (heightMeters * heightMeters);
        
        BigDecimal bd = new BigDecimal(Double.toString(bmi));
        bd = bd.setScale(2, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
