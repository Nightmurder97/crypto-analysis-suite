/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        neutral: {
          900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
          800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
          700: 'rgb(var(--color-neutral-700) / <alpha-value>)',
          400: 'rgb(var(--color-neutral-400) / <alpha-value>)',
          300: 'rgb(var(--color-neutral-300) / <alpha-value>)',
          100: 'rgb(var(--color-neutral-100) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '6': 'var(--space-6)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
      }
    },
  },
  plugins: [],
}