import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["About", "Projects", "Services", "Contact"];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("about");

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const sections = navItems.map(item =>
    document.getElementById(item.toLowerCase())
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { threshold: 0.6 }
  );

  sections.forEach(section => {
    if (section) observer.observe(section);
  });

    return () => observer.disconnect();
    }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 backdrop-blur bg-black/40 border-b border-white/10 transition-all ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center px-8">
        {/* Left spacer */}
        <div className="flex-1" />

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm text-gray-300 relative">
            {navItems.map((item) => {
                const id = item.toLowerCase();
                return (
                <motion.a
                    key={item}
                    href={`#${id}`}
                    whileHover={{ y: -2 }}
                    className={`relative hover:text-white transition ${
                    active === id ? "text-white" : ""
                    }`}
                >
                    {item}

                    {active === id && (
                    <motion.span
                        layoutId="nav-indicator"
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
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="hover:text-white transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;