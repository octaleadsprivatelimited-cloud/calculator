/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1a73e8',
          blueHover: '#174ea6',
          blueLight: '#e8f0fe',
          red: '#ea4335',
          yellow: '#fbbc04',
          green: '#34a853',
          gray: '#5f6368',
          lightGray: '#f1f3f4',
          border: '#dadce0',
          bg: '#f8f9fa',
          text: '#202124'
        },
        calculator: {
          primary: '#1e293b',
          secondary: '#334155',
          accent: '#1a73e8',
          display: '#f1f3f4',
          button: '#f1f3f4',
          buttonHover: '#e8eaed',
          function: '#dadce0',
          functionHover: '#bdc1c6',
          operator: '#f1f3f4',
          operatorHover: '#e8eaed',
          number: '#f1f3f4',
          numberHover: '#e8eaed',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'calculator': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'google': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        'google-hover': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}

