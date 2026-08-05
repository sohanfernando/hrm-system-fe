import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#DBEAFE",
        },
        secondary: {
          DEFAULT: "#64748B",
          dark: "#475569",
          light: "#E2E8F0",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        surface: "#F8FAFC",
        border: "#E2E8F0",
        foreground: "#0F172A",
        muted: "#94A3B8",
      },
      fontSize: {
        heading: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        subheading: ["18px", { lineHeight: "28px", fontWeight: "600" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      spacing: {
        sidebar: "16rem",
        "sidebar-collapsed": "4.5rem",
        navbar: "4rem",
      },
      borderRadius: {
        card: "0.75rem",
        button: "0.5rem",
        input: "0.5rem",
        badge: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.06)",
        dropdown: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)",
        modal: "0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
