import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import { motion } from "framer-motion";

const services = [
  { title: "Web Development", desc: "Fast, responsive modern websites." },
  { title: "UI / UX Design", desc: "Clean, intuitive interfaces." },
  { title: "Performance", desc: "Optimized for speed and SEO." },
];

const Services = () => {
  return (
    <MotionSection
      id="services"
      variants={staggerContainer}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      <motion.h2
        variants={fadeUp}
        className="text-3xl sm:text-4xl font-bold mb-12 text-center"
      >
        Services
      </motion.h2>

      <motion.div
        variants={fadeUp}
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
      >
        {services.map((service, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              {service.title}
            </h3>
            <p className="text-gray-400 text-sm">
              {service.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </MotionSection>
  );
};

export default Services;