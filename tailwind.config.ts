module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class", // This must be here
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"], // This connects the font
      },
    },
  },
  plugins: [],
};
