import { useState, memo } from "react";
import ProjectModal from "../common/ProjectModal";
import { motion } from "framer-motion";
import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { projectsContent } from "../../content";

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const { projects, sectionTitle } = projectsContent;

  return (
    <>
      <MotionSection
        id="projects"
        variants={staggerContainer}
        className="py-24 scroll-mt-24"
      >
        <div className="nb-container">
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold mb-12 text-slate-900 dark:text-slate-100"
          >
            {sectionTitle}
          </motion.h2>

          <motion.div variants={fadeUp} className="grid gap-6 md:grid-cols-3">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                onClick={() => setActiveProject(p)}
                className="cursor-pointer nb-card nb-ring p-4 sm:p-6 transition"
              >
                {/* Mobile-friendly: show whole screenshot (contain). Desktop: cover for polish. */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-32 sm:h-36 md:h-40 object-contain sm:object-cover rounded-2xl mb-4 bg-black/5 dark:bg-white/5"
                  loading="lazy"
                  decoding="async"
                />

                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {p.title}
                </h3>

                <p className="text-slate-700 dark:text-slate-400 text-sm mt-3">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </MotionSection>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
};

export default memo(Projects);
