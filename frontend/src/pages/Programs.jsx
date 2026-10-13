import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Zap, Flame, Heart, Target, Dumbbell } from 'lucide-react';

export default function Programs() {
    const programs = [
        {
            id: 1,
            title: "Strength & Power",
            desc: "Build raw strength and increase muscle mass through heavy compound lifting.",
            level: "Intermediate/Advanced",
            duration: "12 Weeks",
            icon: Dumbbell,
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800",
            tags: ["Barbell", "Powerlifting", "Muscle"]
        },
        {
            id: 2,
            title: "HIIT & Conditioning",
            desc: "High-intensity interval training to burn fat and skyrocket cardiovascular endurance.",
            level: "All Levels",
            duration: "8 Weeks",
            icon: Flame,
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
            tags: ["Cardio", "Fat Loss", "Intensity"]
        },
        {
            id: 3,
            title: "Functional Fitness",
            desc: "Train your body for real-world activities using dynamic movements and kettlebells.",
            level: "All Levels",
            duration: "10 Weeks",
            icon: Activity,
            image: "https://images.unsplash.com/photo-1554244933-d876deb6b2fa?q=80&w=800",
            tags: ["Mobility", "Kettlebell", "Core"]
        },
        {
            id: 4,
            title: "Zero Equipment Home",
            desc: "A complete calisthenics and bodyweight routine you can do anywhere, anytime.",
            level: "Beginner Friendly",
            duration: "6 Weeks",
            icon: Zap,
            image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800",
            tags: ["Home", "Bodyweight", "No Gear"]
        },
        {
            id: 5,
            title: "Yoga & Flexibility",
            desc: "Enhance your mind-body connection, improve mobility, and speed up recovery.",
            level: "All Levels",
            duration: "Ongoing",
            icon: Heart,
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
            tags: ["Yoga", "Recovery", "Stretching"]
        },
        {
            id: 6,
            title: "Sports Performance",
            desc: "Agility, speed, and explosive power training tailored for athletes.",
            level: "Advanced",
            duration: "16 Weeks",
            icon: Target,
            image: "https://images.unsplash.com/photo-1526506114642-54a0fc0c213c?q=80&w=800",
            tags: ["Agility", "Speed", "Athletics"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#060913] text-white font-sans overflow-hidden">
            {/* Navigation (Matching Home) */}
            <nav className="absolute w-full z-50 top-0 left-0 bg-gradient-to-b from-black/80 to-transparent">
                <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black font-display tracking-[0.2em] text-white">
                        FIT<span className="text-gym-accent">FLOW</span>
                    </Link>
                    <div className="hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase">
                        <Link to="/" className="hover:text-gym-accent transition-colors">Home</Link>
                        <Link to="/programs" className="text-gym-accent transition-colors">Programs</Link>
                        <Link to="/trainers" className="hover:text-gym-accent transition-colors">Trainers</Link>
                        <Link to="/login" className="hover:text-gym-accent transition-colors">Login</Link>
                    </div>
                    <Link to="/register" className="bg-gym-accent text-white px-6 py-2 uppercase tracking-widest font-bold text-xs hover:bg-white hover:text-[#060913] transition-colors duration-300">
                        Join Now
                    </Link>
                </div>
            </nav>

            {/* Header Section */}
            <div className="relative pt-40 pb-20 px-8">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gym-accent/5 rounded-full blur-[150px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter mb-6">
                        Elite <span className="text-gym-accent">Programs</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        Choose from our selection of professionally designed training programs tailored to your specific fitness goals.
                    </p>
                </div>
            </div>

            {/* Programs Grid */}
            <div className="max-w-7xl mx-auto px-8 pb-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map((prog) => {
                        const Icon = prog.icon;
                        return (
                            <div key={prog.id} className="group relative bg-[#151A2C] border border-white/5 overflow-hidden transition-all duration-500 hover:border-gym-accent/50 flex flex-col">
                                {/* Image Section */}
                                <div className="h-56 w-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                    <img 
                                        src={prog.image} 
                                        alt={prog.title} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                    />
                                    {/* Difficulty Badge */}
                                    <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur border border-white/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-white">
                                        {prog.level}
                                    </div>
                                    {/* Duration Badge */}
                                    <div className="absolute top-4 right-4 z-20 bg-gym-accent px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-white">
                                        {prog.duration}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gym-accent/10 flex items-center justify-center text-gym-accent group-hover:scale-110 transition-transform">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-display font-black uppercase tracking-wide group-hover:text-gym-accent transition-colors">
                                            {prog.title}
                                        </h3>
                                    </div>
                                    
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                        {prog.desc}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {prog.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold tracking-wider uppercase bg-white/5 px-2 py-1 text-gray-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <Link to="/register" className="flex items-center justify-between border-t border-white/10 pt-4 group/btn">
                                        <span className="text-xs font-bold tracking-widest uppercase text-white group-hover/btn:text-gym-accent transition-colors">
                                            Start Program
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-gym-accent transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Call to Action Footer */}
            <div className="border-t border-white/5 bg-[#0A0D18]">
                <div className="max-w-7xl mx-auto px-8 py-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mb-6">
                        Not sure where to <span className="text-gym-accent">start?</span>
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Sign up today and our intelligent onboarding system will recommend the perfect program based on your body, goals, and experience level.
                    </p>
                    <Link to="/register" className="inline-block bg-white text-[#060913] px-10 py-4 uppercase tracking-[0.2em] font-bold text-sm hover:bg-gym-accent hover:text-white transition-all duration-300">
                        Get Your Custom Plan
                    </Link>
                </div>
            </div>
        </div>
    );
}
