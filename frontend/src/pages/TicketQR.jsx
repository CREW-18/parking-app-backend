import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Navigation 
} from "lucide-react";
import { useUser } from "../context/UserContext";

function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useUser();
  const [qrLoaded, setQrLoaded] = useState(false);

  const booking = location.state?.booking || {
    id: "SLT-X99204",
    location: "UB City Mall",
    slot: "F1-A12",
    date: "24 MAR 2026",
    time: "10:00 AM",
    amount: "120"
  };

  useEffect(() => {
    const timer = setTimeout(() => setQrLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleStartNavigation = () => {
    navigate("/navigate", { state: { target: booking.location, slot: booking.slot } });
  };

  return (
    <div className="min-h-screen bg-[#000d1a] text-white font-sans relative overflow-hidden flex flex-col items-center py-12 px-6">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#00FFFF 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-[#00FFFF]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="w-full max-w-sm flex items-center justify-between mb-10 relative z-10">
        <button 
          onClick={() => navigate("/dashboard")}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#00FFFF]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-right">
          <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Access Pass</h1>
          <p className="text-[8px] font-black text-[#00FFFF] tracking-[0.3em] uppercase mt-1">Status: Authorized</p>
        </div>
      </div>

      {/* THE TICKET CARD - ENHANCED DIFFERENTIATION */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-[#0a1f2f]/80 backdrop-blur-3xl border border-white/20 rounded-[3rem] relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
      >
        {/* Top Section: User Info */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl border border-[#00FFFF]/30 overflow-hidden bg-black/60">
                <img src={userData?.profilePic} alt="Pilot" className="w-full h-full object-cover" />
             </div>
             <div>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Pilot in Command</p>
                <h2 className="text-sm font-black uppercase tracking-tighter">{userData?.name || "Unidentified Pilot"}</h2>
             </div>
          </div>
          <ShieldCheck className="text-[#00FFFF]" size={24} />
        </div>

        {/* QR Section */}
        <div className="p-8 flex flex-col items-center border-y border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
          <div className="bg-white p-4 rounded-[2rem] shadow-[0_0_50px_rgba(0,255,255,0.15)] relative">
            <QRCodeSVG 
              value={`slotify-booking-${booking.id}`} 
              size={180} 
              level="H"
              includeMargin={false}
              fgColor="#000d1a"
            />
            {!qrLoaded && (
              <div className="absolute inset-0 bg-white rounded-[2rem] flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-[#00FFFF] border-t-transparent animate-spin rounded-full" />
              </div>
            )}
          </div>
          <p className="mt-6 font-mono text-[10px] text-[#00FFFF] tracking-[0.5em] font-black uppercase">{booking.id}</p>
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <DetailItem icon={<Calendar size={12}/>} label="Arrival Date" value={booking.date} />
            <DetailItem icon={<Clock size={12}/>} label="Arrival Time" value={booking.time} />
          </div>

          <div className="flex items-center justify-between py-4 border-t border-white/5">
             <div>
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Grid Target</p>
                <div className="flex items-center gap-2">
                   <MapPin size={14} className="text-[#00FFFF]" />
                   <span className="text-lg font-black tracking-tighter uppercase">{booking.location}</span>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Unit</p>
                <span className="text-2xl font-black text-[#00FFFF] tracking-tighter uppercase">{booking.slot}</span>
             </div>
          </div>
        </div>

        {/* Ticket Perforation Holes */}
        <div className="absolute -left-3 top-[55%] -translate-y-1/2 w-6 h-6 bg-[#000d1a] rounded-full border-r border-white/10" />
        <div className="absolute -right-3 top-[55%] -translate-y-1/2 w-6 h-6 bg-[#000d1a] rounded-full border-l border-white/10" />
      </motion.div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex flex-col gap-4 w-full max-w-sm relative z-10">
        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={handleStartNavigation}
          className="w-full py-5 rounded-[2rem] bg-[#00FFFF] text-[#000d1a] flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.3em] shadow-[0_15px_35px_rgba(0,255,255,0.25)]"
        >
          <Navigation size={18} fill="#000d1a" />
          Start Navigation
        </motion.button>

        <div className="flex gap-4">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest"
          >
            <Download size={16} className="text-[#00FFFF]" />
            PDF
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest"
          >
            <Share2 size={16} className="text-[#00FFFF]" />
            Share
          </motion.button>
        </div>
      </div>

      <p className="mt-8 text-zinc-600 text-[8px] font-black uppercase tracking-[0.4em] text-center max-w-[200px] leading-relaxed">
        Scan this signal at terminal gate {booking.slot?.split('-')[0]} for automated hangar access.
      </p>
    </div>
  );
}

const DetailItem = ({ icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 opacity-30">
      {icon}
      <p className="text-[7px] font-black uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-xs font-black tracking-tight uppercase">{value}</p>
  </div>
);

export default Ticket;