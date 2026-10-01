import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1526',
          900: '#10233F', // Brand Navy Primary
          800: '#13284A',
          700: '#16305A', // Brand Navy Accent
          600: '#1E4072',
          100: '#E7ECF3',
        },
        gold: {
          500: '#B8964E',
          DEFAULT: '#C9A961', // Brand Gold Accent Primary CTA
          600: '#B5944D',
          700: '#8F7232',
          100: '#F9F6ED',
        },
        steel: {
          900: '#1E232A',
          800: '#2D343E',
          700: '#434C59',
          500: '#6B7480', // Technical Text / Secondary
          300: '#A4ACB7',
          200: '#D5DAE0',
          100: '#F1F3F5', // Soft Background Grid
          50: '#F8F9FA',
        },
        safety: {
          red: '#A31621', // Reserved solely for HSE, Safety indicators & Alerts
          hover: '#8A121B',
          light: '#FDF2F2',
        },
        success: {
          DEFAULT: '#1E7A46',
          light: '#EDF7F1',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Barlow Condensed', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'industrial': '0 4px 20px -2px rgba(16, 35, 63, 0.08), 0 2px 6px -1px rgba(16, 35, 63, 0.04)',
        'industrial-lg': '0 12px 32px -4px rgba(16, 35, 63, 0.12), 0 4px 12px -2px rgba(16, 35, 63, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
