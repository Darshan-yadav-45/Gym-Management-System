import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      
      setSuccessMsg(response.message || 'Account created successfully! Redirecting to setup your athletic profile...');
      
      setTimeout(() => {
        navigate('/profile-setup');
      }, 1200);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.';
      const msg = typeof errorMessage === 'string' ? errorMessage : 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans flex flex-col md:flex-row selection:bg-[#ef233c] selection:text-white">
      {/* Left side: Hero Photography & Branding */}
      <div className="md:w-1/2 relative hidden md:block">
        <div 
          className="absolute inset-0 bg-cover bg-center contrast-125"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1400&auto=format&fit=crop')" }}
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
            START TODAY
          </div>
          <h2 className="text-5xl font-display font-black uppercase tracking-tight leading-none mb-4 text-white">
            YOUR STRONGEST <br/>VERSION <span className="text-[#ef233c]">STARTS HERE.</span>
          </h2>
          <p className="text-gray-300 tracking-wider text-xs uppercase leading-relaxed font-semibold">
            Join thousands of athletes transforming their physical conditioning with realistic 3D exercise form and dedicated AI coaches.
          </p>
        </div>
      </div>

      {/* Right side: Registration Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16 relative bg-[#0b0c10]">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 md:hidden">
          <Link to="/" className="text-2xl font-black font-display tracking-[0.15em] text-white">
            FIT<span className="text-[#ef233c] font-bold italic">FLOW</span>
          </Link>
        </div>

        <div className="w-full max-w-md mt-16 md:mt-0">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-2">
              NEW MEMBERSHIP
            </div>
            <h1 className="text-4xl font-display font-black uppercase tracking-tight text-white mb-2">Create Account</h1>
            <p className="text-gray-400 text-xs">Register to start your personal training plan & select your AI coach</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#ef233c]/15 border border-[#ef233c]/40 text-white rounded-xl text-xs font-semibold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#ef233c] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#14151b] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#14151b] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#14151b] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-sm"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#14151b] border border-white/10 rounded-xl pl-9 pr-9 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-xs"
                    placeholder="Min 6 chars"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-1.5">Confirm</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-[#14151b] border border-white/10 rounded-xl pl-9 pr-9 py-3 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-xs"
                    placeholder="Re-type"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 pt-1">
              * A confirmation welcome email will be dispatched to your email address upon registration.
            </p>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ef233c] hover:bg-[#d90429] text-white py-4 rounded-full uppercase tracking-widest font-bold text-xs transition-all duration-300 mt-4 flex justify-center items-center gap-2 shadow-[0_4px_20px_rgba(239,35,60,0.4)] hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Already have an account? <Link to="/login" className="text-[#ef233c] hover:text-white transition-colors ml-1 font-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
