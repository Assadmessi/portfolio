import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";
import { siteContent } from "../../content";

const About = () => {
  const { about } = siteContent;

  return (
    <MotionSection
      id="about"
      variants={staggerContainer}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      <motion.div variants={fadeUp} className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold">{about.title}</h2>

        {about.paragraphs.map((p, idx) => (
          <p
            key={idx}
            className={
              idx === 0
                ? "mt-6 text-slate-600 dark:text-gray-400 leading-relaxed"
                : "mt-4 text-slate-600 dark:text-gray-400 leading-relaxed"
            }
          >
            {p}
          </p>
        ))}

        <div className="mt-10 flex flex-wrap gap-2">
          {about.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </MotionSection>
  );
};

export default About;
