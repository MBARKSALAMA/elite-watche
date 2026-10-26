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
        luxury: {
          black: "#0A0A0B",
          carbon: "#121214",
          charcoal: "#1A1A1E",
          card: "#161619",
          border: "#2A2A30",
          cream: {
            50: "#FDFCFB",
            100: "#FAF8F5",
            200: "#F3EFEA",
            300: "#EAE5DE",
          },
          gold: {
            50: "#FAF6EB",
            100: "#F4ECCF",
            200: "#E8D89E",
            300: "#DCC46D",
            400: "#D4AF37", // Pure Gold
            500: "#C5A059", // Champagne Gold
            600: "#A6823E",
            700: "#876428",
            800: "#5F4517",
            900: "#3E2C0C",
          },
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        arabic: ["Tajawal", "Cairo", "Segoe UI", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(212, 175, 55, 0.25)",
        "gold-sm": "0 0 12px -2px rgba(212, 175, 55, 0.2)",
        "card-dark": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
