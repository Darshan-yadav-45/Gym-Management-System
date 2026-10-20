-- ==============================================================================
-- FITFLOW GYM MANAGEMENT SYSTEM — POSTGRESQL / pgAdmin 4 VERIFICATION QUERIES
-- ==============================================================================
-- Run these queries in pgAdmin 4 Query Tool to inspect live data records.
-- All queries are non-destructive SELECT statements.

-- 1. Verify Users and Roles
SELECT id, name, email, role, enabled, created_at 
FROM fit_users 
ORDER BY id ASC;

-- 2. Verify Fitness Profiles and Goals
SELECT 
    fp.id AS profile_id,
    u.name,
    u.email,
    fp.age,
    fp.gender,
    fp.height_cm,
    fp.weight_kg,
    fp.bmi,
    fp.fitness_goal,
    fp.experience_level,
    fp.location
FROM fitness_profiles fp
JOIN fit_users u ON fp.user_id = u.id
ORDER BY fp.id ASC;

-- 3. Verify AI Coaches Directory (14 Seeded Coaches)
SELECT 
    id, 
    display_name, 
    gender, 
    tier, 
    primary_category, 
    specialization, 
    active 
FROM ai_coaches 
ORDER BY tier ASC, id ASC;

-- 4. Verify User Coach Preferences (Persisted AI Coach Selection)
SELECT 
    ucp.id,
    u.name AS user_name,
    u.email,
    c.display_name AS selected_coach,
    c.gender AS coach_gender,
    c.tier AS coach_tier,
    c.specialization,
    ucp.selected_at
FROM user_coach_preferences ucp
JOIN fit_users u ON ucp.user_id = u.id
JOIN ai_coaches c ON ucp.coach_id = c.id;

-- 5. Verify User Subscriptions & Premium Status
SELECT 
    s.id AS subscription_id,
    u.name,
    u.email,
    s.status,
    s.start_date,
    s.end_date,
    s.auto_renew,
    CASE 
        WHEN s.status = 'ACTIVE' AND s.end_date >= CURRENT_DATE THEN 'PREMIUM_ACTIVE'
        WHEN s.status = 'EXPIRING_SOON' THEN 'EXPIRING_SOON'
        WHEN s.status = 'EXPIRED' THEN 'EXPIRED'
        ELSE 'FREE_ACCESS'
    END AS effective_access
FROM user_subscriptions s
JOIN fit_users u ON s.user_id = u.id
ORDER BY s.id ASC;

-- 6. Verify Daily Metrics (Hydration, Steps, Protein, Calories)
SELECT 
    dm.id,
    u.email,
    dm.record_date,
    dm.water_intake_ml,
    dm.steps_count,
    dm.protein_grams,
    dm.calories_burned,
    dm.distance_km
FROM daily_metrics dm
JOIN fit_users u ON dm.user_id = u.id
ORDER BY dm.record_date DESC, dm.id DESC;

-- 7. Verify Saved Workout History & Progress
SELECT 
    p.id,
    u.email,
    p.recorded_at,
    p.weight_kg,
    p.body_note,
    p.workouts_completed
FROM progress_records p
JOIN fit_users u ON p.user_id = u.id
ORDER BY p.recorded_at DESC;

-- 8. Verify Email Delivery Audit Logs (Idempotent History)
SELECT 
    id,
    recipient_email,
    notification_type,
    delivery_status,
    event_date_key,
    created_at,
    error_message
FROM email_delivery_logs
ORDER BY created_at DESC;

-- 9. Check Total Platform Counts Summary
SELECT 
    (SELECT COUNT(*) FROM fit_users) AS total_users,
    (SELECT COUNT(*) FROM ai_coaches) AS total_ai_coaches,
    (SELECT COUNT(*) FROM exercises) AS total_exercises,
    (SELECT COUNT(*) FROM user_subscriptions WHERE status = 'ACTIVE') AS active_subscriptions,
    (SELECT COUNT(*) FROM user_coach_preferences) AS coach_preferences_saved,
    (SELECT COUNT(*) FROM daily_metrics) AS metric_records,
    (SELECT COUNT(*) FROM email_delivery_logs WHERE delivery_status = 'SENT') AS emails_sent;
