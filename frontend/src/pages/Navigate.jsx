import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, MapPin, Navigation, Send } from "lucide-react";
import { api } from "../api/api";
import { BrandMark, Button, LoadingState, StatusPill, Surface } from "../components/PremiumUI";

const Navigate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking || null;
  const [visible, setVisible] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(!booking);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (booking) {
      return;
    }

    const fetchLocations = async () => {
      try {
        const response = await api.get("/api/locations");
        setLocations(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Navigation location fetch failed:", error);
        setLocations([]);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [booking]);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.lat},${booking.lng}`;
    window.open(url, "_blank");
  };

  const openSelectedDestination = (mall) => {
    navigate("/navigate", {
      replace: true,
      state: {
        booking: {
          mall: mall.name,
          mallImage: mall.image,
          lat: mall.lat || "13.0827",
          lng: mall.lng || "80.2707",
          slot: "Choose after arrival",
        },
      },
    });
  };

  return (
    <main className="app-bg min-h-[100dvh] px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100dvh-64px)] w-full max-w-4xl flex-col">
        <header className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 font-bold text-[var(--ink)] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <BrandMark compact />
        </header>

        {!booking && (
          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            className="flex flex-1 flex-col justify-center"
          >
            <div className="mb-8 max-w-2xl">
              <StatusPill>
                <Compass size={14} className="text-[var(--accent)]" />
                Choose route
              </StatusPill>
              <h1 className="mt-6 text-5xl font-black leading-[0.98] tracking-tight text-[var(--ink)] md:text-6xl">
                Where are you heading?
              </h1>
              <p className="muted-copy mt-5 max-w-lg text-lg leading-8">
                Pick a destination first. Slotify will only open navigation after you choose the mall.
              </p>
            </div>

            {loadingLocations ? (
              <LoadingState label="Loading destinations" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {locations.length > 0 ? (
                  locations.map((mall) => (
                    <button
                      key={mall._id || mall.name}
                      onClick={() => openSelectedDestination(mall)}
                      className="premium-surface overflow-hidden text-left transition hover:-translate-y-0.5 hover:border-[var(--line-strong)]"
                    >
                      <img
                        src={mall.image}
                        alt={mall.name}
                        className="h-44 w-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600";
                        }}
                      />
                      <div className="p-5">
                        <h2 className="text-2xl font-black tracking-tight text-[var(--ink)]">{mall.name}</h2>
                        <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
                          {mall.location || "Bengaluru"} · {mall.distance || "Nearby"}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <Surface className="p-8">
                    <h2 className="text-2xl font-black text-[var(--ink)]">No destinations online</h2>
                    <p className="muted-copy mt-3 leading-7">Go back to the dashboard and select a mall once locations load.</p>
                    <Button onClick={() => navigate("/dashboard")} className="mt-6">
                      Back to dashboard
                    </Button>
                  </Surface>
                )}
              </div>
            )}
          </motion.section>
        )}

        {booking && (
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          className="grid flex-1 items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div>
            <StatusPill>
              <Compass size={14} className="text-[var(--accent)]" />
              Pathfinding
            </StatusPill>
            <h1 className="mt-6 text-5xl font-black leading-[0.98] tracking-tight text-[var(--ink)] md:text-6xl">
              Route to {booking.mall}
            </h1>
            <p className="muted-copy mt-5 max-w-lg text-lg leading-8">
              Slotify keeps this screen simple: confirm your destination, open maps, and finish the route when you arrive.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Surface className="p-5">
                <p className="text-sm font-bold text-[var(--muted)]">Remaining</p>
                <p className="stat-number mt-2 text-4xl font-black tracking-tight text-[var(--ink)]">3.2 km</p>
              </Surface>
              <Surface className="p-5">
                <p className="text-sm font-bold text-[var(--muted)]">Arrival</p>
                <p className="stat-number mt-2 text-4xl font-black tracking-tight text-[var(--accent)]">6 min</p>
              </Surface>
            </div>
          </div>

          <Surface className="overflow-hidden p-0">
            <div className="relative aspect-square min-h-[320px]">
              <img src={booking.mallImage} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/15 to-transparent" />
              <div className="absolute inset-0 grid place-items-center p-8 text-center text-white">
                <div>
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-white text-[var(--ink)] shadow-[0_18px_42px_rgba(15,23,42,0.22)]">
                    <Navigation size={40} className="text-[var(--accent)]" />
                  </div>
                  <h2 className="mt-8 text-3xl font-black tracking-tight">{booking.mall}</h2>
                  <p className="mt-3 flex items-center justify-center gap-2 text-sm font-bold text-white/76">
                    <MapPin size={15} />
                    Reserved slot {booking.slot}
                  </p>
                </div>
              </div>
            </div>
          </Surface>
        </motion.section>
        )}

        {booking && <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Button variant="accent" onClick={openGoogleMaps} className="w-full">
            <Send size={18} />
            Open in Maps
          </Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="w-full px-7">
            End navigation
          </Button>
        </div>}
        {booking && <p className="muted-copy mt-5 text-center text-sm">Safety first. Drive responsibly.</p>}
      </div>
    </main>
  );
};

export default Navigate;
