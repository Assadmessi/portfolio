import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

const Contact = () => {
  // TODO: Replace these with your real links
  const EMAIL = "ayehtetheinmessi@gmail.com";
  const RESUME_URL = "/resume.pdf"; // put resume.pdf in /public
  const GITHUB_URL = "https://github.com/Assadmessi";
  const LINKEDIN_URL = "https://www.linkedin.com/in/aye-htet-h-511087101/";

  return (
    <MotionSection
      id="contact"
      variants={staggerContainer}
      className="py-24 px-6 max-w-4xl mx-auto text-center"
    >
      <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold">
        Let’s Work Together
      </motion.h2>

      <motion.p variants={fadeUp} className="mt-6 text-gray-400 leading-relaxed">
        I’m available for freelance work (websites, landing pages, React UI builds) and also open to junior frontend roles, internships, and collaborations.
        <br className="hidden sm:block" />
        If you’re looking for a motivated junior developer who cares about clean UI
        and code quality, feel free to reach out.
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent("Freelance inquiry — Website / UI build")}`}
          className="px-6 py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-400 transition"
        >
          Email Me
        </a>

        <a
          href={RESUME_URL}
          className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition"
        >
          Download Resume
        </a>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-10 max-w-2xl mx-auto text-left rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="font-medium">To get a fast quote, include:</p>
        <ul className="mt-3 space-y-2 text-sm text-gray-400">
          <li className="flex gap-2"><span className="mt-1 text-indigo-400">•</span><span>Project type (landing page / business site / React UI / fixes)</span></li>
          <li className="flex gap-2"><span className="mt-1 text-indigo-400">•</span><span>Deadline + any reference links (Figma is perfect)</span></li>
          <li className="flex gap-2"><span className="mt-1 text-indigo-400">•</span><span>Pages/features + budget range (optional)</span></li>
        </ul>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400"
      >
        <a className="hover:text-white transition" href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <span className="text-white/20">•</span>
        <a className="hover:text-white transition" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </motion.div>

      
    </MotionSection>
  );
};

export default Contact;
