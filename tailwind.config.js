/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-500': '#3b82f6',
        'green-500': '#10b981',
        'yellow-500': '#f59e0b',
      }
    },
  },
  plugins: [],
}
