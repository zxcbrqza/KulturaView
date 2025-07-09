/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        avocado: {
          50: "#f7f8f3",
          100: "#eef1e6",
          200: "#dde3ce",
          300: "#c6d0ab",
          400: "#aab887",
          500: "#8fa168",
          600: "#568203",
          700: "#5a6b47",
          800: "#49563a",
          900: "#3e4932",
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}
