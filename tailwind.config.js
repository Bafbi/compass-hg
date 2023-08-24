import { withMaterialColors } from 'tailwind-material-colors'

export default withMaterialColors({
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        "status-open": '#506546',
        "status-closed": '#a54650',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}, {
  primary: '#506546',
});

