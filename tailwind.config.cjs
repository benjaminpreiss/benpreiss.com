const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{astro,svelte,ts}", "./content/**/*.mdoc"],
  theme: {
    extend: {
      fontFamily: {
        // Existing display/body aliases now share the approved replacement family.
        logo: ['"Onest Logo"', "Arial", "sans-serif"],
        fg: ['"Work Sans"', "Arial", "sans-serif"],
        fgt: ['"Work Sans"', "Arial", "sans-serif"],
      },
      // Retain the owner's smaller typography scale during font comparisons.
      // Scale typography by 14/16 without changing the root rem/layout scale.
      fontSize: {
        sm: ["0.765625rem", { lineHeight: "1.25rem" }],
        base: ["0.875rem", { lineHeight: "1.5rem" }],
        lg: ["0.984375rem", { lineHeight: "1.75rem" }],
        xl: ["1.09375rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.3125rem", { lineHeight: "2rem" }],
        "3xl": ["1.640625rem", { lineHeight: "2.25rem" }],
        brand: ["1.44375rem", { lineHeight: "2.3rem" }],
      },
      backdropBlur: {
        "nav-sm": "10px",
      },
      colors: {
        "ben-black": "#212121",
        "ben-gray-1": "#fafafa",
        "ben-gray-2": "#f6f6f6",
        "ben-gray-3": "#efefef",
        "ben-gray-4": "#e4e4e4",
        "ben-gray-5": "#797878",
        "ben-gray-6": "#4c4c4c",
        "ben-bluegray-1": "#E6EAEE",
        "ben-beige-1": "#EFEAE3",
        "ben-red-1": "#FF0000",
      },
      backgroundImage: {
        "nav-burger": "url('/nav-burger.svg')",
        "cross-x": "url('/nav-cross.svg')",
        "twitter-white": "url('/social/twitter-white.svg')",
        "github-white": "url('/social/github-white.svg')",
        "twitter-black": "url('/social/twitter-black.svg')",
        "github-black": "url('/social/github-black.svg')",
        "thin-long-arrow-down": "url('/thin-long-arrow-down.svg')",
        "adobe-illustrator": "url('/technologies/adobe-illustrator.svg')",
        "adobe-xd": "url('/technologies/adobe-xd.svg')",
        docker: "url('/technologies/docker.svg')",
        nextjs: "url('/technologies/nextjs.svg')",
        "react-query": "url('/technologies/react-query.svg')",
        swiper: "url('/technologies/swiper.svg')",
        tailwindcss: "url('/technologies/tailwindcss.svg')",
        formik: "url('/technologies/formik.svg')",
        javascript: "url('/technologies/javascript.svg')",
        paperjs: "url('/technologies/paperjs.png')",
        sass: "url('/technologies/sass.svg')",
        webpack: "url('/technologies/webpack.svg')",
        figma: "url('/technologies/figma.svg')",
        xstate: "url('/technologies/xstate.svg')",
        copy: "url('/copy.svg')",
      },
      boxShadow: {
        "nav-sm": "0px 0px 40px rgba(0, 0, 0, 0.1)",
        "video-sm": "4px 4px 20px rgba(0, 0, 0, 0.25)",
      },
      transitionProperty: {
        "opacity-transform": "opacity, transform",
      },
      transitionDuration: {
        0: "0ms",
      },
      transitionDelay: {
        0: "0ms",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("supports-backdrop-blur", "@supports (backdrop-filter: blur(0px))");
    }),
  ],
};
