import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Cpu, Clock, Layers, Zap, User, Target } from "lucide-react";
import { useUser } from "../context/UserContext"; 

export default function Booking() {
  const navigate = useNavigate();
  const locationData = useLocation();
  const { userData } = useUser(); 

  const mall = locationData.state || {
    name: "UB City Mall",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  };

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [floor, setFloor] = useState("F1");
  const [entryMinutes, setEntryMinutes] = useState(600); 
  const [exitMinutes, setExitMinutes] = useState(660); 
  const [showHeatmap, setShowHeatmap] = useState(false);

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const adjustTime = (type, amount) => {
    if (type === "entry") {
      setEntryMinutes((prev) => Math.max(0, prev + amount));
      setSelectedSlot(null);
    } else {
      setExitMinutes((prev) => Math.max(entryMinutes + 10, prev + amount));
    }
  };

  const slots = useMemo(() => {
    if (!showHeatmap) return [];
    const hour = Math.floor(entryMinutes / 60);

    return Array.from({ length: 20 }, (_, i) => {
      let baseOccupancy;
      const clusterFactor = i >= 7 && i <= 12 ? 0.3 : 0;

      if (hour >= 17 && hour <= 21) baseOccupancy = 0.5 + Math.random() * 0.5;
      else if (hour >= 8 && hour <= 11) baseOccupancy = Math.random() * 0.4;
      else baseOccupancy = 0.3 + Math.random() * 0.5;

      const occupancy = Math.min(baseOccupancy + clusterFactor, 1);
      const permanentlyBlocked = i === 2 || i === 17;
      const predictedFull = occupancy > 0.75;

      return {
        id: `${floor}-A${i + 1}`,
        occupancy,
        unavailable: permanentlyBlocked || predictedFull,
        permanentlyBlocked
      };
    });
  }, [floor, entryMinutes, showHeatmap]);

  const duration = exitMinutes > entryMinutes ? ((exitMinutes - entryMinutes) / 60).toFixed(1) : null;

  const handleContinue = () => {
    navigate("/payment", {
      state: { 
        userId: userData?.userId, 
        userName: userData?.name,
        mall: mall.name, 
        slot: selectedSlot, 
        entryTime: formatTime(entryMinutes), 
        exitTime: formatTime(exitMinutes), 
        duration,
        amount: 120 
      }
    });
  };

  useEffect(() => {
    if (entryMinutes) {
      setShowHeatmap(true);
      setSelectedSlot(null);
    }
  }, [entryMinutes, floor]);

  return (
    <div className="min-h-screen bg-[#000d1a] text-white font-sans overflow-x-hidden relative">
      
      {/* CINEMATIC HEADER */}
      <div className="relative h-96 w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          src={mall.image} 
          alt={mall.name} 
          className="w-full h-full object-cover opacity-40 grayscale-[20%]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000d1a]/60 to-[#000d1a]"></div>

        <div className="absolute top-12 left-6 right-6 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl"
          >
            <ChevronLeft size={20} className="text-[#00FFFF]" />
          </button>
          
          <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-3">
             <div className="text-right">
                <p className="text-[7px] font-black text-[#00FFFF] uppercase tracking-widest">Pilot Identity</p>
                <p className="text-[10px] font-black uppercase tracking-tight">{userData?.name?.split(' ')[0] || "Guest"}</p>
             </div>
             <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#00FFFF]/30">
                <img src={userData?.profilePic} alt="P" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-8 right-8">
          <div className="flex items-center gap-2 mb-3">
             <Target size={14} className="text-[#00FFFF] animate-pulse" />
             <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Target Grid Sector</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none drop-shadow-2xl">
            {mall.name}
          </h1>
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-10 pb-52">

        {/* DUAL TIME DIALS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: "Arrival Vector", time: entryMinutes, type: "entry" },
            { label: "Departure Vector", time: exitMinutes, type: "exit" }
          ].map((dial) => (
            <div key={dial.label} className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className="text-zinc-500 text-[8px] uppercase tracking-[0.3em] mb-5 font-black text-center">{dial.label}</p>
              <div className="flex justify-between items-center bg-black/60 rounded-2xl p-1.5 border border-white/5">
                <button 
                  onClick={() => adjustTime(dial.type, -10)} 
                  className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-[#00FFFF] transition-all hover:bg-white/5 rounded-xl"
                >
                  -
                </button>
                <span className="text-xl font-black tabular-nums text-white uppercase">{formatTime(dial.time)}</span>
                <button 
                  onClick={() => adjustTime(dial.type, 10)} 
                  className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-[#00FFFF] transition-all hover:bg-white/5 rounded-xl"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DURATION BADGE */}
        {duration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 py-4 bg-gradient-to-r from-[#00FFFF]/10 via-[#00FFFF]/5 to-transparent border-l-4 border-[#00FFFF] px-6 flex justify-between items-center rounded-r-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#00FFFF]/10 rounded-lg">
                <Clock size={16} className="text-[#00FFFF]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Occupancy Protocol</p>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Automated Timeline Sync</p>
              </div>
            </div>
            <span className="text-lg font-black text-[#00FFFF] uppercase">{duration} HRS</span>
          </motion.div>
        )}

        {/* FLOOR NAVIGATOR */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
             <Layers size={16} className="text-zinc-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Level</span>
          </div>
          <div className="flex gap-3">
            {["F1", "F2", "F3"].map((f) => (
              <button
                key={f}
                onClick={() => { setFloor(f); setSelectedSlot(null); }}
                className={`w-14 py-2.5 rounded-xl font-black text-[10px] tracking-widest transition-all border ${
                  floor === f ? "bg-white text-black border-white shadow-[0_10px_20px_rgba(255,255,255,0.1)]" : "border-white/10 bg-white/5 text-zinc-500"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* GRID HEATMAP */}
        <AnimatePresence>
          {showHeatmap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[3rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Cpu size={60} />
              </div>

              <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Grid Authorization</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[8px] font-black text-green-500 tracking-[0.2em] uppercase">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {slots.map((slot) => {
                  const isDisabled = slot.unavailable;
                  let colorClass;
                  
                  // Text remains visible always, but container changes
                  if (isDisabled) {
                    colorClass = "bg-white/[0.01] border-white/5 text-zinc-800"; // Ghost look, but ID visible
                  } else if (slot.id === selectedSlot) {
                    colorClass = "bg-[#00FFFF] text-black border-[#00FFFF] shadow-[0_0_30px_rgba(0,255,255,0.5)] scale-110 z-10 ring-4 ring-[#000d1a]";
                  } else if (slot.occupancy < 0.3) {
                    colorClass = "bg-white/5 border-white/10 text-white hover:border-[#00FFFF]/50";
                  } else if (slot.occupancy < 0.6) {
                    colorClass = "bg-orange-500/5 border-orange-500/20 text-orange-400";
                  } else {
                    colorClass = "bg-red-500/5 border-red-500/20 text-red-500";
                  }

                  return (
                    <motion.div
                      key={slot.id}
                      whileTap={!isDisabled ? { scale: 0.9 } : {}}
                      onClick={() => !isDisabled && setSelectedSlot(slot.id)}
                      className={`h-24 rounded-3xl border flex flex-col items-center justify-center font-black transition-all duration-500 ${colorClass} ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="text-[7px] opacity-40 mb-1 uppercase tracking-tighter">{slot.id.split('-')[0]}</span>
                      <span className="text-base tracking-tighter uppercase">{slot.id.split('-')[1]}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* ENHANCED LEGEND */}
              <div className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/5 px-2">
                {[
                  { color: "bg-white/20", label: "Open" },
                  { color: "bg-red-500/40", label: "Full" },
                  { color: "bg-zinc-800", label: "Block" },
                  { color: "bg-[#00FFFF]", label: "Your Selection" }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border border-white/10 ${item.color}`}></div> 
                    <span className="text-[9px] uppercase font-black text-white tracking-widest text-center">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA BUTTON */}
      <div className="fixed bottom-24 left-0 right-0 p-8 z-[90] pointer-events-none">
        <motion.button
          disabled={!selectedSlot}
          whileTap={selectedSlot ? { scale: 0.95 } : {}}
          onClick={handleContinue}
          className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 transition-all pointer-events-auto backdrop-blur-2xl border ${
            selectedSlot 
              ? "bg-[#00FFFF] text-black border-[#00FFFF] shadow-[0_20px_50px_rgba(0,255,255,0.3)]" 
              : "bg-white/5 text-zinc-700 border-white/5"
          }`}
        >
          {selectedSlot ? (
            <>
              <Zap size={18} fill="currentColor" /> 
              Confirm Protocol {selectedSlot}
            </>
          ) : (
            "Select Grid Unit"
          )}
        </motion.button>
      </div>
    </div>
  );
}