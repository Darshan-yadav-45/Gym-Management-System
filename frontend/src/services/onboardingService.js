import api from './api';

export const submitOnboardingData = async (data) => {
    try {
        const payload = {
            gender: data.gender || "MALE",
            heightCm: parseFloat(data.height) || 170.0,
            weightKg: parseFloat(data.weight) || 65.0,
            bmi: parseFloat(data.bmi) || 22.5,
            fitnessGoal: data.goal || "GENERAL_FITNESS",
            targetMuscles: data.targetMuscles || [],
            workoutsPerWeek: parseInt(data.workoutFrequency, 10) || 4,
            preferredWorkoutTime: data.preferredWorkoutTime || "MORNING",
            equipmentType: data.equipment || "NO_EQUIPMENT",
            workoutLocation: data.equipment === 'FULL_GYM' ? 'GYM' : 'HOME'
        };

        const response = await api.post('/onboarding', payload);
        return response.data;
    } catch (error) {
        console.error("Error submitting onboarding data:", error);
        return null;
    }
};
