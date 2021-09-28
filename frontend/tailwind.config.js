module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      "mobile-S": "320px",
      "mobile-M": "375px",
      "mobile-L": "425px",
      tablet: "768px",
      laptop: "1024px",
      "laptop-L": "1200px",
      "4k": "2560px",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
