// Framer-inspired motion: blur + spring + stagger.
// Keep the same export names so the rest of your site doesn't need refactors.

const spring = {
  type: "spring",
  stiffness: 140,
  damping: 22,
  mass: 0.9,
};

export const fadeUp = {
  hidden: (custom) => ({
    opacity: 0,
    y: custom?.dir === "up" ? -18 : 22,
    scale: 0.985,
    filter: "blur(10px)",
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      ...spring,
    },
  },
};

export const fadeIn = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { ...spring },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.10,
      delayChildren: 0.06,
    },
  },
};

// Extra variants you can opt into (doesn't change existing usage)
export const pop = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(10px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { ...spring } },
};

export const slideMask = {
  hidden: { opacity: 0, y: 20, clipPath: "inset(0 0 100% 0 round 16px)", filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0 round 16px)",
    filter: "blur(0px)",
    transition: { ...spring },
  },
};
