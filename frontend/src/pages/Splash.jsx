import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // Increased slightly to let the "Unlocked" animation breathe

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-[#001F3F] flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Background Pulse Glow (Electric Cyan) */}
      <div className="absolute w-96 h-96 bg-[#00FFFF] opacity-10 blur-[120px] rounded-full animate-pulse" />

      {/* Main Logo Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Wordmark: slotify */}
        <div className="flex items-center text-6xl font-black tracking-tight text-white italic-none">
          <span>sl</span>
          
          {/* The Hero 'O' (Triple Threat: Lock, Car, Headphones) */}
          <motion.div 
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="relative mx-1 w-16 h-16 border-4 border-[#00FFFF] rounded-full flex items-center justify-center"
          >
            {/* The Headphone Arch / Padlock Shackle */}
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -top-6 w-10 h-8 border-t-2 border-l-2 border-r-2 border-[#00FFFF] rounded-t-full"
            >
              {/* The "Unlocked" Gap */}
              <div className="absolute -top-1 right-2 w-1 h-2 bg-[#001F3F]" />
            </motion.div>

            {/* The Car (Hidden Spot) */}
            <div className="w-6 h-10 bg-white rounded-md relative shadow-[0_0_10px_rgba(0,255,255,0.5)]">
               <div className="absolute top-2 left-1 right-1 h-3 bg-[#001F3F] rounded-sm opacity-80" /> {/* Windshield */}
            </div>
          </motion.div>

          <span>tify</span>
        </div>

        {/* Slogan: The City, Unlocked. */}
        <motion.h2
          initial={{ letterSpacing: "0.1em", opacity: 0 }}
          animate={{ letterSpacing: "0.4em", opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-8 text-xs font-light text-[#00FFFF] uppercase tracking-[0.4em]"
        >
          The City, Unlocked.
        </motion.h2>
      </motion.div>

      {/* Bottom Loading Bar (Visual flavor) */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ delay: 0.5, duration: 2 }}
        className="absolute bottom-20 h-[1px] bg-white/20"
      >
        <div className="h-full bg-[#00FFFF] w-1/3 animate-infinite-loading" />
      </motion.div>

    </div>
  );
}