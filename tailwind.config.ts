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
          950: '#071D35',
          900: '#12365A',
          800: '#1C4162',
          700: '#315B7D',
          600: '#6F849B',
          100: '#DCE3EA',
        },
        accent: {
          500: '#1687FF',
          DEFAULT: '#1687FF',
          600: '#0D76E8',
          700: '#0A63C7',
          100: '#DCE3EA',
        },
        steel: {
          900: '#263445',
          800: '#425367',
          700: '#68788A',
          600: '#68788A',
          500: '#68788A',
          400: '#68788A',
          300: '#AAB8C5',
          200: '#D8E0E8',
          100: '#DCE3EA',
          50: '#F3F6F9',
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
        'industrial': '0 4px 20px -2px rgba(7, 29, 53, 0.08), 0 2px 6px -1px rgba(7, 29, 53, 0.04)',
        'industrial-lg': '0 12px 32px -4px rgba(7, 29, 53, 0.12), 0 4px 12px -2px rgba(7, 29, 53, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
