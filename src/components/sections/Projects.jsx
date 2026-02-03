import { useState } from "react";
import ProjectModal from "../common/ProjectModal";
import { motion } from "framer-motion";
import { MotionSection } from "../../animations/MotionWrappers";
import { fadeUp, staggerContainer } from "../../animations/variants";
import project1 from "../../assets/images/project1.png";
import project2 from "../../assets/images/project2.png";
import project3 from "../../assets/images/project3.png";


const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const projects = [
  {
    title: "Organization Management App",
    desc: "Reduced manual reporting and improved coordination with real-time dashboards.",
    image: project1,
  },
  {
    title: "Portfolio System",
    desc: "High-conversion UI with smooth animations and responsive layout.",
    image: project2,
  },
  {
    title: "Cloud Hosting Platform",
    desc: "Scalable backend architecture designed for growing user bases.",
    image: project3,
  },
];
  return (
    <>
      <MotionSection
        id="projects"
        variants={staggerContainer}
        className="py-24 bg-[#0f1621]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold mb-12"
          >
            Client-Focused Projects
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="grid gap-6 md:grid-cols-3"
          >
            {projects.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                onClick={() => setActiveProject(p)}
                className="cursor-pointer p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />

                <h3 className="text-lg font-semibold">
                  {p.title}
                </h3>

                <p className="text-gray-400 text-sm mt-3">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </MotionSection>

      {/* MODAL */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
};

export default Projects;