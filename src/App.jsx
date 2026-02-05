import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import HowIWork from "./components/sections/HowIWork";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/layout/Footer";
import { motion } from "framer-motion";
import ScrollProgress from "./components/common/ScrollProgress";

const App = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0b0f14] text-white min-h-screen"
    >
      <ScrollProgress />
      <Navbar />

      <Hero />
      <About />
      <HowIWork />

      {/* Leaving Projects section as-is for now (we'll build 3 real projects next) */}
      <Projects />

      <Contact />
      <Footer />
    </motion.div>
  );
};

export default App;
