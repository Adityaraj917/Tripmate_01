/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        'primary-light': '#FF8C61',
        secondary: '#00B4D8',
        accent: '#06D6A0',
        'dark-bg': '#0D1B2A',
        'card-bg': '#1A2F45',
        'card-bg-light': '#243B53',
        'light-text': '#F8F9FA',
        'muted-text': '#8EADC1',
        warning: '#FFD166',
        danger: '#EF476F',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        'mobile': '428px',
        'desktop': '1280px',
      },
      screens: {
        'xs': '480px',
        'desktop': '1024px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out both',
        'pulse-heart': 'pulseHeart 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite linear',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'drift-left': 'driftLeft 25s linear infinite',
        'drift-right': 'driftRight 30s linear infinite',
        'drift-up': 'driftUp 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'reveal-up': 'revealUp 0.6s ease-out both',
        'rotate-slow': 'rotateSlow 12s linear infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'parallax-cloud': 'parallaxCloud 35s linear infinite',
        'stagger-fade': 'staggerFade 0.5s ease-out both',
        'scale-in': 'scaleIn 0.4s ease-out both',
        'slide-in-left': 'slideInLeft 0.4s ease-out both',
        'slide-in-right': 'slideInRight 0.4s ease-out both',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'ping-slow': 'pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseHeart: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) rotate(2deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-2deg)' },
        },
        driftLeft: {
          '0%': { transform: 'translateX(100vw) translateY(0)' },
          '100%': { transform: 'translateX(-200px) translateY(-30px)' },
        },
        driftRight: {
          '0%': { transform: 'translateX(-200px) translateY(0)' },
          '100%': { transform: 'translateX(100vw) translateY(-20px)' },
        },
        driftUp: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-100px) rotate(15deg)', opacity: '0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 107, 53, 0.3), 0 0 10px rgba(255, 107, 53, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(255, 107, 53, 0.5), 0 0 30px rgba(255, 107, 53, 0.2)' },
        },
        revealUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0', filter: 'blur(4px)' },
          '100%': { transform: 'translateY(0)', opacity: '1', filter: 'blur(0)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        parallaxCloud: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        staggerFade: {
          '0%': { transform: 'translateY(20px) scale(0.97)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pingSlow: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
