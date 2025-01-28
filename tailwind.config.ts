import type { Config } from "tailwindcss";

export default {
	darkMode: ["class", '[data-theme="dark"]'],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// fundamental tokens (light mode by default) - can be overridden in css variables
				"background": "hsl(var(--background) / <alpha-value>)",
				"foreground": "hsl(var(--foreground) / <alpha-value>)",
				"card": "hsl(var(--card) / <alpha-value>)",
				"card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
				"primary": "hsl(var(--primary) / <alpha-value>)",
				"primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
				"secondary": "hsl(var(--secondary) / <alpha-value>)",
				"secondary-foreground": "hsl(var(--secondary-foreground) / <alpha-value>)",
				"accent": "hsl(var(--accent) / <alpha-value>)",
				"accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
				"muted": "hsl(var(--muted) / <alpha-value>)",
				"muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
				"border": "hsl(var(--border) / <alpha-value>)",
				"input": "hsl(var(--input) / <alpha-value>)",
				"ring": "hsl(var(--ring) / <alpha-value>)",
				"destructive": "hsl(var(--destructive) / <alpha-value>)",
				"destructive-foreground": "hsl(var(--destructive-foreground) / <alpha-value>)",
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				serif: ["Playfair Display", "serif"],
				mono: ["JetBrains Mono", "monospace"],
			},
			keyframes: {
				fadeInUp: {
					"0%": {
						opacity: "0",
						transform: "translateY(4px)",
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)",
					},
				},
			},
			animation: {
				fadeInUp: "fadeInUp 0.4s ease forwards",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
