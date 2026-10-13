import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Footprints, 
  Flame, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import UserLayout from '../components/layout/UserLayout';
import { metricsService } from '../services/metricsService';
import { authService } from '../services/authService';

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({
    waterIntakeMl: 1500,
    waterTargetMl: 3000,
    waterRemainingMl: 1500,
    waterProgressPercentage: 50.0,

    stepsCount: 6000,
    stepsTarget: 10000,
    stepsRemaining: 4000,
    stepsProgressPercentage: 60.0,
    distanceKm: 4.68,
    caloriesBurned: 240,

    proteinGrams: 70,
    proteinTargetGrams: 140,
    proteinRemainingGrams: 70,
    proteinProgressPercentage: 50.0,
  });

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'

  // Modal input state
  const [waterUnit, setWaterUnit] = useState('ml'); // 'ml' | 'l'
  const [waterInput, setWaterInput] = useState('');
  const [stepsInput, setStepsInput] = useState('');
  const [proteinInput, setProteinInput] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user and metrics
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadTodayMetrics();
  }, []);

  const loadTodayMetrics = async () => {
    setLoading(true);
    try {
      const data = await metricsService.getTodayMetrics();
      if (data) {
        setMetrics(data);
      }
    } catch (err) {
      console.warn('Could not load today metrics from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const openLogModal = () => {
    setWaterUnit('ml');
    setWaterInput(metrics.waterIntakeMl ? String(metrics.waterIntakeMl) : '0');
    setStepsInput(metrics.stepsCount ? String(metrics.stepsCount) : '0');
    setProteinInput(metrics.proteinGrams ? String(metrics.proteinGrams) : '0');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleUnitToggle = (unit) => {
    if (unit === waterUnit) return;
    if (unit === 'l') {
      const ml = parseFloat(waterInput) || 0;
      setWaterInput((ml / 1000).toFixed(2));
    } else {
      const l = parseFloat(waterInput) || 0;
      setWaterInput(String(Math.round(l * 1000)));
    }
    setWaterUnit(unit);
  };

  const handleQuickAddWater = async (addMl) => {
    try {
      const newWater = (metrics.waterIntakeMl || 0) + addMl;
      const payload = {
        waterIntakeMl: newWater,
        stepsCount: metrics.stepsCount || 0,
        proteinGrams: metrics.proteinGrams || 0
      };
      const saved = await metricsService.logMetrics(payload);
      setMetrics(saved);
      showToast('Data saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save water intake.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    let waterMl = 0;
    if (waterUnit === 'l') {
      const l = parseFloat(waterInput);
      if (isNaN(l) || l < 0) {
        setFormError('Please enter a valid water amount in litres.');
        return;
      }
      waterMl = Math.round(l * 1000);
    } else {
      waterMl = parseInt(waterInput, 10);
      if (isNaN(waterMl) || waterMl < 0) {
        setFormError('Please enter a valid water amount in millilitres.');
        return;
      }
    }

    const steps = parseInt(stepsInput, 10);
    if (isNaN(steps) || steps < 0) {
      setFormError('Please enter a valid non-negative steps count.');
      return;
    }

    const protein = parseInt(proteinInput, 10);
    if (isNaN(protein) || protein < 0) {
      setFormError('Please enter a valid non-negative protein amount in grams.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        waterIntakeMl: waterMl,
        stepsCount: steps,
        proteinGrams: protein
      };
      const response = await metricsService.logMetrics(payload);
      setMetrics(response);
      setIsModalOpen(false);
      showToast('Data saved successfully!', 'success');
    } catch (err) {
      console.error('Error logging metrics:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to save data. Please try again.';
      setFormError(errMsg);
      showToast('Failed to save data. Please check your input.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <UserLayout>
      <div className="space-y-6">
        
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce transition-all">
            <div className={`px-5 py-3 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex items-center gap-3 border ${
              toastType === 'success' 
                ? 'bg-[#00D632] text-[#071307] border-[#52ff7d]' 
                : 'bg-red-600 text-white border-red-400'
            }`}>
              {toastType === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#071307]" />
              ) : (
                <AlertCircle className="w-5 h-5 text-white" />
              )}
              <span className="font-extrabold text-sm">{toastMessage}</span>
            </div>
          </div>
        )}

        {/* HERO / WELCOME GREETING */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Hello, {user?.name ? user.name.split(' ')[0] : 'Athlete'} 👋
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Track your daily water, steps, and protein targets.
            </p>
          </div>

          <button
            onClick={openLogModal}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Today's Data</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* CARD A: WATER TRACKER                                   */}
        {/* ======================================================== */}
        <div className="bg-[#12162B] border border-white/5 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          {/* Subtle water glow background */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold tracking-wide uppercase text-gray-300">Water Tracker</h2>
                <p className="text-xs text-gray-400">Target: {(metrics.waterTargetMl / 1000).toFixed(1)}L (3,000 ml)</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {metrics.waterProgressPercentage?.toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Visual Animated Water Glass Cup */}
            <div className="col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-16 h-24 border-2 border-cyan-400/50 rounded-b-2xl rounded-t-sm overflow-hidden bg-[#0A0D1D] shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]">
                {/* Water Level Fill */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-700 ease-out"
                  style={{ height: `${Math.min(100, metrics.waterProgressPercentage || 0)}%` }}
                >
                  {/* Wave effect */}
                  <div className="w-full h-1.5 bg-white/40 animate-pulse"></div>
                </div>
                {/* Measurement ticks */}
                <div className="absolute inset-0 flex flex-col justify-between py-2 px-1 opacity-40 pointer-events-none">
                  <div className="w-3 border-t border-cyan-200"></div>
                  <div className="w-2 border-t border-cyan-200"></div>
                  <div className="w-3 border-t border-cyan-200"></div>
                  <div className="w-2 border-t border-cyan-200"></div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1.5 font-medium">Daily Glass</span>
            </div>

            {/* Numbers & Stats */}
            <div className="col-span-8 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400">Consumed today:</span>
                <span className="text-lg font-black text-cyan-400">{metrics.waterIntakeMl?.toLocaleString()} <span className="text-xs font-normal text-gray-400">ml</span></span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400">Remaining to drink:</span>
                <span className="text-sm font-bold text-gray-200">{metrics.waterRemainingMl?.toLocaleString()} <span className="text-xs font-normal text-gray-400">ml</span></span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1A203F] h-2.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, metrics.waterProgressPercentage || 0)}%` }}
                ></div>
              </div>

              {/* Quick Add buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleQuickAddWater(250)}
                  className="flex-1 bg-[#1A203F] hover:bg-[#242C57] text-cyan-300 text-[11px] font-bold py-1.5 rounded-lg border border-cyan-500/20 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> 250ml
                </button>
                <button
                  onClick={() => handleQuickAddWater(500)}
                  className="flex-1 bg-[#1A203F] hover:bg-[#242C57] text-cyan-300 text-[11px] font-bold py-1.5 rounded-lg border border-cyan-500/20 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> 500ml
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD B: STEPS TRACKER                                   */}
        {/* ======================================================== */}
        <div className="bg-[#12162B] border border-white/5 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold tracking-wide uppercase text-gray-300">Steps Tracker</h2>
                <p className="text-xs text-gray-400">Target: {metrics.stepsTarget?.toLocaleString()} steps</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
              {metrics.stepsProgressPercentage?.toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Circular Progress Ring */}
            <div className="col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#1A203F"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#0088FF"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={
                      2 * Math.PI * 40 * (1 - Math.min(100, metrics.stepsProgressPercentage || 0) / 100)
                    }
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-black text-white">{metrics.stepsCount?.toLocaleString()}</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">Steps</span>
                </div>
              </div>
            </div>

            {/* Remaining, Distance, Calories */}
            <div className="col-span-7 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400">Remaining steps:</span>
                <span className="text-sm font-bold text-gray-200">{metrics.stepsRemaining?.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-[#181E3B] p-2.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Distance</div>
                  <div className="text-sm font-black text-[#00A3FF] mt-0.5">{metrics.distanceKm?.toFixed(2)} km</div>
                </div>
                <div className="bg-[#181E3B] p-2.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" /> Calories
                  </div>
                  <div className="text-sm font-black text-orange-400 mt-0.5">{metrics.caloriesBurned} kcal</div>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 italic pt-1">
                *Calculated via step estimates (~0.78m stride, ~0.04 kcal/step).
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD C: PROTEIN TRACKER                                 */}
        {/* ======================================================== */}
        <div className="bg-[#12162B] border border-white/5 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold tracking-wide uppercase text-gray-300">Protein Tracker</h2>
                <p className="text-xs text-gray-400">Target: {metrics.proteinTargetGrams} grams</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {metrics.proteinProgressPercentage?.toFixed(0)}%
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-400">Protein consumed:</span>
              <span className="text-lg font-black text-emerald-400">{metrics.proteinGrams} <span className="text-xs font-normal text-gray-400">/ {metrics.proteinTargetGrams}g</span></span>
            </div>

            {/* Macro Progress Bar */}
            <div className="w-full bg-[#1A203F] h-3.5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, metrics.proteinProgressPercentage || 0)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-400 pt-0.5">
              <span>Remaining: <strong className="text-gray-200">{metrics.proteinRemainingGrams}g</strong></span>
              <span>Daily Goal: <strong className="text-emerald-400">{metrics.proteinTargetGrams}g</strong></span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LOG DAILY METRICS BUTTON                                */}
        {/* ======================================================== */}
        <div className="pt-2">
          <button
            onClick={openLogModal}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-[0_4px_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 text-sm tracking-wide transition-all transform active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Update Daily Progress</span>
          </button>
        </div>

        {/* MODAL FORM FOR LOGGING DAILY METRICS */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#12162B] border border-blue-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              
              <div className="p-5 bg-[#181E3B] border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">Log Today's Data</h3>
                  <p className="text-xs text-gray-400">Update your water, steps, and protein</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {formError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Water Intake Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5" /> Water Intake
                    </label>
                    {/* Unit Switcher */}
                    <div className="flex bg-[#0A0D1D] rounded-lg p-0.5 border border-white/10 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => handleUnitToggle('ml')}
                        className={`px-2.5 py-0.5 rounded-md transition-colors ${
                          waterUnit === 'ml' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        ml
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnitToggle('l')}
                        className={`px-2.5 py-0.5 rounded-md transition-colors ${
                          waterUnit === 'l' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Litres
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    step={waterUnit === 'l' ? '0.1' : '1'}
                    value={waterInput}
                    onChange={(e) => setWaterInput(e.target.value)}
                    placeholder={waterUnit === 'ml' ? 'e.g. 1500' : 'e.g. 1.5'}
                    className="w-full bg-[#0A0D1D] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400 focus:outline-none text-sm font-semibold"
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Target: 3,000 ml (3 Litres)
                  </p>
                </div>

                {/* Steps Input */}
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 mb-1.5">
                    <Footprints className="w-3.5 h-3.5" /> Steps Walked
                  </label>
                  <input
                    type="number"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    placeholder="e.g. 6000"
                    className="w-full bg-[#0A0D1D] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-400 focus:outline-none text-sm font-semibold"
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Target: 10,000 steps
                  </p>
                </div>

                {/* Protein Input */}
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Protein Consumed (Grams)
                  </label>
                  <input
                    type="number"
                    value={proteinInput}
                    onChange={(e) => setProteinInput(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full bg-[#0A0D1D] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-emerald-400 focus:outline-none text-sm font-semibold"
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Target: 140 grams
                  </p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-[#181E3B] hover:bg-[#20274C] text-gray-300 font-bold py-3 rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Today's Data</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </UserLayout>
  );
}
