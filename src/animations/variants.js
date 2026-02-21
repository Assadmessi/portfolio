// Premium motion language (lift + spring) — mobile friendly (no blur filters)
// Keeps your content intact while making motion feel "Framer premium".

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
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

export const maskReveal = {
  hidden: { opacity: 0, y: 8, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Backwards-compatible aliases (so existing imports don't break)
export const fadeUp = cardEnter;
export const fadeIn = sectionEnter;
