import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import CalculatorFavorites from './components/CalculatorFavorites'
import Footer from './components/Footer'
import GoogleAnalytics from './components/GoogleAnalytics'
import SEOOptimizer from './components/SEOOptimizer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Online Calculators - Math, Finance, Health, Construction & More | Online Calculator.live',
  description: 'Free online calculators for math, finance, health, construction, education, and more. Over 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools. Fast, accurate, and easy to use.',
  keywords: [
    'free online calculators',
    'financial calculators',
    'mortgage calculator',
    'loan calculator',
    'investment calculator',
    'scientific calculator',
    'math calculators',
    'health calculators',
    'BMI calculator',
    'calorie calculator',
    'construction calculators',
    'conversion calculators',
    'time calculators',
    'education calculators',
    'GPA calculator',
    'online calculator.live',
    'free calculators',
    'online calculators',
    'calculator tools',
    'math tools',
    'financial tools',
    'health tools',
    'construction tools',
    'conversion tools',
    'unit converter',
    'percentage calculator',
    'tip calculator',
    'age calculator',
    'area calculator',
    'volume calculator',
    'temperature converter',
    'weight converter',
    'length converter',
    'currency converter',
    'time calculator',
    'date calculator',
    'fraction calculator',
    'standard deviation calculator',
    'triangle calculator',
    'roofing calculator',
    'tile calculator',
    'concrete calculator',
    'paint calculator',
    'electrical calculator',
    'btu calculator',
    'horsepower calculator',
    'bandwidth calculator',
    'ip subnet calculator',
    'resistor calculator',
    'ohms law calculator',
    'voltage drop calculator',
    'wind chill calculator',
    'heat index calculator',
    'dew point calculator',
    'body fat calculator',
    'bmr calculator',
    'tdee calculator',
    'macro calculator',
    'protein calculator',
    'carbohydrate calculator',
    'fat intake calculator',
    'calories burned calculator',
    'target heart rate calculator',
    'sleep calculator',
    'pregnancy calculator',
    'ovulation calculator',
    'conception calculator',
    'period calculator',
    'pregnancy weight gain calculator',
    'golf handicap calculator',
    'one rep max calculator',
    'pace calculator',
    'speed calculator',
    'time duration calculator',
    'time zone calculator',
    'time card calculator',
    'day counter calculator',
    'day of week calculator',
    'countdown timer',
    'dice roller calculator',
    'random number generator',
    'password generator',
    'love calculator',
    'love compatibility',
    'bra size calculator',
    'shoe size converter',
    'tire size calculator',
    'gravel calculator',
    'mulch calculator',
    'stair calculator',
    'square footage calculator',
    'grade calculator',
    'percentage grade calculator',
    'scholarship calculator',
    'salary calculator',
    'take home paycheck calculator',
    'commission calculator',
    'margin calculator',
    'roi calculator',
    'irr calculator',
    'payback period calculator',
    'present value calculator',
    'future value calculator',
    'average return calculator',
    'debt to income calculator',
    'down payment calculator',
    'refinance calculator',
    'fha loan calculator',
    'va loan calculator',
    'usda loan calculator',
    'jumbo loan calculator',
    'conventional loan calculator',
    'auto loan calculator',
    'boat loan calculator',
    'personal loan calculator',
    'business loan calculator',
    'rental property calculator',
    'real estate calculator',
    'budget calculator',
    'lease calculator',
    'payment calculator',
    'interest calculator',
    'percent off calculator',
    'commission calculator',
    'margin calculator',
    'roi calculator',
    'irr calculator',
    'payback period calculator',
    'present value calculator',
    'future value calculator',
    'average return calculator',
    'debt to income calculator',
    'down payment calculator',
    'refinance calculator',
    'fha loan calculator',
    'va loan calculator',
    'usda loan calculator',
    'jumbo loan calculator',
    'conventional loan calculator',
    'auto loan calculator',
    'boat loan calculator',
    'personal loan calculator',
    'business loan calculator',
    'rental property calculator',
    'real estate calculator',
    'budget calculator',
    'lease calculator',
    'payment calculator',
    'interest calculator',
    'percent off calculator'
  ],
  authors: [{ name: 'Online Calculator.live Team' }],
  creator: 'Online Calculator.live',
  publisher: 'Online Calculator.live',
  metadataBase: new URL('https://onlinecalculator.live'),
  alternates: {
    canonical: 'https://onlinecalculator.live',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code-here',
    yandex: 'your-yandex-verification-code-here',
    yahoo: 'your-yahoo-verification-code-here',
  },
  openGraph: {
    title: 'Free Online Calculators - Math, Finance, Health & More | Online Calculator.live',
    description: 'Free online calculators for math, finance, health, construction, education, and more. Over 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools.',
    url: 'https://onlinecalculator.live',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Online Calculator.live - Free Online Calculators',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Calculators - Math, Finance, Health & More | Online Calculator.live',
    description: 'Free online calculators for math, finance, health, construction, education, and more. Over 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools.',
    images: ['/og-image.jpg'],
    creator: '@onlinecalculator',
    site: '@onlinecalculator',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'apple-mobile-web-app-title': 'Online Calculator.live',
    'application-name': 'Online Calculator.live',
    'msapplication-TileColor': '#3B82F6',
    'theme-color': '#3B82F6',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google AdSense Verification */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3793493831699803"
          crossOrigin="anonymous"
        />
        
        {/* Google Analytics 4 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="your-verification-code-here" />
        
        {/* Bing Webmaster Tools Verification */}
        <meta name="msvalidate.01" content="your-bing-verification-code-here" />
        
        {/* Yandex Webmaster Verification */}
        <meta name="yandex-verification" content="your-yandex-verification-code-here" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.className} h-full`}>
        <GoogleAnalytics />
        <SEOOptimizer />
        <Header />
        {children}
        <CalculatorFavorites />
        <Footer />
      </body>
    </html>
  )
}
