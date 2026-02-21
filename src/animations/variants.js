// Nubien-inspired motion language (lift + spring)
// NOTE: Avoid animating CSS filters (e.g. blur) — it can feel janky on mobile GPUs.

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
      // Slightly tighter stagger = smoother on low-power devices
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
};

export const maskReveal = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Backwards-compatible aliases (so existing imports don't break)
export const fadeUp = cardEnter;
export const fadeIn = sectionEnter;
