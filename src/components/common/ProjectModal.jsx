import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProofIcon } from "./IconLibrary";


// Cloudinary responsive helpers (keeps non-Cloudinary URLs untouched)
const isCloudinaryUrl = (url) =>
  typeof url === "string" && url.includes("res.cloudinary.com") && url.includes("/upload/");

const cldTransform = (url, transform) => {
  if (!isCloudinaryUrl(url)) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
};

const cldSrcSet = (url, widths = [480, 768, 1024, 1440, 1920]) => {
  if (!isCloudinaryUrl(url)) return undefined;
  return widths
    .map((w) => `${cldTransform(url, `f_auto,q_auto,w_${w},c_fill,g_auto`)} ${w}w`)
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
  } catch {
    return false;
  }

  return false;
};

const getMShotsThumbnail = (liveUrl, width = 1100, height = 760) => {
  const url = normalizeUrl(liveUrl);
  if (!url) return "";
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${width}&h=${height}`;
};

const getThumThumbnail = (liveUrl, width = 1100, height = 760) => {
  const url = normalizeUrl(liveUrl);
  if (!url) return "";
  return `https://image.thum.io/get/width/${width}/crop/${height}/${url}`;
};

const getAutoThumbnailSources = (liveUrl) => {
  const url = normalizeUrl(liveUrl);
  if (!url) return [];
  return [
    getMShotsThumbnail(url),
    getThumThumbnail(url),
  ].filter(Boolean);
};

const resolveProjectImage = (rawImage, fallbackLiveUrl = "") => {
  const img = normalizeUrl(rawImage);

  if (img) {
    if (isDirectImageUrl(img)) {
      return { src: img, fallbacks: [], isDirect: true };
    }

    const fallbacks = getAutoThumbnailSources(img);
    return { src: fallbacks[0] ?? "", fallbacks: fallbacks.slice(1), isDirect: false };
  }

  if (!fallbackLiveUrl) {
    return { src: "", fallbacks: [], isDirect: false };
  }

  const fallbacks = getAutoThumbnailSources(fallbackLiveUrl);
  return { src: fallbacks[0] ?? "", fallbacks: fallbacks.slice(1), isDirect: false };
};

const getProjectLinks = (p) => {
  const links = p?.links ?? {};
  return {
    live: normalizeUrl(links.live ?? links.liveUrl ?? links.url ?? p?.live ?? p?.liveUrl),
    repo: normalizeUrl(links.repo ?? links.github ?? links.repoUrl ?? p?.repo ?? p?.repoUrl),
    pdf: normalizeUrl(links.pdf ?? links.pdfUrl ?? p?.pdf ?? p?.pdfUrl),
  };
};

const LinkChip = ({ href, label, icon }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white hover:shadow-sm transition"
    >
      <span className="text-slate-500 dark:text-slate-300">{icon}</span>
      <span>{label}</span>
    </a>
  );
};
const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { scale: 0.96, opacity: 0, y: 10 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};


const normalizeProof = (raw) => {
  if (!raw) return [];
  const arr = Array.isArray(raw)
    ? raw
    : typeof raw === "object"
      ? Object.entries(raw)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([, v]) => v)
      : [];
  return arr.filter(Boolean).map((it) => ({
    title: typeof it === "string" ? it : it?.title ?? "",
    desc: typeof it === "string" ? "" : it?.desc ?? "",
    iconKey: typeof it === "string" ? "spark" : it?.iconKey ?? "spark",
    iconUrl: typeof it === "string" ? "" : it?.iconUrl ?? "",
  }));
};
const ProjectModal = ({ project, onClose }) => {
  const [sourceIndex, setSourceIndex] = useState(0);
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    // Lock background scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  const links = getProjectLinks(project);
  const imageSrcRaw = project?.image ?? project?.imageUrl ?? project?.cover ?? project?.thumbnail ?? "";
  const imageSrc = resolveProjectImage(imageSrcRaw, links.live);

  const imageSources = useMemo(() => {
    if (!imageSrc?.src) return [];
    return [imageSrc.src, ...(imageSrc.fallbacks ?? [])].filter(Boolean);
  }, [imageSrc]);

  useEffect(() => {
    setSourceIndex(0);
  }, [imageSrc?.src, imageSrc?.fallbacks, project]);

  const currentImageSrc = imageSources[sourceIndex] ?? "";

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 flex items-center justify-center px-4 sm:px-6"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="w-full max-w-lg rounded-2xl p-6 backdrop-blur
                       border border-black/10 bg-white/80 text-slate-900
                       dark:border-white/10 dark:bg-[#0f1621] dark:text-slate-100"
          >
            {currentImageSrc && (
              <img
                src={currentImageSrc}
                srcSet={imageSrc?.isDirect ? cldSrcSet(imageSrc.src) : undefined}
                sizes="(max-width: 640px) 92vw, 100vw"
                alt={project.title}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (sourceIndex < imageSources.length - 1) {
                    setSourceIndex((prev) => prev + 1);
                    return;
                  }
                  e.currentTarget.style.display = "none";
                }}
                className="w-full h-44 sm:h-52 md:h-56 object-contain sm:object-cover rounded-xl mb-6 bg-black/5 dark:bg-white/5"
              />
            )}

            <h3 className="text-2xl font-bold mb-3">{project.title}</h3>

            <div className="flex flex-wrap gap-2 mb-5">
              <LinkChip
                href={links.live}
                label="Live URL"
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
                    <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
                  </svg>
                }
              />
              <LinkChip
                href={links.repo}
                label="Repo URL"
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 2H8a2 2 0 0 0-2 2v16l6-3 6 3V4a2 2 0 0 0-2-2z" />
                  </svg>
                }
              />
              <LinkChip
                href={links.pdf}
                label="PDF URL"
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                }
              />
            </div>


            <p className="text-slate-700 dark:text-slate-400 mb-6">{project.desc ?? project.description ?? project.description ?? project?.desc}</p>

            {(project.problem || project.system || project.solution || project.impact) ? (
              <div className="space-y-4 mb-6">
                {project.problem ? (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Problem</div>
                    <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{project.problem}</div>
                  </div>
                ) : null}
                {project.system ? (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">System</div>
                    <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{project.system}</div>
                  </div>
                ) : null}
                {project.solution ? (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Solution</div>
                    <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{project.solution}</div>
                  </div>
                ) : null}
                {project.impact ? (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Impact</div>
                    <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{project.impact}</div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg font-medium transition
                           bg-indigo-600/90 text-white hover:bg-indigo-600
                           ring-1 ring-indigo-600/20
                           dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:ring-indigo-400/20"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
