import type { Config } from "tailwindcss";

/**
 * Meridian design tokens
 * ----------------------
 * Palette (named):
 *   ink      #0B1220  — deep navy-black, dark surfaces & headline text on light bg
 *   porcelain#F6F8FB  — light-mode background
 *   emerald  #0F6B5C  — primary brand: trust + growth
 *   mint     #2FAE8B  — brand accent: positive amounts, success, active states
 *   gold     #C9A227  — premium accent, used sparingly (card foil, premium badges)
 *   coral    #E4572E  — attention/negative amounts, destructive actions
 *
 * Type system:
 *   display -> Space Grotesk (headlines, marketing, marquee numbers)
 *   sans    -> Inter (UI text, body copy)
 *   mono    -> IBM Plex Mono (balances, account numbers, card numbers — tabular
 *              figures so financial digits never jitter/misalign)
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        ink: {
          950: "#0B1220",
          900: "#111A2E",
          800: "#1B2740",
          700: "#2A3856",
          600: "#3E4E70",
          400: "#7C8AA5",
          200: "#C7CEDB",
        },
        porcelain: {
          DEFAULT: "#F6F8FB",
          100: "#FFFFFF",
          200: "#EEF2F7",
        },
        emerald: {
          DEFAULT: "#0F6B5C",
          600: "#0C5145",
          500: "#0F6B5C",
          400: "#1B8873",
        },
        mint: {
          DEFAULT: "#2FAE8B",
          500: "#2FAE8B",
          400: "#4FC7A6",
          100: "#DFF6EE",
        },
        gold: {
          DEFAULT: "#C9A227",
          500: "#C9A227",
          300: "#E4C868",
        },
        coral: {
          DEFAULT: "#E4572E",
          500: "#E4572E",
          100: "#FBE3DA",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11,18,32,0.04), 0 8px 24px -8px rgba(11,18,32,0.10)",
        card: "0 4px 16px -4px rgba(11,18,32,0.18), 0 1px 2px rgba(11,18,32,0.06)",
        glow: "0 0 0 1px rgba(47,174,139,0.25), 0 8px 32px -8px rgba(15,107,92,0.45)",
      },
      backgroundImage: {
        "vault-gradient":
          "linear-gradient(135deg, #0B1220 0%, #0F6B5C 62%, #2FAE8B 100%)",
        "vault-foil":
          "repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 8px)",
      },
      maxWidth: {
        app: "430px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
