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

const TOTAL_STEPS = 9;

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
            equipment: "",
            workoutFrequency: 4,
            selectedDays: [],
            preferredWorkoutTime: "MORNING",
            workoutLocation: "GYM",
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
        const heightM = (onboardingData.height || 170) / 100;
        const bmi = (onboardingData.weight || 65) / (heightM * heightM);
        handleUpdateData('bmi', parseFloat(bmi.toFixed(1)));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await submitOnboardingData(onboardingData);
        } catch (error) {
            console.error("Failed to submit onboarding data:", error);
        } finally {
            setIsSubmitting(false);
            navigate('/dashboard');
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1: return onboardingData.gender !== "";
            case 2: return onboardingData.height > 100;
            case 3: return onboardingData.weight > 30;
            case 4: return onboardingData.goal !== "";
            case 5: return (onboardingData.targetMuscles || []).length > 0;
            case 6: return onboardingData.equipment !== "";
            case 7: return onboardingData.workoutFrequency > 0;
            case 8: return true; // loading/analysis screen
            case 9: return true; // summary screen
            default: return true;
        }
    };

    const handleNext = () => {
        if (currentStep === 3) calculateBMI();
        
        if (currentStep === 7) {
            nextStep(); // go to 8 (Plan Analysis)
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
            case 5: return <MuscleSelector data={onboardingData} update={handleUpdateData} />;
            case 6: return <EquipmentSelection data={onboardingData} update={handleUpdateData} />;
            case 7: return <WorkoutFrequency data={onboardingData} update={handleUpdateData} />;
            case 8: return <PlanAnalysis data={onboardingData} onComplete={nextStep} />;
            case 9: return <OnboardingSummary data={onboardingData} onNext={handleSubmit} isSubmitting={isSubmitting} />;
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

            {/* Footer buttons: visible on all steps except automated analysis step 8 */}
            {currentStep !== 8 && (
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
                        {isSubmitting 
                            ? 'Starting...' 
                            : currentStep === TOTAL_STEPS 
                                ? 'Start My Fitness Journey →' 
                                : 'Continue'}
                    </button>
                </footer>
            )}
        </div>
    );
}
