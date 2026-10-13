import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const submitOnboardingData = async (data) => {
    try {
        // Prepare the payload for Spring Boot
        const payload = {
            gender: data.gender,
            heightCm: parseFloat(data.height),
            weightKg: parseFloat(data.weight),
            bmi: parseFloat(data.bmi),
            fitnessGoal: data.goal,
            targetMuscles: data.targetMuscles,
            workoutsPerWeek: parseInt(data.workoutFrequency, 10),
            preferredWorkoutTime: data.preferredWorkoutTime,
            equipmentType: data.equipment,
            workoutLocation: data.equipment === 'Full Gym' ? 'GYM' : 'HOME'
        };

        const response = await axios.post(`${API_URL}/onboarding`, payload, {
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header here if needed
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting onboarding data:", error);
        throw error;
    }
};
