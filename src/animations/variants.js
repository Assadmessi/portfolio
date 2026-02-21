// Motion language: lift + spring (mobile-friendly)
// Avoid CSS filter/blur in motion variants — it's a major source of jank on mobile Safari.

export const sectionEnter = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      mass: 0.8,
    },
  },
};

export const cardEnter = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 22,
      mass: 0.7,
    },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      // Keep it snappy (less work on mobile)
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const maskReveal = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// Backwards-compatible aliases (so existing imports don't break)
export const fadeUp = cardEnter;
export const fadeIn = sectionEnter;
