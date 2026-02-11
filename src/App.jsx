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

  // Swap title + favicon for admin routes (keeps public site branding unchanged)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isAdmin = window.location.pathname.startsWith("/admin");
    const originalTitle = document.title;

    const setFavicon = (variant) => {
      const cacheBust = `?v=${Date.now()}`;

      const isAdminVariant = variant === "admin";
      const png32 = isAdminVariant ? "/admin-favicon-32.png" : "/favicon-32.png";
      const png16 = isAdminVariant ? "/admin-favicon-16.png" : "/favicon-16.png";
      const ico = isAdminVariant ? "/admin-favicon.ico" : "/favicon.ico";
      const appleTouch = isAdminVariant ? "/admin-apple-touch-icon.png" : "/apple-touch-icon.png";

      const ensureLink = (id, rel, type, sizes) => {
        let el = document.getElementById(id);
        if (!el) {
          el = document.createElement("link");
          el.id = id;
          el.rel = rel;
          if (type) el.type = type;
          if (sizes) el.sizes = sizes;
          document.head.appendChild(el);
        }
        el.href = (id === "app-favicon-shortcut" || id === "app-favicon-ico") ? ico + cacheBust : el.href;
        return el;
      };

      // Safari updates more reliably when we provide .ico + apple-touch-icon alongside PNG sizes.
      const icon32 = ensureLink("app-favicon", "icon", "image/png", "32x32");
      icon32.href = png32 + cacheBust;

      const icon16 = ensureLink("app-favicon-16", "icon", "image/png", "16x16");
      icon16.href = png16 + cacheBust;

      const iconIco = ensureLink("app-favicon-ico", "icon", "image/x-icon");
      iconIco.href = ico + cacheBust;

      const shortcut = ensureLink("app-favicon-shortcut", "shortcut icon", "image/x-icon");
      shortcut.href = ico + cacheBust;

      const touch = ensureLink("app-apple-touch", "apple-touch-icon");
      touch.href = appleTouch + cacheBust;
    };

    if (isAdmin) {
      document.title = "Asaad Portfolio Admin";
      setFavicon("admin");
    } else {
      document.title = originalTitle;
      setFavicon("public");
    }
  }, [tick]);

  // Minimal routing without adding react-router
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
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