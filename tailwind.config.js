/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0052cc",
        "on-surface": "#191c1e",
        "on-surface-variant": "#434654",
        "surface-container-low": "#ffffff",
        "outline-variant": "#e1e2e4",
      },
      fontFamily: {
        body: ['Montserrat', 'sans-serif'],
      },
      spacing: {
        'container-margin': '24px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
      }
    },
  },
  plugins: [],
}