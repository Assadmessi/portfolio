import { MotionSection } from "../../animations/MotionWrappers";
import { cardEnter, sectionEnter, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";
import { siteContent } from "../../content";

// Extra section inspired by Nubien-style "integrations/toolbox" blocks.
// It doesn't change your existing text/sections; it only adds visual proof.

const fallback = {
  pill: "Toolbox",
  title: "Tools I use to ship fast",
  intro: "A focused stack for clean UI, smooth motion, and easy content updates.",
  chips: ["UI", "Motion", "Backend"],
  items: [
    { name: "React", hint: "UI" },
    { name: "Tailwind", hint: "Design" },
    { name: "Framer Motion", hint: "Motion" },
    { name: "Firebase", hint: "Realtime" },
    { name: "Vite", hint: "Build" },
    { name: "Cloudinary", hint: "Assets" },
  ],
};

const Toolbox = () => {
  const toolbox = siteContent?.toolbox ?? fallback;
  const chips = Array.isArray(toolbox?.chips) && toolbox.chips.length ? toolbox.chips : fallback.chips;
  const items = Array.isArray(toolbox?.items) && toolbox.items.length ? toolbox.items : fallback.items;

  return (
    <MotionSection id="toolbox" variants={sectionEnter} className="pt-20">
      <div className="nb-container">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
          <motion.div variants={cardEnter} className="nb-card nb-ring p-8 md:p-10">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div>
                <div className="nb-pill w-fit">{toolbox?.pill ?? fallback.pill}</div>
                <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">
                  {toolbox?.title ?? fallback.title}
                </h2>
                <p className="nb-muted mt-2 max-w-2xl">
                  {toolbox?.intro ?? fallback.intro}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {chips.map((c) => (
                  <span key={c} className="sv-kbd">{c}</span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {items.map((s, idx) => (
                <div key={`${s?.name ?? "item"}-${idx}`} className="rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 p-4">
                  <div className="text-sm font-semibold">{s?.name}</div>
                  <div className="text-xs nb-muted mt-1">{s?.hint}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MotionSection>
  );
};

export default Toolbox;
