import React from 'react';
import { 
  Dumbbell, 
  Activity, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  Heart, 
  Zap, 
  Trophy, 
  RotateCcw, 
  Home, 
  Compass 
} from 'lucide-react';

export default function GoalSelection({ data, update, onSelect }) {
  const handleSelect = (goal) => {
    update('goal', goal);
    setTimeout(() => {
      onSelect();
    }, 350);
  };

  const goals = [
    {
      id: 'BUILD_MUSCLE',
      name: 'Muscle Building',
      desc: 'Progressive overload hypertrophy for lean muscular size and definition.',
      icon: Dumbbell,
      color: 'text-amber-400'
    },
    {
      id: 'WEIGHT_LOSS',
      name: 'Weight Loss & Fat Burn',
      desc: 'High-calorie expenditure combining metabolic cardio and strength conditioning.',
      icon: Flame,
      color: 'text-[#ef233c]'
    },
    {
      id: 'WEIGHT_GAIN',
      name: 'Healthy Weight Gain',
      desc: 'Mass-building compound lifting paired with structured caloric surplus education.',
      icon: TrendingUp,
      color: 'text-emerald-400'
    },
    {
      id: 'STRENGTH',
      name: 'Strength & Power',
      desc: 'Maximal neuromuscular powerlifting and raw barbell performance.',
      icon: Zap,
      color: 'text-purple-400'
    },
    {
      id: 'YOGA_FLEXIBILITY',
      name: 'Yoga & Flexibility',
      desc: 'Mindful dynamic Vinyasa flows, postural alignment, and deep joint mobility.',
      icon: Sparkles,
      color: 'text-blue-400'
    },
    {
      id: 'SPORTS_PERFORMANCE',
      name: 'Sports Conditioning',
      desc: 'Agility, sprint acceleration, multi-planar plyometrics, and athletic speed.',
      icon: Trophy,
      color: 'text-yellow-400'
    },
    {
      id: 'GENERAL_FITNESS',
      name: 'General Fitness',
      desc: 'Holistic functional endurance, active lifestyle, and balanced conditioning.',
      icon: Activity,
      color: 'text-cyan-400'
    },
    {
      id: 'HOME_FITNESS',
      name: 'Home & Calisthenics',
      desc: 'Zero-equipment bodyweight mastery, functional core, and bodyweight agility.',
      icon: Home,
      color: 'text-teal-400'
    },
    {
      id: 'MOBILITY_RECOVERY',
      name: 'Mobility & Recovery',
      desc: 'Myofascial release, joint decompression, restorative stretching, and longevity.',
      icon: RotateCcw,
      color: 'text-indigo-400'
    }
  ];

  return (
    <div className="w-full flex flex-col items-center max-w-4xl mx-auto px-4">
      <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-white mb-2 text-center">
        What's your primary <span className="text-[#ef233c]">fitness goal?</span>
      </h1>
      <p className="text-gray-400 text-xs sm:text-sm font-medium mb-8 text-center max-w-lg">
        FitFlow calibrates your 3D exercise sequence, rep tempos, and AI coaching cues around your chosen objective.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
        {goals.map((g) => {
          const Icon = g.icon;
          const isSelected = data.goal === g.id;
          return (
            <div
              key={g.id}
              onClick={() => handleSelect(g.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#ef233c]/15 border-[#ef233c] shadow-[0_4px_20px_rgba(239,35,60,0.3)] scale-[1.02]'
                  : 'bg-[#14151b] border-white/5 hover:border-white/20 hover:bg-[#181920]'
              }`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                  <Icon className={`w-5 h-5 ${g.color}`} />
                </div>
                <h3 className="text-sm font-black uppercase text-white mb-1 tracking-wide">{g.name}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">{g.desc}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-bold">
                <span className={isSelected ? 'text-[#ef233c]' : 'text-gray-500'}>
                  {isSelected ? '✓ Selected' : 'Select Goal'}
                </span>
                <span className="text-gray-500 uppercase tracking-wider">FitFlow Plan</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
