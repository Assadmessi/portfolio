import { memo } from "react";
import { MotionSection } from "../../animations/MotionWrappers";
import { motion } from "framer-motion";
import { siteContent } from "../../content";
import logoMark from "../../assets/images/logo.png";

const Hero = () => {
  const { hero, links } = siteContent;

  const RESUME_URL = links.resumeUrl;
  const GITHUB_URL = links.githubUrl;
  const LINKEDIN_URL = links.linkedinUrl;


  // Cinematic (but still premium): slightly slower stagger + soft blur reveal
  const heroStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.12,
      },
    },
  };

  const heroFadeUp = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionSection
      id="home"
      variants={heroStagger}
      className="min-h-[calc(100vh-4rem)] pt-24 flex items-center justify-center text-center px-6 scroll-mt-24"
    >

      {/* Cinematic background (subtle, premium) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.75, 0.55] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
          animate={{ scale: [1.02, 0.96, 1.02], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-3xl">
        {/* Hero photo (keeps original layout; adds premium visual proof) */}
        <motion.div
          variants={heroFadeUp}
          className="mx-auto mb-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[2px]
                     bg-gradient-to-b from-indigo-500/60 via-indigo-500/20 to-transparent
                     shadow-[0_0_0_1px_rgba(99,102,241,0.18)]"
        >
          <motion.div
            className="relative w-full h-full rounded-full overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur"
            animate={{ y: [0, -8, 0], rotate: [0, -1.5, 0], scale: [1, 1.02, 1] }}
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
          variants={heroFadeUp}
          className="text-sm tracking-wider uppercase text-indigo-700/80 dark:text-indigo-300/80"
        >
          {hero.badge}
        </motion.p>

        <motion.h1
          variants={heroFadeUp}
          className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-slate-100"
        >
          {hero.name}
          <br />
          <span className="text-indigo-600/90 dark:text-indigo-400">
            {hero.headlineAccent}
          </span>
        </motion.h1>

        <motion.p
          variants={heroFadeUp}
          className="mt-6 text-slate-700 dark:text-slate-400 text-base sm:text-lg leading-relaxed"
        >
          {hero.intro}
        </motion.p>

        <motion.p variants={heroFadeUp} className="mt-3 text-slate-700 dark:text-slate-400">
          {hero.availability}
        </motion.p>

        <motion.div
          variants={heroFadeUp}
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
          variants={heroFadeUp}
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
