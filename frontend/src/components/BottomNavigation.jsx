import React from "react";
import { Zap, Ticket, MapPin, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: Zap, label: "Core" },
    { to: "/my-bookings", icon: Ticket, label: "Pass" },
    { to: "/navigate", icon: MapPin, label: "Grid" },
    { to: "/profile", icon: User, label: "Pilot" },
  ];

  return (
    <div className="flex justify-around items-center h-16 relative">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;

        return (
          <button
            key={item.to}
            onClick={() => navigate(item.to)}
            className="relative flex flex-col items-center justify-center w-14 h-14 transition-all duration-500 group"
          >
            {/* 1. SELECTION GLOW (Framer Motion for smooth sliding) */}
            {isActive && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute inset-0 bg-[#00FFFF]/5 blur-xl rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {/* 2. ICON LOGIC */}
            <div className={`relative z-10 transition-transform duration-300 ${isActive ? "scale-110 -translate-y-1" : "group-hover:scale-110"}`}>
              <Icon 
                size={22} 
                className={`transition-colors duration-300 ${isActive ? "text-[#00FFFF]" : "text-zinc-600"}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              {/* Subtle Icon Internal Glow */}
              {isActive && (
                <div className="absolute inset-0 text-[#00FFFF] blur-[4px] opacity-50">
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* 3. LABEL (Appears only when active) */}
            <span className={`text-[7px] font-black uppercase tracking-[0.2em] mt-1 transition-all duration-300 ${
              isActive ? "text-[#00FFFF] opacity-100" : "opacity-0"
            }`}>
              {item.label}
            </span>

            {/* 4. ACTIVE INDICATOR (The Dot) */}
            {isActive && (
              <motion.div 
                layoutId="nav-dot"
                className="absolute -bottom-0.5 w-1.5 h-[2px] bg-[#00FFFF] rounded-full shadow-[0_0_10px_#00FFFF]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavigation;