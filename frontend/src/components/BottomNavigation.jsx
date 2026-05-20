import React from "react";
import { Compass, LayoutDashboard, Ticket, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/my-bookings", icon: Ticket, label: "Passes" },
    { to: "/navigate", icon: Compass, label: "Route" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="relative flex h-16 items-center justify-around" aria-label="Primary navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;

        return (
          <button
            key={item.to}
            onClick={() => navigate(item.to)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={`group relative flex h-14 min-w-14 flex-col items-center justify-center rounded-[22px] px-3 transition-colors duration-300 ${
              isActive ? "text-[var(--accent-strong)]" : "text-[var(--ink-soft)] hover:text-[var(--accent)]"
            }`}
          >
            {isActive && (
              <motion.div 
                layoutId="nav-active"
                className="absolute inset-0 rounded-[22px] bg-[var(--accent-soft)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <div className={`relative z-10 transition-transform duration-300 ${isActive ? "-translate-y-0.5" : "group-hover:-translate-y-0.5"}`}>
              <Icon 
                size={21} 
                className={isActive ? "text-[var(--accent-strong)]" : ""}
                strokeWidth={2}
              />
            </div>

            <span className={`relative z-10 mt-1 text-[10px] font-bold leading-none transition-opacity duration-300 ${
              isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
