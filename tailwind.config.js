import { withMaterialColors } from 'tailwind-material-colors'

export default withMaterialColors({
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      // fontFamily: {
      //   'sans': ['Roboto', 'sans-serif'],
      // },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}, {
  primary: '#506546',
});

