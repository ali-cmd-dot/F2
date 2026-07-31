import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        card: "#1E1E1E",
        border: "#171717",
        brand: "#94EC8E",
        brandDark: "#215B3B",
        textPrimary: "#FFFFFF",
        textSecondary: "#D8D8D8",
        textMuted: "#9E9E9E",
        warning: "#FFC107",
        critical: "#FF4D4D",
      },
    },
  },
  plugins: [],
};

export default config;
