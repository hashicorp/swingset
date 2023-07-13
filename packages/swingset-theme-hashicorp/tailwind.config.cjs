const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'ss-',
  content: [
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      textColor: {
        heading: colors.slate[800],
        'foreground-primary': '#3b3d45',
        'foreground-faint': '#656a76',
        'foreground-action': '#1060ff',
      },
      backgroundColor: {
        'surface-action': '#f2f8ff',
        'surface-faint': '#fafafa',
      },
      borderColor: {
        action: '#cce3fe',
        faint: '#656a761a',
      },
    },
  },
  plugins: [],
}
