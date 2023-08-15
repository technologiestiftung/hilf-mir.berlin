const { join } = require('path')

module.exports = {
  content: [
    join(__dirname, './pages/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, './src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    colors: {
      purple: {
        50: '#F9F1F7',
        200: '#ECD5E6',
        400: '#8D3F78',
        500: '#773666',
        700: '#4A1A3E',
      },
      // TODO: Note that currently primary and purple-500 are the same.
      // When there is time for refactoring, we should use the purple scale everywhere.
      primary: '#773666',
      black: '#0A1045',
      success: '#4f9033',
      info: '#5891C3',
      gray: {
        '10': '#EFEFEF',
        '20': '#CCCCCC',
        '40': '#999999',
        '60': '#666666',
        '80': '#333333',
      },
      white: '#FFF',
      trasparent: 'transparent',
      currentColor: 'currentColor',
    },
    extend: {
      fontFamily: {
        sans: [
          'DM Sans',
          'Calibri',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        sidebarW: `420px`,
        mapW: `calc(100vw - 420px)`,
      },
      animation: {
        'fadein-delay-400': 'fadeIn 200ms ease-in-out 400ms 1 forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
}
