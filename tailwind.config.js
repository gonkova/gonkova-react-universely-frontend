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
  },
  plugins: [],
};
