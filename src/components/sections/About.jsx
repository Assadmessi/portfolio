import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";
import { siteContent } from "../../content";

const About = () => {
  const defaultProof = [
    {
      title: "UI + Motion",
      desc: "Smooth interactions, scroll reveals, and clean component systems.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      ),
    },
    {
      title: "Admin-ready UX",
      desc: "Dashboards, role-based flows, and content editing patterns.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16v6H4zM4 14h7v6H4zM13 14h7v6h-7z" />
        </svg>
      ),
    },
    {
      title: "Production mindset",
      desc: "Performance, maintainability, and deploy-friendly structure.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3 7h7l-5.5 4.3L18.5 21 12 16.8 5.5 21l2-7.7L2 9h7z" />
        </svg>
      ),
    },
  ];
  const { about } = siteContent;

  return (
    <MotionSection
      id="about"
      variants={staggerContainer}
      className="py-24"
    >
      <div className="nb-container">
      <motion.div variants={fadeUp} className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold">{about.title}</h2>

        {about.paragraphs.slice(0, 2).map((p, idx) => (
          <p
            key={idx}
            className={
              idx === 0
                ? "mt-6 text-slate-600 dark:text-gray-400 leading-relaxed"
                : "mt-4 text-slate-600 dark:text-gray-400 leading-relaxed"
            }
          >
            {p}
          </p>
        ))}

                <div className="mt-10 flex flex-wrap gap-2">
          {about.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Proof blocks (CMS: title/desc/iconKey). Layout stays the same. */}
        <motion.div
          variants={fadeUp}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {(about.proofBlocks?.length ? about.proofBlocks : defaultProof).map(
            (item) => {
              const iconEl =
                (item.iconUrl ? (
                  <img src={item.iconUrl} alt="" className="w-5 h-5 object-contain" loading="lazy" />
                ) : item.icon) ||
                {
                  ui: (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 7h16M4 12h16M4 17h10" />
                    </svg>
                  ),
                  dashboard: (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16v6H4zM4 14h7v6H4zM13 14h7v6h-7z" />
                    </svg>
                  ),
                  rocket: (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 4c4 1 6 4 6 8-4 0-7 2-8 6-2 0-5-2-6-6 4 0 7-2 8-8z" />
                      <path d="M9 15l-2 2" />
                    </svg>
                  ),
                  shield: (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
                    </svg>
                  ),
                  zap: (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M13 2L3 14h8l-1 8 11-14h-8z" />
                    </svg>
                  ),
                  sparkles: (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
                      <path d="M4 16l.75 2.25L7 19l-2.25.75L4 22l-.75-2.25L1 19l2.25-.75L4 16z" />
                    </svg>
                  ),
                  code: (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M8 9l-3 3 3 3" />
                      <path d="M16 9l3 3-3 3" />
                      <path d="M14 4l-4 16" />
                    </svg>
                  ),
                  globe: (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20" />
                      <path d="M12 2c3 3 3 17 0 20" />
                    </svg>
                  ),
                  wand: (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 4l5 5" />
                      <path d="M4 15l5 5" />
                      <path d="M7 12l10-10" />
                      <path d="M3 21l6-6" />
                    </svg>
                  ),
                }[item.iconKey] ||
                defaultProof[0].icon;

              return (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -6 }}
                  className="nb-card p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl
                                 bg-white/10 text-indigo-200 ring-1 ring-white/10">
                      {iconEl}
                    </span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            }
          )}
        </motion.div>
</motion.div>
      </div>
   
    </MotionSection>
  );
};

export default About;