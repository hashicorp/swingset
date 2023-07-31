/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
        dark: colors.slate[700],
        primary: colors.slate[600],
        faint: colors.gray[500],
        action: '#1060ff',
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
