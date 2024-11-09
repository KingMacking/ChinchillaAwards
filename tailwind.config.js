/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#F3E5AB",
				secondary: "#C3A84C",
				black: "#171717",
				white: "#FAFAFA",
                transparent: 'transparent',
				goldGradient: "linear-gradient(135deg, #FBF4A1, #B67933)",
			},
            backgroundImage: {
                main: 'url(/assets/web-bg.png)',
				'gold-gradient': "linear-gradient(135deg, #FBF4A1, #B67933)",
            }
		},
	},
	plugins: [],
};
