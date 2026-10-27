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
          950: '#071D38',
          900: '#12365A',
          800: '#1D466B',
          700: '#315B7D',
          600: '#527493',
          100: '#E8EEF3',
        },
        gold: {
          500: '#527493',
          DEFAULT: '#527493',
          600: '#426683',
          700: '#315570',
          100: '#E8EEF3',
        },
        steel: {
          900: '#182536',
          800: '#34485D',
          700: '#526273',
          500: '#69798A',
          300: '#AAB8C5',
          200: '#D7E0E8',
          100: '#E8EEF3',
          50: '#F2F5F8',
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
        'industrial': '0 4px 20px -2px rgba(7, 29, 56, 0.08), 0 2px 6px -1px rgba(7, 29, 56, 0.04)',
        'industrial-lg': '0 12px 32px -4px rgba(7, 29, 56, 0.12), 0 4px 12px -2px rgba(7, 29, 56, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
