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
          {(about.proofBlocks?.length ? about.proofBlocks : defaultProof).map((item) => (
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
