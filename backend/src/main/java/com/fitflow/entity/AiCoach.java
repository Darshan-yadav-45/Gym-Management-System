package com.fitflow.entity;

import com.fitflow.entity.enums.CoachCategory;
import com.fitflow.entity.enums.CoachTier;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Represents a selectable AI coach profile.
 * These are fictional AI personas — not real trainers.
 * Created via DataSeeder on startup; also manageable via admin API.
 */
@Entity
@Table(name = "ai_coaches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiCoach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String displayName;

    /** "MALE" or "FEMALE" — presentation style only */
    @Column(nullable = false)
    private String gender;

    /** URL to coach avatar/illustration image */
    private String avatarUrl;

    @Column(nullable = false)
    private String specialization;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String coachingStyle;

    /** Experience blurb, e.g. "Trained 5,000+ members" */
    private String experienceDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CoachTier tier;

    /** Primary category for filtering */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CoachCategory primaryCategory;

    /** All supported categories (stored as element collection) */
    @ElementCollection(targetClass = CoachCategory.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "ai_coach_categories", joinColumns = @JoinColumn(name = "coach_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    @Builder.Default
    private Set<CoachCategory> supportedCategories = new HashSet<>();

    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
