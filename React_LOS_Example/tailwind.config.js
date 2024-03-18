/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      listStyleImage: {
        arrowhead: "url('../public/images/rightheadarrow.svg')",
      },
      opacity: {
        16: "0.16",
        28: "0.28",
        35: "0.35",
        65: "0.65",
      },
      boxShadow: {
        "3xl": " 0px 3px 6px #00000029",
        "4xl": "0px 3px #00000029",
        "5xl": "0px 3px 6px #000000",
      },
      backgroundImage: {},
      // fontFamily: {
      //   // poppins: ["Poppins", "sans-serif"],
      //   urbanist: ["Urbanist","sans-serif"]
      // },
    },
    screens: {
      mobile: "768px",
      // => @media (min-width: 420px) { ... }

      tablet: "1029px",
      // => @media (min-width: 640px) { ... }

      laptop: "1030px",
      // => @media (min-width: 1024px) { ... }

      desktop: "1440px",
      // => @media (min-width: 1280px) { ... }
      monitor: "2561px",
    },
  },
  plugins: [],
};