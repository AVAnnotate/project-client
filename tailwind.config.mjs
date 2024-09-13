/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans Variable', 'sans-serif'],
        inter: ['Inter Variable', 'sans-serif'],
      },
      colors: {
        secondary: '#303F49',
        gray: {
          100: '#F6F6F6',
          200: '#E5E5E5',
          500: '#737373',
        },
        black: '#0A0A0A',
        'blue-hover': '#D9E6ED',
      },
      screens: {
        '3xl': '1800px',
      },
      maxWidth: {
        'screen-3xl': '1800px',
      },
    },
  },
  plugins: [],
};
