package com.fitflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_metrics", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_record_date", columnNames = {"user_id", "record_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_daily_metric_user"))
    private User user;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(name = "water_intake_ml", nullable = false)
    @Builder.Default
    private Integer waterIntakeMl = 0;

    @Column(name = "steps_count", nullable = false)
    @Builder.Default
    private Integer stepsCount = 0;

    @Column(name = "protein_grams", nullable = false)
    @Builder.Default
    private Integer proteinGrams = 0;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void recalculateCalculatedFields() {
        if (this.stepsCount != null) {
            // Documented estimation: ~0.00078 km (0.78 m) per step
            this.distanceKm = Math.round((this.stepsCount * 0.00078) * 100.0) / 100.0;
            // Documented estimation: ~0.04 kcal per step (40 kcal per 1000 steps)
            this.caloriesBurned = (int) Math.round(this.stepsCount * 0.04);
        } else {
            this.distanceKm = 0.0;
            this.caloriesBurned = 0;
        }
    }
}
