import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  List, 
  Sparkles, 
  Play, 
  HelpCircle, 
  SlidersHorizontal, 
  Lightbulb, 
  ListOrdered, 
  ChevronDown, 
  CheckCircle, 
  Check, 
  X, 
  Clock, 
  Flame, 
  Trophy, 
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import UserLayout from '../components/layout/UserLayout';
import { 
  AnatomicalMuscleFigure, 
  ExerciseThumbnail, 
  IntensityBars 
} from '../components/dashboard/ExerciseIllustrations';
import { authService } from '../services/authService';

export default function WorkoutPage() {
  const [user, setUser] = useState(null);
  const [planExpanded, setPlanExpanded] = useState(false);
  const [activePlanName, setActivePlanName] = useState("Appu's Fit Plan");

  // Workout Session Tracker Modal State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(1);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Completed sets tracker: { [exerciseIndex]: [set1Done, set2Done, set3Done] }
  const [completedSets, setCompletedSets] = useState({});

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser?.name) {
      setActivePlanName(`${currentUser.name.split(' ')[0]}'s Fit Plan`);
    }
  }, []);

  // Timer during active workout
  useEffect(() => {
    let timer = null;
    if (isSessionActive && !sessionCompleted) {
      timer = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive, sessionCompleted]);

  // Workout exercises matching the reference screenshot exactly
  const workoutSequence = [
    {
      id: 1,
      name: 'Push-up',
      setsReps: '3 sets x 10 reps',
      muscle: 'Chest',
      targetEnum: 'chest',
      intensity: 3,
      percentage: '21%',
      totalSets: 3,
      reps: 10,
      instructions: 'Keep full core tension and elbows at a 45-degree angle. Lower with control and press up firmly.'
    },
    {
      id: 2,
      name: 'Diamond Push-up',
      setsReps: '3 sets x 10 reps',
      muscle: 'Triceps',
      targetEnum: 'triceps',
      intensity: 3,
      percentage: '23%',
      totalSets: 3,
      reps: 10,
      instructions: 'Position thumbs and forefingers touching beneath your chest. Keep elbows tight against your ribs.'
    },
    {
      id: 3,
      name: 'Chest Dip on Bench',
      setsReps: '3 sets x 10 reps',
      muscle: 'Triceps',
      targetEnum: 'triceps',
      intensity: 3,
      percentage: '29%',
      totalSets: 3,
      reps: 10,
      instructions: 'Place palms on bench, keep hips close to edge. Descend to 90 degrees elbow bend, then extend arms.'
    },
    {
      id: 4,
      name: 'Triceps Dip on Floor',
      setsReps: '3 sets x 10 reps',
      muscle: 'Triceps',
      targetEnum: 'triceps',
      intensity: 2,
      percentage: '25%',
      totalSets: 3,
      reps: 10,
      instructions: 'Keep fingertips pointing forward. Lift hips off ground and pulse through the triceps.'
    },
    {
      id: 5,
      name: 'Bench Dip on Floor',
      setsReps: '3 sets x 10 reps',
      muscle: 'Triceps',
      targetEnum: 'triceps',
      intensity: 2,
      percentage: '25%',
      totalSets: 3,
      reps: 10,
      instructions: 'Keep back flat and elevate feet slightly to maximize triceps load.'
    }
  ];

  const handleStartWorkout = () => {
    setIsSessionActive(true);
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(1);
    setSessionSeconds(0);
    setSessionCompleted(false);
    // Initialize completed sets map
    const initial = {};
    workoutSequence.forEach((_, idx) => {
      initial[idx] = [false, false, false];
    });
    setCompletedSets(initial);
  };

  const toggleSetComplete = (exIdx, setIdx) => {
    setCompletedSets(prev => {
      const copy = { ...prev };
      const current = [...(copy[exIdx] || [false, false, false])];
      current[setIdx] = !current[setIdx];
      copy[exIdx] = current;
      return copy;
    });
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workoutSequence.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(1);
    } else {
      setSessionCompleted(true);
    }
  };

  const formatSessionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentExercise = workoutSequence[currentExerciseIndex];

  return (
    <UserLayout>
      <div className="space-y-4 pb-16">

        {/* ======================================================== */}
        {/* A. ACTIVE PLAN CARD (EXACT REFERENCE SCREENSHOT)          */}
        {/* ======================================================== */}
        <div className="bg-[#12162B] border border-white/5 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            {/* Left: Lightning icon + Active Plan Title + Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">
                  Active Plan
                </span>
                <h2 className="text-base font-extrabold text-white">
                  {activePlanName}
                </h2>
              </div>
            </div>

            {/* Right: Plans Button */}
            <button
              onClick={() => alert("Workout Plans: \n1. Keep Fit (2 days/week) [ACTIVE]\n2. Muscle Hypertrophy (4 days/week)\n3. Lean & Tone (3 days/week)")}
              className="bg-[#181E3B] hover:bg-[#20274C] border border-white/15 px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
            >
              <List className="w-3.5 h-3.5" />
              <span>Plans</span>
            </button>
          </div>

          {/* AI COACH INFORMATION BANNER */}
          <div 
            onClick={() => setPlanExpanded(!planExpanded)}
            className="bg-[#18234D]/70 hover:bg-[#18234D] border border-blue-500/20 rounded-2xl px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 overflow-hidden text-xs">
              <span className="text-[#00A3FF] font-extrabold flex items-center gap-1 flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 fill-[#00A3FF]" />
                AI COACH
              </span>
              <span className="text-gray-300 truncate">
                Built from your answers: Keep Fit, 2 da...
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${planExpanded ? 'rotate-180' : ''}`} />
          </div>

          {planExpanded && (
            <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-300 leading-relaxed space-y-1">
              <p>🎯 <strong>Goal:</strong> Maintain functional upper body strength and shoulder stability.</p>
              <p>⏱️ <strong>Frequency:</strong> 2 days per week (Chest & Triceps Focus).</p>
              <p>⚡ <strong>Estimated Duration:</strong> 35-40 minutes.</p>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* B. NEXT WORKOUT SECTION HEADING                          */}
        {/* ======================================================== */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-1">
            <Play className="w-3 h-3 fill-gray-400 text-gray-400" />
            <span>Your next workout</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-white tracking-tight">
              Chest and Triceps
            </h1>

            <div className="flex items-center gap-3 text-gray-400">
              <button
                onClick={() => alert("Chest and Triceps Workout:\nTargeting pectoralis major and triceps brachii through compound push motions.")}
                title="Workout overview"
                className="hover:text-white transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              <button
                onClick={() => alert("Filter / reorder workout exercises enabled.")}
                title="Filter/Reorder"
                className="hover:text-white transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* C. EXERCISE SEQUENCE CARDS (EXACT SCREENSHOT LAYOUT)     */}
        {/* ======================================================== */}
        <div className="space-y-3 pb-24">
          {workoutSequence.map((item) => (
            <div
              key={item.id}
              className="bg-[#101429] border border-white/5 rounded-2xl p-3 flex items-center justify-between shadow-md hover:bg-[#151A36] transition-colors"
            >
              {/* Left Column: Thumbnail + Info */}
              <div className="flex items-center gap-3">
                {/* Exercise illustration on rounded white square */}
                <ExerciseThumbnail name={item.name} className="w-14 h-14" />

                <div>
                  {/* Top indicators: Blue 4-bars + Bulb + List icons */}
                  <div className="flex items-center gap-2 mb-1">
                    <IntensityBars count={item.intensity} />
                    <Lightbulb className="w-3.5 h-3.5 text-[#00A3FF]" />
                    <ListOrdered className="w-3.5 h-3.5 text-[#00A3FF]" />
                  </div>

                  {/* Exercise Title */}
                  <h3 className="text-sm font-extrabold text-white">
                    {item.name}
                  </h3>

                  {/* Sets and reps */}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.setsReps}
                  </p>
                </div>
              </div>

              {/* Right Column: Anatomical Muscle Illustration + Muscle Name + Contribution Badge */}
              <div className="flex flex-col items-center flex-shrink-0 pl-2">
                <span className="text-[11px] font-bold text-gray-300 capitalize mb-0.5">
                  {item.muscle}
                </span>

                {/* Upper Body Anatomical diagram with highlighted muscles */}
                <div className="w-11 h-13 flex items-center justify-center">
                  <AnatomicalMuscleFigure muscle={item.targetEnum} width={42} height={52} />
                </div>

                {/* Contribution Badge (e.g. ∨ 21%, ∨ 23%, ∨ 29%) */}
                <div className="flex items-center text-[#FF3B5C] text-[10px] font-extrabold mt-0.5">
                  <ChevronDown className="w-3 h-3 text-[#FF3B5C]" />
                  <span>{item.percentage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* D. PROMINENT BLUE STICKY ACTION BUTTON: "⚡ Start"       */}
        {/* ======================================================== */}
        <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl flex justify-center pointer-events-auto">
            <button
              onClick={handleStartWorkout}
              className="w-11/12 bg-[#0088FF] hover:bg-[#0074db] active:scale-95 text-white font-black py-4 rounded-2xl shadow-[0_4px_30px_rgba(0,136,255,0.6)] flex items-center justify-center gap-2 text-base tracking-wider uppercase transition-all"
            >
              <Zap className="w-5 h-5 fill-white text-white" />
              <span>Start</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE WORKOUT SESSION PLAYER MODAL                 */}
        {/* ======================================================== */}
        {isSessionActive && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#12162B] border border-blue-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="p-4 bg-[#181E3B] border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-400 uppercase tracking-widest font-black block">
                    Active Workout Session
                  </span>
                  <h3 className="text-base font-black text-white">Chest and Triceps</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-[#090C1A] px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono font-bold text-blue-300">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{formatSessionTime(sessionSeconds)}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("End current workout session?")) {
                        setIsSessionActive(false);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Session Body */}
              {!sessionCompleted ? (
                <div className="p-5 overflow-y-auto space-y-5">
                  {/* Progress Indicators */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Exercise {currentExerciseIndex + 1} of {workoutSequence.length}</span>
                    <span className="text-blue-400 font-bold">{Math.round(((currentExerciseIndex) / workoutSequence.length) * 100)}% Complete</span>
                  </div>

                  <div className="w-full bg-[#181E3B] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-300"
                      style={{ width: `${((currentExerciseIndex) / workoutSequence.length) * 100}%` }}
                    ></div>
                  </div>

                  {/* Current Exercise Spotlight Card */}
                  <div className="bg-[#181E3B] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <ExerciseThumbnail name={currentExercise.name} className="w-16 h-16" />
                      <div>
                        <h4 className="text-lg font-black text-white">{currentExercise.name}</h4>
                        <p className="text-xs text-blue-400 font-semibold">{currentExercise.muscle} Focus</p>
                        <p className="text-[11px] text-gray-400 mt-1">{currentExercise.setsReps}</p>
                      </div>
                    </div>

                    <div className="w-12 h-14 flex items-center justify-center">
                      <AnatomicalMuscleFigure muscle={currentExercise.targetEnum} width={45} height={55} />
                    </div>
                  </div>

                  {/* Form Instructions cue */}
                  <div className="bg-[#0D1022] p-3 rounded-xl border border-white/5 text-xs text-gray-300 leading-relaxed">
                    💡 <strong>Form Cue:</strong> {currentExercise.instructions}
                  </div>

                  {/* Sets Tracker Checklist */}
                  <div className="space-y-2">
                    <h5 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                      Track Sets (3 Sets)
                    </h5>

                    {[0, 1, 2].map((sIndex) => {
                      const isDone = completedSets[currentExerciseIndex]?.[sIndex];
                      return (
                        <div
                          key={sIndex}
                          onClick={() => toggleSetComplete(currentExerciseIndex, sIndex)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isDone 
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                              : 'bg-[#181E3B] border-white/5 text-gray-300 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isDone ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'
                            }`}>
                              {isDone ? <Check className="w-4 h-4" /> : sIndex + 1}
                            </div>
                            <span className="text-xs font-bold">Set {sIndex + 1}: 10 Reps</span>
                          </div>

                          <span className="text-xs font-semibold">
                            {isDone ? 'Completed' : 'Tap to mark done'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation / Next Button */}
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleNextExercise}
                      className="w-full bg-[#0088FF] hover:bg-[#0074db] text-white font-extrabold py-3.5 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <span>
                        {currentExerciseIndex < workoutSequence.length - 1 ? 'Next Exercise' : 'Finish Workout'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Celebration Completed Screen */
                <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                    <Trophy className="w-10 h-10 text-[#090C1A]" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">Workout Complete! 🎉</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Outstanding effort! You crushed Chest and Triceps today.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-[#181E3B] p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Duration</span>
                      <p className="text-base font-black text-white mt-0.5">{formatSessionTime(sessionSeconds)}</p>
                    </div>
                    <div className="bg-[#181E3B] p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Exercises</span>
                      <p className="text-base font-black text-[#00A3FF] mt-0.5">5 Completed</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSessionActive(false)}
                    className="w-full bg-[#00D632] hover:bg-[#00c02c] text-[#071307] font-black py-4 rounded-xl text-sm tracking-wider uppercase transition-colors shadow-lg"
                  >
                    Done & Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </UserLayout>
  );
}
