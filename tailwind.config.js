/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'gor-bg': 'var(--gor-bg)',
        'gor-acento': 'var(--gor-acento)',
        'gor-txt': 'var(--gor-txt)',
        'gor-muted': 'var(--gor-muted)',
        'gor-border': 'var(--gor-border)',
        'gor-footer': 'var(--gor-footer-bg)',
        'gor-surface': 'var(--gor-surface)',
        'gor-surface2': 'var(--gor-surface2)',
        'gor-btn-txt': 'var(--gor-btn-txt)',
      },
    },
  },
  plugins: [],
};
