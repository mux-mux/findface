module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'background-modal': 'var(--background-modal, #cacaca)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
