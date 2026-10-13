import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainerService } from '../services/trainerService';
import { ChevronRight, ArrowRight } from 'lucide-react';

export default function Trainers() {
    const [trainers, setTrainers] = useState([]);
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    const specializations = ['All', 'Muscle Building', 'Weight Loss', 'Strength', 'Sports', 'Yoga'];

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const data = await trainerService.getAllTrainers();
                setTrainers(data);
            } catch (error) {
                console.error("Failed to load trainers");
                setTrainers([
                    { id: 1, name: 'ARJUN SHARMA', specialization: 'Strength,Muscle Building,Gym Training', experienceYears: 8, profileImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500' },
                    { id: 2, name: 'PRIYA MENON', specialization: 'Fat Loss,HIIT,Nutrition', experienceYears: 6, profileImageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=500' },
                    { id: 3, name: 'RAHUL KUMAR', specialization: 'Sports,Conditioning,Performance', experienceYears: 7, profileImageUrl: 'https://images.openai.com/static-rsc-4/QPY6yYz3r1Z-oEQtvG4Auiplb1sxvhKwapu27CnoiMopGoYAcwpYVpbFuL3H6LVCjwzfaL0yoFGoAE21PLHL5Wu-iRieZq3dRy7AjKTaFUIb1Jj3rzT3eivXxe2mP9CJkQV0IYh00fdz01lv9PJ8SF8pLlxpqxYcXbdUcFRkBqmfydke9XAifvhXtto5xWFo?purpose=fullsize' },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrainers();
    }, []);

    const filteredTrainers = filter === 'All' 
        ? trainers 
        : trainers.filter(t => t.specialization?.includes(filter) || t.tags?.includes(filter));

    return (
        <div className="min-h-screen bg-[#060913] text-white font-sans overflow-x-hidden">
            {/* Navbar (Mocked for context, usually imported) */}
            <nav className="flex justify-between items-center p-6 md:px-12 absolute top-0 w-full z-50">
                <Link to="/" className="text-2xl font-black font-display tracking-[0.2em] text-white">
                    FIT<span className="text-gym-accent">FLOW</span>
                </Link>
                <div className="hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase">
                    <Link to="/" className="hover:text-gym-accent transition-colors">Home</Link>
                    <Link to="/programs" className="hover:text-gym-accent transition-colors">Programs</Link>
                    <Link to="/trainers" className="text-gym-accent">Trainers</Link>
                    <Link to="/login" className="hover:text-gym-accent transition-colors">Login</Link>
                    <Link to="/register" className="text-gym-accent border border-gym-accent px-4 py-2 hover:bg-gym-accent hover:text-white transition-all">Join Now</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 z-10">
                    <h1 className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter leading-[0.9] mb-6">
                        MEET YOUR<br/>
                        <span className="text-gym-accent text-transparent bg-clip-text bg-gradient-to-r from-gym-accent to-red-600">TRAINERS.</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-md mb-10 font-medium">
                        Expert guidance. Personalized programs. Real results.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-gym-accent text-white px-8 py-4 uppercase font-bold tracking-widest text-sm hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
                            FIND YOUR TRAINER <ArrowRight className="w-4 h-4"/>
                        </button>
                        <button className="bg-transparent border border-white/20 text-white px-8 py-4 uppercase font-bold tracking-widest text-sm hover:border-white transition-colors">
                            VIEW PROGRAMS
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 mt-12 md:mt-0 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gym-accent/20 blur-[120px] rounded-full z-0"></div>
                    <img 
                        src="https://images.openai.com/static-rsc-4/CDxVtxew9TjGo_zcBHhmugptfGYvLiARUkPUPGertdHdmIKoVn6LgBisI9KfQTVrYmGms02MAry9z-XdpBPUOoqdipebond-s4zHLUM05j3WvjzjFXaXaANpDGywiKxh6PMA8G5WvLMNBAfF7CvZp6NAtHvRTSG1EVw5yEGSxXn1wskTGZ7yfL9VfRrGDMea?purpose=fullsize" 
                        alt="FitFlow Trainer" 
                        className="relative z-10 w-full h-[500px] object-cover object-top rounded-bl-[100px] rounded-tr-[100px] shadow-2xl grayscale contrast-125 border-r-4 border-b-4 border-gym-accent"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 md:px-12 py-12 border-t border-white/10 bg-[#0A0D18]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                    <div>
                        <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4">Specialization</h3>
                        <div className="flex flex-wrap gap-3">
                            {specializations.map(spec => (
                                <button 
                                    key={spec}
                                    onClick={() => setFilter(spec)}
                                    className={`px-5 py-2 uppercase text-xs font-bold tracking-widest transition-all ${
                                        filter === spec 
                                        ? 'bg-gym-accent text-white' 
                                        : 'bg-transparent border border-white/20 text-gray-400 hover:border-white hover:text-white'
                                    }`}
                                >
                                    {spec}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trainer Grid */}
                {isLoading ? (
                    <div className="text-center py-20 text-gym-accent font-bold tracking-widest uppercase">Loading Trainers...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTrainers.map((trainer) => (
                            <div key={trainer.id} className="bg-[#151A2C] border border-white/5 hover:border-gym-accent/50 transition-colors group relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gym-accent/10 rounded-bl-full pointer-events-none transform group-hover:scale-150 transition-transform duration-500 z-10"></div>
                                <div className="h-48 w-full overflow-hidden relative">
                                    <img src={trainer.profileImageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500'} alt={trainer.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#151A2C] to-transparent"></div>
                                </div>
                                <div className="p-8 pt-4 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-black font-display uppercase tracking-widest mb-1 relative z-20">{trainer.name}</h3>
                                    <p className="text-gym-accent text-sm font-bold uppercase tracking-widest mb-4">
                                        {trainer.specialization?.split(',')[0] || 'Fitness Expert'}
                                    </p>
                                    
                                    <div className="mb-6 flex-grow">
                                        <span className="text-xs bg-white/5 px-3 py-1 text-gray-300 font-medium">
                                            {trainer.experienceYears}+ Years Experience
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {(trainer.tags || trainer.specialization?.split(',')).slice(0,3).map(tag => (
                                            <span key={tag} className="text-xs text-gray-400 uppercase tracking-wider before:content-['•'] before:mr-1 before:text-gym-accent">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    <Link 
                                        to={`/trainers/${trainer.id}`}
                                        className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-white group-hover:text-gym-accent transition-colors mt-auto"
                                    >
                                        View Profile <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform"/>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Why Train Section */}
            <div className="py-24 px-6 md:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-black font-display uppercase tracking-tighter leading-none mb-4">
                        MORE THAN A WORKOUT.<br/>
                        <span className="text-gym-accent">IT'S COACHING.</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { num: '01', title: 'PERSONALIZED', desc: 'Training based on your body, goals and experience.' },
                        { num: '02', title: 'EXPERT GUIDANCE', desc: 'Learn proper form and technique from professionals.' },
                        { num: '03', title: 'PROGRESS TRACKING', desc: 'Your trainer monitors your progress and adapts.' },
                        { num: '04', title: 'ACCOUNTABILITY', desc: 'Stay consistent with scheduled one-on-one sessions.' }
                    ].map(item => (
                        <div key={item.num} className="border-l-2 border-gym-accent/30 pl-6 hover:border-gym-accent transition-colors">
                            <span className="text-gym-accent font-black text-2xl block mb-2">{item.num}</span>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Additions */}
            <div className="border-t border-white/10 bg-black py-12 px-6 md:px-12 text-center">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Are you a FitFlow Trainer?</p>
                <Link to="/trainer/login" className="text-gym-accent hover:text-white font-bold tracking-[0.2em] uppercase text-sm inline-flex items-center gap-2 transition-colors">
                    TRAINER LOGIN <ChevronRight className="w-4 h-4"/>
                </Link>
            </div>
        </div>
    );
}
