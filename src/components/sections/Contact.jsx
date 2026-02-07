import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

const Contact = () => {
  const EMAIL = "ayehtetheinmessi@gmail.com";
  const RESUME_URL = "/resume.pdf";
  const GITHUB_URL = "https://github.com/Assadmessi";
  const LINKEDIN_URL = "https://www.linkedin.com/in/aye-htet-h-511087101/";

  return (
    <MotionSection
      id="contact"
      variants={staggerContainer}
      className="py-24 px-6 max-w-4xl mx-auto text-center scroll-mt-24"
    >
      <motion.h2
        variants={fadeUp}
        className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100"
      >
        Let’s Work Together
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="mt-6 text-slate-700 dark:text-slate-400 leading-relaxed"
      >
        I’m available for freelance work (websites, landing pages, React UI builds) and also open to junior frontend roles, internships, and collaborations.
        <br className="hidden sm:block" />
        If you’re looking for a motivated junior developer who cares about clean UI
        and code quality, feel free to reach out.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent("Freelance inquiry — Website / UI build")}`}
          className="px-6 py-3 rounded-xl font-medium transition
                     bg-indigo-600/90 text-white hover:bg-indigo-600
                     ring-1 ring-indigo-600/20
                     dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:ring-indigo-400/20"
        >
          Email Me
        </a>

        <a
          href={RESUME_URL}
          className="px-6 py-3 rounded-xl transition
                     border border-black/10 text-slate-800 hover:bg-black/5
                     dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
        >
          Download Resume
        </a>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-10 max-w-2xl mx-auto text-left rounded-2xl
                   border border-black/5 dark:border-white/10
                   bg-white/70 dark:bg-white/5 p-6 backdrop-blur"
      >
        <p className="font-medium text-slate-900 dark:text-slate-100">To get a fast quote, include:</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-400">
          <li className="flex gap-2">
            <span className="mt-1 text-indigo-500/80 dark:text-indigo-300/80">•</span>
            <span>Project type (landing page / business site / React UI / fixes)</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 text-indigo-500/80 dark:text-indigo-300/80">•</span>
            <span>Deadline + any reference links (Figma is perfect)</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 text-indigo-500/80 dark:text-indigo-300/80">•</span>
            <span>Pages/features + budget range (optional)</span>
          </li>
        </ul>
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
      </motion.div>
    </MotionSection>
  );
};

export default Contact;
