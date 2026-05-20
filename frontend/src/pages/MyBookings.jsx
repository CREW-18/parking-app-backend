import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, XCircle } from "lucide-react";
import { api } from "../api/api";
import { useUser } from "../context/UserContext";
import { Button, EmptyState, LoadingState, PageHeader, StatusPill, Surface } from "../components/PremiumUI";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/api/bookings");
        setBookings(Array.isArray(response.data) ? response.data : []);
      } catch {
        setBookings(JSON.parse(localStorage.getItem("bookings")) || []);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = (id) => {
    if (window.confirm("Abort this reservation sequence?")) {
      setBookings((current) => current.filter((booking) => (booking._id || booking.id) !== id));
    }
  };

  if (loading) return <LoadingState label="Fetching your reservations" />;

  return (
    <main className="page-shell pt-12">
      <div className="mx-auto w-full max-w-[1040px]">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 font-bold text-[var(--ink)] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
      >
        <ArrowLeft size={18} />
        Dashboard
      </button>

      <PageHeader
        eyebrow="Your passes"
        title={`${userData?.name?.split(" ")[0] || "Pilot"}'s reservations`}
        description="Active and recent Slotify bookings stay here so the pass is always one tap away."
      />

      {bookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No reservations yet"
          description="Choose a destination from the dashboard and your digital pass will appear here after checkout."
          action={<Button onClick={() => navigate("/dashboard")}>Find parking</Button>}
        />
      ) : (
        <section className="grid gap-5">
          {bookings.map((booking, index) => (
            <BookingCard
              key={booking._id || booking.id}
              booking={booking}
              navigate={navigate}
              cancelBooking={cancelBooking}
              delay={index * 0.04}
            />
          ))}
        </section>
      )}
      </div>
    </main>
  );
}

const BookingCard = ({ booking, navigate, cancelBooking, delay }) => {
  const id = booking._id || booking.id;
  const displayDate = booking.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()
    : booking.date;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="premium-surface relative overflow-hidden p-5 md:p-6"
    >
      <button
        onClick={() => cancelBooking(id)}
        aria-label="Cancel booking"
        className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface-soft)] text-[var(--ink-soft)] transition hover:border-red-300/40 hover:bg-red-400/10 hover:text-[var(--danger)]"
      >
        <XCircle size={20} />
      </button>

      <div className="grid gap-6 pr-12 lg:grid-cols-[minmax(0,1fr)_190px] lg:items-end">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusPill>
            <MapPin size={14} className="text-[var(--accent)]" />
            {booking.mallName || booking.location || "Sector 7-B"}
          </StatusPill>
          <StatusPill>ID {id?.slice(-6) || "N/A"}</StatusPill>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--ink)] md:text-4xl">
            Slot {booking.slot || "X-99"}
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Meta icon={<Calendar size={16} />} label="Date" value={displayDate || "Today"} />
            <Meta icon={<Clock size={16} />} label="Duration" value={`${booking.hours || 1} hr`} />
            <Meta label="Paid" value={`Rs ${booking.totalPrice || booking.amount || 120}`} />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-stretch">
          <p className="hidden text-right text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)] lg:block">
            Ready at gate
          </p>
          <Button
            variant="accent"
            onClick={() => navigate("/ticket", { state: { booking } })}
            className="w-full px-5"
          >
            <Ticket size={17} />
            Digital pass
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

const Meta = ({ icon, label, value }) => (
  <div className="min-w-0 rounded-[20px] bg-[var(--surface-soft)] p-4">
    <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
      {icon}
      {label}
    </p>
    <p className="stat-number truncate font-black text-[var(--ink)]">{value}</p>
  </div>
);

export default MyBookings;
