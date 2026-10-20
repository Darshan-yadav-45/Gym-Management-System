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
  ChevronRight,
  ShieldCheck,
  Info,
  Filter
} from 'lucide-react';
import UserLayout from '../components/layout/UserLayout';
import { 
  AnatomicalMuscleFigure, 
  ExerciseThumbnail, 
  IntensityBars 
} from '../components/dashboard/ExerciseIllustrations';
import Exercise3DViewer from '../components/dashboard/Exercise3DViewer';
import { authService } from '../services/authService';
import { coachService } from '../services/coachService';
import { metricsService } from '../services/metricsService';
import api from '../services/api';

export default function WorkoutPage() {
  const [user, setUser] = useState(null);
  const [planExpanded, setPlanExpanded] = useState(false);
  const [activePlanName, setActivePlanName] = useState("FitFlow Performance Plan");
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  // Modals state
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Available plans to switch
  const availablePlans = [
    { id: 'keep-fit', name: 'Keep Fit (2 days/week)', goal: 'Maintain upper body strength & posture', duration: '35 mins' },
    { id: 'hypertrophy', name: 'Muscle Hypertrophy (4 days/week)', goal: 'High-volume progressive overload', duration: '50 mins' },
    { id: 'lean-tone', name: 'Lean & Tone (3 days/week)', goal: 'Metabolic circuits & fat shred', duration: '40 mins' },
    { id: 'strength-power', name: 'Strength & Power (4 days/week)', goal: 'Heavy compound barbell focus', duration: '55 mins' }
  ];

  // Workout Session Tracker Modal State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [selected3DExercise, setSelected3DExercise] = useState(null);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);

  // Completed sets tracker: { [exerciseIndex]: [set1Done, set2Done, set3Done] }
  const [completedSets, setCompletedSets] = useState({});

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser?.name) {
      setActivePlanName(`${currentUser.name.split(' ')[0]}'s Fit Plan`);
    }

    // Load user's selected coach from backend
    coachService.getMyCoach()
      .then(coach => {
        if (coach) setSelectedCoach(coach);
      })
      .catch(err => console.log('No active coach preference yet:', err));

    // Load workout history from backend
    api.get('/progress/me')
      .then(res => {
        if (res.data) setWorkoutHistory(res.data);
      })
      .catch(err => console.log('Could not load workout history:', err));
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

  // Rest Timer countdown during active workout
  useEffect(() => {
    let interval = null;
    if (isSessionActive && isRestTimerActive && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (restSecondsLeft === 0 && isRestTimerActive) {
      setIsRestTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, isRestTimerActive, restSecondsLeft]);

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
    setSessionSeconds(0);
    setSessionCompleted(false);
    setIsRestTimerActive(false);
    setRestSecondsLeft(60);
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
      const willBeDone = !current[setIdx];
      current[setIdx] = willBeDone;
      copy[exIdx] = current;
      if (willBeDone) {
        setRestSecondsLeft(60);
        setIsRestTimerActive(true);
      }
      return copy;
    });
  };

  const handleFinishWorkout = async () => {
    setSessionCompleted(true);
    setIsRestTimerActive(false);
    try {
      const bodyNote = `Completed workout: ${activePlanName} (${workoutSequence.length} exercises)`;
      const res = await api.post('/progress', {
        weightKg: 70.0,
        bodyNote,
        workoutsCompleted: 1
      });
      if (res.data) {
        setWorkoutHistory(prev => [res.data, ...prev]);
      }
    } catch (err) {
      console.log('Error saving workout progress:', err);
    }
  };

  const handleNextExercise = () => {
    setIsRestTimerActive(false);
    setRestSecondsLeft(60);
    if (currentExerciseIndex < workoutSequence.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      handleFinishWorkout();
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
        {/* A. ACTIVE PLAN CARD (WITH AI COACH PROFILE)             */}
        {/* ======================================================== */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            {/* Left: Lightning icon + Active Plan Title + Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ef233c] to-[#d90429] text-white flex items-center justify-center shadow-[0_0_15px_rgba(239,35,60,0.4)]">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
                  Active Plan
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  {activePlanName}
                </h2>
              </div>
            </div>

            {/* Right: Plans & Coach Badges */}
            <div className="flex items-center gap-2">
              {selectedCoach && (
                <div className="hidden sm:flex items-center gap-1.5 bg-[#ef233c]/10 border border-[#ef233c]/30 px-3 py-1 rounded-full text-xs text-[#ff4d6d] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#ef233c] animate-pulse" />
                  <span>Coach: {selectedCoach.displayName}</span>
                </div>
              )}

              <button
                onClick={() => setPlansModalOpen(true)}
                className="bg-[#181920] hover:bg-[#20212b] border border-white/15 px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                <List className="w-3.5 h-3.5 text-[#ef233c]" />
                <span>Plans</span>
              </button>
            </div>
          </div>

          {/* AI COACH INFORMATION BANNER */}
          <div 
            onClick={() => setPlanExpanded(!planExpanded)}
            className="bg-[#181924] hover:bg-[#1f2030] border border-white/10 hover:border-[#ef233c]/40 rounded-2xl px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 overflow-hidden text-xs">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-tr from-[#ef233c] to-[#b7094c] flex-shrink-0 flex items-center justify-center text-white font-black text-xs shadow-sm">
                {selectedCoach?.avatarUrl ? (
                  <img src={selectedCoach.avatarUrl} alt={selectedCoach.displayName} className="w-full h-full object-cover" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
                )}
              </div>
              <div className="overflow-hidden">
                <span className="text-[#ef233c] font-extrabold block">
                  {selectedCoach ? `AI COACH ${selectedCoach.displayName}` : 'AI COACH'}
                </span>
                <span className="text-gray-300 text-[11px] truncate block">
                  {selectedCoach ? selectedCoach.specialization : 'Built from your answers: Chest & Triceps, 3 sets x 10 reps'}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${planExpanded ? 'rotate-180' : ''}`} />
          </div>

          {planExpanded && (
            <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-300 leading-relaxed space-y-1.5 animate-in fade-in duration-200">
              <p>🎯 <strong>Goal:</strong> Maintain functional upper body strength and shoulder stability.</p>
              <p>⏱️ <strong>Frequency:</strong> 2 days per week (Chest & Triceps Focus).</p>
              <p>⚡ <strong>Estimated Duration:</strong> 35-40 minutes.</p>
              {selectedCoach && (
                <p className="text-[#ff4d6d] text-[11px] pt-1 border-t border-white/5">
                  💡 <em>Coaching Style:</em> {selectedCoach.coachingStyle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* B. NEXT WORKOUT SECTION HEADING                          */}
        {/* ======================================================== */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-1">
            <Play className="w-3 h-3 fill-[#ef233c] text-[#ef233c]" />
            <span>Your next workout</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              Chest and Triceps
            </h1>

            <div className="flex items-center gap-3 text-gray-400">
              <button
                onClick={() => setHelpModalOpen(true)}
                title="Workout overview and guidance"
                className="hover:text-white transition-colors cursor-pointer"
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              <button
                onClick={() => setFilterModalOpen(true)}
                title="Workout preferences & intensity"
                className="hover:text-white transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* C. EXERCISE SEQUENCE CARDS WITH 3D DEMONSTRATION         */}
        {/* ======================================================== */}
        <div className="space-y-3 pb-8">
          {workoutSequence.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected3DExercise(item)}
              className="bg-[#14151b] border border-white/5 rounded-2xl p-3 flex items-center justify-between shadow-md hover:border-[#ef233c]/40 transition-all cursor-pointer group"
            >
              {/* Left Column: Thumbnail + Info */}
              <div className="flex items-center gap-3">
                <ExerciseThumbnail name={item.name} className="w-14 h-14" />

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <IntensityBars count={item.intensity} />
                    <Lightbulb className="w-3.5 h-3.5 text-[#ef233c]" />
                    <ListOrdered className="w-3.5 h-3.5 text-gray-400" />
                  </div>

                  <h3 className="text-sm font-extrabold text-white group-hover:text-[#ef233c] transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.setsReps}
                  </p>
                </div>
              </div>

              {/* Right Column: Anatomical Muscle + 3D Launch Action */}
              <div className="flex flex-col items-center flex-shrink-0 pl-2 gap-1.5">
                <span className="text-[11px] font-bold text-gray-300 capitalize">
                  {item.muscle}
                </span>

                <div className="w-11 h-13 flex items-center justify-center">
                  <AnatomicalMuscleFigure muscle={item.targetEnum} width={42} height={52} />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected3DExercise(item);
                  }}
                  className="bg-[#ef233c]/15 hover:bg-[#ef233c] text-[#ff4d6d] hover:text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                  title="Watch Human Exercise Demonstration"
                >
                  <Play className="w-2.5 h-2.5 fill-current" /> Watch Demo
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* RECENT SAVED WORKOUT SESSIONS (FROM POSTGRESQL DB)       */}
        {/* ======================================================== */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 shadow-xl space-y-3 mb-24">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Saved Workout History</span>
            </h3>
            <span className="text-xs text-[#ef233c] font-bold">Live PostgreSQL Sync</span>
          </div>

          {workoutHistory.length === 0 ? (
            <p className="text-xs text-gray-400 py-3">No recorded workouts yet. Tap "Start Workout" below to complete your first session!</p>
          ) : (
            <div className="space-y-2">
              {workoutHistory.slice(0, 3).map((w, idx) => (
                <div key={idx} className="bg-[#181922] p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{w.bodyNote || 'Chest & Triceps Workout'}</span>
                    <span className="text-[10px] text-gray-400">
                      {w.recordedAt ? new Date(w.recordedAt).toLocaleDateString() : 'Today'} • Weight: {w.weightKg || 70} kg
                    </span>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    Completed ✓
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* D. PROMINENT CRIMSON STICKY ACTION BUTTON: "⚡ Start"    */}
        {/* ======================================================== */}
        <div className="fixed bottom-20 md:bottom-8 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl flex justify-center pointer-events-auto">
            <button
              onClick={handleStartWorkout}
              className="w-11/12 bg-[#ef233c] hover:bg-[#d90429] active:scale-95 text-white font-black py-4 rounded-full shadow-[0_4px_25px_rgba(239,35,60,0.55)] flex items-center justify-center gap-2 text-base tracking-wider uppercase transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-white text-white" />
              <span>Start Workout</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3D DEMONSTRATION POPUP MODAL                             */}
        {/* ======================================================== */}
        {selected3DExercise && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0e111e] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-[#14182b] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ExerciseThumbnail name={selected3DExercise.name} className="w-10 h-10" />
                  <div>
                    <h3 className="text-base font-black text-white">{selected3DExercise.name}</h3>
                    <p className="text-xs text-[#ef233c] font-semibold">{selected3DExercise.muscle} Focus • {selected3DExercise.setsReps}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected3DExercise(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <Exercise3DViewer
                  exerciseName={selected3DExercise.name}
                  muscleGroup={selected3DExercise.muscle}
                  instructions={selected3DExercise.instructions}
                />
              </div>

              <div className="p-4 bg-[#14182b] border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelected3DExercise(null)}
                  className="px-6 py-2 bg-[#ef233c] hover:bg-[#d90429] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
                >
                  Close Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PLANS MODAL (SWITCH WORKOUT PLAN)                        */}
        {/* ======================================================== */}
        {plansModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#14151b] border border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-[#ef233c]" />
                  <h3 className="text-lg font-bold font-display uppercase text-white">Select Workout Plan</h3>
                </div>
                <button onClick={() => setPlansModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {availablePlans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActivePlanName(p.name);
                      setPlansModalOpen(false);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      activePlanName.includes(p.name.split(' ')[0])
                        ? 'bg-[#ef233c]/15 border-[#ef233c] text-white'
                        : 'bg-[#181920] border-white/5 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">{p.duration}</span>
                    </div>
                    <p className="text-xs text-gray-400">{p.goal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKOUT OVERVIEW / HELP MODAL                            */}
        {/* ======================================================== */}
        {helpModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#14151b] border border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#ef233c]" />
                  <h3 className="text-lg font-bold font-display uppercase text-white">Chest & Triceps Guide</h3>
                </div>
                <button onClick={() => setHelpModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <p><strong>Target Muscles:</strong> Pectoralis major (sternal & clavicular heads), anterior deltoid, and triceps brachii.</p>
                <p><strong>Warm-Up:</strong> 3-5 minutes dynamic arm swings, shoulder dislocates, and 1 set of 10 gentle incline push-ups.</p>
                <p><strong>Rest Intervals:</strong> 60 to 90 seconds between sets to optimize ATP replenishment.</p>
                <p><strong>Execution Tip:</strong> Emphasize deep stretch at the bottom of push-ups and complete lockout of the triceps at the top.</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-right">
                <button
                  onClick={() => setHelpModalOpen(false)}
                  className="bg-[#ef233c] hover:bg-[#d90429] text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKOUT PREFERENCES / FILTER MODAL                       */}
        {/* ======================================================== */}
        {filterModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#14151b] border border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#ef233c]" />
                  <h3 className="text-lg font-bold font-display uppercase text-white">Workout Preferences</h3>
                </div>
                <button onClick={() => setFilterModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-gray-300">
                <div>
                  <label className="font-bold text-white block mb-1.5">Rest Timer Notification</label>
                  <select className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white">
                    <option>60 Seconds (Hypertrophy)</option>
                    <option>90 Seconds (Strength)</option>
                    <option>45 Seconds (Metabolic)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-white block mb-1.5">Audio Coaching Cues</label>
                  <select className="w-full bg-[#181920] border border-white/10 rounded-xl px-3 py-2 text-white">
                    <option>Voice Guidance (AI Coach)</option>
                    <option>Beep Alerts Only</option>
                    <option>Muted</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-right">
                <button
                  onClick={() => setFilterModalOpen(false)}
                  className="bg-[#ef233c] hover:bg-[#d90429] text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* INTERACTIVE WORKOUT SESSION PLAYER MODAL WITH 3D VIEWER   */}
        {/* ======================================================== */}
        {isSessionActive && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#14151b] border border-[#ef233c]/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
              
              {/* Header */}
              <div className="p-4 bg-[#181920] border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#ef233c] uppercase tracking-widest font-black block">
                    Active Workout Session
                  </span>
                  <h3 className="text-base font-black text-white">{currentExercise.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-[#090C1A] px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono font-bold text-white">
                    <Clock className="w-3.5 h-3.5 text-[#ef233c]" />
                    <span>{formatSessionTime(sessionSeconds)}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("End current workout session?")) {
                        setIsSessionActive(false);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Session Body */}
              {!sessionCompleted ? (
                <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                  {/* Progress Indicators */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Exercise {currentExerciseIndex + 1} of {workoutSequence.length}</span>
                    <span className="text-[#ef233c] font-bold">{Math.round(((currentExerciseIndex) / workoutSequence.length) * 100)}% Complete</span>
                  </div>

                  <div className="w-full bg-[#181920] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#ef233c] h-full transition-all duration-300"
                      style={{ width: `${((currentExerciseIndex) / workoutSequence.length) * 100}%` }}
                    ></div>
                  </div>

                  {/* 3D Human Exercise Demonstration embedded directly in Session */}
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <Exercise3DViewer
                      exerciseName={currentExercise.name}
                      muscleGroup={currentExercise.muscle}
                      equipment="No Equipment"
                      instructions={currentExercise.instructions}
                    />
                  </div>

                  {/* Current Exercise Spotlight Card */}
                  <div className="bg-[#181920] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <ExerciseThumbnail name={currentExercise.name} className="w-16 h-16" />
                      <div>
                        <h4 className="text-lg font-black text-white">{currentExercise.name}</h4>
                        <p className="text-xs text-[#ef233c] font-semibold">{currentExercise.muscle} Focus</p>
                        <p className="text-[11px] text-gray-400 mt-1">{currentExercise.setsReps}</p>
                      </div>
                    </div>

                    <div className="w-12 h-14 flex items-center justify-center">
                      <AnatomicalMuscleFigure muscle={currentExercise.targetEnum} width={45} height={55} />
                    </div>
                  </div>

                  {/* Form Instructions cue */}
                  <div className="bg-[#181924] p-3 rounded-xl border border-white/5 text-xs text-gray-300 leading-relaxed">
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
                              ? 'bg-[#ef233c]/20 border-[#ef233c] text-white shadow-sm' 
                              : 'bg-[#181920] border-white/5 text-gray-300 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isDone ? 'bg-[#ef233c] text-white' : 'bg-white/10 text-white'
                            }`}>
                              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : sIndex + 1}
                            </div>
                            <span className="text-xs font-bold">Set {sIndex + 1}: 10 Reps</span>
                          </div>

                          <span className="text-xs font-semibold">
                            {isDone ? 'Completed ✓' : 'Tap to mark done'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Rest Timer Card */}
                  {isRestTimerActive ? (
                    <div className="bg-gradient-to-r from-amber-500/20 via-red-500/20 to-amber-500/20 border border-amber-500/40 p-3.5 rounded-2xl flex items-center justify-between animate-in fade-in duration-200 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                          <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">Rest Period Active</span>
                          <span className="text-sm font-black text-white font-mono">{restSecondsLeft}s remaining</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRestSecondsLeft(prev => prev + 15)}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                          title="Add 15 seconds"
                        >
                          +15s
                        </button>
                        <button
                          onClick={() => setIsRestTimerActive(false)}
                          className="px-3 py-1 bg-[#ef233c] hover:bg-[#d90429] text-white rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Skip Rest
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 text-[11px] text-gray-400">
                      <span>Prescribed rest interval: <strong>60 seconds</strong></span>
                      <button
                        onClick={() => {
                          setRestSecondsLeft(60);
                          setIsRestTimerActive(true);
                        }}
                        className="text-[#ef233c] hover:underline font-bold cursor-pointer"
                      >
                        Start 60s Rest Timer
                      </button>
                    </div>
                  )}

                  {/* Next Exercise Preview */}
                  {currentExerciseIndex < workoutSequence.length - 1 && (
                    <div className="bg-[#181920] p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Next Exercise:</span>
                        <span className="text-xs font-black text-white">{workoutSequence[currentExerciseIndex + 1].name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">• {workoutSequence[currentExerciseIndex + 1].setsReps}</span>
                      </div>
                      <ExerciseThumbnail name={workoutSequence[currentExerciseIndex + 1].name} className="w-9 h-9" />
                    </div>
                  )}

                  {/* Navigation / Next Button */}
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleNextExercise}
                      className="w-full bg-[#ef233c] hover:bg-[#d90429] text-white font-black py-3.5 rounded-xl text-sm shadow-[0_4px_20px_rgba(239,35,60,0.5)] flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer uppercase tracking-wider"
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
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef233c] to-[#d90429] mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(239,35,60,0.6)]">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white">Workout Complete! 🎉</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Outstanding effort! You crushed Chest and Triceps today.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-[#181920] p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Duration</span>
                      <p className="text-base font-black text-white mt-0.5">{formatSessionTime(sessionSeconds)}</p>
                    </div>
                    <div className="bg-[#181920] p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Exercises</span>
                      <p className="text-base font-black text-[#ef233c] mt-0.5">5 Completed</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSessionActive(false)}
                    className="w-full bg-[#ef233c] hover:bg-[#d90429] text-white font-black py-4 rounded-xl text-sm tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
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
