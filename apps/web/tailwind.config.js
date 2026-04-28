/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          page: '#FAFAF8',
          surface: '#FFFFFF',
          muted: '#F4F4F2',
          image: '#F7F7F8',
        },
        border: {
          subtle: '#E8E8E4',
          strong: '#D4D4CF',
        },
        text: {
          primary: '#0F1B1A',
          secondary: '#5A615F',
          tertiary: '#9CA29F',
        },
        primary: {
          DEFAULT: '#0F766E',
          hover: '#0B5C56',
          muted: '#E6F2F0',
        },
        accent: {
          DEFAULT: '#E1623D',
          muted: '#FBE9E2',
        },
        success: {
          DEFAULT: '#157F46',
          muted: '#E2F2EA',
        },
        warning: {
          DEFAULT: '#B7791F',
          muted: '#FBF1DC',
        },
        danger: {
          DEFAULT: '#B42318',
          muted: '#FBE9E7',
        },
      },
      fontFamily: {
        sans: [
          'Inter var',
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontFeatureSettings: {
        tabular: '"tnum" 1, "cv11" 1',
      },
      fontSize: {
        display: ['1.75rem', { lineHeight: '1.15', fontWeight: '700' }],
        'display-lg': ['2.25rem', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h1-lg': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['1.25rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h2-lg': ['1.375rem', { lineHeight: '1.25', fontWeight: '600' }],
        h3: ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['0.875rem', { lineHeight: '1.55', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        label: ['0.8125rem', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.04em' }],
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 27, 26, 0.04), 0 4px 12px rgba(15, 27, 26, 0.06)',
        pop: '0 2px 4px rgba(15, 27, 26, 0.05), 0 12px 28px rgba(15, 27, 26, 0.10)',
        focus: '0 0 0 2px #FAFAF8, 0 0 0 4px #0F766E',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
};
