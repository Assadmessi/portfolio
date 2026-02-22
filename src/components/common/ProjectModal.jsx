import { useEffect } from "react";
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
            {project.image && (
              <img
                src={isCloudinaryUrl(project.image) ? cldTransform(project.image, "f_auto,q_auto,w_1400,c_fill,g_auto") : project.image}
                srcSet={cldSrcSet(project.image)}
                sizes="(max-width: 640px) 92vw, 100vw"
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-44 sm:h-52 md:h-56 object-contain sm:object-cover rounded-xl mb-6 bg-black/5 dark:bg-white/5"
              />
            )}

            <h3 className="text-2xl font-bold mb-3">{project.title}</h3>

            <p className="text-slate-700 dark:text-slate-400 mb-6">{project.desc}</p>

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

            {normalizeProof(project.proof ?? project.highlights).length ? (
              <div className="mb-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                  Proof
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {normalizeProof(project.proof ?? project.highlights).slice(0, 3).map((h, i) => (
                    <div key={`${project.title}-proof-${i}`} className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-3">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 dark:bg-white/10 text-slate-900 dark:text-slate-100">
                          <ProofIcon iconKey={h.iconKey} iconUrl={h.iconUrl} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold">{h.title}</div>
                          {h.desc ? <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{h.desc}</div> : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
