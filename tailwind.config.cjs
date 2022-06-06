const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Prompt', ...fontFamily.sans]
		},
		extend: {}
	},
	variants: {
		extend: {}
	},
	plugins: [require('@tailwindcss/forms'), require('daisyui'), require('@tailwindcss/line-clamp')],
	daisyui: {
		themes: [
			{
				emerald: {
					...require('daisyui/colors/themes')['[data-theme=emerald]'],
					primary: '#12446A',
					'primary-focus': '#02345A',
					secondary: '#E62E5C',
					'secondary-focus': '#D61E4C',
					accent: '#49B185',
					'accent-focus': '#39A175',
					neutral: '#E7EBEE',
					'neutral-focus': '#B7BBBE',
					'neutral-content': '#000000',
					'base-100': '#ffffff',
					info: '#3ABFF8',
					'info-focus': '#3ABFF8',
					success: '#36D399',
					'success-focus': '#36D399',
					warning: '#FFC550',
					'warning-focus': '#FFC550',
					error: '#F87272',
					'error-focus': '#F87272'
				},
				dark:{
					...require('daisyui/colors/themes')['[data-theme=dark]'],
					primary: '#33CCFF',
					'primary-focus': '#33CCFF',
				},
			},
			'dark'
		]
	}
};
