/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        header: 'var(--header-height)',
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
