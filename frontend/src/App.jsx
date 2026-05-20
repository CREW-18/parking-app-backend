import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; 
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import TicketQR from "./pages/TicketQR";
import MyBookings from "./pages/MyBookings";
import NavigatePage from "./pages/Navigate";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* 1. INITIALIZATION: Splash & Auth (No Layout) */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. CORE SYSTEM: Wrapped in MainLayout (Includes Bottom Nav) */}
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/my-bookings" element={<MainLayout><MyBookings /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        
        {/* 3. TRANSACTION FLOW: Usually cleaner with the Nav hidden */}
        <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />
        <Route path="/payment" element={<MainLayout><Payment /></MainLayout>} />

        {/* 4. IMMERSIVE EXPERIENCES: Full screen, no Navigation Dock */}
        <Route path="/ticket" element={<TicketQR />} />
        <Route path="/navigate" element={<NavigatePage />} />

        {/* 5. PROTOCOL FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserProvider>
  );
}

export default App;