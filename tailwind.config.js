/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-bristol-1', 'bg-bristol-2', 'bg-bristol-3', 'bg-bristol-4',
    'bg-bristol-5', 'bg-bristol-6', 'bg-bristol-7',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f8f4',
          100: '#e6f0e6',
          200: '#cfe0cf',
          300: '#a9c8a9',
          400: '#7faa7f',
          500: '#5c8c5c',
          600: '#477047',
          700: '#3a5a3a',
          800: '#304930',
          900: '#283d28',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf6ec',
          200: '#f3ecd4',
          300: '#e9dab6',
          400: '#dcc28e',
          500: '#cda86a',
        },
        mp: {
          blue: '#009ee3',
          deep: '#33348e',
          yellow: '#ffce00',
        },
        bristol: {
          1: '#8b5a2b',
          2: '#a06a35',
          3: '#b8854a',
          4: '#7faa7f',
          5: '#c9b04a',
          6: '#e0a040',
          7: '#d97740',
        },
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 16px -2px rgba(60, 90, 60, 0.08)',
        card: '0 4px 24px -6px rgba(60, 90, 60, 0.12)',
        lift: '0 10px 40px -10px rgba(60, 90, 60, 0.22)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
