import React from 'react';
import { 
  RotateCcw, 
  Activity, 
  Moon, 
  Droplets, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import UserLayout from '../components/layout/UserLayout';

export default function RecoverPage() {
  const muscleRecoveryStatus = [
    { muscle: 'Chest (Pectorals)', status: 'Recovering', percentage: 70, color: 'text-yellow-400', bg: 'bg-yellow-400' },
    { muscle: 'Triceps Brachii', status: 'Fatigued', percentage: 45, color: 'text-red-400', bg: 'bg-red-400' },
    { muscle: 'Quadriceps', status: 'Fully Recovered', percentage: 100, color: 'text-emerald-400', bg: 'bg-emerald-400' },
    { muscle: 'Back & Lats', status: 'Optimal', percentage: 95, color: 'text-emerald-400', bg: 'bg-emerald-400' },
    { muscle: 'Deltoids & Shoulders', status: 'Recovering', percentage: 80, color: 'text-yellow-400', bg: 'bg-yellow-400' }
  ];

  return (
    <UserLayout>
      <div className="space-y-4 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Recovery & Sleep</h1>
            <p className="text-xs text-gray-400">Track muscular readiness and recovery protocols</p>
          </div>

          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>Ready to Train</span>
          </div>
        </div>

        {/* Readiness Score Card */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Overall Readiness Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white">82</span>
                <span className="text-xs font-bold text-emerald-400">/ 100 (High Readiness)</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Your body is well-rested. Recommended focus: Upper body recovery or active mobility drills.
              </p>
            </div>

            {/* Circular Ring */}
            <div className="w-20 h-20 flex-shrink-0 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#1A203F" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - 0.82)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-black text-white">82%</span>
            </div>
          </div>
        </div>

        {/* Muscle Recovery Map */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Muscle Soreness & Recovery Map
            </h3>
            <span className="text-[11px] text-gray-400">Last updated: Today</span>
          </div>

          <div className="space-y-3">
            {muscleRecoveryStatus.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-300">{item.muscle}</span>
                  <span className={item.color}>{item.status} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-[#1A203F] h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.bg} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep & Hydration Protocol Card */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#14151b] border border-white/5 rounded-3xl p-4 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2.5">
              <Moon className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Sleep Quality</h4>
            <p className="text-lg font-black text-indigo-400 mt-1">7h 45m</p>
            <p className="text-[10px] text-gray-400 mt-1">92% Restorative REM sleep</p>
          </div>

          <div className="bg-[#14151b] border border-white/5 rounded-3xl p-4 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2.5">
              <Droplets className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Hydration Index</h4>
            <p className="text-lg font-black text-cyan-400 mt-1">3.0 Litres</p>
            <p className="text-[10px] text-gray-400 mt-1">Optimal cellular recovery</p>
          </div>
        </div>

        {/* Recovery Protocols list */}
        <div className="bg-[#14151b] border border-white/5 rounded-3xl p-5 shadow-xl space-y-3">
          <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
            Today's Recovery Protocols
          </h3>

          <div className="space-y-2 text-xs">
            <div className="bg-[#181920] p-3 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-200">Upper body chest and doorway stretch (5 min)</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Done</span>
            </div>

            <div className="bg-[#181920] p-3 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-200">Hydrate with 500ml water post-workout</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Done</span>
            </div>

            <div className="bg-[#181920] p-3 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-200">Triceps foam rolling & lacrosse ball release</span>
              </div>
              <span className="text-[10px] text-blue-400 font-bold">Recommended</span>
            </div>
          </div>
        </div>

      </div>
    </UserLayout>
  );
}
