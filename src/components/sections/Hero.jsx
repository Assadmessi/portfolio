import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

const Hero = () => {
  const RESUME_URL = "/resume.pdf";
  const GITHUB_URL = "https://github.com/Assadmessi";
  const LINKEDIN_URL = "https://www.linkedin.com/in/aye-htet-h-511087101/";

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
          Junior Front-End Developer
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-slate-100"
        >
          Asaad
          <br />
          <span className="text-indigo-600/90 dark:text-indigo-400">
            Front-End Developer
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-slate-700 dark:text-slate-400 text-base sm:text-lg leading-relaxed"
        >
          I build responsive, animated, and user-focused web interfaces using{" "}
          <span className="text-slate-900 dark:text-slate-200">React</span>,{" "}
          <span className="text-slate-900 dark:text-slate-200">Tailwind CSS</span>, and modern frontend
          tools.
        </motion.p>

        <motion.p variants={fadeUp} className="mt-3 text-slate-700 dark:text-slate-400">
          Currently open to{" "}
          <span className="text-slate-900 dark:text-slate-200 font-medium">freelance projects</span>{" "}
          (landing pages, portfolios, UI builds) and also seeking a{" "}
          <span className="text-slate-900 dark:text-slate-200 font-medium">junior frontend role</span>{" "}
          or{" "}
          <span className="text-slate-900 dark:text-slate-200 font-medium">internship</span> to grow under experienced developers.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href="#services"
            className="px-6 py-3 rounded-xl font-medium transition bg-indigo-600/90 text-white hover:bg-indigo-600 ring-1 ring-indigo-600/20 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:ring-indigo-400/20"
          >
            Hire Me (Freelance)
          </a>

          <a
            href="#projects"
            className="px-6 py-3 rounded-xl transition border border-black/10 text-slate-800 hover:bg-black/5 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
          >
            View Projects
          </a>

          <a
            href={RESUME_URL}
            className="px-6 py-3 rounded-xl transition border border-black/10 text-slate-800 hover:bg-black/5 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Download Resume
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400"
        >
          <a className="hover:text-slate-900 dark:hover:text-white transition" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span className="text-black/30 dark:text-white/20">•</span>
          <a className="hover:text-slate-900 dark:hover:text-white transition" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <span className="text-black/30 dark:text-white/20">•</span>
          <a className="hover:text-slate-900 dark:hover:text-white transition" href="#contact">
            Contact
          </a>
        </motion.div>
      </div>
    </MotionSection>
  );
};

export default Hero;
