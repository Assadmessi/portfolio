import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const MotionSection = ({ children, className = "", variants, ...rest }) => {
  const reduceMotion = useReducedMotion();
  const lastY = useRef(0);
  const [dir, setDir] = useState("down");

  // Track scroll direction so animations can enter from the correct side.
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
      // Pass scroll direction down to children variants (eg. fadeUp).
      custom={reduceMotion ? undefined : { dir }}
      viewport={{
        once: false,
        amount: 0.12,
        margin: "0px 0px -15% 0px",
      }}
      {...rest}
    >
      {children}
    </motion.section>
  );
};
