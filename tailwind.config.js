/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',  // Enable dark mode with class strategy
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-text': '#ffffff',  // Define the color for light mode text
        'dark-text': '#000000',   // Define the color for dark mode text
      },
      fontFamily: {
        body: ['Asap'] // Define global font families
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
