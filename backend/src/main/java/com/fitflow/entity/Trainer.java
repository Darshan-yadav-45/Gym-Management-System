package com.fitflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "trainers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String specialization;
    
    private Integer experienceYears;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private String profileImageUrl;
    
    private String availability; // Simple string representing availability

    @ManyToMany
    @JoinTable(
        name = "trainer_members",
        joinColumns = @JoinColumn(name = "trainer_id"),
        inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    @Builder.Default
    private Set<User> members = new HashSet<>();
}
