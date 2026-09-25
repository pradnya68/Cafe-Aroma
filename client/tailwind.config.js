/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: '#3A2118',
        'dark-coffee': '#24130E',
        coffee: '#6F4532',
        caramel: '#B8794A',
        cream: '#F7F0E6',
        beige: '#E8D8C3',
        white: '#FFFDF9',
        gold: '#C99A5B',
        'ink-muted': '#735B4D',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 16px 50px rgba(36, 19, 14, 0.10)',
        'deep': '0 24px 60px rgba(36, 19, 14, 0.18)',
      }
    },
  },
  plugins: [],
}
