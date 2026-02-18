import { memo } from "react";

/**
 * Lightweight inline SVG visuals to add "proof" imagery without adding heavy assets.
 * Uses currentColor + Tailwind classes so it matches light/dark themes automatically.
 */

export const ServiceGlyph = memo(function ServiceGlyph({ index = 0, className = "" }) {
  const common = "w-10 h-10 shrink-0 text-indigo-600/90 dark:text-indigo-300/90";
  const i = index % 4;

  if (i === 0) {
    // UI / layout
    return (
      <svg viewBox="0 0 24 24" className={`${common} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6.5h16M4 10.5h10M4 14.5h16M4 18.5h8" strokeLinecap="round" />
        <path d="M15 10.5h5v8h-5z" opacity="0.35" />
      </svg>
    );
  }

  if (i === 1) {
    // Speed / performance
    return (
      <svg viewBox="0 0 24 24" className={`${common} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
        <path d="M12 7v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 3l-4 4" strokeLinecap="round" />
      </svg>
    );
  }

  if (i === 2) {
    // Backend / data
    return (
      <svg viewBox="0 0 24 24" className={`${common} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 7c0-2 3-3 6-3s6 1 6 3-3 3-6 3-6-1-6-3Z" />
        <path d="M6 7v10c0 2 3 3 6 3s6-1 6-3V7" opacity="0.6" />
        <path d="M6 12c0 2 3 3 6 3s6-1 6-3" opacity="0.6" />
      </svg>
    );
  }

  // Deployment / cloud
  return (
    <svg viewBox="0 0 24 24" className={`${common} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 18h10a4 4 0 0 0 .8-7.9A5.5 5.5 0 0 0 7.2 8.8 3.5 3.5 0 0 0 7 18Z" />
      <path d="M12 10v7" strokeLinecap="round" />
      <path d="M9.5 14.5 12 17l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

export const WorkflowGraphic = memo(function WorkflowGraphic({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10
                  bg-white/70 dark:bg-white/5 backdrop-blur ${className}`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute -inset-10 bg-indigo-500/10 blur-3xl" />
      <svg viewBox="0 0 520 320" className="relative w-full h-full">
        <defs>
          <linearGradient id="svgGrad" x1="0" x2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.2" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Nodes */}
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeOpacity="0.55">
          <rect x="46" y="56" width="160" height="66" rx="16" />
          <rect x="314" y="56" width="160" height="66" rx="16" />
          <rect x="46" y="198" width="160" height="66" rx="16" />
          <rect x="314" y="198" width="160" height="66" rx="16" />
        </g>

        {/* Connectors */}
        <g stroke="url(#svgGrad)" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M206 89h108" />
          <path d="M126 122v76" />
          <path d="M394 122v76" />
          <path d="M206 231h108" />
        </g>

        {/* Dots */}
        <g fill="currentColor" opacity="0.35" filter="url(#soft)">
          <circle cx="126" cy="89" r="7" />
          <circle cx="394" cy="89" r="7" />
          <circle cx="126" cy="231" r="7" />
          <circle cx="394" cy="231" r="7" />
        </g>

        {/* Labels (no user copy; just schematic) */}
        <g fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
           fontSize="14" fill="currentColor" opacity="0.6">
          <text x="70" y="94">plan()</text>
          <text x="338" y="94">build()</text>
          <text x="70" y="236">ship()</text>
          <text x="338" y="236">iterate()</text>
        </g>
      </svg>
    </div>
  );
});

export const ProofStrip = memo(function ProofStrip({ className = "" }) {
  const items = [
    { src: "/uploads/project1.png", alt: "Project preview 1" },
    { src: "/uploads/project2.png", alt: "Project preview 2" },
    { src: "/uploads/project3.png", alt: "Project preview 3" },
  ];

  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`} aria-label="Project previews">
      {items.map((it) => (
        <div
          key={it.src}
          className="group relative overflow-hidden rounded-xl border border-black/5 dark:border-white/10
                     bg-white/70 dark:bg-white/5 backdrop-blur"
        >
          <div className="pointer-events-none absolute -inset-8 bg-indigo-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />
          <img
            src={it.src}
            alt={it.alt}
            className="relative z-10 w-full h-20 sm:h-24 object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
});
