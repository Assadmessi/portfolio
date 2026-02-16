import { motion } from "framer-motion";

export function Card({ title, subtitle, right, children }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-sm">
      {(title || subtitle || right) ? (
        <div className="px-5 py-4 border-b border-black/10 dark:border-white/10 flex items-start justify-between gap-4">
          <div>
            {title ? <div className="text-sm font-semibold">{title}</div> : null}
            {subtitle ? <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">{subtitle}</div> : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Button({ variant="primary", className="", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-indigo-600 text-white hover:opacity-90",
    ghost: "bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15",
    danger: "bg-rose-600 text-white hover:opacity-90",
    outline: "border border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
  };
  return <button className={`${base} ${styles[variant] || styles.primary} ${className}`} {...props} />;
}

export function Input({ className="", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 ${className}`}
      {...props}
    />
  );
}

export function Select({ className="", children, ...props }) {
  return (
    <select
      className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className="", ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 ${className}`}
      {...props}
    />
  );
}

export function HelperText({ children, tone="neutral" }) {
  const map = {
    neutral: "text-slate-600 dark:text-slate-300",
    error: "text-rose-600 dark:text-rose-400",
    success: "text-emerald-600 dark:text-emerald-400",
    warn: "text-amber-700 dark:text-amber-300",
  };
  return <div className={`text-xs mt-1 ${map[tone] || map.neutral}`}>{children}</div>;
}

export function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black/10 dark:bg-white/10 px-2 py-0.5 text-[11px]">
      {children}
    </span>
  );
}

export function PageFade({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}
