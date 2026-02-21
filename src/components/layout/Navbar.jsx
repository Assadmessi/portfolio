import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Toolbox", id: "toolbox" },
  { label: "How I Work", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const navRef = useRef(null);
  const [navH, setNavH] = useState(72);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keep mobile menu aligned to actual navbar height
  useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current;

    const update = () => {
      const h = Math.round(el.getBoundingClientRect().height || 72);
      setNavH(h);
    };

    update();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }

    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      if (ro) ro.disconnect();
    };
  }, [scrolled]);

  // Close mobile menu when entering desktop breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    onChange();
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Deep linking on load
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const el = document.getElementById(hash);
    if (!el) return;

    setActive(hash);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Scroll spy
  useEffect(() => {
    const ids = navItems.map((i) => i.id);
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0) return;

    let rafId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length === 0) return;

          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActive(visible[0].target.id);
        });
      },
      {
        rootMargin: "-110px 0px -55% 0px",
        threshold: [0.12, 0.2, 0.3, 0.45, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  const goTo = (id) => {
    setActive(id);
    setOpen(false);
    window.history.pushState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={[
        "fixed top-0 w-full z-50 md:backdrop-blur transition-all",
        "bg-white/60 dark:bg-black/30",
        "border-b border-black/5 dark:border-white/10",
        scrolled ? "py-2 shadow-sm shadow-black/5 dark:shadow-none" : "py-4",
      ].join(" ")}
    >
      <div className="relative">
        <div className="max-w-7xl mx-auto flex items-center px-4 sm:px-8">
          {/* Logo / Name */}
          <button
            onClick={() => goTo("home")}
            className="flex items-center gap-3 select-none shrink-0"
            aria-label="Go to home"
            type="button"
          >
            <span className="h-9 w-9 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-200">
              A
            </span>
            <span className="hidden sm:block text-sm text-slate-900 dark:text-slate-200">
              Asaad
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex ml-auto items-center space-x-8 text-sm text-slate-700 dark:text-slate-300 relative">
            {navItems.map((item) => {
              const isActive = active === item.id;

              return (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? "page" : undefined}
                  whileHover={{ y: -2 }}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(item.id);
                  }}
                  className={[
                    "relative transition",
                    "hover:text-slate-900 dark:hover:text-white",
                    isActive ? "text-slate-900 dark:text-white" : "",
                  ].join(" ")}
                >
                  {item.label}

                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-indigo-500 rounded"
                    />
                  )}
                </motion.a>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Toggle theme"
              className={[
                "ml-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition",
                "bg-black/5 hover:bg-black/10 border border-black/10 text-slate-800",
                "dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-200",
              ].join(" ")}
            >
              <span>{theme === "dark" ? "Dark" : "Light"}</span>
              <span className="opacity-70">{theme === "dark" ? "🌙" : "☀️"}</span>
            </button>
          </div>

          {/* ✅ Mobile right controls (prevents overflow on tiny screens) */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            {/* Theme Toggle (mobile) */}
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Toggle theme"
              className={[
                "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-medium transition",
                "bg-black/5 hover:bg-black/10 border border-black/10 text-slate-800",
                "dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-200",
              ].join(" ")}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative w-10 h-10 grid place-items-center rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              type="button"
            >
              <div className="relative w-6 h-6">
                <motion.span
                  animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="absolute top-1 w-6 h-[2px] bg-slate-900 dark:bg-white"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  className="absolute top-3 w-6 h-[2px] bg-slate-900 dark:bg-white"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="absolute top-5 w-6 h-[2px] bg-slate-900 dark:bg-white"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 z-40 bg-black/30"
                style={{ top: navH }}
              />

              {/* Panel */}
              <motion.div
                id="mobile-nav"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={[
                  "md:hidden",
                  "fixed left-0 right-0 z-50",
                  "border-t border-black/5 dark:border-white/10",
                  "bg-[#F6F7FB] dark:bg-[#0B0F19]",
                  "overflow-y-auto",
                ].join(" ")}
                style={{
                  top: navH,
                  maxHeight: `calc(100vh - ${navH}px)`, // ✅ real responsive height
                }}
              >
                <div className="px-4 sm:px-8 py-6 text-slate-700 dark:text-slate-300">
                  {/* ✅ 1 col on xs, 2 cols from sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {navItems.map((item) => {
                      const isActive = active === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => goTo(item.id)}
                          className={[
                            "text-left rounded-2xl px-4 py-3 border transition",
                            "border-black/10 dark:border-white/10",
                            "bg-white/60 dark:bg-white/5",
                            "hover:bg-white/80 dark:hover:bg-white/10",
                            isActive
                              ? "text-slate-900 dark:text-white border-indigo-500/40"
                              : "text-slate-700 dark:text-slate-300",
                          ].join(" ")}
                        >
                          <div className="text-sm font-semibold">{item.label}</div>
                          <div className="text-[11px] opacity-70">#{item.id}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 px-4 py-3">
                    <div className="text-xs font-medium">Theme</div>
                    <button
                      onClick={toggleTheme}
                      type="button"
                      aria-label="Toggle theme"
                      className={[
                        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition",
                        "bg-black/5 hover:bg-black/10 border border-black/10 text-slate-800",
                        "dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-200",
                      ].join(" ")}
                    >
                      <span>{theme === "dark" ? "Dark" : "Light"}</span>
                      <span className="opacity-70">{theme === "dark" ? "🌙" : "☀️"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;