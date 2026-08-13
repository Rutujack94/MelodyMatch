/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0F0B15',
          900: '#15101C',
          800: '#1E1626',
          700: '#291F35',
          600: '#372A47',
        },
        cream: '#F5EFE6',
        mist: '#A79BB0',
        gold: {
          DEFAULT: '#F2A93B',
          light: '#F7C874',
          dim: '#B5822C',
        },
        coral: {
          DEFAULT: '#FF6F91',
          dim: '#C24F6B',
        },
        teal: {
          DEFAULT: '#3FC1B0',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(242, 169, 59, 0.35)',
        card: '0 8px 30px -12px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(245,239,230,0.05) 1px, transparent 0)",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'spin-slow': 'spin-slow 12s linear infinite',
      },
    },
  },
  plugins: [],
}
