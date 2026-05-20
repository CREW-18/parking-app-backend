import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, CheckCircle2, ChevronLeft, Mail, ShieldCheck, User } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { Button, Field, PageHeader, StatusPill, Surface } from "../components/PremiumUI";
import { useUser } from "../context/UserContext";

const Profile = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [localUser, setLocalUser] = useState({
    name: "",
    email: "",
    profilePic: "",
    userId: "",
  });

  useEffect(() => {
    if (userData) {
      setLocalUser({
        name: userData.name || "Aravind Swamy",
        email: userData.email || "aravind.ux@slotify.com",
        profilePic: userData.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Aravind",
        userId: userData.userId || "SLOT-8829",
      });
    }
  }, [userData]);

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      updateUserData(localUser);
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <main className="page-shell overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed left-4 right-4 top-6 z-[120] mx-auto flex max-w-md items-center gap-3 rounded-[24px] border border-emerald-300/30 bg-emerald-400/10 p-4 text-emerald-100 shadow-[var(--shadow-card)]"
            role="status"
          >
            <CheckCircle2 size={20} />
            <span className="text-sm font-black">Profile sync complete</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 font-bold text-[var(--ink)] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
      >
        <ChevronLeft size={18} />
        Back
      </button>

      <PageHeader
        eyebrow="Identity"
        title="Profile"
        description="Your Slotify identity is stored locally for quick booking and QR pass personalization."
        action={
          <StatusPill tone="success">
            <ShieldCheck size={14} />
            ID verified
          </StatusPill>
        }
      />

      <section className="grid min-w-0 gap-6 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
        <Surface className="min-w-0 p-6 text-center lg:self-start">
          <div className="relative mx-auto inline-block">
            <img
              src={localUser.profilePic}
              alt="Profile"
              className="h-36 w-36 rounded-[36px] border border-[var(--line)] bg-[var(--surface)] object-cover shadow-[var(--shadow-card)]"
            />
            <button
              aria-label="Update profile picture"
              className="absolute -bottom-2 -right-2 grid h-12 w-12 place-items-center rounded-2xl border-4 border-[var(--surface)] bg-[var(--accent)] text-[#00111f] shadow-[0_12px_28px_rgba(0,255,255,0.18)]"
            >
              <Camera size={18} />
            </button>
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-[var(--ink)]">{localUser.name}</h2>
          <p className="muted-copy mt-2 font-semibold">{localUser.email}</p>

          <div className="mt-8 rounded-[32px] bg-[var(--surface-soft)] p-6">
            <div className="mx-auto inline-block rounded-[24px] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
              <QRCodeCanvas value={`USER-${localUser.userId}`} size={118} fgColor="#0b1220" level="H" />
            </div>
            <p className="stat-number mt-4 font-mono text-xs font-black tracking-[0.24em] text-[var(--accent)]">{localUser.userId}</p>
          </div>
        </Surface>

        <Surface className="min-w-0 p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-3xl font-black tracking-tight text-[var(--ink)]">Account details</h2>
            <p className="muted-copy mt-2 leading-7">Name changes are reflected across dashboard, booking, and tickets.</p>
          </div>

          <div className="space-y-5">
            <Field
              label="Display name"
              icon={User}
              value={localUser.name}
              placeholder="Enter name"
              onChange={(e) => setLocalUser({ ...localUser, name: e.target.value })}
            />
            <Field
              label="Email address"
              icon={Mail}
              value={localUser.email}
              disabled
              hint="Email is read-only in the current app flow."
            />
          </div>

          <Button onClick={handleSave} loading={loading} className="mt-8 w-full">
            {loading ? "Syncing profile" : "Update profile"}
          </Button>

          <p className="muted-copy mt-6 text-center text-sm">Local profile data remains compatible with the existing Slotify storage keys.</p>
        </Surface>
      </section>
      </div>
    </main>
  );
};

export default Profile;
