import { memo } from "react";
import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";
import { siteContent } from "../../content";

const Hero = () => {
  const { hero, links, metrics } = siteContent;

  const RESUME_URL = links.resumeUrl;
  const GITHUB_URL = links.githubUrl;
  const LINKEDIN_URL = links.linkedinUrl;

  return (
    <MotionSection
      id="home"
      variants={staggerContainer}
      className="min-h-[calc(100vh-4rem)] pt-24 flex items-center justify-center text-center px-6 scroll-mt-24"
    >
      <div className="max-w-3xl">
        <motion.p
          variants={fadeUp}
          className="text-sm tracking-wider uppercase text-indigo-700/80 dark:text-indigo-300/80"
        >
          {hero.badge}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-slate-100"
        >
          {hero.name}
          <br />
          <span className="text-indigo-600/90 dark:text-indigo-400">
            {hero.headlineAccent}
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-slate-700 dark:text-slate-400 text-base sm:text-lg leading-relaxed"
        >
          {hero.intro}
        </motion.p>

        {hero.stack && (
          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400"
          >
            {hero.stack}
          </motion.p>
        )}

        <motion.p variants={fadeUp} className="mt-3 text-slate-700 dark:text-slate-400">
          {hero.availability}
        </motion.p>

        {metrics?.items?.length ? (
          <motion.div
            variants={fadeUp}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left"
          >
            {metrics.items.map((m, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-4 py-3"
              >
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{m.value}</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">{m.label}</div>
              </div>
            ))}
          </motion.div>
        ) : null}

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href={hero.buttons.primary.href}
            className="px-6 py-3 rounded-xl font-medium transition bg-indigo-600/90 text-white hover:bg-indigo-600 ring-1 ring-indigo-600/20 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:ring-indigo-400/20"
          >
            {hero.buttons.primary.label}
          </a>

          <a
            href={hero.buttons.secondary.href}
            className="px-6 py-3 rounded-xl transition border border-black/10 text-slate-800 hover:bg-black/5 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
          >
            {hero.buttons.secondary.label}
          </a>

          <a
            href={RESUME_URL}
            download
            className="px-6 py-3 rounded-xl transition border border-black/10 text-slate-800 hover:bg-black/5 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
          >
            {hero.buttons.resume.label}
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400"
        >
          <a className="hover:text-slate-900 dark:hover:text-white transition" href={GITHUB_URL} target="_blank" rel="noreferrer">
            {hero.footerLinks.githubLabel}
          </a>
          <span className="text-black/30 dark:text-white/20">•</span>
          <a className="hover:text-slate-900 dark:hover:text-white transition" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            {hero.footerLinks.linkedinLabel}
          </a>
          <span className="text-black/30 dark:text-white/20">•</span>
          <a className="hover:text-slate-900 dark:hover:text-white transition" href={hero.footerLinks.contactHref}>
            {hero.footerLinks.contactLabel}
          </a>
        </motion.div>
      </div>
    </MotionSection>
  );
};

export default memo(Hero);
