import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import ProjectModal from "../common/ProjectModal";
import { projectsContent } from "../../content";

// Supports data coming from JSON (array) OR admin/Firestore (object keyed by index)
// Examples supported:
// - projects: [ {...}, {...} ]
// - projects: { "0": {...}, "1": {...} }
// - projects: { items: [ ... ] }
const normalizeProjects = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.items)) return raw.items;
  if (typeof raw === "object") {
    return Object.entries(raw)
      .filter(([k]) => k !== "items")
      .sort(([a], [b]) => {
        const na = Number(a);
        const nb = Number(b);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
        return String(a).localeCompare(String(b));
      })
      .map(([, v]) => v);
  }
  return [];
};

const getKey = (p, i) => String(p?.id ?? p?.slug ?? p?.title ?? i);
const getDesc = (p) => p?.description ?? p?.desc ?? "";

const Projects = () => {
  const { projects: rawProjects, sectionTitle } = projectsContent;

  const projects = useMemo(() => normalizeProjects(rawProjects), [rawProjects]);
  const items = useMemo(
    () => projects.map((p, i) => ({ p, i, key: getKey(p, i) })),
    [projects]
  );

  const [featuredKey, setFeaturedKey] = useState(() => getKey(projects?.[0], 0));
  const [activeProject, setActiveProject] = useState(null);

  // Keep featured valid when content updates
  useEffect(() => {
    if (!items.length) return;
    const exists = items.some((x) => x.key === featuredKey);
    if (!exists) setFeaturedKey(items[0].key);
  }, [items, featuredKey]);

  const featuredItem = useMemo(
    () => items.find((x) => x.key === featuredKey) ?? items[0],
    [items, featuredKey]
  );

  const swapFeatured = (item) => setFeaturedKey(item.key);

  return (
    <>
      <MotionSection id="projects" variants={staggerContainer} className="py-28 scroll-mt-24">
        <div className="nb-container">
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-white/10 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-white/5">
                Selected work
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
                {sectionTitle}
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl">
                Product-focused builds with clean UX, motion polish, and production-ready structure.
              </p>
            </div>
          </motion.div>

          {/* Layout */}
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            {/* Featured */}
            <motion.div variants={fadeUp} className="lg:col-span-8">
              {featuredItem ? (
                <button
                  type="button"
                  onClick={() => setActiveProject(featuredItem.p)}
                  className="group w-full text-left rounded-3xl overflow-hidden border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white transition shadow-sm hover:shadow-xl"
                >
                  <div className="relative">
                    {featuredItem.p?.image ? (
                      <img
                        src={featuredItem.p.image}
                        alt={featuredItem.p.title}
                        className="h-64 sm:h-80 w-full object-cover group-hover:scale-[1.02] transition duration-500"
                      />
                    ) : (
                      <div className="h-64 sm:h-80 w-full bg-slate-100 dark:bg-white/10" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                        Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {featuredItem.p?.title}
                        </h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                          {getDesc(featuredItem.p)}
                        </p>
                      </div>
                      <span className="shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition">
                        View →
                      </span>
                    </div>

                    {Array.isArray(featuredItem.p?.tech) && featuredItem.p.tech.length ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {featuredItem.p.tech.slice(0, 6).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </button>
              ) : (
                <div className="rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 p-10 text-slate-600 dark:text-slate-400">
                  No projects yet.
                </div>
              )}
            </motion.div>

            {/* List */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <motion.div
                variants={fadeUp}
                className="rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">All projects</div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Click any project to feature it.
                </p>
              </motion.div>

              {items.length ? (
                <motion.div
                  variants={staggerContainer}
                  className="rounded-3xl border border-slate-200/70 dark:border-white/10 overflow-hidden"
                >
                  {items.map((item) => {
                    const isActive = item.key === featuredKey;
                    return (
                      <motion.button
                        key={item.key}
                        variants={fadeUp}
                        type="button"
                        onClick={() => !isActive && swapFeatured(item)}
                        className={`w-full text-left px-5 py-4 bg-white/70 dark:bg-[#0B0F19]/40 transition flex items-center gap-4 ${
                          isActive
                            ? "opacity-80 cursor-default"
                            : "hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                        }`}
                      >
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-6">
                          {String(item.i + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {item.p?.title}
                            </div>
                            {isActive ? (
                              <span className="shrink-0 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                Featured
                              </span>
                            ) : null}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
                            {getDesc(item.p)}
                          </div>
                        </div>
                        <div className="ml-auto text-slate-400">↔</div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </MotionSection>

      {activeProject ? (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      ) : null}
    </>
  );
};

export default memo(Projects);
