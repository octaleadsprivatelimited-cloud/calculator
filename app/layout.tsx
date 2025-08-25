import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import CalculatorFavorites from './components/CalculatorFavorites'

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
    'online calculators'
  ],
  authors: [{ name: 'Online Calculator.live Team' }],
  creator: 'Online Calculator.live',
  publisher: 'Online Calculator.live',
  metadataBase: new URL('https://onlinecalculator.live'),
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
      </head>
      <body className={`${inter.className} h-full`}>
        <Header />
        {children}
        <CalculatorFavorites />
      </body>
    </html>
  )
}
