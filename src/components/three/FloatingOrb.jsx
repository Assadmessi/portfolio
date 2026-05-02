import { motion } from "framer-motion";

/**
 * FloatingOrb — pure CSS 3D depth accent.
 * Drop one or two into any section for ambient spatial depth.
 * All values are configurable; defaults give a nice indigo/cyan glow.
 */
const FloatingOrb = ({
  size = 320,
  x = "10%",
  y = "20%",
  color = "indigo",
  opacity = 0.18,
  blur = 80,
  delay = 0,
  duration = 8,
  zIndex = -1,
}) => {
  const colors = {
    indigo: "rgba(99,102,241,1)",
    cyan: "rgba(34,211,238,1)",
    violet: "rgba(139,92,246,1)",
    rose: "rgba(244,63,94,1)",
    sky: "rgba(56,189,248,1)",
  };

  const bg = colors[color] ?? color;

  return (
    <motion.div
      aria-hidden
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: [1, 1.08, 1],
        opacity: [opacity, opacity * 1.3, opacity],
        y: ["0px", "-18px", "0px"],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        filter: `blur(${blur}px)`,
        zIndex,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    />
  );
};

export default FloatingOrb;
