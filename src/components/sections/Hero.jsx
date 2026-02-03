import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <MotionSection
    id="home"
      variants={staggerContainer}
      className="min-h-[calc(100vh-4rem)] pt-20 flex items-center justify-center text-center px-6"
    >
      <motion.div
        variants={fadeUp}
        className="max-w-3xl"
      >
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
        >
          I help businesses{" "}
          <span className="text-indigo-400">make money</span>
          <br />
          with high-quality software
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-gray-400 text-base sm:text-lg"
        >
          Freelance full-stack developer helping startups and businesses turn ideas
          into reliable, revenue-ready products.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-6 py-3 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-400 transition"
          >
            View Work
          </a>

          <a
            href="#contact"
            className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition"
          >
            Start a Project
          </a>
        </motion.div>
      </motion.div>
    </MotionSection>
  );
};

export default Hero;