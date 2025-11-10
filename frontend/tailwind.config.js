/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: ["particle"], // 🧠 prevents purge
  theme: {
    extend: {
      colors: {
        moodifyCyan: "#00ffff",
        moodifyMagenta: "#ff00cc",
        moodifyDark: "#0a0a1a",
        moodifyPurple: "#9b5de5",
        moodifyPink: "#f15bb5",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.3" },
          "50%": { transform: "translateY(-25px) scale(1.1)", opacity: "0.7" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "0.3" },
        },
        gradientFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        gradientFlow: "gradientFlow 6s linear infinite",
      },
    },
  },
  plugins: [],
};
