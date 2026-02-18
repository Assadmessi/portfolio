import { motion, useReducedMotion } from "framer-motion";

/**
 * MaskText — Framer-like masked reveal for headings/subheads.
 * Keeps your text EXACTLY the same, just animates how it enters.
 */
export default function MaskText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  stagger = 0.03,
}) {
  const reduceMotion = useReducedMotion();
  const words = typeof text === "string" ? text.split(" ") : [];

  if (reduceMotion || typeof text !== "string") {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "120%", opacity: 0, filter: "blur(10px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 22,
              mass: 0.9,
              delay: delay + i * stagger,
            }}
          >
            {w}
            {i !== words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
