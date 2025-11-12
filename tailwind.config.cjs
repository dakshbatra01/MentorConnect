module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // enable class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5fbff',
          100: '#e6f5ff',
          300: '#7fd1ff',
          500: '#2bb3ff',
          700: '#0a83cc'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(2,6,23,0.08)'
      }
    },
  },
  plugins: [],
}
