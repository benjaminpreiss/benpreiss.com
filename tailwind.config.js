const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "fg": ['"Founders Grotesk"', 'Arial', 'sans-serif'],
        "fgt": ['"Founders Grotesk Text"', 'Arial', 'sans-serif'],
      },
      backdropBlur: {
        'nav-sm': '10px',
      },
      colors: {
        'ben-black': '#212121',
        'ben-gray-1': '#fafafa',
        'ben-gray-2': '#f6f6f6',
        'ben-gray-3': '#efefef',
        'ben-gray-4': '#e4e4e4',
        'ben-gray-5': '#797878',
        'ben-gray-6': '#4c4c4c',
        'ben-bluegray-1': '#E6EAEE',
        'ben-beige-1': '#EFEAE3',
        'ben-red-1': '#FF0000',
      },
      backgroundImage: {
        'nav-burger': "url('/nav-burger.svg')",
        'cross-x': "url('/nav-cross.svg')",
        'twitter-white': "url('/twitter-white.svg')",
        'github-white': "url('/github-white.svg')",
        'gitlab-white': "url('/gitlab-white.svg')",
        'bitbucket-white': "url('/bitbucket-white.svg')",
        'twitter-black': "url('/twitter-black.svg')",
        'github-black': "url('/github-black.svg')",
        'gitlab-black': "url('/gitlab-black.svg')",
        'bitbucket-black': "url('/bitbucket-black.svg')",
        'thin-long-arrow-down': "url('/thin-long-arrow-down.svg')",
        'adobe-illustrator': "url('/adobe-illustrator.svg')",
        'adobe-xd': "url('/adobe-xd.svg')",
        'docker': "url('/docker.svg')",
        'nextjs': "url('/nextjs.svg')",
        'react-query': "url('/react-query.svg')",
        'swiper': "url('/swiper.svg')",
        'tailwindcss': "url('/tailwindcss.svg')",
        'formik': "url('/formik.svg')",
        'javascript': "url('/javascript.svg')",
        'paperjs': "url('/paperjs.png')",
        'sass': "url('/sass.svg')",
        'webpack': "url('/webpack.svg')",
        'figma': "url('/figma.svg')",
        'xstate': "url('/xstate.svg')",
        'copy': "url('/copy.svg')",
      },
      boxShadow: {
        'nav-sm': '0px 0px 40px rgba(0, 0, 0, 0.1)',
        'video-sm': '4px 4px 20px rgba(0, 0, 0, 0.25)'
      },
      transitionProperty: {
        'opacity-transform': 'opacity, transform',
      },
      transitionDuration: {
        '0': '0ms',
      },
      transitionDelay: {
        '0': '0ms',
      }

    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('supports-backdrop-blur', '@supports (backdrop-filter: blur(0px))')
    })
  ]
}
