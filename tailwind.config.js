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
        calculator: {
          primary: '#1e293b',
          secondary: '#334155',
          accent: '#3b82f6',
          display: '#0f172a',
          button: '#475569',
          buttonHover: '#64748b',
          function: '#dc2626',
          functionHover: '#ef4444',
          operator: '#f59e0b',
          operatorHover: '#fbbf24',
          number: '#6b7280',
          numberHover: '#9ca3af',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'calculator': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

