import { motion } from "framer-motion";

export const MotionSection = ({ children, className = "", variants, ...rest }) => {
  return (
    <motion.section
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      {...rest}   // ✅ THIS forwards id="about" etc.
    >
      {children}
    </motion.section>
  );
};