import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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
        // Since trainer portal UI is separate, we'll just mock this for now
        // Normally this would hit a specific /auth/trainer/login or just use role check
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#060913] text-white font-sans flex flex-col items-center justify-center p-8 relative">
            <div className="absolute top-8 left-8">
                <Link to="/" className="text-2xl font-black font-display tracking-[0.2em] text-white">
                    FIT<span className="text-gym-accent">FLOW</span>
                </Link>
            </div>

            <div className="w-full max-w-md bg-[#151A2C] border border-gym-accent/30 p-10 rounded-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gym-accent/10 rounded-bl-full pointer-events-none"></div>
                
                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-gym-accent/20 flex items-center justify-center rounded-full mx-auto mb-4 border border-gym-accent/50">
                        <span className="text-2xl">💪</span>
                    </div>
                    <h1 className="text-3xl font-display font-black uppercase tracking-widest mb-2">Trainer Portal</h1>
                    <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Manage your clients and schedule</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Trainer ID / Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-[#0A0D18] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gym-accent transition-colors"
                            placeholder="TRAINER@FITFLOW.COM"
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
                            className="w-full bg-[#0A0D18] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gym-accent transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-transparent border-2 border-gym-accent text-gym-accent hover:bg-gym-accent hover:text-white py-4 rounded-lg uppercase tracking-[0.2em] font-bold text-sm transition-all duration-300 mt-8"
                    >
                        Access Portal
                    </button>
                </form>

                <p className="mt-8 text-center text-xs uppercase tracking-widest text-gray-500 font-bold">
                    Not a trainer? <Link to="/login" className="text-white hover:text-gym-accent transition-colors">Member Login</Link>
                </p>
            </div>
        </div>
    );
}
