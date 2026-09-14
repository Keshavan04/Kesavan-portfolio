/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#6cbafa',   // sky blue — primary highlight
        dark: '#020815',     // page base
        txt: '#f4f6fc',      // body text
        primary: '#050a30',  // deep navy band
        secondary: '#ffffff',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        entrySlideUp: {
          '0%': { transform: 'translateY(0)' },
          '55%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        exitSlideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        logoStem: { '0%': { transform: 'scaleY(0)' }, '100%': { transform: 'scaleY(1)' } },
        logoDot: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        logoK: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scrollDot: {
          '0%': { transform: 'translateY(0) scaleY(1)', opacity: '0' },
          '10%': { transform: 'translateY(0) scaleY(1)', opacity: '1' },
          '40%': { transform: 'translateY(4px) scaleY(2.5)', opacity: '.8' },
          '70%': { transform: 'translateY(12px) scaleY(1)', opacity: '0' },
          '100%': { transform: 'translateY(12px) scaleY(1)', opacity: '0' },
        },
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(80px, 80px)' },
        },
        push: {
          '0%': { transform: 'scale(1.03)' },
          '50%': { transform: 'scale(.95)' },
          '100%': { transform: 'scale(1.03)' },
        },
        waveWobble: {
          '0%, 100%': { transform: 'rotate(0)' },
          '25%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-3deg)' },
        },
      },
      animation: {
        push: 'push 0.7s cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
}
