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
        cream: {
          50: "#fdfbf7",
          100: "#f7f3e9",
          200: "#ede6d5",
        },
        orchard: {
          DEFAULT: "#1e3d2f",
          light: "#2d5a45",
          dark: "#142920",
        },
        must: {
          DEFAULT: "#c17f3a",
          light: "#d9a066",
        },
        russet: "#8b3a2f",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
