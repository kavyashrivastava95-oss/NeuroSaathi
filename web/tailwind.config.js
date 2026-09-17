/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        patient: {
          bg: '#fdfbf7', // Warm off-white, comfortable for elderly eyes
          card: '#ffffff',
          primary: '#0d9488', // Teal
          accent: '#e11d48', // Warm rose
          subtle: '#f3f4f6',
          text: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'elderly-base': '1.25rem', // 20px
        'elderly-lg': '1.5rem',    // 24px
        'elderly-xl': '2rem',      // 32px
        'elderly-2xl': '2.5rem',   // 40px
      }
    },
  },
  plugins: [],
}
