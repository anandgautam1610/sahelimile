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
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0D9488", // Primary Brand Teal
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        coral: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#F97316", // Accent Warm Coral
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        cream: {
          DEFAULT: "#FFFBEB", // Background Canvas
          50: "#fffdf5",
          100: "#FFFBEB",
          200: "#fef3c7",
          300: "#fde68a",
        },
        brand: {
          teal: "#0D9488",
          coral: "#F97316",
          cream: "#FFFBEB",
          dark: "#0F172A",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "'Plus Jakarta Sans'", "sans-serif"],
        sans: ["var(--font-sans)", "'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
