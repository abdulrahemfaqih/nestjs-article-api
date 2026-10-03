/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111111',
          pure: '#000000',
          muted: '#666666',
          light: '#888888',
          border: '#e5e5e5',
          bg: '#fcfcfc',
          panel: '#f7f7f8',
        },
        accent: {
          DEFAULT: '#b45309', // warm amber accent - minimal and organic
          hover: '#92400e',
          light: '#fef3c7',
          subtle: '#fffbeb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      }
    },
  },
  plugins: [
    typography,
  ],
}
