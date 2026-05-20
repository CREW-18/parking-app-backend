import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, ShieldCheck, Camera, ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useUser } from "../context/UserContext";

const Profile = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [localUser, setLocalUser] = useState({
    name: "",
    email: "",
    profilePic: "",
    userId: ""
  });

  // Sync local state with global context on mount
  useEffect(() => {
    if (userData) {
      setLocalUser({
        name: userData.name || "Aravind Swamy",
        email: userData.email || "aravind.ux@slotify.com",
        profilePic: userData.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Aravind",
        userId: userData.userId || "SLOT-8829"
      });
    }
  }, [userData]);

  const handleSave = async () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      updateUserData(localUser);
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#000d1a] text-white font-sans p-6 relative overflow-hidden">
      
      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-10 left-6 right-6 z-[100] bg-emerald-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
          >
            <CheckCircle2 size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Profile Cloud Sync Complete</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AMBIENT BACKGROUND */}
      <div className="fixed top-[-10%] left-[-10%] w-[70%] h-[50%] bg-[#00FFFF]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 flex items-center justify-between mb-10 pt-4">
        <button 
          onClick={() => navigate(-1)} 
          className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl text-[#00FFFF]"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md">
           <ShieldCheck size={14} className="text-[#00FFFF]" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">ID Verified</span>
        </div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        
        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-[2.5rem] border-2 border-[#00FFFF]/20 p-1 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.1)]"
            >
              <img src={localUser.profilePic} alt="Profile" className="w-full h-full object-cover rounded-[2.3rem]" />
            </motion.div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-2 -right-2 p-3 bg-[#00FFFF] text-[#000d1a] rounded-2xl shadow-xl border-4 border-[#000d1a]"
            >
              <Camera size={18} />
            </motion.button>
          </div>
          <h2 className="mt-6 text-3xl font-black italic uppercase tracking-tighter">{localUser.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Sparkles size={12} className="text-[#00FFFF] animate-pulse" />
            <span className="text-[9px] font-black text-white/30 tracking-[0.3em] uppercase">Executive Pilot</span>
          </div>
        </div>

        {/* PROFILE GLASS CARD */}
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 space-y-8 shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FFFF]/20 to-transparent" />
          
          <div className="space-y-6">
            <div className="group">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 mb-2">Neural Identity</p>
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 focus-within:border-[#00FFFF]/50 transition-all">
                <User size={18} className="text-white/20 group-focus-within:text-[#00FFFF]" />
                <input 
                  value={localUser.name} 
                  onChange={(e) => setLocalUser({...localUser, name: e.target.value})}
                  className="bg-transparent w-full outline-none text-sm font-bold text-white placeholder:text-white/10"
                  placeholder="Enter Name"
                />
              </div>
            </div>

            <div className="group opacity-50">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1 mb-2">Comms Channel</p>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                <Mail size={18} className="text-white/20" />
                <input 
                  value={localUser.email} 
                  disabled
                  className="bg-transparent w-full outline-none text-sm font-bold text-white/50"
                />
              </div>
            </div>
          </div>

          {/* QR IDENTIFIER */}
          <div className="pt-8 border-t border-white/5 flex flex-col items-center">
            <div className="bg-white p-4 rounded-[2rem] relative group">
              <QRCodeCanvas 
                value={`USER-${localUser.userId}`} 
                size={110} 
                fgColor="#000d1a"
                level="H"
              />
            </div>
            <div className="mt-4 px-4 py-1 bg-white/5 rounded-full border border-white/5">
                <p className="text-[8px] font-black text-[#00FFFF] uppercase tracking-[0.4em]">{localUser.userId}</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-6 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 ${
            loading
              ? "bg-white/5 text-white/20 border border-white/5"
              : "bg-white text-[#000d1a] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#000d1a]/20 border-t-[#000d1a] rounded-full animate-spin" />
          ) : (
            "Update Protocol"
          )}
        </motion.button>

        <p className="text-center mt-10 text-[8px] font-black text-white/10 uppercase tracking-[0.5em] leading-relaxed">
            Data encrypted via Slotify Quantum Bridge
        </p>
      </div>
    </div>
  );
};

export default Profile;
