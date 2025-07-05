/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        main: "#333333",
        background: "#FAF8F5",
        accent: "#FF6B35",
        tertiary: "#005271",
        sectionbg: "#FFF2EB",
        darkbg: "#1C1C1C",
        darksection: "#2A2A2A",
        darktext: "#F2F2F2",
        darktertiary: "#66BBD2",
        darkborder: "#444",
        darkgray: "#333",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
} 