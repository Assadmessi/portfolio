import { memo } from "react";
import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";
import { siteContent } from "../../content";
import logoMark from "../../assets/images/logo.png";

const Hero = () => {
  const { hero, links } = siteContent;

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
        {/* Hero photo (keeps original layout; adds premium visual proof) */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mb-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[2px]
                     bg-gradient-to-b from-indigo-500/60 via-indigo-500/20 to-transparent
                     shadow-[0_0_0_1px_rgba(99,102,241,0.18)]"
        >
          <motion.div
            className="relative w-full h-full rounded-full overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Soft glow */}
            <div className="pointer-events-none absolute -inset-6 bg-indigo-500/10 blur-2xl" />
            <img
              src={hero.photoUrl || siteContent.photoUrl || logoMark}
              alt={`${hero.name} profile`}
              className="relative z-10 w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </motion.div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="sv-pill mx-auto w-fit text-indigo-700/90 dark:text-indigo-200"
        >
          {hero.badge}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-slate-100"
        >
          {hero.name}
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-indigo-400">
            {hero.headlineAccent}
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 sv-muted text-base sm:text-lg leading-relaxed"
        >
          {hero.intro}
        </motion.p>

        <motion.p variants={fadeUp} className="mt-3 sv-muted">
          {hero.availability}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href={hero.buttons.primary.href}
            className="sv-btn-primary px-6 py-3"
          >
            {hero.buttons.primary.label}
          </a>

          <a
            href={hero.buttons.secondary.href}
            className="sv-btn px-6 py-3"
          >
            {hero.buttons.secondary.label}
          </a>

          <a
            href={RESUME_URL}
            download
            className="sv-btn px-6 py-3"
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
