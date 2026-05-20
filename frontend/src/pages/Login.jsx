import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chrome, Facebook, Apple } from "lucide-react";
import { loginUser } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001F3F] relative overflow-hidden text-white font-sans">
      <div className="absolute w-[500px] h-[500px] bg-[#00FFFF]/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00FFFF]/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: "0 0 10px #00FFFF",
              animation: `float ${3 + Math.random() * 5}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative bg-white/5 backdrop-blur-2xl border border-white/10 w-full max-w-md rounded-[2.5rem] p-12 shadow-2xl transition-all duration-1000 ease-out ${
          animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
             <div className="w-16 h-16 border-4 border-[#00FFFF] rounded-full flex items-center justify-center relative shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                <div className="absolute -top-5 w-10 h-8 border-t-2 border-l-2 border-r-2 border-[#00FFFF] rounded-t-full">
                   <div className="absolute -top-1 right-1.5 w-1.5 h-2 bg-[#001F3F]" />
                </div>
                <div className="w-5 h-8 bg-white rounded-sm relative">
                   <div className="absolute top-1.5 left-0.5 right-0.5 h-2.5 bg-[#001F3F] rounded-xs" />
                </div>
             </div>
          </div>

          <h1 className="text-3xl font-black tracking-tighter text-white">slotify</h1>
          <p className="text-[#00FFFF] text-[10px] uppercase tracking-[0.5em] mt-2 font-light">The City, Unlocked.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00FFFF] focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00FFFF] focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-[#00FFFF] text-[#001F3F] py-4 rounded-2xl font-bold overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] active:scale-95"
          >
            <span className="relative z-10">
              {loading ? "UNLOCKING..." : "ACCESS CITY"}
            </span>
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-white/10"></div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Or connect via</span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          {[
            { icon: <Chrome size={20} />, label: "Google" },
            { icon: <Facebook size={20} />, label: "Facebook" },
            { icon: <Apple size={20} />, label: "Apple" },
          ].map((social) => (
            <button
              key={social.label}
              aria-label={social.label}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-[#00FFFF] hover:border-[#00FFFF]/50 hover:bg-white/10 transition-all"
            >
              {social.icon}
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-between items-center text-xs text-gray-500">
          <span className="hover:text-white cursor-pointer transition">Forgot Access?</span>
          <span
            onClick={() => navigate("/register")}
            className="text-[#00FFFF] cursor-pointer font-bold hover:brightness-125 transition"
          >
            Get the Key
          </span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </div>
  );
}
