/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./lab-final-b/views/**/*.ejs",
    "./public/**/*.html",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(222, 0, 70)',
          hover: 'rgb(200, 0, 60)',
        }
      }
    },
  },
  plugins: [],
}

