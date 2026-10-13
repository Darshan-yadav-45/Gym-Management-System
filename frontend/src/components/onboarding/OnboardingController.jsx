import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import StepTransition from './StepTransition';
import GenderSelection from './GenderSelection';
import HeightSlider from './HeightSlider';
import WeightRuler from './WeightRuler';
import GoalSelection from './GoalSelection';
import MuscleSelector from './MuscleSelector';
import WorkoutFrequency from './WorkoutFrequency';
import EquipmentSelection from './EquipmentSelection';
import PlanAnalysis from './PlanAnalysis';
import OnboardingSummary from './OnboardingSummary';
import { submitOnboardingData } from '../../services/onboardingService';
import '../../styles/onboarding.css';

const TOTAL_STEPS = 10;

export default function OnboardingController() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [onboardingData, setOnboardingData] = useState(() => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        return {
            gender: user?.gender || "",
            height: user?.heightCm || 170,
            heightUnit: "cm",
            weight: user?.weightKg || 65,
            weightUnit: "kg",
            bmi: 22.5,
            goal: "",
            targetMuscles: [],
            workoutFrequency: 4,
            selectedDays: [],
            equipment: "",
            preferredWorkoutTime: "",
            workoutLocation: "",
        };
    });

    const handleUpdateData = (key, value) => {
        setOnboardingData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        if (currentStep < TOTAL_STEPS) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    const calculateBMI = () => {
        const heightM = onboardingData.height / 100;
        const bmi = onboardingData.weight / (heightM * heightM);
        handleUpdateData('bmi', bmi.toFixed(1));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await submitOnboardingData(onboardingData);
            navigate('/dashboard'); // Navigate on success
        } catch (error) {
            console.error("Failed to submit", error);
            // In a real app, show error toast here
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1: return onboardingData.gender !== "";
            case 2: return onboardingData.height > 100;
            case 3: return onboardingData.weight > 30;
            case 4: return onboardingData.goal !== "";
            case 5: return onboardingData.targetMuscles.length > 0; // upper body
            case 6: return true; // lower body (optional)
            case 7: return onboardingData.workoutFrequency > 0;
            case 8: return true; // loading/analysis screen
            case 9: return true; // feature intro
            case 10: return onboardingData.equipment !== "";
            default: return true;
        }
    };

    // Before leaving step 3, update BMI
    const handleNext = () => {
        if (currentStep === 3) calculateBMI();
        
        // If on analysis step, auto-advance after delay
        if (currentStep === 7) {
            nextStep(); // go to 8
        } else if (currentStep === TOTAL_STEPS) {
            handleSubmit();
        } else {
            nextStep();
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <GenderSelection data={onboardingData} update={handleUpdateData} onSelect={handleNext} />;
            case 2: return <HeightSlider data={onboardingData} update={handleUpdateData} />;
            case 3: return <WeightRuler data={onboardingData} update={handleUpdateData} />;
            case 4: return <GoalSelection data={onboardingData} update={handleUpdateData} onSelect={handleNext} />;
            case 5: return <MuscleSelector data={onboardingData} update={handleUpdateData} type="upper" />;
            case 6: return <MuscleSelector data={onboardingData} update={handleUpdateData} type="lower" />;
            case 7: return <WorkoutFrequency data={onboardingData} update={handleUpdateData} />;
            case 8: return <PlanAnalysis data={onboardingData} onComplete={nextStep} />;
            case 9: return <OnboardingSummary data={onboardingData} />;
            case 10: return <EquipmentSelection data={onboardingData} update={handleUpdateData} />;
            default: return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="onboarding-container">
            <header className="onboarding-header">
                <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            </header>

            <main className="onboarding-content">
                <StepTransition key={currentStep} direction={direction}>
                    {renderStep()}
                </StepTransition>
            </main>

            {currentStep !== 8 && currentStep !== 9 && ( // Hide controls on analysis and summary steps if needed
                <footer className="onboarding-footer">
                    <button 
                        className="btn-secondary" 
                        onClick={prevStep}
                        style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                    >
                        Back
                    </button>
                    
                    <button 
                        className="btn-primary" 
                        onClick={handleNext}
                        disabled={!isStepValid() || isSubmitting}
                    >
                        {isSubmitting ? 'Loading...' : currentStep === TOTAL_STEPS ? 'Start My Fitness Journey' : 'Continue'}
                    </button>
                </footer>
            )}
        </div>
    );
}
