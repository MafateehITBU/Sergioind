/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#59CB00',
          secondary: '#63A331',
          background: '#F9F9F9',
          'background-secondary': '#E4E4E4',
          text: '#2E3A26',
          'text-secondary': '#7B7D7D',
        },
        fontFamily: {
          'itim': ['Itim', 'cursive'],
          'roboto': ['Roboto', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }