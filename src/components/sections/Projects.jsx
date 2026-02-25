import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";


// Cloudinary responsive helpers (keeps non-Cloudinary URLs untouched)
const isCloudinaryUrl = (url) =>
  typeof url === "string" && url.includes("res.cloudinary.com") && url.includes("/upload/");

const cldTransform = (url, transform) => {
  if (!isCloudinaryUrl(url)) return url;
  // Insert transform right after `/upload/` (works even if the URL already has transforms/version)
  return url.replace("/upload/", `/upload/${transform}/`);
};

const cldSrcSet = (url, widths = [480, 768, 1024, 1440, 1920]) => {
  if (!isCloudinaryUrl(url)) return undefined;
  return widths
    .map((w) => `${cldTransform(url, `f_auto,q_auto,w_${w},c_fill,g_auto`)} ${w}w`)
    .join(", ");
};

// Featured image: avoid aggressive crop on small screens, keep desktop look.
const cldSrcSetFeatured = (url, widths = [480, 768, 1024, 1440, 1920]) => {
  if (!isCloudinaryUrl(url)) return undefined;
  return widths
    .map((w) => {
      const t = w <= 640 ? `f_auto,q_auto,w_${w},c_fit` : `f_auto,q_auto,w_${w},c_fill,g_auto`;
      return `${cldTransform(url, t)} ${w}w`;
    })
    .join(", ");
};
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

// Highlights can also come from admin/Firestore as an object keyed by index.
// Supported:
// - highlights: [ { title, desc }, ... ]
// - highlights: { "0": { title, desc }, "1": { ... } }
const normalizeProof = (raw) => {
  if (!raw) return [];
  const arr = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.items)
      ? raw.items
      : typeof raw === "object"
        ? Object.entries(raw)
            .filter(([k]) => k !== "items")
            .sort(([a], [b]) => {
              const na = Number(a);
              const nb = Number(b);
              if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
              return String(a).localeCompare(String(b));
            })
            .map(([, v]) => v)
        : [];

  return arr
    .filter(Boolean)
    .map((it) => {
      if (typeof it === "string") return { title: it, desc: "", iconKey: "spark", iconUrl: "" };
      return {
        title: it?.title ?? "",
        desc: it?.desc ?? "",
        iconKey: it?.iconKey ?? "spark",
        iconUrl: it?.iconUrl ?? "",
      };
    });
};

const fallbackHighlights = (project) => {
  const name = project?.title ?? "this project";
  return [
    { title: "Goal", desc: `Designed to deliver a clear, reliable experience for ${name}.` },
    { title: "Build quality", desc: "Reusable components, clean structure, and maintainable code." },
    { title: "User impact", desc: "Polished UX with performance-focused decisions." },
  ];
};

const getHighlights = (project) => {
  const normalized = normalizeProof(project?.proof ?? project?.highlights);
  const three = normalized.slice(0, 3);
  if (three.length === 3) return three;
  return [...three, ...fallbackHighlights(project)].slice(0, 3);
};

const getKey = (p, i) => String(p?.id ?? p?.slug ?? p?.title ?? i);
const getDesc = (p) => p?.description ?? p?.desc ?? "";
const shortText = (text = "", max = 120) => {
  if (typeof text !== "string") return "";
  const t = text.trim();
  return t.length > max ? t.slice(0, max).trimEnd() + "…" : t;
};

const Projects = () => {
  const { projects: rawProjects, sectionTitle } = projectsContent;

  const projects = useMemo(() => normalizeProjects(rawProjects), [rawProjects]);
  const items = useMemo(() => projects.map((p, i) => ({ p, i, key: getKey(p, i) })), [projects]);

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
      <MotionSection id="projects" variants={staggerContainer} className="py-20 sm:py-28 scroll-mt-24">
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

          {/* Mobile: tighter spacing so the featured+list stack doesn't feel "too big" */}
          <div className="mt-10 sm:mt-12 grid gap-6 sm:gap-10 lg:grid-cols-12 min-w-0 max-w-full">
            {/* Featured */}
            <motion.div variants={fadeUp} className="lg:col-span-8 min-w-0 max-w-full">
              {featuredItem ? (
                <button
                  type="button"
                  onClick={() => setActiveProject(featuredItem.p)}
                  className="group w-full text-left rounded-3xl overflow-hidden border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white transition shadow-sm hover:shadow-xl"
                >
                  <div className="relative">
                    {featuredItem.p?.image ? (
                      // ✅ Mobile: make the frame shorter so it doesn't dominate the screen
                      <div className="relative w-full aspect-[21/9] sm:aspect-[16/10] bg-slate-100 dark:bg-white/10">
                        <img
                          src={isCloudinaryUrl(featuredItem.p.image) ? cldTransform(featuredItem.p.image, "f_auto,q_auto,w_1200,c_fill,g_auto") : featuredItem.p.image}
                          srcSet={cldSrcSetFeatured(featuredItem.p.image)}
                          // Accurate sizes helps the browser pick the right src for small screens
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 66vw"
                          alt={featuredItem.p.title}
                          // ✅ FIX 2: fill the frame on mobile (no more "floating small image")
                          // On very small screens, prefer "contain" so the image doesn't look overly cropped.
                          className="absolute inset-0 w-full h-full object-contain sm:object-cover object-center group-hover:scale-[1.01] transition duration-500"
                          loading="eager"
                          decoding="async"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[21/9] sm:aspect-[16/10] w-full bg-slate-100 dark:bg-white/10" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                        Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="flex items-start justify-between gap-3 sm:gap-4 min-w-0">
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {featuredItem.p?.title}
                        </h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                          {shortText(getDesc(featuredItem.p), 160)}
                        </p>

                        <div key={`story-${featuredKey}`} className="mt-5 grid gap-3 sm:grid-cols-2">
                          {[
                            { label: "Problem (Project story)", value: featuredItem.p?.problem },
                            { label: "System (Architecture)", value: featuredItem.p?.system },
                            { label: "Solution (What you built)", value: featuredItem.p?.solution },
                            { label: "Impact (Result)", value: featuredItem.p?.impact },
                          ].map((it, idx) => (
                            <div key={`${featuredKey}-story-${idx}`} className="min-w-0">
                              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {it.label}
                              </div>

                              <div className="mt-2 relative rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 sm:px-4 py-3 sm:py-4 overflow-hidden">
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 dark:ring-white/10"
                                />
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute -bottom-px -right-px h-7 w-7 rounded-br-2xl border-b border-r border-slate-200/70 dark:border-white/10"
                                />
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute bottom-2 right-2 h-px w-10 rotate-45 origin-right bg-slate-200/70 dark:bg-white/10"
                                />

                                <div className="relative text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                                  {it.value ? it.value : "—"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <span className="hidden sm:inline shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition">
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
                <div className="rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 sm:p-10 text-slate-600 dark:text-slate-400">
                  No projects yet.
                </div>
              )}
            </motion.div>

            {/* List */}
            <div className="lg:col-span-4 flex flex-col gap-4 min-w-0 max-w-full">
              <motion.div
                variants={fadeUp}
                className="rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 sm:p-6"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">All projects</div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Click any project to feature it.
                </p>
              </motion.div>

              {items.length ? (
                <motion.div
                  variants={staggerContainer}
                  initial={false}
                  animate="visible"
                  className="rounded-3xl border border-slate-200/70 dark:border-white/10 overflow-hidden"
                >
                  {items.map((item) => {
                    const isActive = item.key === featuredKey;
                    return (
                      <motion.button
                        key={item.key}
                        variants={fadeUp}
                        initial={false}
                        type="button"
                        onClick={() => !isActive && swapFeatured(item)}
                        className={`w-full text-left px-4 sm:px-5 py-3.5 sm:py-4 bg-white/70 dark:bg-[#0B0F19]/40 transition flex items-center gap-3 sm:gap-4 ${
                          isActive
                            ? "opacity-80 cursor-default"
                            : "hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                        }`}
                      >
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-6 shrink-0">
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
                            {shortText(getDesc(item.p), 90)}
                          </div>
                        </div>

                        <div className="ml-auto text-slate-400 shrink-0">↔</div>
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