/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          dark: '#14151b',
          darker: '#0b0c10',
          accent: '#ef233c', // MegaGym vibrant crimson red
          accentHover: '#d90429',
          light: '#f8f9fa',
          card: '#1a1b22',
          cardHover: '#22232c',
          border: '#2b2c36',
          redBanner: '#ef233c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Montserrat', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
