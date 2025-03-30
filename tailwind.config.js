module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        error: 'var(--error-text-color)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
