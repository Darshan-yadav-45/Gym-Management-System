import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ListChecks, 
  Play, 
  Flame, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  ChevronRight,
  Zap,
  Sparkles
} from 'lucide-react';
import UserLayout from '../components/layout/UserLayout';

export default function RoutinesPage() {
  const navigate = useNavigate();
  const [activeRoutineId, setActiveRoutineId] = useState(1);

  const routines = [
    {
      id: 1,
      name: 'Chest and Triceps Blitz',
      description: 'High hypertrophy push routine focusing on pectorals and triceps brachii.',
      daysPerWeek: '2 days/week',
      duration: '35-40 min',
      difficulty: 'Intermediate',
      exercisesCount: 5,
      exercises: ['Push-up', 'Diamond Push-up', 'Chest Dip on Bench', 'Triceps Dip on Floor', 'Bench Dip on Floor']
    },
    {
      id: 2,
      name: 'Full Body Beginner',
      description: 'Foundational strength routine engaging core, legs, and upper body.',
      daysPerWeek: '3 days/week',
      duration: '45 min',
      difficulty: 'Beginner',
      exercisesCount: 6,
      exercises: ['Bodyweight Squats', 'Push-ups', 'Plank', 'Glute Bridges', 'Lunges', 'Dumbbell Curls']
    },
    {
      id: 3,
      name: 'Back and Biceps Power',
      description: 'Posterior chain strength and lat hypertrophy with vertical & horizontal pulling.',
      daysPerWeek: '2 days/week',
      duration: '40 min',
      difficulty: 'Intermediate',
      exercisesCount: 5,
      exercises: ['Lat Pulldowns', 'Barbell Rows', 'Dumbbell Bicep Curls', 'Hammer Curls', 'Face Pulls']
    },
    {
      id: 4,
      name: 'Legs and Core Blast',
      description: 'Quadriceps, hamstrings, and rotational core stability circuit.',
      daysPerWeek: '2 days/week',
      duration: '40 min',
      difficulty: 'Advanced',
      exercisesCount: 5,
      exercises: ['Leg Press', 'Walking Lunges', 'Romanian Deadlifts', 'Hanging Leg Raises', 'Plank Hold']
    }
  ];

  return (
    <UserLayout>
      <div className="space-y-4 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Workout Routines</h1>
            <p className="text-xs text-gray-400">Choose your training split or routine schedule</p>
          </div>

          <button
            onClick={() => alert("Custom routine builder opened!")}
            className="bg-[#181E3B] hover:bg-[#222B52] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Create</span>
          </button>
        </div>

        {/* Routines List */}
        <div className="space-y-3.5">
          {routines.map((routine) => {
            const isActive = routine.id === activeRoutineId;

            return (
              <div
                key={routine.id}
                className={`rounded-3xl p-4.5 border transition-all ${
                  isActive 
                    ? 'bg-[#12162B] border-blue-500/50 shadow-[0_4px_25px_rgba(0,136,255,0.25)]' 
                    : 'bg-[#101429] border-white/5 hover:bg-[#141936]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{routine.name}</span>
                    {isActive && (
                      <span className="bg-blue-500/20 text-[#00A3FF] border border-blue-500/40 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> ACTIVE
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-gray-400">{routine.daysPerWeek}</span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  {routine.description}
                </p>

                {/* Exercise Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {routine.exercises.map((ex, i) => (
                    <span key={i} className="bg-[#0A0D1D] text-gray-300 text-[10px] font-medium px-2 py-1 rounded-lg border border-white/5">
                      {ex}
                    </span>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-400" /> {routine.duration}</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> {routine.difficulty}</span>
                  </div>

                  {isActive ? (
                    <button
                      onClick={() => navigate('/dashboard/workout')}
                      className="bg-[#0088FF] hover:bg-[#0074db] text-white font-black px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs shadow-md active:scale-95 transition-all"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Start Workout</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveRoutineId(routine.id)}
                      className="text-xs font-bold text-gray-300 hover:text-white bg-[#181E3B] px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                    >
                      Set as Active
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </UserLayout>
  );
}
