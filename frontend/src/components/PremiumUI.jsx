import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const BrandMark = ({ compact = false, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative grid h-11 w-11 place-items-center rounded-[18px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_12px_28px_rgba(0,0,0,0.2)]">
      <div className="absolute -top-2 h-5 w-6 rounded-t-full border-x-2 border-t-2 border-[var(--accent)] bg-[var(--background)]" />
      <div className="h-5 w-3 rounded-[5px] bg-[var(--ink)]" />
      <div className="absolute inset-x-3 top-[18px] h-1 rounded-full bg-[var(--accent)] opacity-80" />
    </div>
    {!compact && (
      <div>
        <p className="text-xl font-black leading-none tracking-tight text-[var(--ink)]">slotify</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
          The City, Unlocked.
        </p>
      </div>
    )}
  </div>
);

export const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-4xl font-black tracking-tight text-[var(--ink)] md:text-5xl">{title}</h1>
      {description && <p className="muted-copy mt-3 max-w-[62ch] text-base leading-7">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const Surface = ({ children, className = "", as: Component = "div" }) => (
  <Component className={`premium-surface ${className}`}>{children}</Component>
);

export const Button = ({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled,
  ...props
}) => {
  const variantClass =
    variant === "accent"
      ? "premium-button-accent"
      : variant === "muted"
        ? "premium-button-muted"
        : variant === "ghost"
          ? "premium-button-ghost"
          : "premium-button-primary";

  return (
    <button
      className={`premium-button ${variantClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
};

export const Field = ({ label, hint, icon: Icon, className = "", ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-2 block text-sm font-bold text-[var(--ink)]">{label}</span>
    <span className="relative block">
      {Icon && <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[var(--accent)]" />}
      <input className={`premium-input ${Icon ? "premium-input-with-icon" : ""}`} {...props} />
    </span>
    {hint && <span className="mt-2 block text-xs leading-5 text-[var(--muted)]">{hint}</span>}
  </label>
);

export const StatusPill = ({ children, tone = "neutral", className = "" }) => {
  const toneClass =
    tone === "success"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : tone === "warning"
        ? "border-orange-300/30 bg-orange-300/10 text-orange-200"
        : tone === "danger"
          ? "border-red-300/30 bg-red-300/10 text-red-200"
          : "";

  return <span className={`status-pill ${toneClass} ${className}`}>{children}</span>;
};

export const LoadingState = ({ label = "Loading" }) => (
  <div className="grid min-h-[420px] place-items-center">
    <div className="w-full max-w-sm rounded-[32px] border border-[var(--line)] bg-[var(--surface)]/85 p-8 text-center shadow-[var(--shadow-card)]">
      <div className="relative mx-auto mb-5 h-2 w-40 overflow-hidden rounded-full bg-[var(--surface-strong)]">
        <div className="absolute inset-y-0 left-0 w-14 rounded-full bg-[var(--accent)] animate-progress-sweep" />
      </div>
      <p className="text-sm font-bold text-[var(--ink)]">{label}</p>
      <p className="mt-2 text-xs text-[var(--muted)]">Keeping the city signal warm.</p>
    </div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="premium-surface grid place-items-center px-6 py-16 text-center">
    {Icon && (
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
        <Icon size={26} />
      </div>
    )}
    <h2 className="text-2xl font-black tracking-tight text-[var(--ink)]">{title}</h2>
    {description && <p className="muted-copy mt-3 max-w-md leading-7">{description}</p>}
    {action && <div className="mt-7">{action}</div>}
  </div>
);

export const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
