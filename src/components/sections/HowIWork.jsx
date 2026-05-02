import { motion } from "framer-motion";
import { siteContent } from "../../content";

const HowIWork = () => {
  const { howIWork } = siteContent;

  return (
    <section id="skills" className="relative py-32 sm:py-44 overflow-hidden scroll-mt-24">
      {/* Sticky label */}
      <div className="absolute top-10 left-6 sm:left-10 z-10 pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-500 dark:text-cyan-400/70 uppercase">/ 04 — How I Work</p>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* LEFT — title + intro */}
          <div className="lg:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-extrabold leading-[0.9] tracking-[-0.04em] sticky top-32"
              style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
            >
              {howIWork.title}
            </motion.h2>
          </div>

          {/* RIGHT — intro + numbered list */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-base sm:text-lg text-slate-700 dark:text-white/65 leading-relaxed mb-12 font-mono"
            >
              {howIWork.intro}
            </motion.p>

            <ul>
              {howIWork.points.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group flex items-start gap-5 sm:gap-8 py-5 sm:py-6 border-b border-black/5 dark:border-white/5 hover:border-cyan-400/30 transition-colors"
                >
                  <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-cyan-500 dark:text-cyan-400/70 uppercase shrink-0 w-10 sm:w-12 pt-1.5">
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-base sm:text-xl text-slate-800 dark:text-white/85 leading-relaxed flex-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {p}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
