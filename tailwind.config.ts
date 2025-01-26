import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        colorBase: "#14213d",
        colorAccent: "#bfa15a", // refined gold
        colorBackgroundLight: "#ffffff",
        colorBackgroundDark: "#000000",
        colorNeutralLight: "#e5e5e5",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.4s ease forwards",
      },
    },
  },
  plugins: [],
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
