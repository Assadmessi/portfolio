import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteContent } from "../../content";
import logoMark from "../../assets/images/logo.png";

const Hero = ({ tick }) => {
  void tick;
  const { hero, links } = siteContent;
  const RESUME_URL = links.resumeUrl;
  const GITHUB_URL = links.githubUrl;
  const LINKEDIN_URL = links.linkedinUrl;

  const { scrollY } = useScroll();
  const headlineY = useTransform(scrollY, [0, 800], [0, -120]);
  const headlineOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);

  return (
    <section id="home" className="relative min-h-screen scroll-mt-24 overflow-hidden">
      <div className="absolute top-24 left-6 sm:left-10 z-10 pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 dark:text-white/30 uppercase">/ Portfolio · 2026</p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase">{hero.headlineAccent}</p>
      </div>

      <div className="absolute top-24 right-6 sm:right-10 z-10 pointer-events-none">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
          </span>
          {hero.badge}
        </div>
      </div>

      <motion.div
        style={{ y: headlineY, opacity: headlineOpacity }}
        className="relative z-10 pt-40 sm:pt-48 px-6 sm:px-10 max-w-[1600px] mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-extrabold leading-[0.85] tracking-[-0.045em]"
          style={{ fontSize: "clamp(4rem, 17vw, 18rem)" }}
        >
          {hero.name}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 sm:mt-4 font-extrabold leading-[0.95] tracking-[-0.03em]"
          style={{ fontSize: "clamp(1.75rem, 6vw, 6rem)" }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-cyan-300 [background-size:200%_auto] animate-[heroGradient_5s_linear_infinite]">
            {hero.headlineAccent}
          </span>
        </motion.h2>
      </motion.div>

      <div className="relative z-10 mt-16 sm:mt-24 px-6 sm:px-10 max-w-[1600px] mx-auto pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="lg:col-span-7"
        >
          <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-white/70 max-w-2xl font-mono">{hero.intro}</p>
          <p className="mt-5 text-xs sm:text-sm text-slate-500 dark:text-white/40 font-mono">{hero.availability}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={hero.buttons.primary.href}
              className="px-6 py-3 rounded-md text-sm font-semibold transition-all bg-gradient-to-br from-indigo-500/30 to-cyan-400/15 border border-indigo-400/40 text-slate-900 dark:text-white hover:translate-y-[-2px] hover:border-indigo-400/70 hover:shadow-[0_8px_24px_rgba(99,102,241,0.25)] font-mono tracking-wider">
              {hero.buttons.primary.label}
            </a>
            <a href={hero.buttons.secondary.href}
              className="px-6 py-3 rounded-md text-sm font-semibold border border-black/15 dark:border-white/15 text-slate-700 dark:text-white/70 hover:border-black/30 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white transition-all font-mono tracking-wider">
              {hero.buttons.secondary.label}
            </a>
            <a href={RESUME_URL} download
              className="px-6 py-3 rounded-md text-sm font-semibold border border-black/15 dark:border-white/15 text-slate-700 dark:text-white/70 hover:border-black/30 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white transition-all font-mono tracking-wider">
              {hero.buttons.resume.label}
            </a>
          </div>

          <div className="mt-8 flex items-center gap-4 text-xs text-slate-500 dark:text-white/40 font-mono">
            <a className="hover:text-slate-900 dark:hover:text-white transition" href={GITHUB_URL} target="_blank" rel="noreferrer">{hero.footerLinks.githubLabel}</a>
            <span className="opacity-30">/</span>
            <a className="hover:text-slate-900 dark:hover:text-white transition" href={LINKEDIN_URL} target="_blank" rel="noreferrer">{hero.footerLinks.linkedinLabel}</a>
            <span className="opacity-30">/</span>
            <a className="hover:text-slate-900 dark:hover:text-white transition" href={hero.footerLinks.contactHref}>{hero.footerLinks.contactLabel}</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <span className="font-mono text-[9px] tracking-[0.2em] text-cyan-500 dark:text-cyan-400/80 uppercase">
                MODEL · A-1
              </span>
            </div>
            <div className="absolute top-4 right-4 z-10">
              <span className="font-mono text-[9px] tracking-[0.2em] text-slate-500 dark:text-white/30 uppercase">v1.0</span>
            </div>

            <div className="aspect-square relative bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 overflow-hidden">
              <img
                src={hero.photoUrl || siteContent.photoUrl || logoMark}
                alt={hero.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-3 h-3 border-l border-t border-cyan-400/40" />
                <div className="absolute top-4 right-4 w-3 h-3 border-r border-t border-cyan-400/40" />
                <div className="absolute bottom-4 left-4 w-3 h-3 border-l border-b border-cyan-400/40" />
                <div className="absolute bottom-4 right-4 w-3 h-3 border-r border-b border-cyan-400/40" />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{hero.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-white/40 mt-0.5 font-mono tracking-widest truncate">{hero.headlineAccent}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                {(hero.profileStats || []).slice(0, 3).map((s, i) => (
                  <div key={i} className="text-right">
                    <div className="text-[10px] font-bold text-cyan-600 dark:text-cyan-300 font-mono">{s.title}</div>
                    <div className="text-[8px] text-slate-500 dark:text-white/30 uppercase tracking-wider">{s.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-mono text-[9px] tracking-[0.3em] text-slate-500 dark:text-white/30 uppercase">Scroll to continue</span>
        <div className="w-px h-10 bg-gradient-to-b from-cyan-400/60 to-transparent animate-pulse" />
      </div>

      <div className="absolute -bottom-4 sm:-bottom-8 left-0 right-0 overflow-hidden pointer-events-none opacity-[0.04] z-0">
        <div className="whitespace-nowrap font-extrabold leading-none tracking-[-0.06em]"
          style={{ fontSize: "clamp(8rem, 22vw, 22rem)" }}>
          {hero.name.toUpperCase()} · {hero.name.toUpperCase()} · {hero.name.toUpperCase()}
        </div>
      </div>

      <div aria-hidden className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }} />

      <style>{`@keyframes heroGradient { to { background-position: -200% center; } }`}</style>
    </section>
  );
};

export default memo(Hero);
