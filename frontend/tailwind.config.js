// frontend/tailwind.config.js
import defaultTheme from "tailwindcss/defaultTheme";
import flowbite from "flowbite/plugin";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#4F46E5", light: "#6366F1", dark: "#3730A3" },
        secondary: { DEFAULT: "#10B981", light: "#34D399", dark: "#059669" },
        accent: { DEFAULT: "#F59E0B" },
        neutral: { light: "#F9FAFB", DEFAULT: "#6B7280", dark: "#111827" },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [
    flowbite,   // ✅ Flowbite plugin goes here
  ],
};
