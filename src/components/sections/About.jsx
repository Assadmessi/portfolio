import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";
import { siteContent } from "../../content";

const About = () => {
  const ICONS = {
    ui: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 section-spacing" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7h16M4 12h16M4 17h10" />
      </svg>
    ),
    dashboard: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v6H4zM4 14h7v6H4zM13 14h7v6h-7z" />
      </svg>
    ),
    rocket: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 10l-3 3" />
        <path d="M5 20l3-3" />
        <path d="M9 15l-4 1 1-4 9-9a4 4 0 015 5z" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6z" />
        <path d="M9 12l2 2 4-5" />
      </svg>
    ),
    zap: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
      </svg>
    ),
    code: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 18l6-6-6-6" />
        <path d="M8 6l-6 6 6 6" />
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15 15 0 010 20" />
        <path d="M12 2a15 15 0 000 20" />
      </svg>
    ),
    sparkles: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
        <path d="M19 13l.8 2.4L22 16l-2.2.6L19 19l-.8-2.4L16 16l2.2-.6z" />
      </svg>
    ),
  };

  const defaultProof = [
    {
      title: "UI + Motion",
      desc: "Smooth interactions, scroll reveals, and clean component systems.",
      iconKey: "ui",
      icon: ICONS.ui,
    },
    {
      title: "Admin-ready UX",
      desc: "Dashboards, role-based flows, and content editing patterns.",
      iconKey: "dashboard",
      icon: ICONS.dashboard,
    },
    {
      title: "Production mindset",
      desc: "Performance, maintainability, and deploy-friendly structure.",
      iconKey: "shield",
      icon: ICONS.shield,
    },
  ];

  // Allow CMS to override only text while keeping icons/structure stable.
  const proofMerged = (siteContent.about?.proofBlocks?.length ? siteContent.about.proofBlocks : []).map((b, i) => {
    const base = defaultProof[i % defaultProof.length];
    const iconKey = b?.iconKey || base.iconKey;
    return {
      ...base,
      title: b?.title ?? base.title,
      desc: b?.desc ?? base.desc,
      iconKey,
      icon: ICONS[iconKey] || base.icon,
    };
  });
  const proofItems = proofMerged.length ? proofMerged : defaultProof;

  const { about } = siteContent;

  return (
    <MotionSection
      id="about"
      variants={staggerContainer}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      <motion.div variants={fadeUp} className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold">{about.title}</h2>

        {about.paragraphs.map((p, idx) => (
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
        
        {/* Proof blocks (photos can be added later, layout stays the same) */}
        <motion.div variants={fadeUp} className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {proofItems.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-black/5 dark:border-white/10
                         bg-white/70 dark:bg-white/5 backdrop-blur p-5"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl
                                 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300
                                 ring-1 ring-indigo-500/15">
                  {item.icon}
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
              </div>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
</div>
      </motion.div>
    </MotionSection>
  );
};

export default About;
