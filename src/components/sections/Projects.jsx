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
        className="py-28 scroll-mt-24"
      >
        <div className="nb-container">
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100"
          >
            {sectionTitle}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-slate-600 dark:text-slate-400 mb-12 max-w-2xl"
          >
            Practical builds focused on clean UX, smooth motion, and production-ready structure.
          </motion.p>

          <motion.div variants={fadeUp} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                onClick={() => setActiveProject(p)}
                className="group cursor-pointer nb-card nb-ring p-4 sm:p-6 transition"
              >
                {/* Mobile-friendly: show whole screenshot (contain). Desktop: cover for polish. */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-36 sm:h-40 md:h-44 object-contain sm:object-cover rounded-2xl mb-5 bg-black/5 dark:bg-white/5 group-hover:scale-[1.01] transition"
                  loading="lazy"
                  decoding="async"
                />

                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {p.title}
                </h3>

                <p className="text-slate-700 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                  {p.desc}
                </p>

                {Array.isArray(p.tech) && p.tech.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {p.tech.map((t, idx) => (
                      <span key={idx} className="nb-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                {(p.live || p.github) && (
                  <div className="flex items-center gap-4 mt-6 text-sm">
                    {p.live ? (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Live Demo →
                      </a>
                    ) : null}

                    {p.github ? (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-slate-600 dark:text-slate-300 hover:underline"
                      >
                        Code →
                      </a>
                    ) : null}

                    <span className="ml-auto text-slate-500 dark:text-slate-400">
                      Details
                    </span>
                  </div>
                )}
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
