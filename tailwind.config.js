/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.hbs',
    './partials/**/*.hbs'
  ],
  theme: {
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
