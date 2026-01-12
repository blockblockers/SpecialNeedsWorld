/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Crayon-inspired color palette - matched to logo
        crayon: {
          red: '#E63B2E',      // Matched to red hand in logo
          orange: '#F5A623',   // Warm orange from sun
          yellow: '#F8D14A',   // Sun yellow
          green: '#5CB85C',    // Land/grass green from logo
          blue: '#4A9FD4',     // Ocean blue from logo  
          lightblue: '#87CEEB', // Cloud blue
          purple: '#8E6BBF',   // Softer purple
          pink: '#E86B9A',     // Softer pink
          brown: '#8B5A2B',    // Earth brown
          paper: '#FFFEF5',    // Slightly warmer white like paper
          paperDark: '#F5ECD9',
        }
      },
      fontFamily: {
        crayon: ['"Patrick Hand"', '"Comic Neue"', '"Comic Sans MS"', 'cursive'],
        display: ['"Bubblegum Sans"', '"Patrick Hand"', 'cursive'],
      },
      backgroundImage: {
        'paper-texture': "url('/paper-texture.png')",
      },
      boxShadow: {
        'crayon': '4px 4px 0px rgba(0,0,0,0.2)',
        'crayon-lg': '6px 6px 0px rgba(0,0,0,0.25)',
        'crayon-pressed': '2px 2px 0px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        'wobbly': '30% 70% 70% 30% / 30% 30% 70% 70%',
      },
      animation: {
        'wobble': 'wobble 0.5s ease-in-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
