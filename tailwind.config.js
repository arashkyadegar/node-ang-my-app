/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      gridColumn: {
        'span-16': 'width :10rem',
      }
    },
  },
  plugins: [],
}
