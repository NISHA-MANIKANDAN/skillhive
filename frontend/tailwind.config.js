/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#0891b2",
        'black-haze': "#f1f3f3",
        'mirage': "#1e2f38",
        'ocean-green': "#40aa8e",
        'lynch': "#6c7ca4",
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))',
      },
    },
  },
  plugins: [],
}
