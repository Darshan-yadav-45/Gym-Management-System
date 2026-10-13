package com.fitflow.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "membership_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Double price;
    
    private Integer durationMonths;
    
    @Column(columnDefinition = "TEXT")
    private String features;

    @Builder.Default
    private boolean active = true;
}
