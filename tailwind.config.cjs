const plugin = require("tailwindcss/plugin");
const tokens = require("./styles/tokens.json");

module.exports = {
  content: ["./src/**/*.{astro,svelte,ts}", "./content/**/*.mdoc"],
  theme: {
    extend: {
      fontFamily: tokens.fontFamily,
      fontWeight: tokens.fontWeight,
      fontSize: Object.fromEntries(
        Object.entries(tokens.fontSize).map(([name, size]) => [
          name,
          [`${size / 16}rem`, { lineHeight: tokens.lineHeight }],
        ]),
      ),
      maxWidth: tokens.maxWidth,
      borderRadius: tokens.borderRadius,
      backdropBlur: {
        "nav-sm": "10px",
      },
      colors: tokens.colors,
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
        "control-outline": `inset 0 0 0 1.5px ${tokens.colors.ink}`,
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
    plugin(function ({ addComponents, addVariant, theme }) {
      const typography = {};
      for (const [size, pixels] of Object.entries(tokens.fontSize)) {
        if (size === "brand") continue;
        for (const [style, weight] of Object.entries({
          regular: tokens.fontWeight.normal,
          semibold: tokens.fontWeight.semibold,
          bold: tokens.fontWeight.bold,
          emphasis: tokens.fontWeight.emphasis,
        })) {
          typography[`.type-${size}-${style}`] = {
            fontFamily: tokens.fontFamily.sans.join(", "),
            fontSize: `${pixels / 16}rem`,
            fontWeight: weight,
            fontStyle: style === "emphasis" ? "italic" : "normal",
            lineHeight: tokens.lineHeight,
            letterSpacing: "0",
          };
        }
      }
      typography[".type-wordmark"] = {
        fontFamily: tokens.fontFamily.logo.join(", "),
        fontSize: `${tokens.fontSize.brand / 16}rem`,
        fontWeight: tokens.fontWeight.wordmark,
        lineHeight: theme("spacing.7"),
      };
      addComponents(typography);
      addVariant("supports-backdrop-blur", "@supports (backdrop-filter: blur(0px))");
    }),
  ],
};
