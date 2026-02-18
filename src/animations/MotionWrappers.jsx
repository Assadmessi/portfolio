import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Framer-style reveal wrapper:
 * - springy + blurred entrance (driven by variants)
 * - slightly later trigger (feels less "template-y")
 * - once by default (like Framer templates)
 */
export const MotionSection = ({
  children,
  className = "",
  variants,
  once = true,
  amount = 0.18,
  margin = "0px 0px -12% 0px",
  ...rest
}) => {
  const reduceMotion = useReducedMotion();
  const lastY = useRef(0);
  const [dir, setDir] = useState("down");

  // Track scroll direction so variants can decide "up" vs "down".
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const nextDir = y < lastY.current ? "up" : "down";
      lastY.current = y;
      setDir(nextDir);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.section
      className={className}
      variants={reduceMotion ? undefined : variants}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      custom={reduceMotion ? undefined : { dir }}
      viewport={{
        once,
        amount,
        margin,
      }}
      {...rest}
    >
      {children}
    </motion.section>
  );
};
