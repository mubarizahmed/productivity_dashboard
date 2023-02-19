/** @type {import('tailwindcss').Config} */

module.exports = {

  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E1E1E',
        secondary: '#F2F2F2',
        accent: '#FFC107',
        'todoist-4': '#D1453B',
        'todoist-3': '#eb8909',
        'todoist-2': '#246fe0',
        'todoist-1': 'grey',
        'pd-blue': '#1E1E1E',
        'pd-red': '#D1453B',
        'pd-yellow': '#eb8909',
        'pd-green': '#246fe0',
        'pd-grey': 'grey',
        'pd-charcoal': '#1E1E1E',
        'pd-orange': '#F2F2F2',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(-225deg, #2CD8D5 0%, #6B8DD6 48%, #8E37D7 100%)'
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      }
    }
  },
  purge: {
    // content: ['./src/**/*.html'],
    options: {
      safelist: ['bg-todoist-1', 'bg-todoist-2', 'bg-todoist-3', 'bg-todoist-4', 'border-todoist-1', 'border-todoist-2', 'border-todoist-3', 'border-todoist-4', 'gradient-1'],
    },
  },

  plugins: [require('@tailwindcss/forms')],

};