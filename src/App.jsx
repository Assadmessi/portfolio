import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Services from "./components/sections/Services";
import HowIWork from "./components/sections/HowIWork";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/layout/Footer";
import ScrollProgress from "./components/common/ScrollProgress";

import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { startContentSync } from "./firebase/contentSync";
import { subscribeContent } from "./content";

const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const HomeLayout = () => {
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

const LoadingScreen = () => (
  <div className="min-h-screen grid place-items-center">Loading...</div>
);

// Option A routing:
// - / -> Home
// - /admin -> Admin
// - /admin/* -> 404 (blocked, like your old behavior)
// - * -> 404
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
    const p = location.pathname || "";
    return p === "/admin" || p === "/admin/";
  }, [location.pathname]);

  // Swap title + favicon for admin routes (keeps public site branding unchanged)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalTitle = "Asaad | Front-End Developer";

    const setFavicon = (variant) => {
      // Safari can be aggressive about caching favicons and sometimes ignores just changing `href`.
      // Re-creating the <link> nodes forces Safari to pick up the correct icon per route.
      const cacheBust = `?v=${Date.now()}`;

      const isAdminVariant = variant === "admin";
      const png32 = isAdminVariant ? "/favicons/admin/favicon-32.png" : "/favicons/public/favicon-32.png";
      const png16 = isAdminVariant ? "/favicons/admin/favicon-16.png" : "/favicons/public/favicon-16.png";
      const ico = isAdminVariant ? "/favicons/admin/favicon.ico" : "/favicons/public/favicon.ico";
      const appleTouch = isAdminVariant ? "/favicons/admin/apple-touch-icon.png" : "/favicons/public/apple-touch-icon.png";

      // Remove any previously injected favicon links
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

      // 1) A generic icon (no sizes) helps Safari choose correctly.
      addLink({ id: "app-favicon-main", rel: "icon", href: ico, type: "image/x-icon" });

      // 2) Explicit sizes for browsers that use them.
      addLink({ id: "app-favicon", rel: "icon", href: png32, type: "image/png", sizes: "32x32" });
      addLink({ id: "app-favicon-16", rel: "icon", href: png16, type: "image/png", sizes: "16x16" });

      // 3) Fallbacks
      addLink({ id: "app-favicon-ico", rel: "icon", href: ico, type: "image/x-icon" });
      addLink({ id: "app-favicon-shortcut", rel: "shortcut icon", href: ico, type: "image/x-icon" });

      // 4) iOS / Safari touch icon
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
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/admin" element={<Admin />} />

        {/* Block deep admin paths like /admin/anything */}
        <Route path="/admin/*" element={<NotFound />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
