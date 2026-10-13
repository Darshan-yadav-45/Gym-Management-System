import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Target, 
  Trophy, 
  Droplets, 
  Footprints, 
  TrendingUp, 
  LogOut, 
  Edit3, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import UserLayout from '../components/layout/UserLayout';
import { authService } from '../services/authService';
import api from '../services/api';

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // Fetch fresh profile data
    api.get('/users/me')
      .then(res => {
        setProfileData(res.data);
      })
      .catch(err => {
        // Fallback to localStorage user
        setProfileData(currentUser);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSignOut = () => {
    authService.logout();
    navigate('/');
  };

  const displayUser = profileData || user;

  const getSportEmoji = (sport) => {
    const map = {
      'Cricket': '🏏',
      'Football': '⚽',
      'Badminton': '🏸',
      'Basketball': '🏀',
      'Tennis': '🎾',
      'Volleyball': '🏐',
      'Swimming': '🏊',
      'Running': '🏃',
      'Kabaddi': '🤼',
    };
    return map[sport] || '🏅';
  };

  return (
    <UserLayout>
      <div className="space-y-5 pb-12">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Account & Profile</h1>
            <p className="text-xs text-gray-400">Manage your credentials, targets and profile</p>
          </div>

          <button
            onClick={() => navigate('/profile-setup')}
            className="bg-[#181E3B] hover:bg-[#222B52] border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* User Identity Card */}
        <div className="bg-[#12162B] border border-white/5 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00A3FF] to-[#6366F1] flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(0,163,255,0.3)] border-2 border-white/10">
              {displayUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{displayUser?.name || 'Athlete'}</h2>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-gray-500" /> {displayUser?.email}
              </p>
              {displayUser?.phone && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-gray-500" /> {displayUser?.phone}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/5 text-center">
            <div className="bg-[#181E3B] p-2.5 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Age</span>
              <span className="text-xs font-black text-white mt-0.5 block">{displayUser?.age || '--'}</span>
            </div>
            <div className="bg-[#181E3B] p-2.5 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Gender</span>
              <span className="text-xs font-black text-white mt-0.5 block">{displayUser?.gender || '--'}</span>
            </div>
            <div className="bg-[#181E3B] p-2.5 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Height</span>
              <span className="text-xs font-black text-white mt-0.5 block">{displayUser?.heightCm ? `${displayUser.heightCm}cm` : '--'}</span>
            </div>
            <div className="bg-[#181E3B] p-2.5 rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Weight</span>
              <span className="text-xs font-black text-white mt-0.5 block">{displayUser?.weightKg ? `${displayUser.weightKg}kg` : '--'}</span>
            </div>
          </div>
        </div>

        {/* Personal Fitness Targets Card */}
        <div className="bg-[#12162B] border border-white/5 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Personal Daily Fitness Targets
            </h3>
          </div>

          <div className="space-y-2.5">
            {/* Water Target */}
            <div className="bg-[#181E3B] p-3 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Water Target</h4>
                  <p className="text-[10px] text-gray-400">Optimal hydration & electrolyte balance</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-cyan-400">3,000 ml (3L)</span>
            </div>

            {/* Steps Target */}
            <div className="bg-[#181E3B] p-3 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Step Target</h4>
                  <p className="text-[10px] text-gray-400">Baseline NEAT active energy burn</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-blue-400">10,000 Steps</span>
            </div>

            {/* Protein Target */}
            <div className="bg-[#181E3B] p-3 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Protein Target</h4>
                  <p className="text-[10px] text-gray-400">Muscle recovery & hypertrophy synthesis</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-emerald-400">140 Grams</span>
            </div>
          </div>
        </div>

        {/* Location & Sports */}
        {(displayUser?.location || displayUser?.designation || (displayUser?.sports && displayUser.sports.length > 0)) && (
          <div className="bg-[#12162B] border border-white/5 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
              Profile Details
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {displayUser?.location && (
                <div className="bg-[#181E3B] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </span>
                  <span className="text-white font-bold mt-1 block">{displayUser.location}</span>
                </div>
              )}

              {displayUser?.designation && (
                <div className="bg-[#181E3B] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Designation
                  </span>
                  <span className="text-white font-bold mt-1 block">{displayUser.designation}</span>
                </div>
              )}
            </div>

            {displayUser?.sports && displayUser.sports.length > 0 && displayUser.sports[0] !== 'NONE' && (
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-2">Sports Interests</span>
                <div className="flex flex-wrap gap-2">
                  {displayUser.sports.map((sp, i) => (
                    <span key={i} className="bg-[#181E3B] text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-1.5">
                      <span>{getSportEmoji(sp)}</span>
                      <span className="capitalize">{sp.toLowerCase()}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sign Out Button */}
        <div className="pt-2">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-3.5 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </UserLayout>
  );
}
