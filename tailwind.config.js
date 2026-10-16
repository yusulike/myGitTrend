/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
        },
        dark: {
          bg: '#0d1117',
          card: '#161b22',
          cardHover: '#1c2128',
          inset: '#0d1117',
          border: '#30363d',
          borderLight: '#3d444d',
          textMuted: '#8b949e',
          textHeading: '#f0f6fc',
        }
      }
    },
  },
  plugins: [],
}
