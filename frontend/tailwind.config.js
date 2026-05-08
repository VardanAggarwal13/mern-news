/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#ff6600',
          dark: '#e55a00',
        },
      },
    },
  },
  plugins: [],
};
