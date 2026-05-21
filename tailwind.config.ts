// tailwind.config.js
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/heroBg.png')",
      },
      animation: {
        marquee: 'marquee linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        // Dynamic theme colors using CSS variables
        primary: {
          DEFAULT: 'var(--color-primary, #FF5C1A)',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: 'var(--color-primary, #FF5C1A)',
          600: '#FF5C1A',
          700: '#EA580C',
          800: '#C2410C',
          900: '#9A3412',
        },
        parentPrimary: {
          DEFAULT: '#FF5C1A',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF5C1A',
          600: '#FF5C1A',
          700: '#EA580C',
          800: '#C2410C',
          900: '#9A3412',
        },
        parentPrimaryFirst: '#C2410C',
        parentPrimarySecond: '#FFF3ED',
        parentSecondary: '#FFF3ED',
        parentAccent: '#C2410C',
        parentGreen: {
          500: '#4ADE80',
          900: '#1B4332',
        },
        parentGray: {
          25:  "#fafafa",
          50:  "#f2f2f2",
          100: "#e6e6e6",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080",
          600: "#666666",
          700: "#4d4d4d",
          800: "#333333",
          900: "#1a1a1a",
          925: "#0d0d0d",
        },
        secondary: 'var(--color-secondary, #FFF3ED)',
        accent: 'var(--color-accent, #C2410C)',
        background: 'var(--color-background, #FFFFFF)',
        text: 'var(--color-text, #1C1B19)',
        error: 'var(--color-error, #EF4444)',
        success: 'var(--color-success, #10B981)',
        green: {
          500: '#4ADE80',
          900: '#1B4332',
        },
        gray: {
          25:  "#fafafa",
          50:  "#f2f2f2",
          100: "#e6e6e6",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080",
          600: "#666666",
          700: "#4d4d4d",
          800: "#333333",
          900: "#1a1a1a",
          925: "#0d0d0d",
        },
      },
      fontFamily: {
        sans: ['var(--font-family)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['var(--font-heading)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['var(--font-body)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.bg-green-striped': {
          'background-image': `linear-gradient(45deg, #0a2000 10%, transparent 10%,
            transparent 20%, #0a2000 20%, #0a2000 30%, transparent 30%, transparent 40%,
            #0a2000 40%, #0a2000 50%, transparent 50%, transparent 60%, #0a2000 60%,
            #0a2000 70%, transparent 70%, transparent 80%, #0a2000 80%, #0a2000 90%,
            transparent 90%, transparent)`,
        },
      })
    })
  ],
}