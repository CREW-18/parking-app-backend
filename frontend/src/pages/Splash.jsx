import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BrandMark } from "../components/PremiumUI";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="auth-shell app-bg overflow-hidden">
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-60" />
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-md flex-col items-center text-center"
      >
        <BrandMark />
        <h1 className="mt-10 text-5xl font-black tracking-tight text-[var(--ink)] md:text-6xl">
          The city is ready.
        </h1>
        <p className="muted-copy mt-4 max-w-sm text-base leading-7">
          Slotify prepares parking, payment, and entry into one calm reservation flow.
        </p>
        <div className="mt-10 h-2 w-48 overflow-hidden rounded-full bg-[var(--surface-strong)]">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "260%" }}
            transition={{ duration: 2.2, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-16 rounded-full bg-[var(--accent)]"
          />
        </div>
      </motion.section>
    </main>
  );
}
