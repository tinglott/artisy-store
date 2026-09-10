/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#0a0a0f',
          panel: '#12121a',
          border: '#1e1e2e',
          accent: '#7c3aed',
          glow: '#a855f7',
          success: '#22c55e',
          warn: '#f59e0b',
          danger: '#ef4444',
        }
      }
    },
  },
  plugins: [],
}
