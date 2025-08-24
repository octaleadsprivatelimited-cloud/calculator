import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import CalculatorFavorites from './components/CalculatorFavorites'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Online Calculators - Math, Finance, Health, Construction & More | Calculator.net',
  description: 'Free online calculators for math, finance, health, construction, education, and more. Over 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools. Fast, accurate, and easy to use.',
  keywords: [
    'free calculator', 'online calculator', 'math calculator', 'financial calculator', 'mortgage calculator',
    'BMI calculator', 'scientific calculator', 'unit converter', 'percentage calculator', 'loan calculator',
    'investment calculator', 'retirement calculator', 'tax calculator', 'construction calculator', 'health calculator',
    'fitness calculator', 'education calculator', 'GPA calculator', 'grade calculator', 'age calculator',
    'date calculator', 'time calculator', 'concrete calculator', 'paint calculator', 'flooring calculator',
    'roofing calculator', 'electrical calculator', 'tile calculator', 'mulch calculator', 'gravel calculator',
    'tire size calculator', 'wind chill calculator', 'heat index calculator', 'dew point calculator',
    'bandwidth calculator', 'time duration calculator', 'day counter', 'day of week calculator'
  ],
  authors: [{ name: 'Calculator.net Team' }],
  creator: 'Calculator.net',
  publisher: 'Calculator.net',
  formatDetection: { email: false, address: false, telephone: false, },
  metadataBase: new URL('https://calculator.net'),
  alternates: { canonical: '/', },
  openGraph: {
    title: 'Free Online Calculators - Math, Finance, Health, Construction & More',
    description: 'Free online calculators for math, finance, health, construction, education, and more. Over 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools.',
    url: 'https://calculator.net',
    siteName: 'Calculator.net',
    images: [
      {
        url: 'https://calculator.net/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Calculator.net - Free Online Calculators',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Calculators - Math, Finance, Health, Construction & More',
    description: 'Free online calculators for math, finance, health, construction, education, and more. Over 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1, },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'Technology',
  classification: 'Calculator Tools',
  other: {
    'msapplication-TileColor': '#3B82F6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3B82F6',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Calculator.net',
    'application-name': 'Calculator.net',
    'mobile-web-app-capable': 'yes',
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png', },
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Header />
        {children}
        <CalculatorFavorites />
      </body>
    </html>
  )
}
