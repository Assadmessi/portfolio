import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Tilt3DCard — wraps any child with a real CSS 3D mouse-tilt effect.
 * Works with framer-motion springs; respects prefers-reduced-motion via
 * the parent MotionSection already using useReducedMotion.
 *
 * Props:
 *   className  — forwarded to the outer wrapper div
 *   intensity  — how much tilt (default 12 degrees max)
 *   glare      — show a moving glare highlight (default true)
 *   scale      — scale on hover (default 1.03)
 */
const Tilt3DCard = ({
  children,
  className = "",
  intensity = 12,
  glare = true,
  scale = 1.03,
}) => {
  const ref = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 22, mass: 0.6 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  const rotateX = useTransform(springY, [-1, 1], [intensity, -intensity]);
  const rotateY = useTransform(springX, [-1, 1], [-intensity, intensity]);

  // Glare position
  const glareX = useTransform(springX, [-1, 1], [0, 100]);
  const glareY = useTransform(springY, [-1, 1], [0, 100]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    rawX.set(cx * 2 - 1);
    rawY.set(cy * 2 - 1);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "900px" }}
      className={className}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        whileHover={{ scale }}
        transition={{ duration: 0.15 }}
        className="relative w-full h-full"
      >
        {children}

        {/* Glare overlay */}
        {glare && (
          <motion.div
            aria-hidden
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.10) 0%, transparent 65%)`
              ),
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Tilt3DCard;
