package com.fitflow.service;

import com.fitflow.dto.DailyMetricRequest;
import com.fitflow.dto.DailyMetricResponse;
import com.fitflow.entity.DailyMetric;
import com.fitflow.entity.User;
import com.fitflow.entity.enums.Role;
import com.fitflow.repository.DailyMetricRepository;
import com.fitflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DailyMetricServiceTest {

    @Mock
    private DailyMetricRepository dailyMetricRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DailyMetricService dailyMetricService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Appu")
                .email("appu@fitflow.com")
                .role(Role.MEMBER)
                .build();
    }

    @Test
    void testGetTodayMetrics_WhenNoRecordExists_ReturnsDefaults() {
        when(userRepository.findByEmail("appu@fitflow.com")).thenReturn(Optional.of(testUser));
        when(dailyMetricRepository.findByUserIdAndRecordDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.empty());

        DailyMetricResponse response = dailyMetricService.getTodayMetrics("appu@fitflow.com");

        assertNotNull(response);
        assertEquals(3000, response.getWaterTargetMl());
        assertEquals(10000, response.getStepsTarget());
        assertEquals(140, response.getProteinTargetGrams());
        assertEquals(0, response.getWaterIntakeMl());
        assertEquals(0, response.getStepsCount());
        assertEquals(0, response.getProteinGrams());
    }

    @Test
    void testLogMetrics_CreatesAndCalculatesDistanceAndCalories() {
        when(userRepository.findByEmail("appu@fitflow.com")).thenReturn(Optional.of(testUser));
        when(dailyMetricRepository.findByUserIdAndRecordDate(eq(1L), any(LocalDate.class)))
                .thenReturn(Optional.empty());

        DailyMetric savedMetric = DailyMetric.builder()
                .id(100L)
                .user(testUser)
                .recordDate(LocalDate.now())
                .waterIntakeMl(1500)
                .stepsCount(6000)
                .proteinGrams(70)
                .build();
        savedMetric.recalculateCalculatedFields();

        when(dailyMetricRepository.save(any(DailyMetric.class))).thenReturn(savedMetric);

        DailyMetricRequest request = DailyMetricRequest.builder()
                .waterIntakeMl(1500)
                .stepsCount(6000)
                .proteinGrams(70)
                .build();

        DailyMetricResponse response = dailyMetricService.logMetrics("appu@fitflow.com", request);

        assertNotNull(response);
        assertEquals(1500, response.getWaterIntakeMl());
        assertEquals(6000, response.getStepsCount());
        assertEquals(70, response.getProteinGrams());
        assertEquals(50.0, response.getWaterProgressPercentage());
        assertEquals(60.0, response.getStepsProgressPercentage());
        assertEquals(50.0, response.getProteinProgressPercentage());
        assertEquals(4.68, response.getDistanceKm());
        assertEquals(240, response.getCaloriesBurned());
        verify(dailyMetricRepository, times(1)).save(any(DailyMetric.class));
    }

    @Test
    void testGetTodayMetricsForUser_Unauthorized_ThrowsSecurityException() {
        when(userRepository.findByEmail("appu@fitflow.com")).thenReturn(Optional.of(testUser));

        assertThrows(SecurityException.class, () -> {
            dailyMetricService.getTodayMetricsForUser("appu@fitflow.com", 2L);
        });
    }
}
