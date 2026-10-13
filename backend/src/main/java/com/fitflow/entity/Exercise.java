package com.fitflow.entity;

import com.fitflow.entity.enums.EquipmentType;
import com.fitflow.entity.enums.ExperienceLevel;
import com.fitflow.entity.enums.TargetMuscle;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private TargetMuscle muscleGroup;

    @Enumerated(EnumType.STRING)
    private EquipmentType equipment;

    @Enumerated(EnumType.STRING)
    private ExperienceLevel difficulty;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    private String animationUrl;
    
    private String imageUrl;

    private Integer durationSeconds;
    
    private Integer defaultSets;
    
    private Integer defaultReps;
}
