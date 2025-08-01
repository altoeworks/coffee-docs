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
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.7rem', { lineHeight: '1rem' }],
        'sm': ['0.8rem', { lineHeight: '1.25rem' }],
        'base': ['0.95rem', { lineHeight: '1.5rem' }],
        'lg': ['1.05rem', { lineHeight: '1.7rem' }],
        'xl': ['1.15rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.4rem', { lineHeight: '2rem' }],
        '3xl': ['1.75rem', { lineHeight: '2.25rem' }],
        '4xl': ['2rem', { lineHeight: '2.5rem' }],
      },
    },
  },
  plugins: [],
} 