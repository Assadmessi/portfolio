import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Services from "./components/sections/Services";
import HowIWork from "./components/sections/HowIWork";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/layout/Footer";
import ScrollProgress from "./components/common/ScrollProgress";
import Admin from "./pages/Admin";
import { startContentSync } from "./firebase/contentSync";
import { subscribeContent } from "./content";
import { useEffect, useState } from "react";

const App = () => {
  const [tick, setTick] = useState(0);

  // Start Firestore realtime sync once
  useEffect(() => {
    const stopSync = startContentSync();
    const unsub = subscribeContent(() => setTick((t) => t + 1));
    return () => {
      unsub();
      stopSync();
    };
  }, []);

  // Minimal routing without adding react-router
  if (typeof window !== "undefined" && window.location.pathname === "/admin") {
    return <Admin />;
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      {/* Soft global background tint (prevents harsh white in light mode) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Light mode tint */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_55%)] dark:hidden" />
        {/* Dark mode tint */}
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.12),transparent_55%)]" />
      </div>

      <ScrollProgress />
      <Navbar />

      <Hero />
      <About />
      <Services />
      <HowIWork />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;