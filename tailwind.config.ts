import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			colorBase: '#14213d',
  			colorAccent: '#bfa15a',
  			colorBackgroundLight: '#ffffff',
  			colorBackgroundDark: '#000000',
  			colorNeutralLight: '#e5e5e5',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'sans-serif'
  			],
  			serif: [
  				'Playfair Display',
  				'serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		keyframes: {
  			fadeInUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(4px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		animation: {
  			fadeInUp: 'fadeInUp 0.4s ease forwards'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

// import type { Config } from "tailwindcss";
//
// export default {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // from your minimal-luxury spec
//         primary: "#14213d", // dark navy
//         secondary: "#fca311", // bright amber
//         backgroundLight: "#ffffff",
//         backgroundDark: "#000000",
//         neutralLight: "#e5e5e5",
//
//         // fallback usage
//         foreground: "var(--foreground)",
//         brand: "var(--brand)",
//         brandAccent: "var(--brand-accent)",
//
//         // you could unify these if you like
//       },
//       fontFamily: {
//         sans: ["Inter", "sans-serif"],
//         mono: ["JetBrains Mono", "monospace"],
//         serif: ["Playfair Display", "serif"],
//       },
//       spacing: {
//         // to keep consistent with your whitespace approach
//         8: "8px",
//         "section": "4rem",
//       },
//       maxWidth: {
//         "content": "1440px", // from your grid system
//       },
//       screens: {
//         // optional if you want custom breakpoints
//       },
//       keyframes: {
//         fadeInUp: {
//           "0%": { opacity: "0", transform: "translateY(10px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         swirl: {
//           "0%": { transform: "scale(1) rotate(0deg)" },
//           "50%": { transform: "scale(1.04) rotate(3deg)" },
//           "100%": { transform: "scale(1) rotate(0deg)" },
//         },
//       },
//       animation: {
//         fadeInUp: "fadeInUp 0.6s ease forwards",
//         swirl: "swirl 0.1s ease-in-out",
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config;
