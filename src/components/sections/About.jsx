import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

const About = () => {
  return (
    <MotionSection
      id="about"
      variants={staggerContainer}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      <motion.div variants={fadeUp} className="max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold">About</h2>

        <p className="mt-6 text-gray-400 leading-relaxed">
          I’m a junior front-end developer with hands-on experience building modern
          web interfaces using React, Tailwind CSS, and Framer Motion.
        </p>

        <p className="mt-4 text-gray-400 leading-relaxed">
          I focus on creating clean, responsive layouts with smooth animations and
          reusable components. I enjoy turning designs into functional, accessible
          user interfaces while keeping code readable and maintainable.
        </p>

        <p className="mt-4 text-gray-400 leading-relaxed">
          I’m continuously improving my skills by building real projects, studying
          frontend best practices, and learning how production-ready applications
          are structured.
        </p>

        <p className="mt-4 text-gray-400 leading-relaxed">
          Currently, I’m looking for a junior front-end position or internship
          where I can contribute, learn from experienced developers, and grow into
          a professional frontend engineer.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {["React", "Tailwind CSS", "Framer Motion", "Vite", "JavaScript"].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-gray-200"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </motion.div>
    </MotionSection>
  );
};

export default About;
