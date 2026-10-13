import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { trainerService } from '../services/trainerService';
import { authService } from '../services/authService';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function TrainerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trainer, setTrainer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingMode, setBookingMode] = useState(false);
    const [error, setError] = useState('');

    const [bookingData, setBookingData] = useState({
        appointmentDate: '',
        startTime: '07:00',
        trainingType: 'Gym',
        sessionType: 'Personal Training',
        notes: ''
    });

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const data = await trainerService.getTrainerById(id);
                setTrainer(data);
            } catch (error) {
                console.error("Failed to load trainer");
                // Mock data for demo
                setTrainer({
                    id: id,
                    name: 'ARJUN SHARMA',
                    specialization: 'Strength,Muscle Building,Gym Training',
                    experienceYears: 8,
                    bio: 'Transform your strength, build confidence and train with purpose.',
                    tags: ['Strength', 'Muscle Building', 'Bodybuilding'],
                    profileImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500'
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrainer();
    }, [id]);

    const handleBookingChange = (e) => {
        setBookingData({...bookingData, [e.target.name]: e.target.value});
    };

    const handleBookSession = async (e) => {
        e.preventDefault();
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await trainerService.bookSession({
                trainerId: trainer.id,
                appointmentDate: bookingData.appointmentDate,
                startTime: bookingData.startTime + ":00", // Format to LocalTime HH:mm:ss
                trainingType: bookingData.trainingType,
                sessionType: bookingData.sessionType,
                notes: bookingData.notes
            });
            navigate('/dashboard'); // or /my-appointments
        } catch (err) {
            setError('Booking failed. Please check details or login again.');
        }
    };

    if (isLoading) return <div className="min-h-screen bg-[#060913] text-white flex justify-center items-center font-display font-black tracking-widest text-xl uppercase">Loading...</div>;
    if (!trainer) return <div className="min-h-screen bg-[#060913] text-white flex justify-center items-center">Trainer not found</div>;

    return (
        <div className="min-h-screen bg-[#060913] text-white font-sans flex flex-col md:flex-row overflow-x-hidden">
            {/* Left side: Image */}
            <div className="md:w-1/2 relative min-h-[50vh] md:min-h-screen">
                <div 
                    className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
                    style={{ backgroundImage: `url('${trainer.profileImageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500'}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#060913]"></div>
                
                <Link to="/trainers" className="absolute top-10 left-10 text-white hover:text-gym-accent transition-colors flex items-center gap-2 font-bold tracking-widest uppercase text-sm">
                    <ArrowLeft className="w-4 h-4"/> Back
                </Link>
            </div>

            {/* Right side: Content */}
            <div className="md:w-1/2 flex items-center p-8 md:p-20 relative bg-[#060913]">
                <div className="w-full max-w-xl">
                    {!bookingMode ? (
                        <>
                            <h1 className="text-5xl md:text-6xl font-black font-display uppercase tracking-tighter mb-2">{trainer.name}</h1>
                            <p className="text-gym-accent uppercase tracking-widest font-bold mb-8">CERTIFIED PERSONAL TRAINER</p>
                            
                            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed border-l-4 border-gym-accent pl-6 mb-10 text-gray-300">
                                "{trainer.bio || 'Push harder than yesterday if you want a different tomorrow.'}"
                            </blockquote>

                            <div className="flex gap-8 mb-10 border-y border-white/10 py-6">
                                <div>
                                    <div className="text-2xl font-black">{trainer.experienceYears}+</div>
                                    <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Years Exp.</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black">350+</div>
                                    <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Clients</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black">4.9/5</div>
                                    <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Rating</div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4">Specializations</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(trainer.tags || trainer.specialization?.split(',')).map(tag => (
                                        <span key={tag} className="bg-[#151A2C] px-4 py-2 text-xs uppercase font-bold tracking-widest border border-white/5">{tag.trim()}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4">Training Options</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-[#151A2C] p-6 border border-white/5 hover:border-gym-accent transition-colors">
                                        <div className="font-bold tracking-widest uppercase mb-1">Personal Training</div>
                                        <div className="text-gym-accent font-black text-xl">₹2,999<span className="text-sm text-gray-400 font-normal">/mo</span></div>
                                    </div>
                                    <div className="bg-[#151A2C] p-6 border border-white/5 hover:border-gym-accent transition-colors">
                                        <div className="font-bold tracking-widest uppercase mb-1">1-On-1 Session</div>
                                        <div className="text-gym-accent font-black text-xl">₹799<span className="text-sm text-gray-400 font-normal">/session</span></div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setBookingMode(true)}
                                className="w-full bg-gym-accent text-white py-5 uppercase tracking-[0.2em] font-bold text-sm hover:bg-white hover:text-black transition-all duration-300 flex justify-center items-center gap-2"
                            >
                                BOOK A SESSION <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <div className="animate-fade-in">
                            <button onClick={() => setBookingMode(false)} className="text-gray-400 hover:text-white uppercase tracking-widest text-xs font-bold mb-8 flex items-center gap-2 transition-colors">
                                <ArrowLeft className="w-4 h-4"/> Back to Profile
                            </button>
                            
                            <h2 className="text-4xl font-black font-display uppercase mb-2">Book Session</h2>
                            <p className="text-gym-accent uppercase tracking-widest font-bold mb-10">WITH {trainer.name.split(' ')[0]}</p>

                            {error && <div className="text-red-500 mb-6 bg-red-500/10 p-4 border border-red-500/50 text-sm font-bold">{error}</div>}

                            <form onSubmit={handleBookSession} className="space-y-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Select Date</label>
                                    <input 
                                        type="date" 
                                        name="appointmentDate"
                                        value={bookingData.appointmentDate}
                                        onChange={handleBookingChange}
                                        className="w-full bg-transparent border-b-2 border-white/20 pb-2 text-white focus:outline-none focus:border-gym-accent transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Select Time</label>
                                    <select 
                                        name="startTime"
                                        value={bookingData.startTime}
                                        onChange={handleBookingChange}
                                        className="w-full bg-[#060913] border-b-2 border-white/20 pb-2 text-white focus:outline-none focus:border-gym-accent transition-colors"
                                    >
                                        <option value="07:00">07:00 AM</option>
                                        <option value="09:00">09:00 AM</option>
                                        <option value="17:00">05:00 PM</option>
                                        <option value="19:00">07:00 PM</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Training Type</label>
                                    <select 
                                        name="trainingType"
                                        value={bookingData.trainingType}
                                        onChange={handleBookingChange}
                                        className="w-full bg-[#060913] border-b-2 border-white/20 pb-2 text-white focus:outline-none focus:border-gym-accent transition-colors"
                                    >
                                        <option value="Gym">Gym</option>
                                        <option value="Home">Home</option>
                                        <option value="Online">Online</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Session</label>
                                    <select 
                                        name="sessionType"
                                        value={bookingData.sessionType}
                                        onChange={handleBookingChange}
                                        className="w-full bg-[#060913] border-b-2 border-white/20 pb-2 text-white focus:outline-none focus:border-gym-accent transition-colors"
                                    >
                                        <option value="Personal Training">Personal Training</option>
                                        <option value="Consultation">Consultation</option>
                                        <option value="1-On-1 Session">1-On-1 Session</option>
                                    </select>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-gym-accent text-white py-5 uppercase tracking-[0.2em] font-bold text-sm hover:bg-white hover:text-black transition-all duration-300 mt-8 flex justify-center items-center gap-2"
                                >
                                    CONFIRM BOOKING <ChevronRight className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
