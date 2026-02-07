import { motion } from "framer-motion";

export const MotionSection = ({ children, className = "", variants, ...rest }) => {
  return (
    <motion.section
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      // Mobile-friendly: tall sections still trigger in-view animations
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -15% 0px" }}
      {...rest}
    >
      {children}
    </motion.section>
  );
};
