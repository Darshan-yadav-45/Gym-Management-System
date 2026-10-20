import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Wind, 
  Eye, 
  Flame, 
  Layers, 
  Clock, 
  ChevronRight, 
  Sliders, 
  Camera, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { getExerciseMedia } from '../../data/exerciseMediaData';

/**
 * ExerciseDemonstrationViewer (Exercise3DViewer):
 * Premium Real-Human Exercise Demonstration & Biomechanical Detail Viewer.
 * 
 * Replaces dummy robot/skeletal models with authentic, professional human fitness demonstrations:
 * - Real human video & looped movement demonstrations
 * - Play/Pause, Replay, Playback Speed (0.5x Slow-Mo, 1x Normal, 1.5x, 2x), Mute, Fullscreen
 * - Dual-Phase Form Breakdown (Phase 1 Starting Posture vs Phase 2 Peak Movement)
 * - Complete Biomechanical Guide: Setup, Steps, Breathing, Mistakes, Tempo, Sets/Reps, Safety
 * - Reduced-Motion friendly mode & network fallback handling
 */
export default function Exercise3DViewer({
  exerciseName = 'Push-up',
  muscleGroup = 'Chest',
  equipment = 'No Equipment',
  difficulty = 'Intermediate',
  instructions = '',
  className = ''
}) {
  const media = getExerciseMedia(exerciseName);

  // Player state
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  // Active view tab: 'demonstration' | 'phases' | 'guide'
  const [activeTab, setActiveTab] = useState('demonstration');
  // Dual-phase active phase: 'all' | 'phase1' | 'phase2'
  const [selectedPhase, setSelectedPhase] = useState('all');

  // Determine media source
  const hasVideo = Boolean(media?.videoUrl && !videoError && !reducedMotion);
  const hasAnimation = Boolean(media?.animationUrl && !reducedMotion);
  const hasPhotos = Boolean(media?.startPhoto || media?.peakPhoto);
  const setupInstructions = media.setup || instructions;

  // Synchronize playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    setVideoError(false);
    setImageError(false);
    setVideoProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(Boolean(media.videoUrl));
    setActiveTab('demonstration');
  }, [exerciseName, media.videoUrl]);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = (event) => setReducedMotion(event.matches);
    motionPreference.addEventListener('change', updateMotionPreference);
    return () => motionPreference.removeEventListener('change', updateMotionPreference);
  }, []);

  // Video time update listener
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setCurrentTime(curr);
      setDuration(dur);
      setVideoProgress((curr / dur) * 100);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    if (videoRef.current && duration) {
      videoRef.current.currentTime = pct * duration;
      setVideoProgress(pct * 100);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setVideoError(true));
      }
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setVideoError(true));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`rounded-3xl overflow-hidden border border-white/10 bg-[#0d0f17] text-white shadow-2xl flex flex-col ${className}`}
    >
      {/* ======================================================== */}
      {/* 1. TOP HEADER & NAVIGATION TABS                          */}
      {/* ======================================================== */}
      <div className="bg-[#131622] px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ef233c] to-[#d90429] flex items-center justify-center text-white shadow-md shadow-red-900/40">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ef233c]">
                {media.availabilityMessage ? 'Demonstration Unavailable' : 'Human Exercise Demonstration'}
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/30" />
              <span className="hidden sm:inline-block text-[10px] text-gray-400 font-bold">
                {media.type} • {media.equipment || equipment}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black tracking-tight text-white">
              {media.name}
            </h3>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#090b12] p-1 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('demonstration')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'demonstration'
                ? 'bg-[#ef233c] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Demonstration</span>
          </button>

          <button
            onClick={() => setActiveTab('phases')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'phases'
                ? 'bg-[#ef233c] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Dual-Phase Form</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-[#ef233c] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Info className="w-3 h-3" />
            <span>Guide & Safety</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TAB A: PRIMARY REAL HUMAN DEMONSTRATION VIEWER        */}
      {/* ======================================================== */}
      {activeTab === 'demonstration' && (
        <div className="relative bg-black flex flex-col items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[380px] max-h-[520px]">
          {/* Main Visual Display */}
          <div className="w-full h-full relative flex items-center justify-center bg-[#07090f]">
            {/* Case A: Real Video Clip */}
            {hasVideo ? (
              <video
                ref={videoRef}
                src={media.videoUrl}
                poster={media.poster}
                className="w-full max-h-[460px] object-contain"
                playsInline
                loop
                muted={isMuted}
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setVideoError(true)}
              />
            ) : hasAnimation ? (
              /* Case B: Real Human Looped Exercise Demonstration */
              <div className="w-full h-full flex flex-col items-center justify-center relative p-2">
                <img
                  src={media.animationUrl}
                  alt={`${media.name} Real Human Demonstration`}
                  className="max-h-[420px] w-auto object-contain rounded-2xl shadow-2xl"
                  onError={() => setImageError(true)}
                />
                {!imageError && (
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real Movement Cycle</span>
                  </div>
                )}
              </div>
            ) : hasPhotos && !imageError ? (
              /* Case C: High-Definition Human Photo Demonstration with Form Cues */
              <div className="w-full h-full p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-4 bg-gradient-to-b from-[#0b0e18] to-[#07080d]">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-[340px] shadow-2xl group flex-1">
                  {media.startPhoto ? (
                    <img
                      src={media.startPhoto}
                      alt={`${media.name} Starting Posture`}
                      className="w-full h-full object-cover object-center"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="min-h-48 flex items-center justify-center p-4 text-center text-sm text-gray-400">Starting photo not supplied.</div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                    <span className="text-[10px] uppercase font-black tracking-wider text-yellow-400 block">
                      Phase 1: Starting Posture
                    </span>
                    <p className="text-xs text-gray-200 line-clamp-2 mt-0.5">{media.setup}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center justify-center text-[#ef233c]">
                  <ArrowRight className="w-6 h-6 animate-pulse" />
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-[340px] shadow-2xl group flex-1">
                  {media.peakPhoto ? (
                    <img
                      src={media.peakPhoto}
                      alt={`${media.name} Peak Contraction`}
                      className="w-full h-full object-cover object-center"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="min-h-48 flex items-center justify-center p-4 text-center text-sm text-gray-400">Movement photo not supplied.</div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 block">
                      Phase 2: Full Range & Contraction
                    </span>
                    <p className="text-xs text-gray-200 line-clamp-2 mt-0.5">
                      {media.steps?.[1] || media.steps?.[0] || 'Lower under control to 90 degrees.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full min-h-72 flex flex-col items-center justify-center gap-3 p-6 text-center bg-gradient-to-b from-[#0b0e18] to-[#07080d]">
                <Camera className="w-8 h-8 text-gray-500" />
                <p className="max-w-lg text-sm font-semibold text-gray-200">
                  {media.availabilityMessage || `${media.name} human demonstration media is unavailable.`}
                </p>
                {(setupInstructions || instructions) && (
                  <p className="max-w-lg text-xs leading-relaxed text-gray-400">{setupInstructions || instructions}</p>
                )}
              </div>
            )}

            {/* Form Highlight Floating Cues */}
            <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-none">
              <div className="bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xl">
                <Flame className="w-3.5 h-3.5 text-[#ef233c]" />
                <span className="text-[11px] font-black text-white">
                  Target: {media.muscle}
                </span>
              </div>
            </div>

            {/* Breathing Indicator Pill */}
            <div className="absolute bottom-14 left-3 hidden sm:flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-xl">
              <Wind className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 block font-black leading-none">
                  Breathing Cue
                </span>
                <span className="text-[11px] font-bold text-emerald-200 mt-0.5 block leading-tight">
                  {media.breathing}
                </span>
              </div>
            </div>
          </div>

          {/* Video Timeline Scrubber */}
          {hasVideo && (
            <div 
              onClick={handleSeek}
              className="w-full h-1.5 bg-white/15 hover:h-2.5 transition-all cursor-pointer relative"
              title="Click to seek"
            >
              <div 
                className="h-full bg-gradient-to-r from-[#ef233c] to-[#ff4d6d]"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          )}

          {/* Video controls appear only for playable video assets. */}
          <div className="w-full px-4 py-2.5 bg-[#10121d] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            {hasVideo ? (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-xl bg-[#ef233c] hover:bg-[#d90429] text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>

                  <button
                    onClick={handleReplay}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                    title="Replay from start"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                <span className="text-[11px] font-mono font-bold text-gray-300 ml-1">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                </div>

                <div className="flex items-center gap-1.5 bg-[#090b14] px-2.5 py-1 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Speed:</span>
                  {[0.5, 1.0, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        playbackSpeed === s
                          ? 'bg-[#ef233c] text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={s === 0.5 ? 'Slow-motion form inspection' : `${s}x playback speed`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[11px] text-gray-400">
                {hasAnimation && !imageError
                  ? 'Animated human demonstration'
                  : hasPhotos && !imageError
                    ? 'Exercise-specific human photos'
                    : 'No demonstration media available'}
              </p>
            )}

            {/* Actions: Audio, Reduced Motion & Fullscreen */}
            <div className="flex items-center gap-2">
              {hasVideo && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              )}

              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                  reducedMotion 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                }`}
                title="Respect reduced motion by using still exercise photos when available"
              >
                {reducedMotion ? 'Static Mode Active' : 'Reduced Motion'}
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB B: DUAL-PHASE REAL HUMAN FORM BREAKDOWN            */}
      {/* ======================================================== */}
      {activeTab === 'phases' && (
        <div className="p-4 sm:p-6 bg-[#0f121d] space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] text-[#ef233c] font-black uppercase tracking-wider block">
                Biomechanical Technique
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                Dual-Phase Kinetic Form Breakdown
              </h4>
            </div>

            <div className="flex items-center gap-1.5 bg-[#090b14] p-1 rounded-xl border border-white/5 text-xs">
              <button
                onClick={() => setSelectedPhase('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedPhase === 'all' ? 'bg-[#ef233c] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Comparison
              </button>
              <button
                onClick={() => setSelectedPhase('phase1')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedPhase === 'phase1' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Phase 1 (Start)
              </button>
              <button
                onClick={() => setSelectedPhase('phase2')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedPhase === 'phase2' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Phase 2 (Peak)
              </button>
            </div>
          </div>

          {/* Phase 1 & Phase 2 Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phase 1: Setup & Starting Posture */}
            {(selectedPhase === 'all' || selectedPhase === 'phase1') && (
              <div className="bg-[#141826] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                <div className="relative h-64 bg-black overflow-hidden group">
                  <img
                    src={media.startPhoto}
                    alt={`${media.name} Starting Posture`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                    Phase 1: Setup & Starting Posture
                  </div>
                </div>

                <div className="p-4 space-y-2.5 flex-1">
                  <h5 className="text-xs font-black uppercase text-yellow-400 tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Proper Alignment & Starting Posture
                  </h5>
                  <p className="text-xs text-gray-200 leading-relaxed">{media.setup}</p>

                  <div className="bg-[#0b0d15] p-3 rounded-xl border border-white/5 space-y-1 text-[11px] text-gray-300">
                    <span className="font-bold text-white block">Key Checkpoints:</span>
                    <p>• Spine remains neutral with glutes and core braced.</p>
                    <p>• Scapulae engaged without shrugging toward ears.</p>
                    <p>• Breathing: Take a deep inhalation to stabilize intra-abdominal pressure.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 2: Peak Contraction & Bottom Range */}
            {(selectedPhase === 'all' || selectedPhase === 'phase2') && (
              <div className="bg-[#141826] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                <div className="relative h-64 bg-black overflow-hidden group">
                  <img
                    src={media.peakPhoto}
                    alt={`${media.name} Peak Contraction`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-500 text-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                    Phase 2: Peak Range & Contraction
                  </div>
                </div>

                <div className="p-4 space-y-2.5 flex-1">
                  <h5 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Concentric Execution & Contraction
                  </h5>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {media.steps?.[2] || media.steps?.[1] || 'Reach full depth under 2-second eccentric control.'}
                  </p>

                  <div className="bg-[#0b0d15] p-3 rounded-xl border border-white/5 space-y-1 text-[11px] text-gray-300">
                    <span className="font-bold text-white block">Kinetic Focus:</span>
                    <p>• Primary engagement: {media.muscle} under full stretch and tension.</p>
                    <p>• Elbows maintain safe 45-degree angle rather than flaring laterally.</p>
                    <p>• Drive forcefully through mid-foot/palms to lockout with complete exhalation.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB C: STEP-BY-STEP INSTRUCTIONS & SAFETY GUIDE       */}
      {/* ======================================================== */}
      {activeTab === 'guide' && (
        <div className="p-4 sm:p-6 bg-[#0f121d] space-y-5 animate-in fade-in duration-200 max-h-[500px] overflow-y-auto">
          {/* Header Overview Banner */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/20 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                Biomechanical Technique Standard
              </h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Step-by-step kinetic sequencing verified for maximum hypertrophy, joint longevity, and progressive overload.
              </p>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h5 className="text-xs font-black uppercase text-white tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Step-by-Step Execution
            </h5>
            <div className="space-y-2">
              {media.steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="bg-[#141826] p-3 rounded-xl border border-white/5 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#ef233c]/20 text-[#ff4d6d] border border-[#ef233c]/40 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes to Avoid */}
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
            <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <AlertTriangle className="w-4 h-4" /> Common Form Mistakes to Avoid
            </span>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {media.mistakes.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. BOTTOM SPECIFICATION & SAFETY METRICS BAR             */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 bg-[#0b0d15] border-t border-white/10 space-y-4">
        {/* Core Prescription Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-[#131622] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Difficulty</span>
            <span className="text-xs font-black text-amber-400 mt-0.5 block">{media.difficulty}</span>
          </div>

          <div className="bg-[#131622] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Equipment</span>
            <span className="text-xs font-black text-white mt-0.5 block truncate">{media.equipment}</span>
          </div>

          <div className="bg-[#131622] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Prescription</span>
            <span className="text-xs font-black text-[#ef233c] mt-0.5 block">{media.setsReps}</span>
          </div>

          <div className="bg-[#131622] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Cadence / Tempo</span>
            <span className="text-xs font-black text-emerald-400 mt-0.5 block">{media.tempo}</span>
          </div>
        </div>

        {/* Primary and Secondary Muscle Activation */}
        <div className="bg-[#131622] p-3.5 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Primary Target</span>
            <span className="text-xs font-black text-white mt-0.5 block">{media.muscle}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Secondary Synergists</span>
            <span className="text-xs font-semibold text-gray-300 mt-0.5 block max-w-xs truncate">
              {media.secondaryMuscles}
            </span>
          </div>
        </div>

        {/* Alternatives: Regressions & Progressions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="bg-[#131622] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Easier Alternative (Regression)</span>
            <p className="text-xs font-semibold text-gray-200 mt-0.5">{media.regression}</p>
          </div>
          <div className="bg-[#131622] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Harder Variation (Progression)</span>
            <p className="text-xs font-semibold text-[#ff4d6d] mt-0.5">{media.progression}</p>
          </div>
        </div>

        {/* Safety Tips Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Safety Tip:</strong> {media.safety}
          </p>
        </div>
      </div>
    </div>
  );
}

export { Exercise3DViewer as ExerciseDemonstrationViewer };
