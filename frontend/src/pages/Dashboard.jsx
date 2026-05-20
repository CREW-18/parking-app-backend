import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Star, ChevronRight, Activity, MapPin, Trophy, Sparkles } from "lucide-react";
import { useUser } from "../context/UserContext"; 
import { api } from "../api/api"; 
import { logoutUser } from "../api/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [malls, setMalls] = useState([]); 
  const [loading, setLoading] = useState(true);

  const liveEvents = [
    {
      id: 1,
      title: "Neon Midnight Sale",
      location: "Phoenix Mall of Asia",
      tag: "50% OFF",
      icon: <Zap size={18} fill="currentColor" />,
      color: "from-purple-600/30 to-blue-500/30",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "E-Sports Qualifiers",
      location: "Nexus Mall",
      tag: "TOURNAMENT",
      icon: <Trophy size={18} fill="currentColor" />,
      color: "from-green-600/30 to-cyan-500/30",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchMalls = async () => {
      try {
        const response = await api.get("/api/locations"); 
        setMalls(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Integration Error:", error);
        setMalls([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMalls();

    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % liveEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [liveEvents.length]);

  const handleLogout = () => {
    if (window.confirm("Logout from Slotify?")) {
      logoutUser();
    }
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-[#000d1a] flex items-center justify-center">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 border-2 border-white/5 border-t-[#00FFFF] rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#00FFFF]/10 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000d1a] text-white font-sans overflow-x-hidden relative selection:bg-[#00FFFF]/30">
      
      {/* 1. TOP HUD NAV */}
      <nav className="p-6 flex justify-between items-center sticky top-0 z-50 bg-[#000d1a]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Sparkles size={10} className="text-[#00FFFF]" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Authorized Pilot</span>
          </div>
          <span className="text-xl font-black tracking-tighter flex items-center gap-2 uppercase">
            {userData?.name?.split(' ')[0] || "Pilot"} <ChevronRight size={14} className="text-[#00FFFF]" />
          </span>
        </div>

        <div className="flex gap-5 items-center">
          <div className="flex flex-col items-end hidden xs:flex">
             <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{getGreeting()}</span>
             <span className="text-[10px] font-black text-[#00FFFF] uppercase">Active Session</span>
          </div>
          
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/profile")} 
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-1 cursor-pointer shadow-2xl hover:border-[#00FFFF]/50 transition-all"
          >
            <img 
              src={userData?.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Slotify"} 
              alt="User" 
              className="w-full h-full object-cover rounded-[0.8rem]"
            />
          </motion.div>

          <button onClick={handleLogout} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-xl border border-white/5 text-zinc-500 hover:text-red-400 transition-colors">
            <Zap size={14} />
          </button>
        </div>
      </nav>

      {/* 2. BENTO STATS */}
      <div className="px-6 mt-8">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
             <Activity size={80} className="text-[#00FFFF]" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Live Grid Pulse</p>
              <h4 className="text-3xl font-black text-white uppercase">1,240 <span className="text-xs text-[#00FFFF] ml-1">SLOTS READY</span></h4>
              <p className="text-[9px] font-bold text-zinc-500 mt-2 uppercase tracking-widest">Bengaluru Hub - High Availability</p>
            </div>
            <div className="w-14 h-14 bg-[#00FFFF]/10 rounded-[1.5rem] flex items-center justify-center border border-[#00FFFF]/20">
               <Activity className="text-[#00FFFF] animate-pulse" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MESH GRADIENT EVENT SLIDER */}
      <section className="px-6 mt-10">
        <div className="relative h-64 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`absolute inset-0 rounded-[3rem] overflow-hidden p-10 flex flex-col justify-end bg-gradient-to-br ${liveEvents[activeTab].color} border border-white/10 shadow-2xl`}
            >
              <img src={liveEvents[activeTab].image} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 grayscale" alt="Event" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-xl rounded-full text-[9px] font-black mb-5 border border-white/10 tracking-widest">
                  <span className="text-[#00FFFF]">{liveEvents[activeTab].icon}</span>
                  {liveEvents[activeTab].tag}
                </div>
                <h3 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter">{liveEvents[activeTab].title}</h3>
                <p className="text-[11px] font-bold text-white/40 mt-3 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <MapPin size={12} className="text-[#00FFFF]" /> {liveEvents[activeTab].location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 4. MALL CARDS WITH HUD UI */}
      <section className="px-6 mt-14 mb-32">
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#00FFFF]">Nearby Grids</h2>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Satellite optimized results</p>
          </div>
          <div className="h-[1px] flex-1 bg-white/5 mx-6" />
          <Star size={14} className="text-zinc-700" />
        </div>

        <div className="space-y-5">
          {malls.length > 0 ? malls.map((mall, idx) => {
            const isBusy = mall.status === "High Demand" || mall.status === "Congested";
            const capacity = isBusy ? "88%" : "24%";
            
            return (
              <motion.div
                key={mall._id || idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/booking?venue=${encodeURIComponent(mall.name)}`, { state: mall })}
                className="relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-[2.8rem] p-6 cursor-pointer group transition-all hover:bg-white/[0.05] hover:border-[#00FFFF]/20 shadow-xl"
              >
                <div className="flex gap-6 items-center">
                  <div className="relative w-24 h-24 shrink-0">
                    <img 
                      src={mall.image} 
                      className="w-full h-full object-cover rounded-[2rem] grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 border border-white/10" 
                      alt={mall.name} 
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600";
                      }}
                    />
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-[5px] border-[#000d1a] ${isBusy ? "bg-red-500 shadow-[0_0_15px_red]" : "bg-[#00FFFF] shadow-[0_0_15px_#00FFFF]"}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-xl uppercase tracking-tighter group-hover:text-[#00FFFF] transition-colors leading-none">{mall.name}</h3>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-orange-400">
                        <Star size={10} fill="currentColor" /> {mall.rating}
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-[0.1em]">{mall.location} - {mall.distance}</p>

                    <div className="mt-5">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">
                        <span>Load Factor</span>
                        <span className={isBusy ? "text-red-400" : "text-[#00FFFF]"}>{capacity}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1.5px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: capacity }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${isBusy ? "bg-red-500 shadow-[0_0_10px_red]" : "bg-[#00FFFF] shadow-[0_0_10px_#00FFFF]"}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="text-center text-zinc-700 py-16 font-black uppercase tracking-[0.4em] text-[10px] border border-dashed border-white/5 rounded-[3rem]">
              Waiting for Grid Signal...
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
