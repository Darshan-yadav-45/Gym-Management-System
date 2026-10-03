import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gym-darker text-white font-sans overflow-hidden">
      {/* Navigation */}
      <nav className="absolute w-full z-50 top-0 left-0">
        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
          <div className="text-xs font-bold tracking-[0.3em] text-white">
            FITFLOW
          </div>
          <div className="text-xs font-bold tracking-[0.3em] text-white">
            MENU
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Background Image with dark overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gym-darker via-gym-darker/80 to-transparent"></div>

        {/* Diagonal Red Element Bottom Right */}
        <div 
          className="absolute bottom-0 right-0 w-2/3 md:w-1/3 h-32 bg-gym-accent"
          style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
        >
          <div className="flex items-center justify-end h-full pr-12 gap-4">
             <div className="w-12 h-12 border border-white flex items-center justify-center rounded-none hover:bg-white hover:text-gym-accent transition cursor-pointer">
                <ChevronRight className="w-6 h-6" />
             </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full mt-20">
          <h1 className="text-7xl md:text-9xl font-display font-black uppercase tracking-tighter leading-none mb-4">
            FIT<span className="text-gym-accent">FLOW</span>
          </h1>
          <p className="text-lg md:text-2xl font-light tracking-[0.3em] text-gray-300 uppercase mb-16">
            Turning Fat Into Fit
          </p>
          {/* We use basic blocks instead of rounded buttons for this aggressive aesthetic */}
          <button className="bg-transparent border-2 border-gym-accent text-white px-10 py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-gym-accent transition-colors duration-300">
            Start Now
          </button>
        </div>
      </div>

      {/* Section 2: The Story */}
      <div className="relative py-32 bg-gym-dark">
        {/* Red Diagonal Accent */}
        <div 
          className="absolute top-0 bottom-0 right-[35%] w-48 bg-gym-accent hidden lg:block z-0"
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 50% 0)' }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-display font-bold uppercase mb-10 leading-tight">
                THE STORY OF <br />
                <span className="text-gym-accent">FITFLOW</span>
              </h2>
              <p className="text-gray-400 mb-12 leading-relaxed text-sm max-w-md">
                We believe in pushing boundaries. Founded with the mission to redefine fitness, FitFlow combines raw grit with scientific precision. Our environment is designed to strip away distractions and focus entirely on your transformation.
              </p>
              <button className="bg-gym-accent text-white px-8 py-3 uppercase tracking-widest font-bold text-xs hover:bg-white hover:text-gym-darker transition-colors duration-300">
                Read More
              </button>
            </div>
            <div className="relative">
              {/* Slanted image container */}
              <div className="w-full h-[600px] overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15% 100%)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop" 
                  alt="Gym Story" 
                  className="w-full h-full grayscale contrast-125 object-cover transform hover:scale-110 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: What Will You Get */}
      <div className="relative py-32 bg-gym-darker">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              {/* Image with diagonal crop */}
              <div className="w-full h-[500px] overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop" 
                  alt="Training" 
                  className="w-full h-full grayscale contrast-125 object-cover"
                />
              </div>
              {/* Red diagonal cut overlay */}
              <div 
                className="absolute inset-0 bg-gym-accent z-10 pointer-events-none opacity-90"
                style={{ clipPath: 'polygon(0 85%, 100% 100%, 100% 100%, 0 100%)' }}
              ></div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-5xl font-display font-bold uppercase mb-16 leading-tight">
                WHAT WILL YOU <br />
                <span className="text-gym-accent">GET AT FITFLOW</span>
              </h2>
              <div className="space-y-12">
                {[
                  { title: "Raw Power Training", desc: "Expert guidance tailored for maximizing strength and endurance." },
                  { title: "Iron Discipline", desc: "Mental fortitude building alongside physical conditioning." },
                  { title: "The Community", desc: "Train with individuals who push you to be your absolute best." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 items-start">
                    <div className="w-12 h-12 bg-gym-accent flex-shrink-0 flex items-center justify-center font-bold text-white text-lg">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold uppercase mb-3 tracking-wide">{item.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Area with Red Block */}
      <div className="bg-gym-dark relative h-32 flex items-center overflow-hidden border-t border-white/5">
        {/* Slanted red footer accent */}
        <div className="absolute left-0 bottom-0 h-full w-24 md:w-64 bg-gym-accent" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 flex justify-between w-full items-center">
           <h2 className="text-2xl font-display font-black uppercase tracking-widest text-gray-600">FIT<span className="text-gym-accent/50">FLOW</span></h2>
           <p className="text-gray-600 text-xs tracking-widest uppercase">© 2026 FITFLOW GYM</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
