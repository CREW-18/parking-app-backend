import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import { api } from "../api/api";
import {
  CreditCard,
  Smartphone,
  Landmark,
  Check,
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock
} from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUser();
  
  const [selectedMethod, setSelectedMethod] = useState("gpay");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fallback for amount if navigation state is lost
  const bookingData = location.state?.booking || location.state || {};
  const amount = bookingData.amount || 120;

  const paymentMethods = [
    { id: "gpay", label: "Google Pay", icon: <Smartphone size={20} />, provider: "UPI Instant" },
    { id: "upi", label: "PhonePe / Paytm", icon: <Smartphone size={20} />, provider: "UPI ID" },
    { id: "card", label: "Cards", icon: <CreditCard size={20} />, provider: "Visa, Mastercard" },
    { id: "netbanking", label: "Net Banking", icon: <Landmark size={20} />, provider: "All Major Banks" },
  ];

  const handlePayment = async () => {
    setLoading(true);

    try {
      const bookingResponse = await api.post("/api/bookings", {
        mallName: bookingData.mall || "Unknown Location",
        slot: bookingData.slot || "Unassigned",
        hours: Number(bookingData.duration) || 1,
        totalPrice: Number(amount) || 120,
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/ticket", { 
          state: { 
            booking: {
              ...bookingData,
              id: bookingResponse.data._id,
              date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
              time: bookingData.entryTime || "10:00",
              location: bookingData.mall || "UB City Mall"
            } 
          } 
        });
      }, 2500);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Payment could not be completed.");
    }
  };

  // SUCCESS OVERLAY
  if (success) {
    return (
      <div className="min-h-screen bg-[#000d1a] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Success Bloom */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[3.5rem] text-center shadow-2xl relative z-10"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -45 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_20px_50px_rgba(16,185,129,0.4)]"
          >
            <Check size={48} className="text-white" strokeWidth={3} />
          </motion.div>
          
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Authorized</h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 px-4">
            Payment verified for <span className="text-[#00FFFF]">{userData?.name || "Pilot"}</span>
          </p>
          
          <div className="space-y-2">
             <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Linking To Grid...</p>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "100%" }} 
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-full bg-[#00FFFF] shadow-[0_0_15px_rgba(0,255,255,1)]"
                />
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000d1a] text-white flex flex-col font-sans relative overflow-hidden">
      {/* AMBIENT EFFECTS */}
      <div className="fixed top-[-10%] right-[-10%] w-[70%] h-[50%] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[60%] h-[50%] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-center px-8 pt-16 pb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl"
        >
          <ChevronLeft size={20} className="text-[#00FFFF]" />
        </button>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-3xl">
          <Lock size={14} className="text-[#00FFFF]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">SSL v3 Ready</span>
        </div>
      </div>

      <div className="relative z-10 px-8 flex-1 flex flex-col max-w-xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Checkout</h1>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mt-3">Gateway Identification Required</p>
        </div>

        {/* PRICE DISPLAY */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 mb-10 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00FFFF]/10 blur-3xl rounded-full" />
          
          <div className="relative z-10">
            <p className="text-[9px] font-black text-[#00FFFF] uppercase tracking-[0.3em] mb-4">Allocation Credit</p>
            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-7xl font-black tracking-tighter text-white">Rs {amount}</span>
              <span className="text-xl text-white/20 font-black">.00</span>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Target Sector</p>
                <p className="text-sm font-black uppercase italic truncate max-w-[150px]">{bookingData.mall || "Sector 7"}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Identity</p>
                <div className="flex items-center gap-2">
                   <span className="text-xs font-black uppercase text-[#00FFFF]">{userData?.name?.split(' ')[0] || "Guest"}</span>
                   <div className="w-5 h-5 rounded-md border border-white/10 overflow-hidden">
                      <img src={userData?.profilePic} className="w-full h-full object-cover" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* METHOD SELECTOR */}
        <div className="space-y-4 mb-10">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Channel Selection</p>
          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-6 rounded-[2.2rem] transition-all duration-300 border ${
                  selectedMethod === method.id
                    ? "bg-white/10 border-[#00FFFF]/50 shadow-[0_0_30px_rgba(0,255,255,0.05)]"
                    : "bg-white/[0.02] border-white/5"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    selectedMethod === method.id ? "bg-[#00FFFF] text-[#000d1a]" : "bg-white/5 text-white/20"
                  }`}>
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-black uppercase tracking-tight ${selectedMethod === method.id ? "text-white" : "text-white/40"}`}>
                      {method.label}
                    </p>
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{method.provider}</p>
                  </div>
                </div>
                
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id ? "border-[#00FFFF]" : "border-white/10"
                }`}>
                  {selectedMethod === method.id && (
                    <motion.div layoutId="pay-dot" className="w-2 h-2 bg-[#00FFFF] rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="mt-auto pb-12">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-3 transition-all ${
              loading
                ? "bg-white/5 text-white/20 border border-white/10"
                : "bg-[#00FFFF] text-[#000d1a] shadow-[0_20px_40px_rgba(0,255,255,0.2)]"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#000d1a]/20 border-t-[#000d1a] rounded-full animate-spin" />
            ) : (
              <>
                Initialize Transfer
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
          <p className="text-center mt-6 text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">End-to-End Encryption Active</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
