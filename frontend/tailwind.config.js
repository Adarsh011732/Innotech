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
          950: '#090A0D',
          900: '#0E1015',
          850: '#13161C',
          800: '#181C24',
          750: '#1F242F',
          700: '#2A303E',
        },
        surface: {
          base: '#090A0D',
          panel: '#0E1015',
          card: '#13161C',
          elevated: '#181C24',
          border: 'rgba(255, 255, 255, 0.07)',
          borderHover: 'rgba(255, 87, 34, 0.4)',
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
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'orange-glow': '0 4px 20px -2px rgba(255, 87, 34, 0.35)',
        'orange-sm': '0 2px 8px rgba(255, 87, 34, 0.25)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 87, 34, 0.25)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}
