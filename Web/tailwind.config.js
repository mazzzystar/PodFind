/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.{html,js}", "./static/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Add the old green colors back
        green: {
          200: '#b5f0d0',
          300: '#8ce3b9',
          400: '#10b981',
        },
      },
    },
  },
  plugins: [],
}


