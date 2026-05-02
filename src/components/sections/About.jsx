import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { siteContent } from "../../content";

const iconMap = {
  ui: "01",
  dashboard: "02",
  rocket: "03",
  shield: "04",
  zap: "05",
  sparkles: "06",
  code: "07",
  globe: "08",
  wand: "09",
};

const About = () => {
  const { about } = siteContent;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgWordX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section id="about" ref={ref} className="relative py-32 sm:py-48 overflow-hidden">
      {/* Sticky section label (ORYZO style) */}
      <div className="absolute top-10 left-6 sm:left-10 z-10 pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-500 dark:text-cyan-400/70 uppercase">/ 01 — About</p>
      </div>

      {/* Big background word that drifts on scroll */}
      <motion.div
        style={{ x: bgWordX }}
        className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap pointer-events-none opacity-[0.025] z-0"
      >
        <span
          className="font-extrabold tracking-[-0.05em] leading-none"
          style={{ fontSize: "clamp(10rem, 26vw, 26rem)" }}
        >
          {about.title.toUpperCase()}
        </span>
      </motion.div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10">
        {/* Massive headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-extrabold leading-[0.9] tracking-[-0.04em] mb-16 sm:mb-24"
          style={{ fontSize: "clamp(3rem, 9vw, 9rem)" }}
        >
          {about.title}
        </motion.h2>

        {/* Two-column body — paragraphs left, tags + stats right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* LEFT — paragraphs */}
          <div className="lg:col-span-7 lg:col-start-1">
            {about.paragraphs.map((p, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className={`text-base sm:text-lg leading-relaxed text-slate-700 dark:text-white/70 ${idx > 0 ? "mt-5" : ""}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {p}
              </motion.p>
            ))}

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-2"
            >
              {about.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs border border-black/10 dark:border-white/10 bg-white/5 text-slate-700 dark:text-white/80 hover:border-cyan-400/40 hover:text-cyan-600 dark:hover:text-cyan-300 transition cursor-default font-mono"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — proof blocks (cards stack like ORYZO feature blocks) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {(about.proofBlocks || []).map((item, i) => (
              <motion.div
                key={item.title || i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="group relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent p-5 sm:p-6 hover:border-cyan-400/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Index number */}
                  <div className="font-mono text-[10px] tracking-widest text-cyan-500 dark:text-cyan-400/70 uppercase shrink-0 pt-1">
                    {iconMap[item.iconKey] || String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold mb-1.5">{item.title}</h3>
                    <p
                      className="text-sm text-slate-600 dark:text-white/55 leading-relaxed"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
                {/* Bottom glow line that fills on hover */}
                <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/40 to-cyan-400/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
