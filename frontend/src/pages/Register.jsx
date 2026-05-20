import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { BrandMark, Button, FadeIn, Field, Surface } from "../components/PremiumUI";
import { registerUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser({ name, email, password });
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell app-bg">
      <FadeIn className="w-full max-w-md">
        <Surface className="p-7 sm:p-9">
          <div className="mb-8">
            <BrandMark />
            <p className="eyebrow mb-3 mt-10">New pilot</p>
            <h1 className="text-4xl font-black tracking-tight text-[var(--ink)]">Create your Slotify identity</h1>
            <p className="muted-copy mt-3 leading-7">
              Your profile powers reservations, QR passes, and quick navigation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              label="Full name"
              icon={User}
              type="text"
              placeholder="Aravind Swamy"
              value={name}
              required
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
            <Field
              label="Email address"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              label="Password"
              icon={Lock}
              type="password"
              placeholder="Create a secure password"
              value={password}
              required
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" loading={loading} className="w-full">
              {loading ? "Creating account" : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-[var(--muted)]">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-[var(--accent)]">
              Sign in
            </button>
          </p>
        </Surface>
      </FadeIn>
    </main>
  );
}
