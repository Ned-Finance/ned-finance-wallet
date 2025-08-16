/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./modules/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "ned-primary": "rgb(var(--ned-primary) / <alpha-value>)",
        "ned-secondary": "rgb(var(--ned-secondary) / <alpha-value>)",
        "ned-background": "rgb(var(--ned-background) / <alpha-value>)",
        "ned-background-secondary":
          "rgb(var(--ned-background-secondary) / <alpha-value>)",
        "ned-info": "rgb(var(--ned-info) / <alpha-value>)",
        "ned-warning": "rgb(var(--ned-warning) / <alpha-value>)",
        "ned-danger": "rgb(var(--ned-danger) / <alpha-value>)",
        "ned-muted": "rgb(var(--ned-muted) / <alpha-value>)",
        "ned-inverse": "rgb(var(--ned-inverse) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    ({ addBase }) =>
      addBase({
        ":root": {
          "--ned-primary": "0 239 209",
          "--ned-secondary": "0 172 234",
          "--ned-info": "255 173 96",
          "--ned-warning": "250 166 255",
          "--ned-danger": "229 83 129",
          "--ned-background": "10 10 10",
          "--ned-background-secondary": "36 37 48",
          "--ned-muted": "115 115 115" /* neutral-600 */,
          "--ned-inverse": "255 255 255" /* white */,
        },
      }),
  ],
};
