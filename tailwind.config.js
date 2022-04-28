module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      magenta: {
        50: "#feedf1",
        100: "#fddbe3",
        200: "#fbb7c7",
        300: "#fa94aa",
        400: "#f8708e",
        500: "#f64c72",
      },
      blue: {
        50: "#eaeaf6",
        100: "#d5d5ec",
        200: "#acacda",
        300: "#8282c7",
        400: "#5959b5",
        500: "#2f2fa2",
      },
      gray: {
        25: "#f5f5f7",
        50: "#ebebef",
        100: "#d7d8df",
        200: "#b0b0bf",
        300: "#8889a0",
        400: "#616180",
        500: "#393a60",
        600: "#2e2e4d",
        700: "#22233a",
        800: "#171726",
        900: "#0b0c13",
      },
      white: "#fff",
      trasparent: "transparent",
      currentColor: "currentColor",
    },
    extend: {},
  },
  plugins: [],
};
