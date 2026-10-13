import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Dashboard() {
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

    return (
        <div className="min-h-screen bg-[#060913] text-white font-sans p-8 flex justify-center">
            <div className="w-full max-w-md">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">Good morning, {user.name.split(' ')[0]} 👋</h1>
                    <p className="text-gray-400">Ready to crush your goals?</p>
                </div>

                {/* Today's Workout */}
                <div className="bg-[#1C2136] rounded-2xl p-6 mb-8 border border-gray-800">
                    <h2 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">Today's Workout</h2>
                    <h3 className="text-2xl font-bold mb-2">Full Body Beginner</h3>
                    <div className="flex gap-4 text-gray-400 mb-6 text-sm">
                        <span>07:00 AM</span>
                        <span>•</span>
                        <span>45 min</span>
                    </div>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg">
                        Start Workout
                    </button>
                </div>

                {/* Today's Schedule */}
                <div className="mb-8">
                    <h2 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">Today's Schedule</h2>
                    <div className="space-y-3">
                        <div className="bg-[#151A2C] rounded-xl p-4 flex justify-between items-center border border-gray-800/50">
                            <span className="font-semibold">Workout</span>
                            <span className="text-blue-400">Pending</span>
                        </div>
                        <div className="bg-[#151A2C] rounded-xl p-4 flex justify-between items-center border border-gray-800/50">
                            <span className="font-semibold">Water</span>
                            <span className="text-blue-400">0 / 2L</span>
                        </div>
                        <div className="bg-[#151A2C] rounded-xl p-4 flex justify-between items-center border border-gray-800/50">
                            <span className="font-semibold">Trainer Session</span>
                            <span className="text-gray-500">None</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-[#151A2C] p-4 rounded-xl text-center hover:bg-[#1C2136] transition-colors border border-gray-800/50">
                            <div className="font-semibold">Workout</div>
                        </button>
                        <button className="bg-[#151A2C] p-4 rounded-xl text-center hover:bg-[#1C2136] transition-colors border border-gray-800/50">
                            <div className="font-semibold">Water</div>
                        </button>
                        <button className="bg-[#151A2C] p-4 rounded-xl text-center hover:bg-[#1C2136] transition-colors border border-gray-800/50">
                            <div className="font-semibold">Trainer</div>
                        </button>
                        <button className="bg-[#151A2C] p-4 rounded-xl text-center hover:bg-[#1C2136] transition-colors border border-gray-800/50">
                            <div className="font-semibold">Progress</div>
                        </button>
                        <button onClick={() => navigate('/profile')} className="bg-[#151A2C] p-4 rounded-xl text-center hover:bg-[#1C2136] transition-colors border border-gray-800/50">
                            <div className="font-semibold text-gym-accent">Profile</div>
                        </button>
                    </div>
                </div>
                
                {/* Logout */}
                <div className="mt-12 text-center">
                    <button 
                        onClick={() => { authService.logout(); navigate('/'); }}
                        className="text-gray-500 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
