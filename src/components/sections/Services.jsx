import { memo } from "react";
import { motion } from "framer-motion";
import { siteContent } from "../../content";

const Services = ({ tick }) => {
  void tick;
  const { services } = siteContent;

  const EMAIL = services.email;
  const subject = services.emailSubject;
  const body = services.emailBodyLines.join("\r\n");
  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section id="services" className="relative py-32 sm:py-44 overflow-hidden">
      {/* Sticky label */}
      <div className="absolute top-10 left-6 sm:left-10 z-10 pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-500 dark:text-cyan-400/70 uppercase">/ 02 — Services</p>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10">
        {/* Big section title — left aligned */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-extrabold leading-[0.9] tracking-[-0.04em] mb-8"
          style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
        >
          {services.sectionTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="text-base sm:text-lg text-slate-700 dark:text-white/65 leading-relaxed max-w-3xl mb-10 font-mono"
        >
          {services.sectionDescription}
        </motion.p>

        {/* CTA + meta row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-center gap-5 mb-20 sm:mb-28"
        >
          <a
            href={mailtoHref}
            className="px-7 py-3.5 rounded-md text-sm font-semibold transition-all bg-gradient-to-br from-indigo-500/30 to-cyan-400/15 border border-indigo-400/40 hover:translate-y-[-2px] hover:border-indigo-400/70 hover:shadow-[0_8px_24px_rgba(99,102,241,0.25)] font-mono tracking-wider w-fit"
          >
            {services.ctaLabel}
          </a>
          <div className="flex flex-col gap-1 text-xs sm:text-sm text-slate-600 dark:text-white/55 font-mono">
            <span>
              <span className="text-slate-400 dark:text-white/30">Based in</span>{" "}
              <span className="text-slate-900 dark:text-white">{services.basedIn.location}</span>
              <span className="text-slate-400 dark:text-white/30"> · </span>
              <span>{services.basedIn.remote}</span>
            </span>
            <span>
              <span className="text-slate-400 dark:text-white/30">From</span>{" "}
              <span className="text-slate-900 dark:text-white">{services.pricing.range}</span>{" "}
              {services.pricing.suffix}
            </span>
          </div>
        </motion.div>

        {/* SERVICE TIER CARDS — ORYZO pricing-tier layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-24 sm:mb-32">
          {services.cards.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent p-7 sm:p-9 hover:border-cyan-400/30 transition-all"
            >
              {/* Tier number top corner */}
              <div className="absolute top-5 right-5 font-mono text-[10px] tracking-[0.2em] text-cyan-500 dark:text-cyan-400/70 uppercase">
                Pkg · {String(i + 1).padStart(2, "0")}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">{s.title}</h3>

              <ul className="space-y-2.5">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="flex gap-3 text-sm sm:text-base text-slate-700 dark:text-white/70 leading-relaxed"
                  >
                    <span className="text-cyan-500 dark:text-cyan-400 mt-1.5 shrink-0 font-mono text-[10px]">→</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p}</span>
                  </li>
                ))}
              </ul>

              {/* Bottom glow line */}
              <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-indigo-400/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>

        {/* PROCESS — numbered steps in ORYZO editorial style */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-extrabold tracking-[-0.02em] mb-10"
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}
        >
          {services.processTitle}
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
          {services.processSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group flex items-start gap-5 py-5 border-b border-black/5 dark:border-white/5 hover:border-cyan-400/30 transition-colors"
            >
              <span className="font-mono text-xs tracking-[0.2em] text-cyan-500 dark:text-cyan-400/70 uppercase shrink-0 pt-1.5 w-12">
                / {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg sm:text-xl font-bold mb-1.5">{step.title}</h4>
                <p
                  className="text-sm text-slate-600 dark:text-white/55 leading-relaxed"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tip line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 text-sm text-slate-500 dark:text-white/40 font-mono"
        >
          {services.tipLine}
        </motion.p>
      </div>
    </section>
  );
};

export default memo(Services);
