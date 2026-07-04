import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.1)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "var(--radius)"
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        blush: {
          50: "hsl(var(--secondary))",
          100: "hsl(var(--border))",
          200: "hsl(var(--border))",
          500: "hsl(var(--muted-foreground))",
          700: "hsl(var(--foreground))",
          800: "hsl(var(--primary))",
          900: "hsl(var(--primary))"
        },
        cream: {
          50: "hsl(var(--secondary))",
          100: "hsl(var(--muted))"
        },
        sage: {
          50: "hsl(var(--secondary))",
          100: "hsl(var(--border))",
          600: "hsl(142 36% 34%)",
          700: "hsl(142 36% 34%)",
          800: "hsl(142 36% 24%)"
        }
      }
    }
  },
  plugins: []
};

export default config;
