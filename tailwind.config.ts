import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "var(--bg-cream)",
        rose: "var(--rose-soft)",
        gold: "var(--gold-soft)",
        apricot: "var(--apricot-soft)",
        ink: "var(--ink-main)",
        moss: "var(--moss-soft)"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Noto Serif SC", "serif"],
        sans: ["var(--font-sans)", "Noto Sans SC", "sans-serif"]
      },
      boxShadow: {
        soft: "0 16px 40px rgba(122, 96, 78, 0.12)",
        float: "0 28px 48px rgba(122, 96, 78, 0.2)"
      },
      borderRadius: {
        xl2: "1.5rem"
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out both"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;

