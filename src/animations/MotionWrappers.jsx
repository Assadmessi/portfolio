import { motion, useReducedMotion } from "framer-motion";

export const MotionSection = ({ children, className = "", variants, ...rest }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      variants={reduceMotion ? undefined : variants}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{
        once: true,
        amount: 0.12,
        margin: "0px 0px 0px 0px",
      }}
      {...rest}
    >
      {children}
    </motion.section>
  );
};
