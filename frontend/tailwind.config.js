/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#090A0C',
          900: '#0E0F13',
          850: '#14151A',
          800: '#1A1B22',
          750: '#22242D',
          700: '#2C2E3A',
        },
        orange: {
          DEFAULT: '#FF5722',
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF5722',
          600: '#F4511E',
          700: '#E64A19',
          800: '#D84315',
          900: '#BF360C',
        },
        accent: {
          orange: '#FF5722',
          'orange-glow': '#FF6D00',
          emerald: '#10B981',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'orange-glow': '0 8px 30px -4px rgba(255, 87, 34, 0.45)',
        'orange-sm': '0 2px 12px rgba(255, 87, 34, 0.3)',
        'card-hover': '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 87, 34, 0.25)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '28px',
      }
    },
  },
  plugins: [],
}
