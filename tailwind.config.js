const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
        serif: ["Helvetica", "Arial", "sans-serif"],
        mono: ["monospace"],
      },
      colors: {
        "pastel-peach": "rgb(252 208 186)",
        gray: "rgb(116 118 123)",
        camel: "rgb(229, 231, 235)",
        destructive: "rgb(255 112 78)",
      },
      lineHeight: {
        dense: "1.1",
      },
    },
  },
  plugins: [],
};
