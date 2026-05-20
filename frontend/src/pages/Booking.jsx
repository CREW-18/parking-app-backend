import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { API_BASE_URL, api } from "../api/api";
import { Button, StatusPill, Surface } from "../components/PremiumUI";
import { useUser } from "../context/UserContext";

const HARDWARE_SLOT_POLL_MS = 2000;
const BOOKING_MALL_STORAGE_KEY = "slotify:lastBookingMall";
const DEFAULT_MALL = {
  name: "UB City Mall",
  image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
};
const KCT_MALL = {
  name: "KCT",
  image: "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=900",
};

export default function Booking() {
  const navigate = useNavigate();
  const locationData = useLocation();
  const { userData } = useUser();

  const mall = useMemo(() => {
    if (locationData.state?.name) {
      return locationData.state;
    }

    const venueParam = new URLSearchParams(locationData.search).get("venue");
    if (venueParam?.toUpperCase() === "KCT") {
      return KCT_MALL;
    }

    try {
      const storedMall = JSON.parse(sessionStorage.getItem(BOOKING_MALL_STORAGE_KEY));
      if (storedMall?.name) {
        return storedMall;
      }
    } catch {
      sessionStorage.removeItem(BOOKING_MALL_STORAGE_KEY);
    }

    return DEFAULT_MALL;
  }, [locationData.search, locationData.state]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [floor, setFloor] = useState("F1");
  const [entryMinutes, setEntryMinutes] = useState(600);
  const [exitMinutes, setExitMinutes] = useState(660);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [hardwareSlots, setHardwareSlots] = useState([]);
  const [hardwareSync, setHardwareSync] = useState({
    isRefreshing: false,
    hasLoaded: false,
    lastSyncedAt: null,
    error: null,
  });

  const isHardwareVenue = mall.name?.toUpperCase() === "KCT";

  useEffect(() => {
    if (mall?.name) {
      sessionStorage.setItem(BOOKING_MALL_STORAGE_KEY, JSON.stringify(mall));
    }
  }, [mall]);

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const adjustTime = (type, amount) => {
    if (type === "entry") {
      setEntryMinutes((prev) => Math.max(0, prev + amount));
      setSelectedSlot(null);
    } else {
      setExitMinutes((prev) => Math.max(entryMinutes + 10, prev + amount));
    }
  };

  const slots = useMemo(() => {
    if (!showHeatmap) return [];

    if (isHardwareVenue) {
      return hardwareSlots.map((slot) => ({
        id: slot.slotNumber,
        occupancy: slot.isAvailable ? 0.1 : 1,
        unavailable: !slot.isAvailable,
        hardwareId: slot.hardwareId,
        isHardwareLinked: slot.isHardwareLinked,
      }));
    }

    const hour = Math.floor(entryMinutes / 60);

    return Array.from({ length: 20 }, (_, i) => {
      let baseOccupancy;
      const clusterFactor = i >= 7 && i <= 12 ? 0.3 : 0;

      if (hour >= 17 && hour <= 21) baseOccupancy = 0.5 + Math.random() * 0.5;
      else if (hour >= 8 && hour <= 11) baseOccupancy = Math.random() * 0.4;
      else baseOccupancy = 0.3 + Math.random() * 0.5;

      const occupancy = Math.min(baseOccupancy + clusterFactor, 1);
      const permanentlyBlocked = i === 2 || i === 17;
      const predictedFull = occupancy > 0.75;

      return {
        id: `${floor}-A${i + 1}`,
        occupancy,
        unavailable: permanentlyBlocked || predictedFull,
        permanentlyBlocked,
      };
    });
  }, [floor, entryMinutes, showHeatmap, isHardwareVenue, hardwareSlots]);

  const duration = exitMinutes > entryMinutes ? ((exitMinutes - entryMinutes) / 60).toFixed(1) : null;
  const openSlotCount = hardwareSlots.filter((slot) => slot.isAvailable).length;

  const formatSyncTime = (date) => {
    if (!date) return "Waiting";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleContinue = () => {
    navigate("/payment", {
      state: {
        userId: userData?.userId,
        userName: userData?.name,
        mall: mall.name,
        slot: selectedSlot,
        entryTime: formatTime(entryMinutes),
        exitTime: formatTime(exitMinutes),
        duration,
        amount: 120,
      },
    });
  };

  useEffect(() => {
    if (entryMinutes) {
      setShowHeatmap(true);
      setSelectedSlot(null);
    }
  }, [entryMinutes, floor]);

  useEffect(() => {
    if (!isHardwareVenue) {
      setHardwareSlots([]);
      setHardwareSync({
        isRefreshing: false,
        hasLoaded: false,
        lastSyncedAt: null,
        error: null,
      });
      return;
    }

    let isMounted = true;
    let isRequestInFlight = false;
    let eventSource = null;

    const fetchHardwareSlots = async () => {
      if (isRequestInFlight) {
        return;
      }

      isRequestInFlight = true;

      if (isMounted) {
        setHardwareSync((previous) => ({
          ...previous,
          isRefreshing: true,
        }));
      }

      try {
        const response = await api.get("/api/slots", {
          params: {
            locationName: "KCT",
            hardwareLinked: "true",
            _: Date.now(),
          },
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!isMounted) {
          return;
        }

        const nextSlots = Array.isArray(response.data) ? response.data : [];
        setHardwareSlots(nextSlots);
        setHardwareSync({
          isRefreshing: false,
          hasLoaded: true,
          lastSyncedAt: new Date(),
          error: null,
        });
      } catch (error) {
        console.error("Hardware slot fetch failed:", error);

        if (isMounted) {
          setHardwareSync((previous) => ({
            ...previous,
            isRefreshing: false,
            hasLoaded: true,
            error: "Sync delayed",
          }));
        }
      } finally {
        isRequestInFlight = false;
      }
    };

    const updateSlotsFromStream = (nextSlots) => {
      if (!isMounted || !Array.isArray(nextSlots)) {
        return;
      }

      setHardwareSlots(nextSlots);
      setHardwareSync({
        isRefreshing: false,
        hasLoaded: true,
        lastSyncedAt: new Date(),
        error: null,
      });
    };

    const updateOneSlotFromStream = (nextSlot) => {
      if (!isMounted || !nextSlot?.slotNumber) {
        return;
      }

      setHardwareSlots((previousSlots) => {
        const slotExists = previousSlots.some((slot) => slot.slotNumber === nextSlot.slotNumber);

        if (!slotExists) {
          return [...previousSlots, nextSlot].sort((a, b) => a.slotNumber.localeCompare(b.slotNumber));
        }

        return previousSlots.map((slot) => (slot.slotNumber === nextSlot.slotNumber ? nextSlot : slot));
      });

      setHardwareSync({
        isRefreshing: false,
        hasLoaded: true,
        lastSyncedAt: new Date(),
        error: null,
      });
    };

    const openHardwareStream = () => {
      if (!window.EventSource) {
        return;
      }

      const streamUrl = new URL("/api/slots/events", API_BASE_URL);
      streamUrl.searchParams.set("locationName", "KCT");
      streamUrl.searchParams.set("hardwareLinked", "true");

      eventSource = new EventSource(streamUrl.toString());

      eventSource.onopen = () => {
        if (isMounted) {
          setHardwareSync((previous) => ({
            ...previous,
            error: null,
          }));
        }
      };

      eventSource.addEventListener("slots", (event) => {
        updateSlotsFromStream(JSON.parse(event.data));
      });

      eventSource.addEventListener("slot", (event) => {
        updateOneSlotFromStream(JSON.parse(event.data));
      });

      eventSource.onerror = () => {
        if (isMounted) {
          setHardwareSync((previous) => ({
            ...previous,
            error: previous.hasLoaded ? null : "Sync delayed",
          }));
        }
      };
    };

    fetchHardwareSlots();
    openHardwareStream();
    const pollTimer = window.setInterval(fetchHardwareSlots, HARDWARE_SLOT_POLL_MS);
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchHardwareSlots();
      }
    };

    window.addEventListener("focus", fetchHardwareSlots);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      eventSource?.close();
      window.clearInterval(pollTimer);
      window.removeEventListener("focus", fetchHardwareSlots);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isHardwareVenue]);

  useEffect(() => {
    if (!selectedSlot) {
      return;
    }

    const selectedHardwareSlot = hardwareSlots.find((slot) => slot.slotNumber === selectedSlot);
    if (selectedHardwareSlot && !selectedHardwareSlot.isAvailable) {
      setSelectedSlot(null);
    }
  }, [hardwareSlots, selectedSlot]);

  return (
    <main className="page-shell mobile-safe-bottom">
      <header className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 font-bold text-[var(--ink)] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <p className="eyebrow mb-3">Booking setup</p>
          <h1 className="text-5xl font-black tracking-tight text-[var(--ink)]">{mall.name}</h1>
          <p className="muted-copy mt-3 max-w-xl leading-7">
            Set arrival, check live availability, and reserve one clean unit for your visit.
          </p>
        </div>
        <Surface className="overflow-hidden p-0">
          <div className="relative h-64">
            <img src={mall.image} alt={mall.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-white/70">Pilot identity</p>
                <p className="mt-1 text-2xl font-black tracking-tight">{userData?.name?.split(" ")[0] || "Guest"}</p>
              </div>
              <img src={userData?.profilePic} alt="Pilot" className="h-12 w-12 rounded-2xl border border-white/30 bg-[var(--surface)] object-cover" />
            </div>
          </div>
        </Surface>
      </header>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <Surface className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <TimerReset size={20} className="text-[var(--accent)]" />
              <h2 className="text-xl font-black tracking-tight text-[var(--ink)]">Time window</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { label: "Arrival", time: entryMinutes, type: "entry" },
                { label: "Departure", time: exitMinutes, type: "exit" },
              ].map((dial) => (
                <div key={dial.label} className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                  <p className="mb-3 text-sm font-bold text-[var(--muted)]">{dial.label}</p>
                  <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2 rounded-full bg-[var(--surface)] p-1">
                    <button
                      onClick={() => adjustTime(dial.type, -10)}
                      className="grid h-11 w-11 place-items-center rounded-full text-xl font-black text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"
                    >
                      -
                    </button>
                    <span className="stat-number text-center text-2xl font-black tracking-tight text-[var(--ink)]">{formatTime(dial.time)}</span>
                    <button
                      onClick={() => adjustTime(dial.type, 10)}
                      className="grid h-11 w-11 place-items-center rounded-full text-xl font-black text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {duration && (
              <div className="mt-5 flex items-center justify-between rounded-[24px] bg-[var(--accent-soft)] p-4 text-[var(--accent-strong)]">
                <div className="flex items-center gap-3">
                  <Clock size={18} />
                  <span className="font-black">Reservation duration</span>
                </div>
                <span className="stat-number font-black">{duration} hrs</span>
              </div>
            )}
          </Surface>

          <Surface className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers size={20} className="text-[var(--accent)]" />
                <h2 className="text-xl font-black tracking-tight text-[var(--ink)]">Level</h2>
              </div>
              <StatusPill>{floor}</StatusPill>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["F1", "F2", "F3"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFloor(f);
                    setSelectedSlot(null);
                  }}
                  className={`min-h-12 rounded-full border text-sm font-black transition ${
                    floor === f
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_0_0_1px_rgba(0,255,255,0.16)]"
                      : "border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)] hover:border-[var(--line-strong)] hover:text-[var(--accent)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Surface>
        </div>

        <Surface className="p-5 sm:p-7">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow mb-2">Grid authorization</p>
              <h2 className="text-3xl font-black tracking-tight text-[var(--ink)]">Select a unit</h2>
              {isHardwareVenue && (
                <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
                  {openSlotCount}/{hardwareSlots.length || 0} open · synced {formatSyncTime(hardwareSync.lastSyncedAt)}
                </p>
              )}
            </div>
            <StatusPill tone={hardwareSync.error ? "warning" : "success"}>
              {hardwareSync.error ? <AlertCircle size={14} /> : <span className="h-2 w-2 rounded-full bg-[var(--success)]" />}
              {hardwareSync.error || (hardwareSync.isRefreshing ? "Syncing" : "Live")}
              {hardwareSync.isRefreshing && <RefreshCw size={14} className="animate-spin" />}
            </StatusPill>
          </div>

          <AnimatePresence>
            {showHeatmap && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {isHardwareVenue && !hardwareSync.hasLoaded && (
                  <div className="col-span-full rounded-[24px] border border-dashed border-[var(--line)] py-10 text-center text-sm font-bold text-[var(--muted)]">
                    Syncing hardware slots...
                  </div>
                )}

                {hardwareSync.hasLoaded && slots.length === 0 && (
                  <div className="col-span-full rounded-[24px] border border-dashed border-[var(--line)] py-10 text-center text-sm font-bold text-[var(--muted)]">
                    No hardware slots online
                  </div>
                )}

                {slots.map((slot) => {
                  const isDisabled = slot.unavailable;
                  const isSelected = slot.id === selectedSlot;
                  const parts = slot.id.split("-");
                  const level = parts.length > 1 ? parts[0] : "Slot";
                  const unit = parts.length > 1 ? parts.slice(1).join("-") : slot.id;
                  let colorClass;

                  if (isDisabled) {
                    colorClass = "border-red-400/60 bg-red-500/18 text-red-100";
                  } else if (isSelected) {
                    colorClass = "border-[var(--accent)] bg-[var(--accent)] text-[#00111f] shadow-[0_18px_34px_rgba(0,255,255,0.22)]";
                  } else if (slot.occupancy < 0.3) {
                    colorClass = "border-emerald-400/50 bg-emerald-500/12 text-emerald-100 hover:border-emerald-300";
                  } else if (slot.occupancy < 0.6) {
                    colorClass = "border-orange-400/60 bg-orange-500/18 text-orange-100";
                  } else {
                    colorClass = "border-red-400/60 bg-red-500/18 text-red-100";
                  }

                  return (
                    <motion.button
                      key={slot.id}
                      whileTap={!isDisabled ? { scale: 0.96 } : {}}
                      onClick={() => !isDisabled && setSelectedSlot(slot.id)}
                      disabled={isDisabled}
                      className={`min-h-[86px] rounded-[24px] border p-3 text-center transition ${colorClass}`}
                    >
                      <span className="block text-[11px] font-bold opacity-60">{level}</span>
                      <span className="stat-number mt-1 block text-lg font-black tracking-tight">{unit}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[var(--line)] pt-6 sm:grid-cols-4">
            {[
              { color: "bg-emerald-400", label: "Open" },
              { color: "bg-red-500", label: "Full" },
              { color: "bg-orange-400", label: "Busy" },
              { color: "bg-[var(--accent)]", label: "Selected" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm font-bold text-[var(--muted)]">
                    <span className={`h-5 w-5 rounded-lg border border-white/20 ${item.color} shadow-[0_0_0_1px_rgba(0,0,0,0.18)]`} />
                {item.label}
              </div>
            ))}
          </div>
        </Surface>
      </section>

      <div className="sticky bottom-28 z-40 mt-6">
        <Surface className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--muted)]">Selected unit</p>
            <p className="text-2xl font-black tracking-tight text-[var(--ink)]">{selectedSlot || "Choose a slot"}</p>
          </div>
          <Button variant={selectedSlot ? "accent" : "muted"} disabled={!selectedSlot} onClick={handleContinue} className="w-full px-7 sm:w-auto">
            {selectedSlot ? (
              <>
                <ShieldCheck size={18} />
                Continue to payment
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Select grid unit
              </>
            )}
          </Button>
        </Surface>
      </div>
    </main>
  );
}
