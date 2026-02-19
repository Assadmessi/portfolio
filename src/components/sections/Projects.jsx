import { useMemo, useState, memo } from "react";
import ProjectModal from "../common/ProjectModal";
import { motion } from "framer-motion";
import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { projectsContent } from "../../content";

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const { projects = [], sectionTitle } = projectsContent;

  const { featured, rest } = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    return {
      featured: list[0] || null,
      rest: list.slice(1),
    };
  }, [projects]);

  return (
    <>
      <MotionSection id="projects" variants={staggerContainer} className="py-28 scroll-mt-24">
        <div className="nb-container">
          {/* Header */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Selected work
              </div>

              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {sectionTitle}
              </h2>

              <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                Product-focused frontend builds: clean UX, smooth motion, and production-ready structure.
                Click any project to open the case study.
              </p>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              {projects.length} projects
            </div>
          </motion.div>

          {/* Featured */}
          {featured ? (
            <motion.div variants={fadeUp} className="grid gap-6 lg:grid-cols-12 mb-12">
              <button
                type="button"
                onClick={() => setActiveProject(featured)}
                className="lg:col-span-8 text-left group nb-card nb-ring overflow-hidden rounded-3xl transition cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-56 sm:h-72 lg:h-[420px] object-cover bg-black/5 dark:bg-white/5"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-white/80">Featured</div>
                      <div className="text-xl sm:text-2xl font-semibold text-white mt-1">
                        {featured.title}
                      </div>
                    </div>
                    <div className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white text-sm border border-white/15 group-hover:bg-white/15 transition">
                      View case study
                      <span aria-hidden className="translate-y-[1px]">→</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {featured.desc}
                  </p>

                  {/* Highlights (Nubien-like: compact + scannable) */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {featured.problem ? (
                      <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-4">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Problem</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200 leading-relaxed line-clamp-3">
                          {featured.problem}
                        </div>
                      </div>
                    ) : null}

                    {featured.solution ? (
                      <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-4">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Solution</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200 leading-relaxed line-clamp-3">
                          {featured.solution}
                        </div>
                      </div>
                    ) : null}

                    {featured.impact ? (
                      <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-4">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Impact</div>
                        <div className="mt-2 text-sm text-slate-800 dark:text-slate-200 leading-relaxed line-clamp-3">
                          {featured.impact}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {Array.isArray(featured.tech) && featured.tech.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {featured.tech.map((t, idx) => (
                        <span key={idx} className="nb-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </button>

              {/* Side rail: “more work” list */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    More work
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A scannable list for recruiters: titles, a one-liner, and a quick click into details.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/70 dark:border-white/10 overflow-hidden">
                  {rest.slice(0, 3).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveProject(p)}
                      className="w-full text-left px-5 py-4 bg-white/70 dark:bg-[#0B0F19]/40 hover:bg-slate-50 dark:hover:bg-white/5 transition flex items-center gap-4"
                    >
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-6">
                        {String(idx + 2).padStart(2, "0")}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {p.title}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {p.desc}
                        </div>
                      </div>
                      <div className="ml-auto text-slate-400">→</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Grid/list (Nubien-like: elegant rows) */}
          <motion.div variants={fadeUp} className="grid gap-4">
            {rest.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveProject(p)}
                className="group w-full text-left nb-card nb-ring rounded-3xl p-4 sm:p-5 transition cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 sm:w-16">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="relative h-16 w-24 sm:h-16 sm:w-28 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-slate-200/70 dark:border-white/10">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {p.title}
                        </h3>
                        {Array.isArray(p.tech) && p.tech.length > 0 ? (
                          <span className="hidden sm:inline-flex nb-pill">
                            {p.tech[0]}
                          </span>
                        ) : null}
                      </div>

                      <p className="text-sm text-slate-700 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {p.desc}
                      </p>
                    </div>
                  </div>

                  <div className="sm:ml-auto flex items-center gap-3">
                    {p.live ? (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Live
                      </a>
                    ) : null}
                    {p.github ? (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:underline"
                      >
                        Code
                      </a>
                    ) : null}
                    <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition">
                      View →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </MotionSection>

      {activeProject ? (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      ) : null}
    </>
  );
};

export default memo(Projects);
