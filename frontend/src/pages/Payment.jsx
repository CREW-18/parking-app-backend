import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Landmark,
  Lock,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { api } from "../api/api";
import { useUser } from "../context/UserContext";
import { Button, StatusPill, Surface } from "../components/PremiumUI";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUser();

  const [selectedMethod, setSelectedMethod] = useState("gpay");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const bookingData = location.state?.booking || location.state || {};
  const amount = bookingData.amount || 120;

  const paymentMethods = [
    { id: "gpay", label: "Google Pay", icon: Smartphone, provider: "UPI instant" },
    { id: "upi", label: "PhonePe / Paytm", icon: Smartphone, provider: "UPI ID" },
    { id: "card", label: "Cards", icon: CreditCard, provider: "Visa, Mastercard" },
    { id: "netbanking", label: "Net banking", icon: Landmark, provider: "Major banks" },
  ];

  const handlePayment = async () => {
    setLoading(true);

    try {
      const bookingResponse = await api.post("/api/bookings", {
        mallName: bookingData.mall || "Unknown Location",
        slot: bookingData.slot || "Unassigned",
        hours: Number(bookingData.duration) || 1,
        totalPrice: Number(amount) || 120,
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/ticket", {
          state: {
            booking: {
              ...bookingData,
              id: bookingResponse.data._id,
              date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase(),
              time: bookingData.entryTime || "10:00",
              location: bookingData.mall || "UB City Mall",
            },
          },
        });
      }, 2500);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Payment could not be completed.");
    }
  };

  if (success) {
    return (
      <main className="auth-shell app-bg">
        <Surface className="w-full max-w-sm p-9 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-[28px] bg-emerald-600 text-white shadow-[0_18px_36px_rgba(19,133,90,0.2)]"
          >
            <Check size={38} strokeWidth={3} />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--ink)]">Payment authorized</h1>
          <p className="muted-copy mt-3 leading-7">
            Verified for <span className="font-black text-[var(--ink)]">{userData?.name || "Pilot"}</span>. Preparing your QR pass.
          </p>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-[var(--accent)]"
            />
          </div>
        </Surface>
      </main>
    );
  }

  return (
    <main className="page-shell mobile-safe-bottom">
      <header className="mb-8 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 font-bold text-[var(--ink)] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <StatusPill>
          <Lock size={14} className="text-[var(--accent)]" />
          Secure checkout
        </StatusPill>
      </header>

      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Surface className="p-7 sm:p-9">
          <p className="eyebrow mb-3">Payment</p>
          <h1 className="text-5xl font-black tracking-tight text-[var(--ink)]">Confirm allocation</h1>
          <p className="muted-copy mt-4 leading-7">
            A clean reservation receipt before the booking is written to Slotify.
          </p>

          <div className="mt-10 rounded-[32px] bg-[var(--ink)] p-7 text-white">
            <p className="text-sm font-bold text-white/60">Amount due</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="stat-number text-6xl font-black tracking-tight">Rs {amount}</span>
              <span className="text-white/50">.00</span>
            </div>
            <div className="mt-8 grid gap-4 border-t border-white/10 pt-6">
              <div className="flex justify-between gap-4">
                <span className="text-white/55">Destination</span>
                <span className="max-w-[180px] text-right font-black">{bookingData.mall || "Sector 7"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/55">Slot</span>
                <span className="font-black text-cyan-100">{bookingData.slot || "Unassigned"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/55">Duration</span>
                <span className="stat-number font-black">{bookingData.duration || 1} hrs</span>
              </div>
            </div>
          </div>
        </Surface>

        <Surface className="p-7 sm:p-9">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[var(--ink)]">Payment method</h2>
              <p className="muted-copy mt-2 text-sm">Choose the channel for this simulated checkout.</p>
            </div>
            <ShieldCheck className="text-[var(--accent)]" size={26} />
          </div>

          <div className="grid gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const active = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex min-h-[76px] items-center justify-between gap-4 rounded-[24px] border p-4 text-left transition ${
                    active ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-[var(--surface-soft)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl ${active ? "bg-[var(--surface)] text-[var(--accent)]" : "bg-[var(--surface)] text-[var(--ink-soft)]"}`}>
                      <Icon size={21} />
                    </span>
                    <span>
                      <span className="block font-black text-[var(--ink)]">{method.label}</span>
                      <span className="mt-1 block text-sm font-semibold text-[var(--muted)]">{method.provider}</span>
                    </span>
                  </span>
                  <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${active ? "border-[var(--accent)]" : "border-[var(--line-strong)]"}`}>
                    {active && <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />}
                  </span>
                </button>
              );
            })}
          </div>

          <Button onClick={handlePayment} loading={loading} className="mt-8 w-full">
            {loading ? "Authorizing" : "Authorize payment"}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </Surface>
      </section>
    </main>
  );
};

export default Payment;
