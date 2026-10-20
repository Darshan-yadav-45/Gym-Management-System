import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(formData);
      if (response.user?.role === 'ADMIN') {
        navigate('/admin');
      } else if (!response.profileCompleted) {
        navigate('/profile-setup');
      } else {
        navigate('/dashboard/routines');
      }
    } catch (err) {
      let msg = 'Login failed. Please check credentials.';
      if (!err.response) {
        msg = 'Cannot connect to backend server. Please verify Spring Boot is running on port 8080.';
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      } else if (typeof err.response.data === 'string') {
        msg = err.response.data;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans flex flex-col md:flex-row selection:bg-[#ef233c] selection:text-white">
      {/* Left side: Hero Photography & Brand Imagery */}
      <div className="md:w-1/2 relative hidden md:block">
        <div 
          className="absolute inset-0 bg-cover bg-center contrast-125"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1400&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-[#0b0c10]" />
        
        <div className="absolute top-12 left-12">
          <Link to="/" className="text-3xl font-black font-display tracking-[0.15em] text-white">
            FIT<span className="text-[#ef233c] font-bold italic">FLOW</span>
          </Link>
        </div>
        
        <div className="absolute bottom-20 left-12 right-12 max-w-lg">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-3">
            ATHLETE ACCESS
          </div>
          <h2 className="text-5xl font-display font-black uppercase tracking-tight leading-none mb-4 text-white">
            TRAIN THE <br/><span className="text-[#ef233c]">CHAMPION IN YOU.</span>
          </h2>
          <p className="text-gray-300 tracking-wider text-xs uppercase leading-relaxed font-semibold">
            Log in to access your customized workout routines, interactive 3D exercise demonstrations, and personal AI coach.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-20 relative bg-[#0b0c10]">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 md:hidden">
          <Link to="/" className="text-2xl font-black font-display tracking-[0.15em] text-white">
            FIT<span className="text-[#ef233c] font-bold italic">FLOW</span>
          </Link>
        </div>

        <div className="w-full max-w-md mt-16 md:mt-0">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-2">
              WELCOME BACK
            </div>
            <h1 className="text-4xl font-display font-black uppercase tracking-tight text-white mb-2">Member Login</h1>
            <p className="text-gray-400 text-xs">Enter your credentials to access your FitFlow training portal</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#ef233c]/15 border border-[#ef233c]/40 text-white rounded-xl text-xs font-semibold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#ef233c] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#14151b] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-sm"
                  placeholder="athlete@fitflow.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#14151b] border border-white/10 rounded-xl pl-11 pr-11 py-3.5 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Seed Accounts: member@fitflow.com / appu12813@gmail.com</span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ef233c] hover:bg-[#d90429] text-white py-4 rounded-full uppercase tracking-widest font-bold text-xs transition-all duration-300 mt-6 flex justify-center items-center gap-2 shadow-[0_4px_20px_rgba(239,35,60,0.4)] hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Don't have an account? <Link to="/register" className="text-[#ef233c] hover:text-white transition-colors ml-1 font-bold">Join Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
