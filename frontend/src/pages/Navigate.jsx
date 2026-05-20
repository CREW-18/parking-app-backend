import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, ArrowUpRight, ChevronLeft, Send, Compass } from "lucide-react";

const Navigate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking || {
    mall: "Phoenix Mall of Asia",
    mallImage: "https://images.unsplash.com/photo-1567449303078-57ad995bd17a?auto=format&fit=crop&w=800&q=80",
    lat: "13.0827",
    lng: "80.2707",
    slot: "A-12"
  };

  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.lat},${booking.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#000d1a] text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* 1. AMBIENT GLOW ARCHITECTURE */}
      {/* Soft Cyan Bloom */}
      <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[60%] bg-[#00FFFF]/10 blur-[140px] rounded-full pointer-events-none" />
      {/* Deep Blue Bloom */}
      <div className="absolute bottom-[-5%] left-[-5%] w-[60%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* 2. REFINED HEADER */}
      <div className="relative z-10 flex justify-between items-center p-8 pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl shadow-xl"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FFFF]">Pathfinding</span>
          <p className="text-xs text-white/40 italic">En route to {booking.mall}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        className="flex-1 px-8 pb-12 relative z-10 flex flex-col"
      >
        {/* 3. HERO NAVIGATION CARD */}
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="relative w-full aspect-square max-w-[320px]">
            {/* Soft Breathing Outer Glow */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-[#00FFFF]/20 blur-[60px] rounded-full"
            />
            
            {/* The Glass Compass Orb */}
            <div className="w-full h-full rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                {/* Faded Background Image within Orb */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                    <img src={booking.mallImage} className="w-full h-full object-cover grayscale" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000d1a] to-transparent" />
                </div>

                <div className="relative flex flex-col items-center">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-12 border border-white/5 rounded-full border-dashed"
                    />
                    
                    <div className="w-24 h-24 rounded-full bg-white text-[#000d1a] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                        <Navigation size={40} />
                    </div>
                    
                    <div className="mt-8 text-center px-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-1">{booking.mall}</h2>
                        <div className="flex items-center justify-center gap-2">
                            <MapPin size={12} className="text-[#00FFFF]" />
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Reserved: {booking.slot}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* 4. TRIP TELEMETRY (CREATIVE GLASS TILES) */}
        <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-white/[0.05] border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-3xl text-center">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Remaining</p>
                <p className="text-3xl font-bold tracking-tight text-white">3.2<span className="text-sm ml-1 text-white/40 font-medium tracking-normal text-zinc-400">KM</span></p>
            </div>
            <div className="bg-white/[0.05] border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-3xl text-center relative overflow-hidden">
                {/* Highlighting this card with a subtle top glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFFF]/40 to-transparent" />
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Arrival</p>
                <p className="text-3xl font-bold tracking-tight text-[#00FFFF]">6<span className="text-sm ml-1 opacity-50 font-medium tracking-normal">MINS</span></p>
            </div>
        </div>

        {/* 5. PRIMARY INTERFACE ACTIONS */}
        <div className="space-y-4">
            <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={openGoogleMaps}
                className="w-full py-5 rounded-[2.2rem] bg-white text-[#000d1a] font-bold uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
                <Send size={18} fill="currentColor" />
                Open In Maps
            </motion.button>
            
            <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 rounded-[2rem] bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
            >
                End Navigation
            </button>
        </div>

        <p className="text-center mt-8 text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">
            Safety First • Drive Responsibly
        </p>
      </motion.div>
    </div>
  );
};

export default Navigate;