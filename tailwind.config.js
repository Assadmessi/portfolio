export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        "sv": "0 1px 0 rgba(15, 23, 42, 0.06), 0 12px 32px rgba(15, 23, 42, 0.08)",
        "sv-dark": "0 1px 0 rgba(255, 255, 255, 0.06), 0 16px 40px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
}