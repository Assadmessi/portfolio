import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";
import { siteContent } from "../../content";

const HowIWork = () => {
  const { howIWork } = siteContent;

  return (
    <MotionSection
      id="skills"
      variants={staggerContainer}
      className="py-24 px-6 max-w-6xl mx-auto scroll-mt-24 section-spacing"
    >
      <motion.div variants={fadeUp} className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          {howIWork.title}
        </h2>

        <p className="mt-4 text-slate-700 dark:text-slate-400 leading-relaxed">
          {howIWork.intro}
        </p>

        <ul className="mt-8 space-y-4">
          {howIWork.points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-slate-800 dark:text-slate-200">
              <span
                className="mt-[7px] h-2.5 w-2.5 rounded-full shrink-0
                           bg-indigo-600/80 dark:bg-indigo-400/80
                           ring-4 ring-indigo-600/10 dark:ring-indigo-400/10"
              />
              <span className="leading-relaxed font-medium">{p}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </MotionSection>
  );
};

export default HowIWork;
