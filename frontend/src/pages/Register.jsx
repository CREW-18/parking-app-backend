import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, ShieldCheck, ChevronRight } from "lucide-react";
import { registerUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser({ name, email, password });
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001F3F] relative overflow-hidden font-sans px-6">
      <div className="absolute w-[500px] h-[500px] bg-[#00FFFF]/10 blur-[120px] rounded-full -top-20 -left-20 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-[#00FFFF]/5 blur-[100px] rounded-full -bottom-20 -right-20" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex p-3 rounded-2xl bg-[#00FFFF]/10 border border-[#00FFFF]/20 text-[#00FFFF] mb-4"
          >
            <ShieldCheck size={32} />
          </motion.div>
          <h1 className="text-4xl font-black italic-none tracking-tighter text-white uppercase">Initialize Profile</h1>
          <p className="text-[10px] text-[#00FFFF] tracking-[0.4em] uppercase font-bold mt-2 opacity-60">
            Join the Slotify Network
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00FFFF] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#001F3F]/50 border border-white/10 px-12 py-4 rounded-2xl focus:outline-none focus:border-[#00FFFF]/50 focus:ring-1 focus:ring-[#00FFFF]/20 transition-all text-sm text-white placeholder:text-gray-600"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00FFFF] transition-colors" size={18} />
              <input
                type="email"
                placeholder="Secure Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#001F3F]/50 border border-white/10 px-12 py-4 rounded-2xl focus:outline-none focus:border-[#00FFFF]/50 focus:ring-1 focus:ring-[#00FFFF]/20 transition-all text-sm text-white placeholder:text-gray-600"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00FFFF] transition-colors" size={18} />
              <input
                type="password"
                placeholder="Access Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#001F3F]/50 border border-white/10 px-12 py-4 rounded-2xl focus:outline-none focus:border-[#00FFFF]/50 focus:ring-1 focus:ring-[#00FFFF]/20 transition-all text-sm text-white placeholder:text-gray-600"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 ${
                loading
                ? "bg-gray-800 text-gray-500"
                : "bg-[#00FFFF] text-[#001F3F] shadow-[0_10px_30px_rgba(0,255,255,0.2)]"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Identity <ChevronRight size={16} /></>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Already Synced?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#00FFFF] hover:underline transition-all"
              >
                Login to Hub
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4 opacity-30">
           <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-[#00FFFF] rounded-full animate-pulse" />
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase">Auth Secure</span>
           </div>
           <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-[#00FFFF] rounded-full animate-pulse" />
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase">Grid Active</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
