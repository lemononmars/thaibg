const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans:['Prompt', ...fontFamily.sans],
		},
		extend: {
		}
	},
	variants: {
		extend: {}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('daisyui'),
	],
	daisyui: {
		themes: [
		  {
			mytheme: {
				"primary": "#12446A",
				"secondary": "#E62E5C",
				"accent": "#49B185",
				"neutral": "#E7EBEE",
				"base-100": "#ffffff",
				"info": "#3ABFF8",
				"success": "#36D399",
				"warning": "#FFC550",
				"error": "#F87272",
				"--btn-text-color": "secondary"
			},
		  },
		],
	  },
}
