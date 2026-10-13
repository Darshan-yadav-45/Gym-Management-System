package com.fitflow.service;

import com.fitflow.dto.ProgressRequest;
import com.fitflow.entity.ProgressRecord;
import com.fitflow.entity.User;
import com.fitflow.repository.ProgressRecordRepository;
import com.fitflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRecordRepository progressRecordRepository;
    private final UserRepository userRepository;

    public ProgressRecord logProgress(String email, ProgressRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        
        ProgressRecord record = ProgressRecord.builder()
                .user(user)
                .weightKg(request.getWeightKg())
                .bodyNote(request.getBodyNote())
                .recordedAt(LocalDateTime.now())
                .build();
                
        return progressRecordRepository.save(record);
    }

    public List<ProgressRecord> getMyProgress(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return progressRecordRepository.findByUserIdOrderByRecordedAtDesc(user.getId());
    }
}
