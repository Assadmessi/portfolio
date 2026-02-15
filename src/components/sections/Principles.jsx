import { memo } from "react";
import { motion } from "framer-motion";
import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { siteContent } from "../../content";

const Principles = () => {
  const { principles } = siteContent;

  if (!principles) return null;

  return (
    <MotionSection
      id="principles"
      variants={staggerContainer}
      className="py-24 bg-transparent scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100"
        >
          {principles.sectionTitle}
        </motion.h2>

        {principles.subtitle && (
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-3xl text-slate-700 dark:text-slate-400"
          >
            {principles.subtitle}
          </motion.p>
        )}

        <motion.div
          variants={fadeUp}
          className="mt-10 grid gap-6 md:grid-cols-2"
        >
          {(principles.items || []).map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-black/5 dark:border-white/10
                         bg-white/70 dark:bg-white/5 backdrop-blur"
            >
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-400">
                {item.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </MotionSection>
  );
};

export default memo(Principles);
