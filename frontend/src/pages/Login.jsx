import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(formData);
      window.alert("Login successful");
      if (!response.profileCompleted) {
        navigate('/profile-setup');
      } else {
        navigate('/dashboard'); // Changed to /dashboard instead of /onboarding
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Login failed. Please check credentials.';
      const msg = typeof errorMessage === 'string' ? errorMessage : 'Login failed. Please check credentials.';
      setError(msg);
      window.alert(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gym-darker text-white font-sans flex flex-col md:flex-row">
      {/* Left side: Image/Branding */}
      <div className="md:w-1/2 relative hidden md:block">
        <div 
          className="absolute inset-0 bg-cover bg-center contrast-125"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gym-accent/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gym-darker/80 to-transparent"></div>
        
        <div className="absolute top-12 left-12">
          <Link to="/" className="text-3xl font-black font-display tracking-[0.2em] text-white">
            FIT<span className="text-gym-accent">FLOW</span>
          </Link>
        </div>
        
        <div className="absolute bottom-20 left-12 right-12">
          <h2 className="text-5xl font-display font-bold uppercase leading-tight mb-4 text-white shadow-black drop-shadow-lg">
            WELCOME BACK. <br/>KEEP <span className="text-gym-accent">PUSHING.</span>
          </h2>
          <p className="text-gray-300 tracking-widest uppercase text-sm font-bold shadow-black drop-shadow-md">Log in to track your progress and access your plan.</p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-20 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 md:hidden">
          <Link to="/" className="text-2xl font-black font-display tracking-[0.2em] text-white">
            FIT<span className="text-gym-accent">FLOW</span>
          </Link>
        </div>

        <div className="w-full max-w-md mt-16 md:mt-0">
          <div className="mb-10">
            <h1 className="text-4xl font-display font-bold uppercase mb-2">Login</h1>
            <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Welcome back to FitFlow</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-100 rounded-lg text-sm font-medium flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-white/20 pb-2 text-white focus:outline-none focus:border-gym-accent transition-colors"
                placeholder="JOHN@EXAMPLE.COM"
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
                className="w-full bg-transparent border-b-2 border-white/20 pb-2 text-white focus:outline-none focus:border-gym-accent transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gym-accent text-white py-4 uppercase tracking-[0.2em] font-bold text-sm hover:bg-white hover:text-gym-darker transition-colors duration-300 mt-8 flex justify-center items-center gap-2"
            >
              Sign In <ChevronRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs uppercase tracking-widest text-gray-400 font-bold">
            Don't have an account? <Link to="/register" className="text-gym-accent hover:text-white transition-colors">Join Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
