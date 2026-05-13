/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        cardbg: 'rgba(15, 23, 42, 0.65)',
        neon: {
          primary: '#00F5FF',
          secondary: '#7B61FF',
          accent: '#39FF14',
          danger: '#FF4D6D',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Orbitron', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-border': 'pulseBorder 2s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseBorder: {
          '0%, 100%': { borderColor: 'rgba(0, 245, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 245, 255, 1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0,245,255,0.2), 0 0 20px rgba(0,245,255,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0,245,255,0.6), 0 0 30px rgba(0,245,255,0.4)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'gradient-y': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'center top' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'center bottom' },
        },
        'gradient-xy': {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
      },
      backdropBlur: {
        xs: '2px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'neon-primary': '0 0 10px rgba(0, 245, 255, 0.5), 0 0 20px rgba(0, 245, 255, 0.3)',
        'neon-secondary': '0 0 10px rgba(123, 97, 255, 0.5), 0 0 20px rgba(123, 97, 255, 0.3)',
        'neon-accent': '0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3)',
        'neon-danger': '0 0 10px rgba(255, 77, 109, 0.5), 0 0 20px rgba(255, 77, 109, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-cyber': 'linear-gradient(135deg, #00F5FF 0%, #7B61FF 100%)',
        'gradient-dark': 'linear-gradient(to bottom right, #050816, #0f172a)',
        'animated-grid': 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};