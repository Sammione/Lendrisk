/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f172a',
        'bg-secondary': '#0a0f1e',
        'bg-tertiary': '#1e293b',
        'text-brand': '#f8fafc',
        'text-muted': '#94a3b8',
        'accent-emerald': '#10b981',
        'accent-amber': '#f59e0b',
        'accent-crimson': '#ef4444',
        'accent-indigo': '#6366f1',
      },
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'main': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
