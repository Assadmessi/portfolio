import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProjectModal from "../common/ProjectModal";
import { projectsContent } from "../../content";
import { getProjectDesc, getProjectKey, normalizeProjects, sortProjects } from "../../utils/projects";

/* ── Cloudinary helpers (UNCHANGED) ─────────────────────────────── */
const isCloudinaryUrl = (url) =>
  typeof url === "string" && url.includes("res.cloudinary.com") && url.includes("/upload/");

const cldTransform = (url, transform) => {
  if (!isCloudinaryUrl(url)) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
};

const cldSrcSetFeatured = (url, widths = [480, 768, 1024, 1440, 1920]) => {
  if (!isCloudinaryUrl(url)) return undefined;
  return widths
    .map((w) => {
      const t = w <= 640 ? `f_auto,q_auto,w_${w},c_fit` : `f_auto,q_auto,w_${w},c_fill,g_auto`;
      return `${cldTransform(url, t)} ${w}w`;
    })
    .join(", ");
};

const normalizeUrl = (url) => {
  if (!url) return "";
  const u = String(url).trim();
  if (!u) return "";
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
};

const isDirectImageUrl = (url) => {
  if (!url) return false;
  const s = String(url).trim();
  if (/^data:image\//i.test(s)) return true;
  if (/\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(s)) return true;
  try {
    const u = new URL(normalizeUrl(s));
    const host = u.hostname.toLowerCase();
    if (host.includes("res.cloudinary.com")) return true;
    if (host.includes("imagekit.io") || host.includes("ik.imagekit.io")) return true;
  } catch { return false; }
  return false;
};

const getAutoThumbnailCandidates = (liveUrl) => {
  const url = normalizeUrl(liveUrl);
  if (!url) return [];
  return [
    `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1600`,
    `https://image.thum.io/get/width/1200/crop/800/${url}`,
  ];
};

const resolveProjectImageCandidates = (rawImage, fallbackLiveUrl = "") => {
  const img = normalizeUrl(rawImage);
  if (img) return isDirectImageUrl(img) ? [img] : getAutoThumbnailCandidates(img);
  return fallbackLiveUrl ? getAutoThumbnailCandidates(fallbackLiveUrl) : [];
};

const getProjectLinks = (p) => {
  const links = p?.links ?? {};
  return {
    live: normalizeUrl(links.live ?? links.liveUrl ?? links.url ?? p?.live ?? p?.liveUrl),
    repo: normalizeUrl(links.repo ?? links.github ?? links.repoUrl ?? p?.repo ?? p?.repoUrl),
    pdf:  normalizeUrl(links.pdf  ?? links.pdfUrl  ?? p?.pdf  ?? p?.pdfUrl),
  };
};

const shortText = (text = "", max = 120) => {
  if (typeof text !== "string") return "";
  const t = text.trim();
  return t.length > max ? t.slice(0, max).trimEnd() + "…" : t;
};

/* ── ORYZO-style Projects ──────────────────────────────────────── */
const Projects = ({ tick }) => {
  void tick;

  const { projects: rawProjects, sectionTitle } = projectsContent;
  const projects = useMemo(() => sortProjects(normalizeProjects(rawProjects), "latest"), [rawProjects]);
  const latestProjects = useMemo(() => projects.slice(0, 3), [projects]);
  const items = useMemo(
    () => latestProjects.map((p, i) => ({ p, i, key: getProjectKey(p, i) })),
    [latestProjects]
  );

  const [featuredKey, setFeaturedKey] = useState(() => getProjectKey(latestProjects?.[0], 0));
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    if (!items.length) return;
    const exists = items.some((x) => x.key === featuredKey);
    if (!exists) setFeaturedKey(items[0].key);
  }, [items, featuredKey]);

  const featuredItem = useMemo(
    () => items.find((x) => x.key === featuredKey) ?? items[0],
    [items, featuredKey]
  );
  const featuredLinks = useMemo(() => getProjectLinks(featuredItem?.p), [featuredItem]);
  const featuredImgRaw =
    featuredItem?.p?.image ??
    featuredItem?.p?.imageUrl ??
    featuredItem?.p?.cover ??
    featuredItem?.p?.thumbnail ??
    "";
  const featuredImgCandidates = useMemo(
    () => resolveProjectImageCandidates(featuredImgRaw, featuredLinks.live),
    [featuredImgRaw, featuredLinks.live]
  );
  const [featuredImgIndex, setFeaturedImgIndex] = useState(0);

  useEffect(() => {
    setFeaturedImgIndex(0);
  }, [featuredItem?.key, featuredImgRaw, featuredLinks.live]);

  const featuredImg = featuredImgCandidates[featuredImgIndex] ?? "";

  return (
    <>
      <section id="projects" className="relative py-32 sm:py-44 overflow-hidden scroll-mt-24">
        {/* Sticky label */}
        <div className="absolute top-10 left-6 sm:left-10 z-10 pointer-events-none">
          <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-500 dark:text-cyan-400/70 uppercase">/ 05 — Work</p>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10">
          {/* Massive section title */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-extrabold leading-[0.9] tracking-[-0.04em] mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
          >
            {sectionTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-base sm:text-lg text-slate-700 dark:text-white/65 leading-relaxed max-w-2xl mb-16 font-mono"
          >
            Product-focused builds with clean UX, motion polish, and production-ready structure.
          </motion.p>

          {featuredItem ? (
            <>
              {/* FEATURED — large image showcase */}
              <motion.button
                type="button"
                onClick={() => setActiveProject(featuredItem.p)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative w-full text-left rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent mb-3 hover:border-cyan-400/30 transition-all"
              >
                {/* Project meta row above image */}
                <div className="absolute top-5 left-5 right-5 z-10 flex items-start justify-between pointer-events-none">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-500 dark:text-cyan-400/80 uppercase bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
                    Featured · 01
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
                    {Array.isArray(featuredItem.p?.tech) ? featuredItem.p.tech.length : 0} techs
                  </span>
                </div>

                {/* Image */}
                {featuredImg ? (
                  <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-slate-100 dark:bg-white/5 overflow-hidden">
                    <img
                      src={
                        isCloudinaryUrl(featuredImg)
                          ? cldTransform(featuredImg, "f_auto,q_auto,w_1600,c_fill,g_auto")
                          : featuredImg
                      }
                      srcSet={cldSrcSetFeatured(featuredImg)}
                      sizes="100vw"
                      alt={featuredItem.p.title}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFeaturedImgIndex((idx) => {
                          const next = idx + 1;
                          return next < featuredImgCandidates.length ? next : idx;
                        })
                      }
                    />
                    {/* Bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Crosshair corners */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-l border-t border-cyan-400/50" />
                    <div className="absolute top-3 right-3 w-3 h-3 border-r border-t border-cyan-400/50" />
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-cyan-400/50" />
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-cyan-400/50" />

                    {/* Title overlay on image */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3
                        className="font-extrabold tracking-[-0.02em] leading-[0.95]"
                        style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}
                      >
                        {featuredItem.p?.title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-gradient-to-br from-indigo-500/10 to-cyan-500/5" />
                )}
              </motion.button>

              {/* DETAILS BELOW IMAGE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16"
              >
                <div className="lg:col-span-7">
                  <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-white/70 font-mono">
                    {shortText(getProjectDesc(featuredItem.p), 220)}
                  </p>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: "Problem", value: featuredItem.p?.problem },
                      { label: "Solution", value: featuredItem.p?.solution },
                    ].map((it) => (
                      <div key={it.label}>
                        <p className="font-mono text-[10px] tracking-[0.25em] text-cyan-500 dark:text-cyan-400/70 uppercase mb-2">
                          / {it.label}
                        </p>
                        <p
                          className="text-sm text-slate-700 dark:text-white/65 leading-relaxed"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {it.value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-cyan-500 dark:text-cyan-400/70 uppercase mb-3">/ Stack</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(featuredItem.p?.tech || []).slice(0, 8).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full text-xs border border-black/10 dark:border-white/10 text-slate-700 dark:text-white/70 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {featuredLinks.live && (
                      <a
                        href={featuredLinks.live}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-md text-xs font-semibold transition-all bg-gradient-to-br from-indigo-500/30 to-cyan-400/15 border border-indigo-400/40 hover:translate-y-[-2px] font-mono tracking-wider"
                      >
                        ↗ Live
                      </a>
                    )}
                    {featuredLinks.repo && (
                      <a
                        href={featuredLinks.repo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-md text-xs font-semibold border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all font-mono tracking-wider"
                      >
                        ⌥ Source
                      </a>
                    )}
                    {featuredLinks.pdf && (
                      <a
                        href={featuredLinks.pdf}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-md text-xs font-semibold border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all font-mono tracking-wider"
                      >
                        ⏍ PDF
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* OTHER PROJECTS — switcher list */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
                  <h3 className="font-bold text-lg sm:text-xl">More projects</h3>
                  <a
                    href="/projects"
                    className="font-mono text-xs tracking-wider text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    View all →
                  </a>
                </div>

                <div className="border-t border-black/10 dark:border-white/10">
                  {items.map((item) => {
                    const isActive = item.key === featuredKey;
                    return (
                      <motion.button
                        key={item.key}
                        type="button"
                        onClick={() => !isActive && setFeaturedKey(item.key)}
                        whileHover={!isActive ? { x: 4 } : {}}
                        className={`w-full text-left px-3 sm:px-5 py-5 sm:py-6 border-b border-black/5 dark:border-white/5 hover:bg-cyan-400/[0.03] transition flex items-center gap-4 sm:gap-6 ${
                          isActive ? "opacity-50 cursor-default" : "cursor-pointer"
                        }`}
                      >
                        <span className="font-mono text-xs tracking-[0.2em] text-cyan-500 dark:text-cyan-400/70 uppercase shrink-0 w-10">
                          /{String(item.i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-base sm:text-lg truncate">{item.p?.title}</h4>
                            {isActive && (
                              <span className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-600 dark:text-cyan-300 font-mono">
                                Showing
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs sm:text-sm text-slate-600 dark:text-white/50 truncate"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {shortText(getProjectDesc(item.p), 100)}
                          </p>
                        </div>
                        <span className="text-slate-400 dark:text-white/30 shrink-0 hidden sm:inline">→</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          ) : (
            <div className="rounded-2xl border border-black/10 dark:border-white/10 p-10 text-slate-600 dark:text-white/50 font-mono">
              No projects yet.
            </div>
          )}
        </div>
      </section>

      {activeProject ? <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} /> : null}
    </>
  );
};

export default memo(Projects);
