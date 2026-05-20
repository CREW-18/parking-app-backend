import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Apple, Chrome, Facebook, Lock, Mail } from "lucide-react";
import { BrandMark, Button, FadeIn, Field, Surface } from "../components/PremiumUI";
import { loginUser } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell app-bg">
      <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <FadeIn className="hidden lg:block">
          <BrandMark />
          <h1 className="mt-10 max-w-2xl text-6xl font-black leading-[0.96] tracking-tight text-[var(--ink)]">
            Reserve the calmest route into the city.
          </h1>
          <p className="muted-copy mt-6 max-w-lg text-lg leading-8">
            A polished parking command center for booking, live slots, payments, and entry passes.
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["1,240", "slots ready"],
              ["2 sec", "live KCT sync"],
              ["Rs 120", "standard pass"],
            ].map(([value, label]) => (
              <div key={label} className="premium-surface-soft p-5">
                <p className="stat-number text-2xl font-black text-[var(--ink)]">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Surface className="mx-auto w-full max-w-md p-7 sm:p-9">
            <div className="mb-8 flex justify-center lg:hidden">
              <BrandMark />
            </div>
            <div className="mb-8">
              <p className="eyebrow mb-3">Welcome back</p>
              <h2 className="text-4xl font-black tracking-tight text-[var(--ink)]">Access Slotify</h2>
              <p className="muted-copy mt-3 leading-7">
                Sign in to manage reservations, passes, and navigation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field
                label="Email address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Field
                label="Password"
                icon={Lock}
                type="password"
                placeholder="Your access key"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" loading={loading} className="w-full">
                {loading ? "Signing in" : "Sign in"}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--line)]" />
              <span className="text-xs font-bold text-[var(--muted)]">Other options</span>
              <div className="h-px flex-1 bg-[var(--line)]" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Chrome, label: "Google" },
                { icon: Facebook, label: "Facebook" },
                { icon: Apple, label: "Apple" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="grid min-h-12 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] text-[var(--ink-soft)] transition hover:text-[var(--accent)]"
                >
                  <Icon size={19} />
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between text-sm">
              <button type="button" className="font-bold text-[var(--muted)]">
                Forgot access?
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-black text-[var(--accent)]"
              >
                Create account
              </button>
            </div>
          </Surface>
        </FadeIn>
      </div>
    </main>
  );
}
