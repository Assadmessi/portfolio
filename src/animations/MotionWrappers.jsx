import { motion, useReducedMotion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export const MotionSection = ({ children, className = "", variants, ...rest }) => {
  const reduceMotion = useReducedMotion();

  // When motion is enabled, we animate IN on enter viewport and animate OUT on leave.
  // This makes scroll animations work both directions (down + back up).
  const ref = useRef(null);
  const inView = useInView(ref, {
    amount: 0.12,
    margin: "0px 0px -15% 0px",
  });
  const controls = useAnimation();

  useEffect(() => {
    if (reduceMotion) return;
    controls.start(inView ? "visible" : "hidden");
  }, [inView, controls, reduceMotion]);

  return (
    <motion.section
      ref={ref}
      className={className}
      variants={reduceMotion ? undefined : variants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : controls}
      {...rest}
    >
      {children}
    </motion.section>
  );
};
