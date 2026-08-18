/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#F0F6FF',
          border: '#BFDBFE'
        },
        surface: {
          leftStart: '#F5F9FF',
          leftEnd: '#EDF4FF',
          pageBg: '#F0F4F8'
        },
        text: {
          navy: '#0F172A',
          muted: '#64748B',
          sub: '#475569'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'element': '14px',
      },
      boxShadow: {
        'card': '0 25px 50px -12px rgba(37, 99, 235, 0.12), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
        'btn': '0 10px 20px -5px rgba(37, 99, 235, 0.35)',
      }
    },
  },
  plugins: [],
}
