import { memo } from "react";
import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";
import MaskText from "../../animations/MaskText";
import { siteContent } from "../../content";

const Services = () => {
  const { services } = siteContent;

  const EMAIL = services.email;
  const subject = services.emailSubject;

  const body = services.emailBodyLines.join("\r\n");

  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  const serviceCards = services.cards;
  const process = services.processSteps;

  return (
    <MotionSection
      id="services"
      variants={staggerContainer}
      className="py-24 px-6 max-w-6xl mx-auto scroll-mt-24"
    >
      <div className="text-center">
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100"
        >
          <MaskText as="span" text={services.sectionTitle} />
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-5 text-slate-700 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto"
        >
          {services.sectionDescription}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-3">
          <a
            href={mailtoHref}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition
                       bg-indigo-600/90 text-white hover:bg-indigo-600
                       ring-1 ring-indigo-600/20
                       dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:ring-indigo-400/20"
          >
            {services.ctaLabel}
          </a>

          <p className="text-sm text-slate-700 dark:text-slate-400">
            Based in{" "}
            <span className="text-slate-900 dark:text-slate-200 font-medium">{services.basedIn.location}</span>
            {" "}— available for{" "}
            <span className="text-slate-900 dark:text-slate-200 font-medium">{services.basedIn.remote}</span>.
          </p>

          <p className="text-sm text-slate-700 dark:text-slate-400">
            Typical projects start from{" "}
            <span className="text-slate-900 dark:text-slate-200 font-medium">{services.pricing.range}</span>{" "}
            {services.pricing.suffix}
          </p>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {serviceCards.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-black/5 dark:border-white/10
                       bg-white/70 dark:bg-white/5 p-6 backdrop-blur"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{s.title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-400">
              {s.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1 text-indigo-500/70 dark:text-indigo-300/80">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-16">
        <h3 className="text-xl font-semibold text-center text-slate-900 dark:text-slate-100">
          {services.processTitle}
        </h3>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {process.map((step) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-black/5 dark:border-white/10
                         bg-white/70 dark:bg-white/5 p-6 backdrop-blur"
            >
              <span className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-indigo-500/70 dark:bg-indigo-400/70" />
              <p className="pl-4 font-medium text-slate-900 dark:text-slate-100">{step.title}</p>
              <p className="pl-4 mt-2 text-sm text-slate-800 dark:text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-slate-700 dark:text-slate-400">
          <span className="text-slate-900 dark:text-slate-200 font-medium">Tip:</span>{" "}
          {services.tipLine.replace(/^Tip:\s*/i, "")}
        </div>
      </motion.div>
    </MotionSection>
  );
};

export default memo(Services);
