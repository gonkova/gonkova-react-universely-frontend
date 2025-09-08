import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        body: ["Poppins", ...defaultTheme.fontFamily.sans],
        heading: ["Grenze Gotisch", ...defaultTheme.fontFamily.sans],
      },
    },
    keyframes: {
      fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
    },
    animation: {
      fadeIn: "fadeIn 0.4s ease-out forwards",
    },
  },
  plugins: [],
};
