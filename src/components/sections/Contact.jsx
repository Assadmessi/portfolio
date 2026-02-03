import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <MotionSection
    id="contact"
      variants={staggerContainer}
      className="py-24 px-6 max-w-4xl mx-auto text-center"
    >
      <motion.h2
        variants={fadeUp}
        className="text-3xl sm:text-4xl font-bold mb-6"
      >
        Let’s Work Together
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="text-gray-400 mb-8"
      >
        Have a project in mind? Let’s build something great.
      </motion.p>

      <motion.a
        variants={fadeUp}
        href="#"
        className="inline-block px-8 py-4 bg-indigo-500 rounded-xl font-medium hover:bg-indigo-400 transition"
      >
        Contact Me
      </motion.a>
    </MotionSection>
  );
};

export default Contact;