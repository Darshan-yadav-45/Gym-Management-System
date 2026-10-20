import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Dumbbell } from 'lucide-react';

export default function TrainerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans flex flex-col items-center justify-center p-6 relative selection:bg-[#ef233c] selection:text-white">
      <div className="absolute top-8 left-8">
        <Link to="/" className="text-2xl sm:text-3xl font-black font-display tracking-[0.15em] text-white">
          FIT<span className="text-[#ef233c] font-bold italic">FLOW</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#14151b] border border-white/10 p-8 sm:p-10 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-[#ef233c]/15 text-[#ef233c] flex items-center justify-center rounded-full mx-auto mb-4 border border-[#ef233c]/30 shadow-md">
            <Dumbbell className="w-7 h-7" />
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-1">
            STAFF ACCESS
          </div>
          <h1 className="text-3xl font-display font-black uppercase tracking-tight text-white mb-2">Trainer Portal</h1>
          <p className="text-gray-400 text-xs">Manage your athlete rosters, schedule, and custom workouts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Trainer ID / Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-sm"
              placeholder="trainer@fitflowgym.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#ef233c] hover:bg-[#d90429] text-white py-4 rounded-full uppercase tracking-widest font-bold text-xs transition-all duration-300 mt-6 shadow-[0_4px_20px_rgba(239,35,60,0.4)] hover:-translate-y-0.5"
          >
            Access Portal
          </button>
        </form>

        <p className="mt-8 text-center text-xs uppercase tracking-wider text-gray-400 font-semibold">
          Not a trainer? <Link to="/login" className="text-[#ef233c] hover:text-white transition-colors ml-1 font-bold">Member Login</Link>
        </p>
      </div>
    </div>
  );
}
