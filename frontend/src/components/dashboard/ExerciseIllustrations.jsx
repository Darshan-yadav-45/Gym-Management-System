import React, { useState } from 'react';
import { Dumbbell, Activity, User, Play } from 'lucide-react';
import { getExerciseMedia } from '../../data/exerciseMediaData';

/**
 * ExerciseThumbnail:
 * Displays genuine, realistic photography of real humans performing the exercise.
 * Replaces stick-figure / robot wireframes with authentic fitness photography.
 */
export function ExerciseThumbnail({ name = 'Push-up', className = 'w-14 h-14' }) {
  const [imgError, setImgError] = useState(false);
  const media = getExerciseMedia(name);
  const photoUrl = media?.thumbnail || media?.startPhoto;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-[#181922] border border-white/10 flex-shrink-0 shadow-md group ${className}`}
      title={`${name} demonstration`}
    >
      {!imgError && photoUrl ? (
        <img
          src={photoUrl}
          alt={`${name} human demonstration`}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#1b1e2e] to-[#252a40] text-gray-400 p-1"
          title={`No exercise-specific photo is available for ${name}`}
        >
          <Dumbbell className="w-5 h-5 text-[#ef233c]" />
          <span className="text-[9px] font-bold text-gray-300 truncate max-w-full px-1">
            Photo needed
          </span>
        </div>
      )}

      {(media?.videoUrl || media?.animationUrl) && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center pointer-events-none">
            <Play className="w-2 h-2 fill-white text-white ml-0.5" />
          </div>
        </>
      )}
    </div>
  );
}

/**
 * AnatomicalMuscleFigure:
 * Clean, modern muscle target indicator badge.
 * Highlights the primary physiological group without dummy robot mannequins.
 */
export function AnatomicalMuscleFigure({ muscle = 'chest', width = 48, height = 56, className = '' }) {
  const norm = (muscle || '').toLowerCase();
  
  // Color palette per muscle group for quick visual recognition
  const getBadgeStyle = () => {
    if (norm.includes('chest')) return { label: 'Chest', code: 'PEC', color: 'from-rose-500/20 to-red-600/30 border-red-500/40 text-[#ff4d6d]' };
    if (norm.includes('tricep')) return { label: 'Triceps', code: 'TRI', color: 'from-amber-500/20 to-orange-600/30 border-amber-500/40 text-amber-400' };
    if (norm.includes('quad') || norm.includes('leg')) return { label: 'Quads', code: 'QUAD', color: 'from-blue-500/20 to-indigo-600/30 border-blue-500/40 text-blue-400' };
    if (norm.includes('back') || norm.includes('lat') || norm.includes('trap')) return { label: 'Back', code: 'LATS', color: 'from-cyan-500/20 to-teal-600/30 border-cyan-500/40 text-cyan-300' };
    if (norm.includes('ab') || norm.includes('core')) return { label: 'Core', code: 'ABS', color: 'from-emerald-500/20 to-green-600/30 border-emerald-500/40 text-emerald-400' };
    if (norm.includes('bicep')) return { label: 'Biceps', code: 'BI', color: 'from-purple-500/20 to-violet-600/30 border-purple-500/40 text-purple-400' };
    if (norm.includes('shoulder')) return { label: 'Shoulders', code: 'DELT', color: 'from-fuchsia-500/20 to-pink-600/30 border-fuchsia-500/40 text-fuchsia-300' };
    return { label: muscle, code: 'MUSCLE', color: 'from-red-500/20 to-red-600/30 border-red-500/40 text-[#ff4d6d]' };
  };

  const style = getBadgeStyle();

  return (
    <div 
      className={`rounded-xl border bg-gradient-to-b ${style.color} flex flex-col items-center justify-center p-1 shadow-sm ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      title={`Target: ${style.label}`}
    >
      <Activity className="w-3.5 h-3.5 mb-0.5 opacity-90" />
      <span className="text-[10px] font-black uppercase tracking-wider block leading-tight">
        {style.code}
      </span>
      <span className="text-[8px] opacity-75 font-semibold leading-none">
        Target
      </span>
    </div>
  );
}

/**
 * 4-Bar Intensity/Difficulty indicator
 */
export function IntensityBars({ count = 3, total = 4 }) {
  return (
    <div className="flex items-center gap-1" title={`Difficulty: ${count} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-3.5 rounded-sm transition-colors ${
            i < count ? 'bg-[#ef233c]' : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}

export default ExerciseThumbnail;
