package com.fitflow.repository;

import com.fitflow.entity.UserSubscription;
import com.fitflow.entity.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {

    Optional<UserSubscription> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<UserSubscription> findByStatus(SubscriptionStatus status);

    /** Find active subscriptions that will expire within the given date range */
    @Query("SELECT s FROM UserSubscription s WHERE s.status = 'ACTIVE' " +
           "AND s.endDate BETWEEN :from AND :to")
    List<UserSubscription> findExpiringBetween(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    /** Find subscriptions that were ACTIVE but whose endDate has passed */
    @Query("SELECT s FROM UserSubscription s WHERE s.status = 'ACTIVE' " +
           "AND s.endDate < :today")
    List<UserSubscription> findExpiredButNotUpdated(@Param("today") LocalDate today);

    long countByStatus(SubscriptionStatus status);
}
