import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

const getSystemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";

const disableTransitionsTemporarily = () => {
  const style = document.createElement("style");
  style.setAttribute("data-theme-transition-fix", "true");
  style.innerHTML = `*{transition:none!important}`;
  document.head.appendChild(style);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.querySelector('style[data-theme-transition-fix="true"]');
      if (el) el.remove();
    });
  });
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || getSystemTheme();
  });

  // ✅ Runs before paint: prevents delayed repaint in dark mode
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => {
        // ✅ Prevents the theme switch from animating slowly
        disableTransitionsTemporarily();
        setTheme((t) => (t === "dark" ? "light" : "dark"));
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};