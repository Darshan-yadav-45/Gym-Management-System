import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gym-darker text-white font-sans overflow-hidden">
      {/* Navigation */}
      <nav className="absolute w-full z-50 top-0 left-0 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black font-display tracking-[0.2em] text-white">
            FIT<span className="text-gym-accent">FLOW</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase">
            <Link to="/" className="hover:text-gym-accent transition-colors">Home</Link>
            <Link to="/programs" className="hover:text-gym-accent transition-colors">Programs</Link>
            <Link to="/trainers" className="hover:text-gym-accent transition-colors">Trainers</Link>
            <Link to="/login" className="hover:text-gym-accent transition-colors">Login</Link>
          </div>
          <Link to="/register" className="bg-gym-accent text-white px-6 py-2 uppercase tracking-widest font-bold text-xs hover:bg-white hover:text-gym-darker transition-colors duration-300">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gym-darker via-gym-darker/80 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full mt-20">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black uppercase tracking-tighter leading-none mb-4 text-white">
            TRAIN SMARTER.<br/>
            <span className="text-gym-accent">LIVE STRONGER.</span>
          </h1>
          <p className="text-lg md:text-2xl font-light tracking-[0.2em] text-gray-300 uppercase mb-12 max-w-2xl border-l-4 border-gym-accent pl-6">
            Your personalized fitness journey for gym and home workouts.
          </p>
          <div className="flex flex-wrap gap-6">
             <Link to="/register" className="bg-gym-accent text-white px-10 py-4 uppercase tracking-[0.2em] font-bold text-sm hover:bg-white hover:text-gym-darker transition-colors duration-300 flex items-center gap-3">
               Start Your Journey <ChevronRight className="w-5 h-5" />
             </Link>
             <Link to="/programs" className="bg-transparent border-2 border-gym-accent text-white px-10 py-4 uppercase tracking-[0.2em] font-bold text-sm hover:bg-gym-accent transition-colors duration-300">
               Explore Programs
             </Link>
          </div>
        </div>

        {/* Diagonal Accent */}
        <div 
          className="absolute bottom-0 right-0 w-2/3 md:w-1/3 h-32 bg-gym-accent"
          style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
        ></div>
      </div>

      {/* Section 2: Programs */}
      <div className="relative py-32 bg-gym-dark">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-5xl font-display font-bold uppercase leading-tight">
                OUR <span className="text-gym-accent">PROGRAMS</span>
              </h2>
              <p className="text-gray-400 mt-4 tracking-widest uppercase text-sm">Tailored for your goals</p>
            </div>
            <Link to="/programs" className="hidden md:flex text-gym-accent hover:text-white uppercase tracking-widest text-sm font-bold items-center gap-2 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Strength Training", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800", desc: "Build muscle and pure power.", level: "All Levels" },
              { title: "Home Workout", img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800", desc: "No equipment? No problem.", level: "Beginner Friendly" },
              { title: "Weight Management", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800", desc: "Cardio and diet guidance.", level: "Intermediate" }
            ].map((prog, i) => (
              <div key={i} className="group relative h-96 overflow-hidden bg-gym-darker cursor-pointer border border-white/5 hover:border-gym-accent transition-colors duration-500">
                <img src={prog.img} alt={prog.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gym-darker via-gym-darker/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                   <div className="text-xs font-bold text-gym-accent uppercase tracking-widest mb-2">{prog.level}</div>
                   <h3 className="text-2xl font-bold uppercase mb-2">{prog.title}</h3>
                   <p className="text-gray-400 text-sm mb-4 line-clamp-2">{prog.desc}</p>
                   <div className="w-10 h-10 border border-white/30 flex items-center justify-center group-hover:bg-gym-accent group-hover:border-gym-accent transition-colors">
                      <ChevronRight className="w-5 h-5 text-white" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Trainers */}
      <div className="relative py-32 bg-gym-darker">
        <div className="max-w-7xl mx-auto px-8">
           <h2 className="text-5xl font-display font-bold uppercase leading-tight mb-16 text-center">
             EXPERT <span className="text-gym-accent">TRAINERS</span>
           </h2>
           <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "Alex Mercer", spec: "Strength", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" },
                { name: "Sarah Connor", spec: "Functional", img: "https://images.openai.com/static-rsc-4/QPY6yYz3r1Z-oEQtvG4Auiplb1sxvhKwapu27CnoiMopGoYAcwpYVpbFuL3H6LVCjwzfaL0yoFGoAE21PLHL5Wu-iRieZq3dRy7AjKTaFUIb1Jj3rzT3eivXxe2mP9CJkQV0IYh00fdz01lv9PJ8SF8pLlxpqxYcXbdUcFRkBqmfydke9XAifvhXtto5xWFo?purpose=fullsize" },
                { name: "Marcus Johnson", spec: "Bodybuilding", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
                { name: "Elena Rostova", spec: "Flexibility", img: "https://images.openai.com/static-rsc-4/CDxVtxew9TjGo_zcBHhmugptfGYvLiARUkPUPGertdHdmIKoVn6LgBisI9KfQTVrYmGms02MAry9z-XdpBPUOoqdipebond-s4zHLUM05j3WvjzjFXaXaANpDGywiKxh6PMA8G5WvLMNBAfF7CvZp6NAtHvRTSG1EVw5yEGSxXn1wskTGZ7yfL9VfRrGDMea?purpose=fullsize" },
              ].map((trainer, i) => (
                <div key={i} className="text-center group">
                   <div className="w-full aspect-[3/4] overflow-hidden mb-6 relative">
                     <img src={trainer.img} alt={trainer.name} className="w-full h-full object-cover transition-all duration-500" />
                     <div className="absolute inset-0 bg-gym-accent/0 group-hover:bg-gym-accent/20 transition-colors"></div>
                   </div>
                   <h4 className="text-xl font-bold uppercase tracking-wide">{trainer.name}</h4>
                   <p className="text-gym-accent text-sm uppercase tracking-widest mt-1">{trainer.spec}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

       {/* Footer */}
      <div className="bg-gym-dark border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
           <h2 className="text-3xl font-display font-black uppercase tracking-widest text-white">FIT<span className="text-gym-accent">FLOW</span></h2>
           
           <div className="flex flex-col md:flex-row gap-8 items-center text-sm uppercase tracking-widest text-gray-500 font-bold">
              <div className="flex gap-8">
                <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
                <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
                <span className="hover:text-white cursor-pointer transition-colors">YouTube</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden md:block"></div>
              <Link to="/trainer/login" className="text-gym-accent hover:text-white flex items-center gap-2 transition-colors">
                 Trainer Portal <ChevronRight className="w-4 h-4"/>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
