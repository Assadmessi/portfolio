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
      className="min-h-[calc(100vh-4rem)] pt-24 flex items-center justify-center text-center px-6"
    >
      <div className="max-w-3xl">
        <motion.p
          variants={fadeUp}
          className="text-sm tracking-wider text-gray-400 uppercase"
        >
          Junior Front-End Developer
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
        >
          Asaad
          <br />
          <span className="text-indigo-400">Front-End Developer</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-gray-400 text-base sm:text-lg leading-relaxed"
        >
          I build responsive, animated, and user-focused web interfaces using{" "}
          <span className="text-gray-200">React</span>,{" "}
          <span className="text-gray-200">Tailwind CSS</span>, and modern frontend
          tools.
        </motion.p>

        <motion.p variants={fadeUp} className="mt-3 text-gray-400">
  Currently open to <span className="text-gray-200">freelance projects</span> (landing pages, portfolios, UI builds) and also seeking a{" "}
  <span className="text-gray-200">junior frontend role</span> or{" "}
  <span className="text-gray-200">internship</span> to grow under experienced developers.
</motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href="#services"
            className="px-6 py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-400 transition"
          >
            Hire Me (Freelance)
          </a>

          <a
            href="#projects"
            className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition"
          >
            View Projects
          </a>

          <a
            href={RESUME_URL}
            className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition"
          >
            Download Resume
          </a>
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
          <span className="text-white/20">•</span>
          <a className="hover:text-white transition" href="#contact">
            Contact
          </a>
        </motion.div>
      </div>
    </MotionSection>
  );
};

export default Hero;
