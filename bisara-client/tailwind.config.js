/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bisara-bg': '#F5F7FF',
        'bisara-accent': '#2563FF',
        'bisara-accent-muted': '#7C3AED',
        'bisara-cyan': '#22D3EE',
        'bisara-yellow': '#FFD60A',
        'bisara-orange': '#FF8A00',
        'bisara-pink': '#FF4D9D',
        'bisara-navy': '#1E293B',
      },
      fontFamily: {
        zain: ['Zain', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
      },
      boxShadow: {
        'sm': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'md': '0 10px 15px -3px rgba(37, 99, 255, 0.08), 0 4px 6px -2px rgba(37, 99, 255, 0.03)',
        'lg': '0 20px 25px -5px rgba(37, 99, 255, 0.1), 0 10px 10px -5px rgba(37, 99, 255, 0.04)',
      }
    },
  },
  plugins: [],
}
