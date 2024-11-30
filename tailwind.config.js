/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#f29e5e",
				secondary: "#DE680F",
				black: "#171717",
				white: "#FAFAFA",
                transparent: 'transparent',
			},
            backgroundImage: {
                main: 'url(/assets/web-bg.jpg)',
            }
		},
	},
	plugins: [],
};
