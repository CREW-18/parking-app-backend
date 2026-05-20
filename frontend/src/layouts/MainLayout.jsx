import BottomNavigation from "../components/BottomNavigation";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#000d1a] text-white relative overflow-x-hidden">
      
      {/* GLOBAL SYSTEM BLOOM - Provides depth across all child pages */}
      <div className="fixed top-[-10%] left-[-10%] w-[70%] h-[50%] bg-[#00FFFF]/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Main Content: Relative z-10 to stay above the blooms */}
      <div className="relative z-10 pb-32">
        {children}
      </div>
      
      {/* FLOATING GLASS DOCK */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[100]">
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 shadow-[0_25px_50px_rgba(0,0,0,0.6),0_0_20px_rgba(0,255,255,0.05)]">
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;