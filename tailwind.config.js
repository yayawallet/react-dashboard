/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    container: {
      padding: '1rem',
      center: false,
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.page-container': {
          padding: '1rem 3rem',
          'max-width': '1536px',
        },
        '@media (max-width: 1024px)': {
          '.page-container': {
            padding: '0 2rem',
          },
        },
        '.table-container': {
          'max-width': '1536px',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
