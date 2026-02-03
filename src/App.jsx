import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Services from "./components/sections/Services";
import Contact from "./components/sections/Contact";
import Footer from "./components/layout/Footer";
import { motion } from "framer-motion";


const App = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0b0f14] text-white min-h-screen"
    >
      <Navbar />
      <Hero/>
      <About/>
      <Projects/>
      <Services/>
      <Contact/>
      <Footer/>
    </motion.div>
  );
};

export default App;