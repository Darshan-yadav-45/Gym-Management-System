import React from 'react';

// Anatomical Upper Body Figure with highlighted target muscles (Chest or Triceps)
export function AnatomicalMuscleFigure({ muscle = 'chest', width = 64, height = 76, className = '' }) {
  const isTriceps = muscle.toLowerCase().includes('tricep');

  if (isTriceps) {
    // Back view showing upper back, shoulders, spine, and highlighted triceps (arms)
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${className}`}
      >
        <defs>
          <radialGradient id="tricepsGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="100%" stopColor="#C9184A" />
          </radialGradient>
          <linearGradient id="backSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="darkShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Head / Neck from behind */}
        <ellipse cx="50" cy="16" rx="9" ry="12" fill="url(#backSilver)" />
        <path d="M44 26 C44 26, 42 34, 40 38 L60 38 C58 34, 56 26, 56 26 Z" fill="url(#darkShade)" />

        {/* Trapezius & Spine (Upper back) */}
        <path d="M40 38 C45 35, 55 35, 60 38 C68 42, 74 46, 75 52 C68 56, 58 58, 50 62 C42 58, 32 56, 25 52 C26 46, 32 42, 40 38 Z" fill="url(#backSilver)" stroke="#334155" strokeWidth="0.8" />
        <line x1="50" y1="38" x2="50" y2="85" stroke="#334155" strokeWidth="1.2" strokeDasharray="2 1" />

        {/* Rhomboids & Lats */}
        <path d="M33 53 C41 57, 50 61, 50 78 C38 74, 30 68, 27 58 Z" fill="url(#backSilver)" opacity="0.9" />
        <path d="M67 53 C59 57, 50 61, 50 78 C62 74, 70 68, 73 58 Z" fill="url(#backSilver)" opacity="0.9" />

        {/* Rear Deltoids (Shoulders) */}
        <path d="M25 46 C21 48, 17 54, 18 62 C22 62, 26 56, 28 50 Z" fill="url(#backSilver)" stroke="#475569" strokeWidth="0.5" />
        <path d="M75 46 C79 48, 83 54, 82 62 C78 62, 74 56, 72 50 Z" fill="url(#backSilver)" stroke="#475569" strokeWidth="0.5" />

        {/* HIGHLIGHTED TRICEPS - Left Arm (Lateral & Long head) */}
        <path
          d="M17 57 C15 62, 14 74, 16 82 C18 84, 21 82, 23 76 C24 70, 23 62, 22 57 Z"
          fill="url(#tricepsGlow)"
          stroke="#FF0040"
          strokeWidth="1.2"
        />
        <path d="M19 62 C18 68, 19 75, 20 78" stroke="#FFA8B8" strokeWidth="0.8" strokeLinecap="round" />

        {/* HIGHLIGHTED TRICEPS - Right Arm (Lateral & Long head) */}
        <path
          d="M83 57 C85 62, 86 74, 84 82 C82 84, 79 82, 77 76 C76 70, 77 62, 78 57 Z"
          fill="url(#tricepsGlow)"
          stroke="#FF0040"
          strokeWidth="1.2"
        />
        <path d="M81 62 C82 68, 81 75, 80 78" stroke="#FFA8B8" strokeWidth="0.8" strokeLinecap="round" />

        {/* Forearms & Lower body silhouette */}
        <path d="M16 82 C15 88, 14 96, 13 104 C15 106, 18 104, 19 98 C20 92, 19 86, 18 82 Z" fill="url(#backSilver)" opacity="0.8" />
        <path d="M84 82 C85 88, 86 96, 87 104 C85 106, 82 104, 81 98 C80 92, 81 86, 82 82 Z" fill="url(#backSilver)" opacity="0.8" />
        <path d="M36 82 C44 85, 56 85, 64 82 C62 94, 58 106, 50 114 C42 106, 38 94, 36 82 Z" fill="url(#darkShade)" />
      </svg>
    );
  }

  // Front view showing pectorals (Chest) highlighted in vibrant red-pink
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${className}`}
    >
      <defs>
        <radialGradient id="chestGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF4D6D" />
          <stop offset="100%" stopColor="#C9184A" />
        </radialGradient>
        <linearGradient id="frontSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="torsoDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      {/* Head / Neck */}
      <ellipse cx="50" cy="16" rx="9" ry="12" fill="url(#frontSilver)" />
      <path d="M43 26 C43 26, 42 34, 40 37 L60 37 C58 34, 57 26, 57 26 Z" fill="url(#torsoDark)" />

      {/* Clavicles & Shoulders (Deltoids) */}
      <path d="M38 37 C44 38, 56 38, 62 37" stroke="#334155" strokeWidth="1" />
      <path d="M26 44 C21 47, 18 54, 20 62 C24 61, 28 54, 30 48 Z" fill="url(#frontSilver)" stroke="#475569" strokeWidth="0.5" />
      <path d="M74 44 C79 47, 82 54, 80 62 C76 61, 72 54, 70 48 Z" fill="url(#frontSilver)" stroke="#475569" strokeWidth="0.5" />

      {/* HIGHLIGHTED PECTORALS (CHEST) - Left & Right Pecs */}
      {/* Left Pec */}
      <path
        d="M31 43 C38 41, 48 42, 49 46 C50 54, 48 62, 46 64 C38 66, 30 62, 28 54 C28 48, 30 44, 31 43 Z"
        fill="url(#chestGlow)"
        stroke="#FF0040"
        strokeWidth="1.2"
      />
      <path d="M34 48 C38 48, 44 51, 46 55" stroke="#FFA8B8" strokeWidth="0.8" strokeLinecap="round" />

      {/* Right Pec */}
      <path
        d="M69 43 C62 41, 52 42, 51 46 C50 54, 52 62, 54 64 C62 66, 70 62, 72 54 C72 48, 70 44, 69 43 Z"
        fill="url(#chestGlow)"
        stroke="#FF0040"
        strokeWidth="1.2"
      />
      <path d="M66 48 C62 48, 56 51, 54 55" stroke="#FFA8B8" strokeWidth="0.8" strokeLinecap="round" />

      {/* Sternum divider */}
      <line x1="50" y1="42" x2="50" y2="64" stroke="#881337" strokeWidth="1.2" />

      {/* Biceps / Arms */}
      <path d="M20 62 C18 68, 17 76, 18 82 C21 83, 24 78, 25 72 C26 67, 24 63, 20 62 Z" fill="url(#frontSilver)" />
      <path d="M80 62 C82 68, 83 76, 82 82 C79 83, 76 78, 75 72 C74 67, 76 63, 80 62 Z" fill="url(#frontSilver)" />

      {/* Abdominals (Six pack) */}
      <path d="M38 66 C42 66, 48 67, 49 67 L49 75 C45 75, 40 74, 38 73 Z" fill="url(#frontSilver)" opacity="0.8" />
      <path d="M62 66 C58 66, 52 67, 51 67 L51 75 C55 75, 60 74, 62 73 Z" fill="url(#frontSilver)" opacity="0.8" />
      <path d="M39 76 C43 76, 48 77, 49 77 L49 85 C45 85, 41 84, 39 83 Z" fill="url(#frontSilver)" opacity="0.8" />
      <path d="M61 76 C57 76, 52 77, 51 77 L51 85 C55 85, 59 84, 61 83 Z" fill="url(#frontSilver)" opacity="0.8" />

      {/* Waist / Hips */}
      <path d="M36 86 C44 89, 56 89, 64 86 C62 96, 57 106, 50 114 C43 106, 38 96, 36 86 Z" fill="url(#torsoDark)" />
    </svg>
  );
}

// Exercise Thumbnail Illustrations on rounded white background
export function ExerciseThumbnail({ name = 'Push-up', className = 'w-14 h-14' }) {
  const norm = name.toLowerCase();

  // White container styling
  const containerClass = `bg-white rounded-xl flex items-center justify-center p-1 shadow-md border border-gray-100 flex-shrink-0 ${className}`;

  if (norm.includes('diamond')) {
    // Diamond push up
    return (
      <div className={containerClass}>
        <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
          <ellipse cx="64" cy="30" rx="6" ry="7" fill="#1E293B" />
          {/* Torso angled down */}
          <path d="M60 34 L36 46 L24 49" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
          {/* Diamond Hands on floor */}
          <path d="M46 41 L44 56 L47 57" stroke="#FF4D6D" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="46,55 49,58 44,58" fill="#FF4D6D" />
          {/* Legs straight */}
          <path d="M24 49 L14 55 L12 56" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
          {/* Red highlighted triceps indicator */}
          <circle cx="45" cy="48" r="4.5" fill="#FF4D6D" opacity="0.85" />
          <line x1="8" y1="58" x2="72" y2="58" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (norm.includes('bench') && norm.includes('dip')) {
    // Chest/Triceps dip on bench
    return (
      <div className={containerClass}>
        <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
          {/* Bench */}
          <rect x="12" y="44" width="22" height="6" rx="2" fill="#334155" />
          <line x1="16" y1="50" x2="16" y2="62" stroke="#475569" strokeWidth="3" />
          <line x1="30" y1="50" x2="30" y2="62" stroke="#475569" strokeWidth="3" />
          {/* Person head */}
          <ellipse cx="33" cy="24" rx="6" ry="7" fill="#1E293B" />
          {/* Torso upright */}
          <path d="M33 30 L34 46" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
          {/* Arm holding bench behind */}
          <path d="M33 33 L24 40 L24 45" stroke="#FF4D6D" strokeWidth="4" strokeLinecap="round" />
          <circle cx="24" cy="39" r="4" fill="#FF4D6D" opacity="0.9" />
          {/* Legs bent or extended in front */}
          <path d="M34 46 L48 50 L56 62" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="10" y1="62" x2="70" y2="62" stroke="#E2E8F0" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  if (norm.includes('floor') && norm.includes('dip')) {
    // Triceps dip on floor
    return (
      <div className={containerClass}>
        <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
          <ellipse cx="30" cy="26" rx="6" ry="7" fill="#1E293B" />
          {/* Torso */}
          <path d="M30 32 L34 48" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
          {/* Arms behind on floor */}
          <path d="M32 34 L22 42 L22 56" stroke="#FF4D6D" strokeWidth="4" strokeLinecap="round" />
          <circle cx="22" cy="42" r="4" fill="#FF4D6D" opacity="0.9" />
          {/* Legs bent knees up */}
          <path d="M34 48 L48 44 L54 56" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="58" x2="68" y2="58" stroke="#E2E8F0" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  if (norm.includes('dumbbell') || norm.includes('press') || norm.includes('bench press')) {
    // Dumbbell Bench Press
    return (
      <div className={containerClass}>
        <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
          {/* Gym bench */}
          <rect x="18" y="44" width="44" height="6" rx="2" fill="#334155" />
          <line x1="24" y1="50" x2="24" y2="62" stroke="#475569" strokeWidth="3" />
          <line x1="56" y1="50" x2="56" y2="62" stroke="#475569" strokeWidth="3" />
          {/* Person lying on bench */}
          <ellipse cx="24" cy="40" rx="5" ry="6" fill="#1E293B" />
          <path d="M28 42 L52 42" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
          {/* Arms pressing up with dumbbells */}
          <path d="M38 42 L37 28" stroke="#FF4D6D" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M46 42 L47 28" stroke="#FF4D6D" strokeWidth="3.5" strokeLinecap="round" />
          {/* Dumbbells in hands */}
          <rect x="33" y="25" width="8" height="4" rx="1" fill="#0284C7" />
          <rect x="43" y="25" width="8" height="4" rx="1" fill="#0284C7" />
          {/* Chest highlight */}
          <circle cx="42" cy="41" r="4.5" fill="#FF4D6D" opacity="0.85" />
          {/* Bent legs on floor */}
          <path d="M52 42 L58 48 L58 58" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="12" y1="62" x2="68" y2="62" stroke="#E2E8F0" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // Default: Push-up illustration
  return (
    <div className={containerClass}>
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
        <ellipse cx="64" cy="32" rx="6" ry="7" fill="#1E293B" />
        {/* Torso straight plank */}
        <path d="M60 36 L36 44 L22 48" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
        {/* Arms bent holding ground */}
        <path d="M46 39 L46 54 L44 55" stroke="#FF4D6D" strokeWidth="3.5" strokeLinecap="round" />
        {/* Chest area glowing red */}
        <ellipse cx="48" cy="42" rx="5" ry="4" fill="#FF4D6D" opacity="0.85" />
        {/* Feet on floor */}
        <path d="M22 48 L14 53 L12 55" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
        {/* Ground line */}
        <line x1="8" y1="56" x2="72" y2="56" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// 4-Bar Intensity/Difficulty indicator
export function IntensityBars({ count = 3, total = 4 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-3.5 rounded-sm ${
            i < count ? 'bg-[#0088FF]' : 'bg-[#1E293B]'
          }`}
        />
      ))}
    </div>
  );
}
