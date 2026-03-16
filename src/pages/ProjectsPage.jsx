import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import ProjectModal from "../components/common/ProjectModal";
import { projectsContent } from "../content";
import {
  getProjectDesc,
  getProjectKey,
  normalizeProjects,
  sortProjects,
} from "../utils/projects";

const shortText = (text = "", max = 130) => {
  if (typeof text !== "string") return "";
  const clean = text.trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
};

function ProjectsPage() {
  const { projects: rawProjects, sectionTitle } = projectsContent;
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [activeProject, setActiveProject] = useState(null);

  const allProjects = useMemo(() => normalizeProjects(rawProjects), [rawProjects]);
  const sortedProjects = useMemo(() => sortProjects(allProjects, sortBy), [allProjects, sortBy]);

  const filteredProjects = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sortedProjects;

    return sortedProjects.filter((project) => {
      const tags = Array.isArray(project?.tags) ? project.tags.join(" ") : "";
      const haystack = [
        project?.title,
        getProjectDesc(project),
        project?.problem,
        project?.system,
        project?.solution,
        project?.impact,
        tags,
        formatProjectDate(project),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [query, sortedProjects]);

  return (
    <div className="min-h-screen nb-page text-slate-900 dark:text-slate-100">
      <section className="relative overflow-hidden border-b border-black/5 dark:border-white/10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_42%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_42%)]">
        <div className="nb-container py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white transition"
            >
              <span aria-hidden>←</span>
              Back to home
            </Link>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-white/10 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-white/5">
              Projects archive
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {sectionTitle || "Projects"}
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              Browse every project in one place, sort by date or name, and search instantly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]"
          >
            <label className="rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/75 dark:bg-white/5 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Search
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, story, tags, or date"
                className="w-full rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </label>

            <label className="rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/75 dark:bg-white/5 p-3 sm:p-4 shadow-sm">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                View by
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="latest">Date: newest first</option>
                <option value="oldest">Date: oldest first</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </label>
          </motion.div>
        </div>
      </section>

      <section className="py-14 sm:py-18">
        <div className="nb-container">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredProjects.length}</span> of {allProjects.length} projects
            </div>
          </div>

          {filteredProjects.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project, index) => {
                const projectKey = getProjectKey(project, index);
                return (
                  <motion.button
                    key={projectKey}
                    type="button"
                    onClick={() => setActiveProject(project)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.18) }}
                    className="group text-left rounded-[28px] border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {project?.title || "Untitled project"}
                        </div>
                      </div>
                      <span className="text-slate-400 transition group-hover:text-slate-600 dark:group-hover:text-slate-200">
                        →
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {shortText(getProjectDesc(project), 140) || "No description added yet."}
                    </p>

                    {Array.isArray(project?.tags) && project.tags.length ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map((tag, tagIndex) => (
                          <span
                            key={`${projectKey}-${tagIndex}`}
                            className="rounded-full border border-slate-200/70 dark:border-white/10 px-3 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300/80 dark:border-white/10 bg-white/60 dark:bg-white/5 p-10 text-center text-slate-600 dark:text-slate-400">
              No projects matched your search.
            </div>
          )}
        </div>
      </section>

      <Footer />

      {activeProject ? <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} /> : null}
    </div>
  );
}

export default memo(ProjectsPage);
