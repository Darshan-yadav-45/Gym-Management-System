import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
        }
    }, [navigate]);

    if (!user) return <div className="min-h-screen bg-[#060913] text-white flex justify-center items-center">Loading...</div>;

    const getSportIcon = (sport) => {
        const icons = {
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
        return icons[sport] || '🏅';
    };

    return (
        <div className="min-h-screen bg-[#060913] text-white font-sans p-8 flex justify-center items-start pt-12">
            <div className="w-full max-w-md">
                
                <div className="flex justify-between items-center mb-8">
                    <Link to="/dashboard" className="text-gym-accent font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
                        ← Back
                    </Link>
                    <h1 className="text-2xl font-display font-bold uppercase tracking-widest">My Profile</h1>
                    <div className="w-12"></div> {/* Spacer for centering */}
                </div>

                <div className="bg-[#1C2136] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gym-accent/10 rounded-bl-full pointer-events-none"></div>
                    
                    <div className="flex flex-col items-center mb-8 relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-tr from-gym-accent to-[#ff7a59] rounded-full flex items-center justify-center text-4xl font-bold shadow-[0_0_20px_rgba(255,87,34,0.3)] mb-4 border-4 border-[#060913]">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#151A2C] rounded-xl p-4 border border-white/5">
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Phone</label>
                            <div className="font-medium text-lg">{user.phone || 'Not provided'}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#151A2C] rounded-xl p-4 border border-white/5">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Age</label>
                                <div className="font-medium text-lg">{user.age || '--'}</div>
                            </div>
                            <div className="bg-[#151A2C] rounded-xl p-4 border border-white/5">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Gender</label>
                                <div className="font-medium text-lg">{user.gender || '--'}</div>
                            </div>
                            <div className="bg-[#151A2C] rounded-xl p-4 border border-white/5">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Height</label>
                                <div className="font-medium text-lg">{user.heightCm ? `${user.heightCm} cm` : '--'}</div>
                            </div>
                            <div className="bg-[#151A2C] rounded-xl p-4 border border-white/5">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Weight</label>
                                <div className="font-medium text-lg">{user.weightKg ? `${user.weightKg} kg` : '--'}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#151A2C] rounded-xl p-4 border border-white/5">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Location</label>
                                <div className="font-medium text-lg truncate">{user.location || '--'}</div>
                            </div>
                            <div className="bg-[#151A2C] rounded-xl p-4 border border-white/5">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Designation</label>
                                <div className="font-medium text-lg truncate">{user.designation || '--'}</div>
                            </div>
                        </div>

                        {user.sports && user.sports.length > 0 && user.sports[0] !== 'NONE' && (
                            <div className="bg-[#151A2C] rounded-xl p-4 border border-white/5">
                                <label className="block text-xs uppercase tracking-widest font-bold text-gray-500 mb-3">Sports</label>
                                <div className="flex flex-wrap gap-2">
                                    {user.sports.map(sport => (
                                        <div key={sport} className="bg-[#0A0D18] px-3 py-1.5 rounded-lg text-sm border border-white/5 flex items-center gap-2">
                                            <span>{getSportIcon(sport.charAt(0).toUpperCase() + sport.slice(1).toLowerCase())}</span>
                                            <span className="capitalize">{sport.toLowerCase()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={() => navigate('/profile-setup')}
                            className="w-full bg-transparent border-2 border-gym-accent text-gym-accent hover:bg-gym-accent hover:text-white py-4 rounded-xl uppercase tracking-[0.2em] font-bold text-sm transition-all duration-300 mt-4"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
