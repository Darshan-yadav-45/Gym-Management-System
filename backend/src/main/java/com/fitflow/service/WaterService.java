package com.fitflow.service;

import com.fitflow.dto.WaterLogRequest;
import com.fitflow.entity.User;
import com.fitflow.entity.WaterLog;
import com.fitflow.repository.UserRepository;
import com.fitflow.repository.WaterLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WaterService {

    private final WaterLogRepository waterLogRepository;
    private final UserRepository userRepository;

    public WaterLog logWater(String email, WaterLogRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        
        WaterLog log = WaterLog.builder()
                .user(user)
                .amountMl(request.getAmountMl())
                .build();
                
        return waterLogRepository.save(log);
    }

    public Integer getTodayWater(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        
        List<WaterLog> logs = waterLogRepository.findByUserIdAndLoggedAtBetween(user.getId(), startOfDay, endOfDay);
        
        return logs.stream().mapToInt(WaterLog::getAmountMl).sum();
    }
}
