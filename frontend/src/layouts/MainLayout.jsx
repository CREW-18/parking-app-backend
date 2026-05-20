import BottomNavigation from "../components/BottomNavigation";

const MainLayout = ({ children }) => {
  return (
    <div className="app-bg relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 soft-grid opacity-60" />
      <div className="pointer-events-none fixed -right-24 top-[-12rem] h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none fixed -left-24 bottom-[-14rem] h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">
        {children}
      </div>

      <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-md -translate-x-1/2 pb-[env(safe-area-inset-bottom)]">
        <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)]/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
