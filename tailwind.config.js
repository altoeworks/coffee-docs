/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        main: "#333333",
        background: "#FAF8F5",
        accent: "#FF6B35",
        tertiary: "#005271",
        sectionbg: "#FFF2EB",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
} 