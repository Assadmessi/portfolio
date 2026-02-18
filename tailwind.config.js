export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        sv: "0 12px 35px rgba(2, 6, 23, 0.08)",
        "sv-hover": "0 18px 55px rgba(2, 6, 23, 0.12)",
        "sv-dark": "0 18px 60px rgba(0, 0, 0, 0.45)",
        "sv-dark-hover": "0 26px 90px rgba(0, 0, 0, 0.55)",
      },
    },
  },
  plugins: [],
}
