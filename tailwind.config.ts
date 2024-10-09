import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        orange: {
          DEFAULT: "#d93900", // Ana renk
          50: "#ffeddc",
          100: "#ffd5b7",
          200: "#ff9c77",
          300: "#ff7747",
          400: "#ff5821",
          500: "#d93900",
          600: "#b12e00",
          700: "#8a2300",
          800: "#641900",
          900: "#3e0f00",
        },
        blue: {
          DEFAULT: "#0a449b", // Ana renk
          50: "#e0ecff",
          100: "#b8d0ff",
          200: "#82aaff",
          300: "#4e84ff",
          400: "#1e5fff",
          500: "#0a449b",
          600: "#073682",
          700: "#052a69",
          800: "#031d51",
          900: "#021138",
        },
        gray: {
          DEFAULT: "#e5ebee", // Ana renk
          50: "#f9fafb",
          100: "#f1f5f8",
          200: "#e5ebee",
          300: "#d2d9dd",
          400: "#b9c2c7",
          500: "#9ea7ad",
          600: "#7d878e",
          700: "#61686f",
          800: "#464b51",
          900: "#2d3134",
        },
      },
    },
  },
  plugins: [],
};

export default config;
