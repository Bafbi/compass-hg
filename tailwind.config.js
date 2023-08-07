import { withMaterialColors } from 'tailwind-material-colors'

export default withMaterialColors({
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
}, {
  primary: '#6D64E8',
});

