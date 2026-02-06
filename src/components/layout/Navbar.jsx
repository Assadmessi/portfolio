import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "How I Work", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Deep linking on load (if URL has #section)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const el = document.getElementById(hash);
    if (!el) return;

    setActive(hash);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Scroll spy (IntersectionObserver) - fixed navbar friendly + stable
  useEffect(() => {
    const ids = navItems.map((i) => i.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

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

  // Close mobile menu when user scrolls
  useEffect(() => {
    if (!open) return;

    const closeOnScroll = () => setOpen(false);
    window.addEventListener("scroll", closeOnScroll, { passive: true });

    return () => window.removeEventListener("scroll", closeOnScroll);
  }, [open]);

  const goTo = (id) => {
    setActive(id);
    setOpen(false);
    window.history.pushState(null, "", `#${id}`);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 backdrop-blur bg-black/40 border-b border-white/10 transition-all ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center px-6 sm:px-8">
        {/* Logo / Name */}
        <button
          onClick={() => goTo("home")}
          className="flex items-center gap-3 select-none"
          aria-label="Go to home"
        >
          <span className="h-9 w-9 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-indigo-200">
            A
          </span>
          <span className="hidden sm:block text-sm text-gray-200">Asaad</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex ml-auto space-x-8 text-sm text-gray-300 relative">
          {navItems.map((item) => {
            const isActive = active === item.id;

            return (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item.id);
                }}
                className={`relative hover:text-white transition ${
                  isActive ? "text-white" : ""
                }`}
              >
                {item.label}

                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-indigo-400 rounded"
                  />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden ml-auto relative w-6 h-6"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="absolute top-1 w-6 h-[2px] bg-white"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className="absolute top-3 w-6 h-[2px] bg-white"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="absolute top-5 w-6 h-[2px] bg-white"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur"
          >
            <div className="flex flex-col items-end px-8 py-6 space-y-5 text-gray-300">
              {navItems.map((item) => {
                const isActive = active === item.id;

                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(item.id);
                    }}
                    className={`hover:text-white transition ${
                      isActive ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
