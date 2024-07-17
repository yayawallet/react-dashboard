/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        header: 'var(--header-height)',
      },
      colors: {
        violet: {
          50: '#eef0fa',
          100: '#d3d4f2',
          200: '#b5b8e9',
          300: '#969cde',
          400: '#787fd2',
          500: '#5054a2', // <-- Midpoint color
          600: '#4a4d91',
          700: '#3e427a',
          800: '#323663',
          900: '#292c51',
        },
      },
    },
    container: {
      padding: '1rem',
      center: false,
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.page-container': {
          'max-width': '1536px',
          padding: '0 1rem',
        },
        '.table-container': {
          'max-width': '1536px',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
