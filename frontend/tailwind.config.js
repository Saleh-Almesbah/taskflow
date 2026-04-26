/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        clay: {
          bg:        '#F4F1FA',
          fg:        '#332F3A',
          muted:     '#635F69',
          accent:    '#7C3AED',
          accentAlt: '#DB2777',
          sky:       '#0EA5E9',
          green:     '#10B981',
          amber:     '#F59E0B',
        },
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        sans:   ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        clayDeep:        '30px 30px 60px #cdc6d9, -30px -30px 60px #ffffff, inset 10px 10px 20px rgba(139,92,246,0.05), inset -10px -10px 20px rgba(255,255,255,0.8)',
        clayCard:        '16px 16px 32px rgba(160,150,180,0.2), -10px -10px 24px rgba(255,255,255,0.9), inset 6px 6px 12px rgba(139,92,246,0.03), inset -6px -6px 12px rgba(255,255,255,1)',
        clayCardHover:   '20px 20px 40px rgba(160,150,180,0.3), -12px -12px 28px rgba(255,255,255,0.95), inset 6px 6px 12px rgba(139,92,246,0.05), inset -6px -6px 12px rgba(255,255,255,1)',
        clayButton:      '12px 12px 24px rgba(139,92,246,0.3), -8px -8px 16px rgba(255,255,255,0.4), inset 4px 4px 8px rgba(255,255,255,0.4), inset -4px -4px 8px rgba(0,0,0,0.1)',
        clayButtonHover: '16px 16px 32px rgba(139,92,246,0.4), -10px -10px 20px rgba(255,255,255,0.5), inset 4px 4px 8px rgba(255,255,255,0.5), inset -4px -4px 8px rgba(0,0,0,0.15)',
        clayPressed:     'inset 10px 10px 20px #d9d4e3, inset -10px -10px 20px #ffffff',
        claySidebar:     '20px 0px 60px rgba(160,150,180,0.25), -2px 0 0 rgba(255,255,255,0.6)',
      },
      keyframes: {
        'clay-float':         { '0%,100%': { transform: 'translateY(0) rotate(0deg)' },   '50%': { transform: 'translateY(-20px) rotate(2deg)' } },
        'clay-float-delayed': { '0%,100%': { transform: 'translateY(0) rotate(0deg)' },   '50%': { transform: 'translateY(-15px) rotate(-2deg)' } },
        'clay-float-slow':    { '0%,100%': { transform: 'translateY(0) rotate(0deg)' },   '50%': { transform: 'translateY(-30px) rotate(5deg)' } },
        'clay-breathe':       { '0%,100%': { transform: 'scale(1)' },                     '50%': { transform: 'scale(1.03)' } },
      },
      animation: {
        'clay-float':         'clay-float 8s ease-in-out infinite',
        'clay-float-delayed': 'clay-float-delayed 10s ease-in-out infinite',
        'clay-float-slow':    'clay-float-slow 12s ease-in-out infinite',
        'clay-breathe':       'clay-breathe 6s ease-in-out infinite',
      },
      borderRadius: {
        'clay-sm': '20px',
        'clay':    '24px',
        'clay-md': '32px',
        'clay-lg': '48px',
        'clay-xl': '60px',
      },
      transitionDuration: { '400': '400ms' },
    },
  },
  plugins: [],
};
