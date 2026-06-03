import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 70px rgba(18, 46, 89, 0.10)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      colors: {
        blush: {
          50: "#f4f8ff",
          100: "#e6effb",
          200: "#cddff4",
          500: "#4b7fb8",
          700: "#245a94",
          800: "#163e69"
        },
        cream: {
          50: "#fbfcff",
          100: "#f1f5fb"
        },
        sage: {
          50: "#f2f9f8",
          100: "#dcefee",
          700: "#3f7d7a"
        }
      }
    }
  },
  plugins: []
};

export default config;
