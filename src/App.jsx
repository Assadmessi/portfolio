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
import NotFound from "./pages/NotFound";
import Seo from "./seo/Seo";

import { startContentSync } from "./firebase/contentSync";
import { subscribeContent } from "./content";
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

const HomeLayout = () => {
  // If you want: build absolute URL for OG tags when deployed
  const absoluteUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100">
      <Seo
        title="Asaad | Front-End Developer"
        description="Asaad – Front-End Developer building modern, high-performance web applications."
        url={absoluteUrl}
      />

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

// Blocks deep admin routes like /admin/anything (your exact current behavior)
const AdminGate = () => {
  const { pathname } = useLocation();
  const isExactAdmin = pathname === "/admin" || pathname === "/admin/";
  return isExactAdmin ? <Admin /> : <NotFound />;
};

const App = () => {
  const [tick, setTick] = useState(0);
  const location = useLocation();

  // Start Firestore realtime sync once
  useEffect(() => {
    const stopSync = startContentSync();
    const unsub = subscribeContent(() => setTick((t) => t + 1));
    return () => {
      unsub();
      stopSync();
    };
  }, []);

  const isAdminRoute = useMemo(() => {
    const path = location.pathname || "";
    return path.startsWith("/admin");
  }, [location.pathname]);

  // Swap title + favicon for admin routes (keeps public site branding unchanged)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalTitle = "Asaad | Front-End Developer";

    const setFavicon = (variant) => {
      const cacheBust = `?v=${Date.now()}`;

      const isAdminVariant = variant === "admin";
      const png32 = isAdminVariant
        ? "/favicons/admin/favicon-32.png"
        : "/favicons/public/favicon-32.png";
      const png16 = isAdminVariant
        ? "/favicons/admin/favicon-16.png"
        : "/favicons/public/favicon-16.png";
      const ico = isAdminVariant
        ? "/favicons/admin/favicon.ico"
        : "/favicons/public/favicon.ico";
      const appleTouch = isAdminVariant
        ? "/favicons/admin/apple-touch-icon.png"
        : "/favicons/public/apple-touch-icon.png";

      const ids = [
        "app-favicon-main",
        "app-favicon",
        "app-favicon-16",
        "app-favicon-ico",
        "app-favicon-shortcut",
        "app-apple-touch",
      ];

      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });

      const addLink = ({ id, rel, href, type, sizes }) => {
        const el = document.createElement("link");
        el.id = id;
        el.rel = rel;
        if (type) el.type = type;
        if (sizes) el.sizes = sizes;
        el.href = href + cacheBust;
        document.head.appendChild(el);
        return el;
      };

      addLink({ id: "app-favicon-main", rel: "icon", href: ico, type: "image/x-icon" });
      addLink({ id: "app-favicon", rel: "icon", href: png32, type: "image/png", sizes: "32x32" });
      addLink({ id: "app-favicon-16", rel: "icon", href: png16, type: "image/png", sizes: "16x16" });
      addLink({ id: "app-favicon-ico", rel: "icon", href: ico, type: "image/x-icon" });
      addLink({ id: "app-favicon-shortcut", rel: "shortcut icon", href: ico, type: "image/x-icon" });
      addLink({ id: "app-apple-touch", rel: "apple-touch-icon", href: appleTouch });
    };

    if (isAdminRoute) {
      document.title = "Asaad Portfolio Admin";
      setFavicon("admin");
    } else {
      document.title = originalTitle;
      setFavicon("public");
    }
  }, [isAdminRoute, tick]);

  return (
    <Routes>
      <Route path="/" element={<HomeLayout />} />
      <Route path="/admin" element={<AdminGate />} />
      <Route path="/admin/" element={<AdminGate />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;