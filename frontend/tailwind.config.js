/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // User requested Light Sky Blue theme color (#80ddff)
        skybg: {
          50: '#f4fbff',
          100: '#e6f7ff',
          200: '#c5eeff',
          300: '#9ee3ff',
          400: '#80ddff', // Exact hex from user image
          500: '#80ddff',
          600: '#38bdf8',
          700: '#0284c7',
          800: '#0369a1',
          900: '#0c4a6e',
          950: '#082f49',
        },
        slate: {
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'sky-shadow': '0 10px 30px -5px rgba(128, 221, 255, 0.4)',
        'card-sky': '0 4px 20px -2px rgba(2, 132, 199, 0.08)',
      }
    },
  },
  plugins: [],
}
