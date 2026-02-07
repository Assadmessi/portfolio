import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-44 sm:h-52 md:h-56 object-contain sm:object-cover rounded-xl mb-6 bg-black/5 dark:bg-white/5"
              />
            )}

            <h3 className="text-2xl font-bold mb-3">{project.title}</h3>

            <p className="text-slate-700 dark:text-slate-400 mb-6">{project.desc}</p>

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
