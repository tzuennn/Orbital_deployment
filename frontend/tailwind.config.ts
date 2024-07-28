import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        main: ["Poppins"],
        secondary: ["Libre Franklin"],
        lato: ["Lato"],
      },
      colors: {
        lightBlue: "#EDE8F5",
        darkerBlue: "#90AEAD",
        skyBlue: "#AFDDE5",
        lightGrey: "#ADBBDA",
        lightOrange: "#FFD580",
        lightYellow: "#ffffa9",
      },
      animation: {
        blink: "blink 1s step-start 0s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
