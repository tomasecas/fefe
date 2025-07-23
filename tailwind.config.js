/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f2',
          100: '#dcf2e1',
          200: '#bce5c7',
          300: '#8dd1a3',
          400: '#57b577',
          500: '#3f754f', // Color principal verde
          600: '#2f5a3c',
          700: '#264832',
          800: '#20392a',
          900: '#1b2f24',
        },
        neutral: {
          400: '#a6a6a6', // Gris personalizado
          500: '#999999',
          600: '#8c8c8c',
        }
      }
    },
  },
  plugins: [],
};
