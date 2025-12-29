/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      screens: {
        'tablet': '768px',
        'desktop': '1024px',
      },
      colors: {
        hadona: {
          primary: '#2B46BB',
          dark: '#1E3190',
          light: '#4A6AE8',
          'bg-dark': '#0F1A5C',
          'bg-darker': '#0A1240',
          yellow: '#EDD947',
          'yellow-dark': '#E5D03D',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'hero-mobile': ['32px', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'hero-tablet': ['40px', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'hero-desktop': ['60px', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'h2-mobile': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2-tablet': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2-desktop': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3-mobile': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3-tablet': ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3-desktop': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-mobile': ['14px', { lineHeight: '1.6' }],
        'body-tablet': ['16px', { lineHeight: '1.6' }],
        'body-desktop': ['18px', { lineHeight: '1.6' }],
        'small-mobile': ['13px', { lineHeight: '1.5' }],
        'small-tablet': ['14px', { lineHeight: '1.5' }],
        'small-desktop': ['16px', { lineHeight: '1.5' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dots-pattern': 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
      },
    }
  },
  plugins: []
}
