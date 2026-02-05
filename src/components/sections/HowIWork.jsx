import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

const points = [
  "Build mobile-first, responsive layouts",
  "Write reusable and readable React components",
  "Use Tailwind CSS for consistency and scalability",
  "Add animations only when they improve UX",
  "Pay attention to spacing, typography, and hierarchy",
  "Refactor code for clarity and maintainability",
];

const HowIWork = () => {
  return (
    <MotionSection
      id="skills"
      variants={staggerContainer}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      <motion.div variants={fadeUp} className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold">How I Work</h2>
        <p className="mt-4 text-gray-400 leading-relaxed">
          I focus on clean UI, solid fundamentals, and production-ready habits —
          not just making things “look good”.
        </p>

        <ul className="mt-8 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-gray-300">
              <span className="mt-[7px] h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </MotionSection>
  );
};

export default HowIWork;
