module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      red: '#E40422',
      black: '#000000',
      mittelgruen: '#00AA84',
      gray: {
        '10': '#EFEFEF',
        '20': '#CCCCCC',
        '40': '#999999',
      },
      white: '#fff',
      trasparent: 'transparent',
      currentColor: 'currentColor',
    },
    extend: {
      fontFamily: {
        sans: [
          'Albert Sans',
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
    },
  },
  plugins: [],
}
