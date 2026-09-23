import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0a0c10",
          card: "#12161f",
          border: "#1e2638",
          cyan: "#00f0ff",
          lime: "#10b981",
          yellow: "#facc15",
          magenta: "#ec4899",
          whatsapp: "#25D366",
          whatsappHover: "#1EBE57"
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 240, 255, 0.35)",
        "neon-lime": "0 0 20px rgba(16, 185, 129, 0.35)",
        "neon-magenta": "0 0 20px rgba(236, 72, 153, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
