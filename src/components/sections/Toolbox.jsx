import { motion } from "framer-motion";
import { siteContent } from "../../content";

const fallback = {
  pill: "Toolbox",
  title: "Tools I use to ship fast",
  intro: "A focused stack for clean UI, smooth motion, and easy content updates.",
  chips: ["UI", "Motion", "Backend"],
  items: [
    { name: "React",         hint: "UI" },
    { name: "Tailwind",      hint: "Design" },
    { name: "Framer Motion", hint: "Motion" },
    { name: "Firebase",      hint: "Realtime" },
    { name: "Vite",          hint: "Build" },
    { name: "Cloudinary",    hint: "Assets" },
  ],
};

const Toolbox = () => {
  const t = siteContent?.toolbox ?? fallback;
  const chips = Array.isArray(t?.chips) && t.chips.length ? t.chips : fallback.chips;
  const items = Array.isArray(t?.items) && t.items.length ? t.items : fallback.items;

  return (
    <section id="toolbox" className="relative py-32 sm:py-44 overflow-hidden">
      {/* Sticky label */}
      <div className="absolute top-10 left-6 sm:left-10 z-10 pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.3em] text-cyan-500 dark:text-cyan-400/70 uppercase">/ 03 — Toolbox</p>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10">
        {/* Title block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 sm:mb-20">
          <div className="lg:col-span-8">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block font-mono text-[10px] tracking-[0.25em] text-slate-500 dark:text-white/40 uppercase mb-5"
            >
              {t.pill}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-extrabold leading-[0.9] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
            >
              {t.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mt-6 text-base sm:text-lg text-slate-700 dark:text-white/65 leading-relaxed max-w-2xl font-mono"
            >
              {t.intro}
            </motion.p>
          </div>

          {/* Right: chips */}
          <div className="lg:col-span-4 flex flex-wrap gap-2 lg:justify-end items-end pb-2">
            {chips.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 border border-black/15 dark:border-white/15 rounded-full text-slate-700 dark:text-white/70"
              >
                {c}
              </motion.span>
            ))}
          </div>
        </div>

        {/* GRID OF TOOLS — ORYZO feature-block style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {items.map((s, idx) => (
            <motion.div
              key={`${s?.name ?? "item"}-${idx}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent p-5 hover:border-cyan-400/30 transition-all cursor-default aspect-square sm:aspect-auto sm:min-h-[140px] flex flex-col justify-end"
            >
              <div className="absolute top-3 right-3 font-mono text-[8px] tracking-[0.2em] text-slate-500 dark:text-white/30 uppercase">
                {String(idx + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10">
                <p className="text-sm sm:text-base font-bold tracking-tight mb-0.5">{s?.name}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-white/40 font-mono uppercase tracking-wider">
                  {s?.hint}
                </p>
              </div>

              {/* Hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/0 to-cyan-400/0 group-hover:from-cyan-400/5 group-hover:via-indigo-400/5 group-hover:to-cyan-400/0 transition-all duration-500" />
              {/* Bottom glow line */}
              <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-indigo-400/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Toolbox;
