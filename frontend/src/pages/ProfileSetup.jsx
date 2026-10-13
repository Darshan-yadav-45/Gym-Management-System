import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { profileService } from '../services/profileService';

export default function ProfileSetup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        heightCm: '',
        weightKg: '',
        location: '',
        designation: '',
        sports: []
    });
    const [customDesignation, setCustomDesignation] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const designations = [
        'Student', 'Software Developer', 'Employee', 'Business Owner',
        'Teacher', 'Freelancer', 'Athlete', 'Homemaker', 'Other'
    ];

    const allSports = [
        'Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis',
        'Volleyball', 'Swimming', 'Running', 'Kabaddi', 'Other', 'None'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSportToggle = (sport) => {
        if (sport === 'None') {
            setFormData({ ...formData, sports: ['None'] });
            return;
        }
        
        let newSports = [...formData.sports].filter(s => s !== 'None');
        if (newSports.includes(sport)) {
            newSports = newSports.filter(s => s !== sport);
        } else {
            newSports.push(sport);
        }
        setFormData({ ...formData, sports: newSports });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.age && formData.age <= 0) {
            setError('Age must be a valid positive value.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const finalDesignation = formData.designation === 'Other' ? customDesignation : formData.designation;
            
            await profileService.saveProfile({
                age: formData.age ? parseInt(formData.age) : null,
                gender: formData.gender,
                heightCm: formData.heightCm ? parseFloat(formData.heightCm) : null,
                weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
                location: formData.location,
                designation: finalDesignation,
                sports: formData.sports
            });

            navigate('/onboarding');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to save profile. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#060913] text-white font-sans flex items-center justify-center p-4 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gym-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-2xl bg-[#151A2C]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-3">
                        Tell us a little <br/><span className="text-gym-accent">about yourself</span>
                    </h1>
                    <p className="text-gray-400 font-medium">We'll use this information to personalize your fitness experience.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm font-semibold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Age */}
                        <div className="group">
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-gym-accent transition-colors">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-[#0A0D18] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gym-accent focus:ring-1 focus:ring-gym-accent transition-all"
                                placeholder="e.g. 25"
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div className="group">
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-gym-accent transition-colors">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-[#0A0D18] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gym-accent focus:ring-1 focus:ring-gym-accent transition-all appearance-none"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>

                        {/* Height */}
                        <div className="group">
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-gym-accent transition-colors">Height (cm)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="heightCm"
                                value={formData.heightCm}
                                onChange={handleChange}
                                className="w-full bg-[#0A0D18] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gym-accent focus:ring-1 focus:ring-gym-accent transition-all"
                                placeholder="177.8"
                                required
                            />
                        </div>

                        {/* Weight */}
                        <div className="group">
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-gym-accent transition-colors">Weight (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="weightKg"
                                value={formData.weightKg}
                                onChange={handleChange}
                                className="w-full bg-[#0A0D18] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gym-accent focus:ring-1 focus:ring-gym-accent transition-all"
                                placeholder="70"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div className="group md:col-span-2">
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-gym-accent transition-colors">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full bg-[#0A0D18] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gym-accent focus:ring-1 focus:ring-gym-accent transition-all"
                                placeholder="Bengaluru"
                                required
                            />
                        </div>

                        {/* Designation */}
                        <div className="group md:col-span-2">
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-gym-accent transition-colors">Designation / Occupation</label>
                            <select
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="w-full bg-[#0A0D18] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gym-accent focus:ring-1 focus:ring-gym-accent transition-all appearance-none mb-3"
                                required
                            >
                                <option value="">Select Occupation</option>
                                {designations.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>

                            {formData.designation === 'Other' && (
                                <input
                                    type="text"
                                    value={customDesignation}
                                    onChange={(e) => setCustomDesignation(e.target.value)}
                                    className="w-full bg-[#0A0D18] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gym-accent focus:ring-1 focus:ring-gym-accent transition-all"
                                    placeholder="Enter your custom designation"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    {/* Sports */}
                    <div>
                        <label className="block text-sm uppercase tracking-widest font-bold text-white mb-4">Are you interested in any game or sport?</label>
                        <div className="flex flex-wrap gap-3">
                            {allSports.map(sport => {
                                const isSelected = formData.sports.includes(sport);
                                return (
                                    <button
                                        key={sport}
                                        type="button"
                                        onClick={() => handleSportToggle(sport)}
                                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-300 ${
                                            isSelected 
                                                ? 'bg-gym-accent border-gym-accent text-white shadow-[0_0_15px_rgba(255,87,34,0.3)]' 
                                                : 'bg-[#0A0D18] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                        }`}
                                    >
                                        {sport} {isSelected && '✓'}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-gym-accent to-[#ff7a59] text-white py-4 rounded-xl uppercase tracking-[0.2em] font-bold text-sm hover:shadow-[0_0_20px_rgba(255,87,34,0.4)] transform hover:-translate-y-1 transition-all duration-300 mt-8 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? 'Saving...' : 'Save Profile'} <ChevronRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
