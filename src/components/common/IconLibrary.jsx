import React from "react";

/**
 * Small default icon set for "proof" cards.
 * - Use `iconKey` on a proof item to select one of these.
 * - If `iconUrl` exists, it takes precedence (uploaded via Cloudinary).
 */
export const DEFAULT_ICON_KEYS = [
  "spark",
  "dashboard",
  "bolt",
  "shield",
  "cloud",
  "data",
  "motion",
];

const base = "w-5 h-5";

export function DefaultIcon({ iconKey = "spark", className = "" }) {
  const cls = `${base} ${className}`.trim();

  switch (iconKey) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16v6H4z" />
          <path d="M4 14h7v6H4z" />
          <path d="M13 14h7v6h-7z" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h8l-1 8 11-14h-8l1-6z" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11-1A4 4 0 0 0 7 18z" />
        </svg>
      );
    case "data":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case "motion":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 15c3-8 6 8 10 0s6 8 6 0" />
          <path d="M4 9h4" />
        </svg>
      );
    case "spark":
    default:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
        </svg>
      );
  }
}

export function ProofIcon({ iconKey, iconUrl, className = "" }) {
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt=""
        className={`w-5 h-5 object-contain ${className}`.trim()}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return <DefaultIcon iconKey={iconKey} className={className} />;
}
