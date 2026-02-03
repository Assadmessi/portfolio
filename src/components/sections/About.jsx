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
      <motion.h2
        variants={fadeUp}
        className="text-3xl sm:text-4xl font-bold mb-6"
      >
        About Me
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="text-gray-400 leading-relaxed max-w-3xl"
      >
        I’m a freelance developer focused on building high-quality,
        scalable, and user-friendly web applications using modern
        technologies.
      </motion.p>
    </MotionSection>
  );
};

export default About;