/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#000000',
        'secondary': '#1a202c',
        'button-bg': '#2d3748',
        'button-text': 'White',
        'highlight': '#f56565',
        'navbar-bg': '#2d3748',
        'navbar-text': '#ffffff',
      },
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'mono'], // Replace 'Inter' with your desired global font
        // You can add more font families if needed
      },
      // Add more custom styles if necessary
    },
  },

  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
