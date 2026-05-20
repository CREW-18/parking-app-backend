import { useNavigate, useLocation } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state;

  // If user refreshes page and state is lost
  if (!bookingData) {
    return (
      <div className="text-white">
        <p>No booking data found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 bg-lime-400 text-black px-4 py-2 rounded-xl"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-center">

      <h1 className="text-3xl font-bold text-lime-400">
        Booking Confirmed 🎉
      </h1>

      <p className="text-zinc-400">
        Your parking slot has been successfully reserved.
      </p>

      <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-2">
        <p className="text-white font-semibold text-lg">
          {bookingData.name}
        </p>
        <p className="text-zinc-400 text-sm">
          Date: {bookingData.date}
        </p>
        <p className="text-zinc-400 text-sm">
          Slot: {bookingData.selectedSlot}
        </p>
      </div>

      <button
        onClick={() => navigate("/ticket", { state: bookingData })}
        className="w-full bg-lime-400 text-black py-3 rounded-xl font-semibold"
      >
        View Ticket
      </button>

    </div>
  );
};

export default Success;