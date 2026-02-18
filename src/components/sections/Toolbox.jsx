import { MotionSection } from "../../animations/MotionWrappers";
import { cardEnter, sectionEnter, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

// Extra section inspired by Nubien-style "integrations/toolbox" blocks.
// It doesn't change your existing text/sections; it only adds visual proof.

const stack = [
  { name: "React", hint: "UI" },
  { name: "Tailwind", hint: "Design" },
  { name: "Framer Motion", hint: "Motion" },
  { name: "Firebase", hint: "Realtime" },
  { name: "Vite", hint: "Build" },
  { name: "Cloudinary", hint: "Assets" },
];

const Toolbox = () => {
  return (
    <MotionSection id="toolbox" variants={sectionEnter} className="pt-20">
      <div className="nb-container">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
          <motion.div variants={cardEnter} className="nb-card nb-ring p-8 md:p-10">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div>
                <div className="nb-pill w-fit">Toolbox</div>
                <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">
                  Tools I use to ship fast
                </h2>
                <p className="nb-muted mt-2 max-w-2xl">
                  A focused stack for clean UI, smooth motion, and easy content updates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="sv-kbd">UI</span>
                <span className="sv-kbd">Motion</span>
                <span className="sv-kbd">Backend</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stack.map((s) => (
                <div key={s.name} className="rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 p-4">
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="text-xs nb-muted mt-1">{s.hint}</div>
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
