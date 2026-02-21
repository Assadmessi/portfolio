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
      className="min-h-[calc(100vh-4rem)] pt-24 flex items-center scroll-mt-24"
    >
      <div className="nb-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div variants={fadeUp} className="nb-pill w-fit">
              {hero.badge}
            </motion.div>

            <motion.h1 variants={fadeUp} className="nb-title mt-5">
              {hero.name}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300">
                {hero.headlineAccent}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="nb-subtitle max-w-2xl">
              {hero.intro}
            </motion.p>
            <motion.p variants={fadeUp} className="mt-3 nb-muted">
              {hero.availability}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href={hero.buttons.primary.href} className="nb-btn-primary">
                {hero.buttons.primary.label}
              </a>
              <a href={hero.buttons.secondary.href} className="nb-btn">
                {hero.buttons.secondary.label}
              </a>
              <a href={RESUME_URL} download className="nb-btn">
                {hero.buttons.resume.label}
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4 text-sm nb-muted">
              <a className="hover:text-white transition" href={GITHUB_URL} target="_blank" rel="noreferrer">
                {hero.footerLinks.githubLabel}
              </a>
              <span className="text-black/30 dark:text-white/20">•</span>
              <a className="hover:text-white transition" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                {hero.footerLinks.linkedinLabel}
              </a>
              <span className="text-black/30 dark:text-white/20">•</span>
              <a className="hover:text-white transition" href={hero.footerLinks.contactHref}>
                {hero.footerLinks.contactLabel}
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div variants={fadeUp} className="nb-card nb-ring p-8 md:p-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-br from-cyan-300/60 via-indigo-400/30 to-transparent">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur">
                    <img
                      src={hero.photoUrl || siteContent.photoUrl || logoMark}
                      alt={`${hero.name} profile`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold">{hero.name}</div>
                  <div className="text-xs nb-muted">{hero.headlineAccent}</div>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-lg font-semibold">UI</div>
                  <div className="text-xs nb-muted mt-1">Systems</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-lg font-semibold">Motion</div>
                  <div className="text-xs nb-muted mt-1">Details</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-lg font-semibold">Build</div>
                  <div className="text-xs nb-muted mt-1">Ship</div>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm nb-muted">
                Fast iteration, clean components, and scalable content updates.
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
};

export default memo(Hero);
