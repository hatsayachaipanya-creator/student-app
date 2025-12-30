import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        moneytracker: {
          'primary': '#059669',
          'primary-content': '#ffffff',
          'secondary': '#0d9488',
          'secondary-content': '#ffffff',
          'accent': '#10b981',
          'accent-content': '#ffffff',
          'neutral': '#374151',
          'neutral-content': '#f3f4f6',
          'base-100': '#ffffff',
          'base-200': '#f0fdf4',
          'base-300': '#dcfce7',
          'base-content': '#1f2937',
          'info': '#0ea5e9',
          'success': '#22c55e',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
      },
    ],
    // Force light theme only - no dark mode
    darkTheme: false,
  },
} satisfies Config
