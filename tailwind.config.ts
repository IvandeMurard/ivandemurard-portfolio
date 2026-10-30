import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        headline: ['"Newsreader"', "serif"],
        body: ['"Manrope"', "sans-serif"],
        label: ['"Manrope"', "sans-serif"],
        serif: ['"Newsreader"', "serif"],
        sans: ['"Manrope"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        // Material-style semantic tokens (from Stitch prototypes)
        surface: {
          DEFAULT: "hsl(var(--surface))",
          bright: "hsl(var(--surface-bright))",
          dim: "hsl(var(--surface-dim))",
          variant: "hsl(var(--surface-variant))",
        },
        "surface-container-lowest": "hsl(var(--surface-container-lowest))",
        "surface-container-low": "hsl(var(--surface-container-low))",
        "surface-container": "hsl(var(--surface-container))",
        "surface-container-high": "hsl(var(--surface-container-high))",
        "surface-container-highest": "hsl(var(--surface-container-highest))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--on-primary))",
          container: "hsl(var(--primary-container))",
          fixed: "hsl(var(--primary-fixed))",
        },
        "primary-container": "hsl(var(--primary-container))",
        "primary-fixed": "hsl(var(--primary-fixed))",
        "primary-fixed-dim": "hsl(var(--primary-fixed-dim))",
        "on-primary": "hsl(var(--on-primary))",
        "on-primary-container": "hsl(var(--on-primary-container))",

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--on-secondary))",
        },
        "rose-copper": "hsl(var(--rose-copper))",
        "rose-copper-on-navy": "hsl(var(--rose-copper-on-navy))",
        "secondary-fixed": "hsl(var(--secondary-fixed))",
        "secondary-fixed-dim": "hsl(var(--secondary-fixed-dim))",
        "on-secondary": "hsl(var(--on-secondary))",
        "on-secondary-container": "hsl(var(--on-secondary-container))",

        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--on-tertiary))",
        },
        "tertiary-container": "hsl(var(--tertiary-container))",
        "on-tertiary": "hsl(var(--on-tertiary))",
        "on-tertiary-container": "hsl(var(--on-tertiary-container))",
        "on-tertiary-fixed-variant": "hsl(var(--on-tertiary-fixed-variant))",

        "on-surface": "hsl(var(--on-surface))",
        "on-surface-variant": "hsl(var(--on-surface-variant))",
        "on-background": "hsl(var(--on-background))",

        error: "hsl(var(--error))",
        "on-error": "hsl(var(--on-error))",
        "error-container": "hsl(var(--error-container))",
        "on-error-container": "hsl(var(--on-error-container))",

        outline: "hsl(var(--outline))",
        "outline-variant": "hsl(var(--outline-variant))",
        "signal-go": "hsl(var(--signal-go))",
        "signal-warn": "hsl(var(--signal-warn))",
        "signal-stop": "hsl(var(--signal-stop))",


        "inverse-surface": "hsl(var(--inverse-surface))",
        "inverse-on-surface": "hsl(var(--inverse-on-surface))",
        "inverse-primary": "hsl(var(--inverse-primary))",

        // shadcn aliases
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.125rem",
        md: "0.25rem",
        lg: "0.25rem",
        xl: "0.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      transitionTimingFunction: {
        hospitable: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
