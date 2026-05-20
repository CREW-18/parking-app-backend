import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  MapPin,
  Navigation,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { BrandMark, Button, StatusPill, Surface } from "../components/PremiumUI";
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
    amount: "120",
  };

  useEffect(() => {
    const timer = setTimeout(() => setQrLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleStartNavigation = () => {
    navigate("/navigate", {
      state: {
        booking: {
          mall: booking.location || booking.mall || "UB City Mall",
          mallImage: booking.mallImage,
          lat: booking.lat || "13.0827",
          lng: booking.lng || "80.2707",
          slot: booking.slot,
        },
      },
    });
  };

  return (
    <main className="app-bg min-h-[100dvh] px-5 py-8">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="grid h-12 w-12 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={19} />
          </button>
          <BrandMark compact />
        </header>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <Surface className="overflow-hidden">
            <div className="flex items-center justify-between p-7">
              <div className="flex items-center gap-4">
                <img src={userData?.profilePic} alt="Pilot" className="h-12 w-12 rounded-2xl border border-[var(--line)] object-cover" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Pilot</p>
                  <h1 className="text-lg font-black tracking-tight text-[var(--ink)]">{userData?.name || "Unidentified Pilot"}</h1>
                </div>
              </div>
              <StatusPill tone="success">
                <ShieldCheck size={14} />
                Authorized
              </StatusPill>
            </div>

            <div className="border-y border-[var(--line)] bg-[var(--surface-soft)] p-7 text-center">
              <div className="relative mx-auto inline-block rounded-[32px] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <QRCodeSVG value={`slotify-booking-${booking.id}`} size={188} level="H" includeMargin={false} fgColor="#0b1220" />
                {!qrLoaded && (
                  <div className="absolute inset-0 grid place-items-center rounded-[32px] bg-white">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--accent)]" />
                  </div>
                )}
              </div>
              <p className="stat-number mt-5 font-mono text-xs font-black tracking-[0.28em] text-[var(--accent)]">{booking.id}</p>
            </div>

            <div className="space-y-5 p-7">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem icon={<Calendar size={15} />} label="Arrival date" value={booking.date} />
                <DetailItem icon={<Clock size={15} />} label="Arrival time" value={booking.time} />
              </div>

              <div className="flex items-end justify-between gap-4 rounded-[24px] bg-[var(--surface-soft)] p-5">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Destination</p>
                  <p className="flex items-center gap-2 text-xl font-black tracking-tight text-[var(--ink)]">
                    <MapPin size={17} className="text-[var(--accent)]" />
                    {booking.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Unit</p>
                  <p className="stat-number text-2xl font-black text-[var(--accent)]">{booking.slot}</p>
                </div>
              </div>
            </div>
          </Surface>

          <div className="mt-6 grid gap-3">
            <Button variant="accent" onClick={handleStartNavigation} className="w-full">
              <Navigation size={18} />
              Start navigation
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" className="w-full">
                <Download size={16} />
                PDF
              </Button>
              <Button variant="ghost" className="w-full">
                <Share2 size={16} />
                Share
              </Button>
            </div>
          </div>

          <p className="muted-copy mx-auto mt-6 max-w-xs text-center text-sm leading-6">
            Scan this pass at terminal gate {booking.slot?.split("-")[0]} for entry authorization.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

const DetailItem = ({ icon, label, value }) => (
  <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
    <div className="mb-2 flex items-center gap-2 text-[var(--muted)]">
      {icon}
      <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
    </div>
    <p className="font-black tracking-tight text-[var(--ink)]">{value}</p>
  </div>
);

export default Ticket;
