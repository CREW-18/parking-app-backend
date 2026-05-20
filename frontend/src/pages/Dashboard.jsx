import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Car,
  ChevronRight,
  LogOut,
  MapPin,
  ParkingCircle,
  Sparkles,
  Star,
  Ticket,
} from "lucide-react";
import { BrandMark, Button, LoadingState, StatusPill, Surface } from "../components/PremiumUI";
import { useUser } from "../context/UserContext";
import { api } from "../api/api";
import { logoutUser } from "../api/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const liveEvents = [
    {
      id: 1,
      title: "Late-night retail window",
      location: "Phoenix Mall of Asia",
      tag: "Retail priority",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Arena arrivals optimized",
      location: "Nexus Mall",
      tag: "Event traffic",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const fetchMalls = async () => {
      try {
        const response = await api.get("/api/locations");
        setMalls(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Integration Error:", error);
        setMalls([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMalls();

    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % liveEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [liveEvents.length]);

  const handleLogout = () => {
    if (window.confirm("Logout from Slotify?")) {
      logoutUser();
    }
  };

  if (loading || userLoading) {
    return <LoadingState label="Preparing your dashboard" />;
  }

  return (
    <main className="page-shell">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <BrandMark />
        <div className="flex items-center gap-3">
          <StatusPill>
            <Sparkles size={14} className="text-[var(--accent)]" />
            {getGreeting()}
          </StatusPill>
          <button
            onClick={() => navigate("/profile")}
            className="flex min-h-12 items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface)] py-1.5 pl-2 pr-4 shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
          >
            <img
              src={userData?.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Slotify"}
              alt="User profile"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="text-sm font-black text-[var(--ink)]">{userData?.name?.split(" ")[0] || "Pilot"}</span>
          </button>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="grid h-12 w-12 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)] transition hover:text-[var(--danger)]"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Surface className="overflow-hidden p-7 sm:p-9">
          <p className="eyebrow mb-4">Authorized parking</p>
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-tight text-[var(--ink)] md:text-6xl">
                Find your space before the city gets loud.
              </h1>
              <p className="muted-copy mt-5 max-w-xl text-lg leading-8">
                Choose a location, reserve a slot, pay securely, and carry your QR pass into the gate.
              </p>
            </div>
            <Button variant="accent" onClick={() => navigate("/my-bookings")} className="px-6">
              My passes
              <Ticket size={18} />
            </Button>
          </div>
        </Surface>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <Surface className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--muted)]">Live availability</p>
                <p className="stat-number mt-2 text-4xl font-black tracking-tight text-[var(--ink)]">1,240</p>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <ParkingCircle size={28} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">Bengaluru hub showing high slot readiness.</p>
          </Surface>
          <Surface className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[var(--muted)]">KCT hardware</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-[var(--ink)]">Live sync</p>
              </div>
              <span className="h-3 w-3 rounded-full bg-[var(--success)] animate-breathe" />
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">Sensor-linked slots update in the booking screen.</p>
          </Surface>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Surface className="self-start overflow-hidden p-4">
          <div className="relative h-[320px] overflow-hidden rounded-[26px] sm:h-[360px] lg:h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={liveEvents[activeTab].image}
                  className="h-full w-full object-cover"
                  alt={liveEvents[activeTab].title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <span className="inline-flex rounded-full bg-white/18 px-3 py-1 text-xs font-bold backdrop-blur">
                    {liveEvents[activeTab].tag}
                  </span>
                  <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight">{liveEvents[activeTab].title}</h2>
                  <p className="mt-3 flex items-center gap-2 text-sm text-white/78">
                    <MapPin size={16} />
                    {liveEvents[activeTab].location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="grid gap-3 p-3 pt-5 sm:grid-cols-2">
            <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Event routing</p>
              <p className="mt-2 text-lg font-black text-[var(--ink)]">Priority slots surfaced first</p>
            </div>
            <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Best time</p>
              <p className="stat-number mt-2 text-lg font-black text-[var(--accent)]">10:00 - 11:00</p>
            </div>
          </div>
        </Surface>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Nearby grids</p>
              <h2 className="text-3xl font-black tracking-tight text-[var(--ink)]">Choose your destination</h2>
            </div>
            <Car size={22} className="text-[var(--muted)]" />
          </div>

          <div className="grid gap-4">
            {malls.length > 0 ? (
              malls.map((mall, idx) => {
                const isBusy = mall.status === "High Demand" || mall.status === "Congested";
                const capacity = isBusy ? "88%" : "24%";

                return (
                  <motion.button
                    key={mall._id || idx}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate(`/booking?venue=${encodeURIComponent(mall.name)}`, { state: mall })}
                    className="premium-surface grid w-full gap-5 p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--line-strong)] sm:grid-cols-[104px_1fr_auto] sm:items-center"
                  >
                    <img
                      src={mall.image}
                      className="h-28 w-full rounded-[24px] object-cover sm:h-24 sm:w-24"
                      alt={mall.name}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600";
                      }}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-black tracking-tight text-[var(--ink)]">{mall.name}</h3>
                        <StatusPill tone={isBusy ? "warning" : "success"}>{mall.status || "Available"}</StatusPill>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
                        {mall.location} · {mall.distance}
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                          <div
                            className={`h-full rounded-full ${isBusy ? "bg-orange-500" : "bg-[var(--accent)]"}`}
                            style={{ width: capacity }}
                          />
                        </div>
                        <span className="stat-number text-xs font-black text-[var(--muted)]">{capacity}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <span className="inline-flex items-center gap-1 text-sm font-black text-[var(--ink)]">
                        <Star size={15} fill="currentColor" className="text-amber-500" />
                        {mall.rating}
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--surface-soft)] text-[var(--ink)]">
                        <ChevronRight size={20} />
                      </span>
                    </div>
                  </motion.button>
                );
              })
            ) : (
              <Surface className="p-8 text-center">
                <CalendarCheck size={34} className="mx-auto text-[var(--muted)]" />
                <p className="mt-4 font-black text-[var(--ink)]">Waiting for grid signal</p>
                <p className="muted-copy mt-2 text-sm">Locations will appear once the backend responds.</p>
              </Surface>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
