import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Clock, XCircle, Ticket, Sparkles, Activity, History } from "lucide-react";
import { useUser } from "../context/UserContext";
import { api } from "../api/api";

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

  if (loading) return <BookingLoader />;

  return (
    <div className="min-h-screen bg-[#000d1a] text-white font-sans relative overflow-x-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/dashboard")}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#00FFFF] backdrop-blur-xl shadow-2xl"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <Sparkles size={12} className="text-[#00FFFF] animate-pulse" />
              <span className="text-[9px] font-black text-white/40 tracking-[0.4em] uppercase">User Hangar</span>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
              {userData?.name?.split(' ')[0] || "Pilot"}'s <span className="text-[#00FFFF]">Logs</span>
            </h1>
          </div>
        </div>

        {bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 border border-white/5 rounded-[3.5rem] bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden"
          >
            <Ticket size={40} className="text-zinc-800 mx-auto mb-6 opacity-50" />
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">No Active Reservations Found</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="mt-10 px-10 py-4 bg-white text-[#000d1a] rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              Initialize Search
            </motion.button>
          </motion.div>
        )}

        {bookings.length > 0 && (
          <BookingSection title="Active Protocols" icon={<Activity size={14}/>}>
            {bookings.map((booking, index) => (
              <BookingCard
                key={booking._id || booking.id}
                booking={booking}
                navigate={navigate}
                cancelBooking={cancelBooking}
                delay={index * 0.1}
              />
            ))}
          </BookingSection>
        )}
      </div>
    </div>
  );
}

const BookingSection = ({ title, icon, children }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4 px-2">
      <div className="border border-[#00FFFF]/20 text-[#00FFFF] p-2 rounded-lg">
        {icon}
      </div>
      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
        {title}
      </h2>
      <div className="h-[1px] flex-1 bg-white/5" />
      <History size={14} className="text-zinc-700" />
    </div>
    <div className="grid gap-5">{children}</div>
  </div>
);

const BookingCard = ({ booking, navigate, cancelBooking, delay }) => {
  const id = booking._id || booking.id;
  const displayDate = booking.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()
    : booking.date;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative group p-8 rounded-[3rem] border backdrop-blur-3xl transition-all duration-500 overflow-hidden bg-white/[0.03] border-white/10 hover:border-[#00FFFF]/40 shadow-2xl"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FFFF]/40 to-transparent group-hover:via-[#00FFFF] transition-all duration-700" />

      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <MapPin size={10} className="text-[#00FFFF]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              {booking.mallName || booking.location || "Sector 7-B"}
            </span>
          </div>
          <h3 className="text-3xl font-black tracking-tighter uppercase italic group-hover:text-[#00FFFF] transition-colors">
            Slot <span className="text-white">{booking.slot || "X-99"}</span>
          </h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black italic tracking-tighter">Rs {booking.totalPrice || booking.amount || 120}</p>
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">ID: {id?.slice(-6) || 'N/A'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 py-6 border-y border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-zinc-500">
             <Calendar size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-tight italic">{displayDate}</span>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-zinc-500">
             <Clock size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-tight italic text-[#00FFFF]">{booking.hours || 1} HR</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/ticket`, { state: { booking } })}
          className="flex-1 bg-white text-[#000d1a] py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 group-hover:bg-[#00FFFF] transition-colors"
        >
          <Ticket size={16} />
          Digital Pass
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => cancelBooking(id)}
          className="w-16 h-16 flex items-center justify-center rounded-[1.8rem] bg-white/5 border border-white/10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <XCircle size={22} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const BookingLoader = () => (
  <div className="min-h-screen bg-[#000d1a] flex flex-col items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-12 h-12 border-2 border-white/5 border-t-[#00FFFF] rounded-full mb-4"
    />
    <span className="text-[10px] font-black text-[#00FFFF] uppercase tracking-[0.4em]">Fetching Hangar Data...</span>
  </div>
);

export default MyBookings;
