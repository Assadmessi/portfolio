import { useMemo, useState, memo } from "react";
import ProjectModal from "../common/ProjectModal";
import { motion } from "framer-motion";
import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { projectsContent } from "../../content";

const cardLayoutByIndex = (i) => {
  // A layout that feels like premium template grids:
  // - first card: featured
  // - next two: stacked on the right (lg)
  // - remaining: balanced grid
  if (i === 0) return "lg:col-span-7 lg:row-span-2";
  if (i === 1) return "lg:col-span-5";
  if (i === 2) return "lg:col-span-5";
  return "lg:col-span-6";
};

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const { projects, sectionTitle } = projectsContent;

  // A small visual collage (inspired by premium templates) using your existing assets.
  const collage = useMemo(
    () => [
      { src: "/uploads/project1.png", alt: "Project preview 1", className: "rotate-[-2deg]" },
      { src: "/uploads/project2.png", alt: "Project preview 2", className: "rotate-[1.5deg]" },
      { src: "/uploads/project3.png", alt: "Project preview 3", className: "rotate-[-1deg]" },
    ],
    []
  );

  return (
    <>
      <MotionSection id="projects" variants={staggerContainer} className="py-28 scroll-mt-24">
        <div className="nb-container">
          {/* Header (premium / template-style) */}
          <motion.div variants={fadeUp} className="flex flex-col gap-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1 text-xs text-slate-600 dark:text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Selected Work
                </div>

                <motion.h2
                  variants={fadeUp}
                  className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
                >
                  {sectionTitle}
                </motion.h2>

                <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  High-quality UI builds with clean structure, smooth motion, and modern product polish.
                </p>
              </div>

              {/* Visual collage */}
              <div className="relative w-full lg:w-[520px]">
                <div className="pointer-events-none absolute -inset-6 rounded-[28px] bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/10 to-sky-500/10 blur-2xl" />
                <div className="relative grid grid-cols-3 gap-4">
                  {collage.map((img, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl overflow-hidden border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 shadow-sm ${img.className}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-28 sm:h-32 w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Projects grid (premium hierarchy) */}
          <motion.div
            variants={fadeUp}
            className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
          >
            {projects.map((p, i) => (
              <motion.article
                key={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                onClick={() => setActiveProject(p)}
                className={`group cursor-pointer relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-sm hover:shadow-xl transition ${cardLayoutByIndex(
                  i
                )}`}
              >
                {/* Glow */}
                <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 via-fuchsia-500/10 to-sky-500/10 blur-2xl" />
                </div>

                {/* Media */}
                <div className="relative">
                  <img
                    src={p.image}
                    alt={p.title}
                    className={`w-full ${i === 0 ? "h-56 sm:h-64" : "h-44 sm:h-48"} object-cover group-hover:scale-[1.02] transition duration-500`}
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Top chips */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-black/60 text-white text-xs px-3 py-1 backdrop-blur">
                      UI + Motion
                    </span>
                    {Array.isArray(p.tech) && p.tech.length > 0 ? (
                      <span className="rounded-full bg-white/80 text-slate-900 text-xs px-3 py-1 backdrop-blur border border-white/50">
                        {p.tech[0]}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {p.title}
                    </h3>
                    {p.year ? (
                      <span className="text-xs text-slate-500 dark:text-slate-400">{p.year}</span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>

                  {Array.isArray(p.tech) && p.tech.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.tech.slice(0, 4).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-xs rounded-full border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1 text-slate-600 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-4 text-sm">
                    {p.live ? (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Live →
                      </a>
                    ) : null}

                    {p.github ? (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-slate-700 dark:text-slate-300 hover:underline"
                      >
                        Code →
                      </a>
                    ) : null}

                    <span className="ml-auto text-slate-500 dark:text-slate-400">View details</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </MotionSection>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
};

export default memo(Projects);
