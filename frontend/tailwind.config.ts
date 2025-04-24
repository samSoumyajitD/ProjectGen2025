import type { Config } from "tailwindcss";
const {heroui} = require("@heroui/react");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
 
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        scroll: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(20px)' },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        move: {
          "0%": { transform: "translateX(-200px)" },
          "100%": { transform: "translateX(200px)" },
        },
        // floatEven: {
        //   '0%, 100%': { transform: 'translateY(0)' },
        //   '50%': { transform: 'translateY(-10px)' },
        // },
        // floatOdd: {
        //   '0%, 100%': { transform: 'translateY(0)' },
        //   '50%': { transform: 'translateY(-15px)' },
        // },
      },
      animation: {
        
        move: "move 5s linear infinite",
        scroll: 'scroll 1s linear infinite',
        aurora: "aurora 60s linear infinite",
        floatEven: 'floatEven 3s ease-in-out infinite',
        floatOdd: 'floatOdd 4s ease-in-out infinite',
        
      },
      
    },
  },
  darkMode: "class",
  plugins: [heroui(),addVariablesForColors],
} satisfies Config;
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}