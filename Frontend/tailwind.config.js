/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7f4',
          100: '#d6ede5',
          200: '#b1ddce',
          300: '#7fc5b0',
          400: '#4da58e',
          500: '#2d8a74',
          600: '#216e5d',
          700: '#1c584c',
          800: '#1a473e',
          900: '#193b34',
        },
        slate: {
          850: '#172033',
          950: '#0c1222',
        }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'input': '0 0 0 1px rgba(45, 138, 116, 0.2)',
        'input-focus': '0 0 0 3px rgba(45, 138, 116, 0.25)',
      },
    },
  },
  plugins: [],
}
