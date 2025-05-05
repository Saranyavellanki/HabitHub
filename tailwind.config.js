module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}' // if using app directory
  ],
    
  darkMode: 'class', 
  theme: {
    extend: {
      // Your theme extensions here
    },
  },
  plugins: [],
}


// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

