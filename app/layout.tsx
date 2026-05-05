import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import CalculatorFavorites from './components/CalculatorFavorites'
import Footer from './components/Footer'
import GoogleAnalytics from './components/GoogleAnalytics'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const siteUrl = 'https://onlinecalculator.live'
const siteName = 'Online Calculator.live'
const siteDescription =
  'Free online calculators for math, finance, health, construction, education, and more. 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools. Fast, accurate, and easy to use — no registration required.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Free Online Calculators - Math, Finance, Health & More | ${siteName}`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: 'Online Calculator.live Team', url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  generator: 'Next.js',
  keywords: [
    'free online calculators',
    'calculator',
    'math calculator',
    'financial calculators',
    'mortgage calculator',
    'loan calculator',
    'BMI calculator',
    'scientific calculator',
    'percentage calculator',
    'compound interest calculator',
    'calorie calculator',
    'investment calculator',
    'unit converter',
    'age calculator',
    'GPA calculator',
    'tip calculator',
    'tax calculator',
    'retirement calculator',
    'body fat calculator',
    'grade calculator',
    'fraction calculator',
    'standard deviation calculator',
    'time calculator',
    'date calculator',
    'ovulation calculator',
    'pregnancy calculator',
    'auto loan calculator',
    'simple interest calculator',
    'TDEE calculator',
    'online calculator.live',
  ],
  category: 'tools',
  classification: 'Calculators, Tools, Utilities',
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': siteUrl,
      'en-GB': siteUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? '',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['en_GB'],
    url: siteUrl,
    siteName,
    title: `Free Online Calculators - 200+ Tools for Math, Finance & Health | ${siteName}`,
    description: siteDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteName} — Free Online Calculators for Everyone`,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@onlinecalclive',
    creator: '@onlinecalclive',
    title: `Free Online Calculators - Math, Finance, Health & More | ${siteName}`,
    description: siteDescription,
    images: [{ url: '/og-image.jpg', alt: `${siteName} — 200+ Free Calculators` }],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': siteName,
    'application-name': siteName,
    'msapplication-TileColor': '#3B82F6',
    'msapplication-config': '/browserconfig.xml',
    'format-detection': 'telephone=no',
    'revisit-after': '3 days',
    rating: 'general',
    language: 'English',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
}

// ─── Global Structured Data (rendered server-side for instant crawl) ──────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    '@id': `${siteUrl}/#logo`,
    url: `${siteUrl}/icon-512x512.png`,
    width: 512,
    height: 512,
    caption: siteName,
  },
  image: { '@id': `${siteUrl}/#logo` },
  description: siteDescription,
  sameAs: [
    'https://twitter.com/onlinecalclive',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@onlinecalculator.live',
    contactType: 'customer support',
    availableLanguage: 'English',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  description: siteDescription,
  publisher: { '@id': `${siteUrl}/#organization` },
  inLanguage: 'en-US',
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search-calculator?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  applicationCategory: 'UtilitiesApplication',
  applicationSubCategory: 'Calculator',
  operatingSystem: 'Web Browser, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '15420',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'Free mortgage calculator',
    'Free BMI calculator',
    'Free scientific calculator',
    'Free loan calculator',
    'Free percentage calculator',
    '200+ free calculators',
    'No registration required',
    'Mobile-friendly interface',
    'Instant results',
    'Share calculations',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="h-full scroll-smooth">
      <head>
        {/* === Critical Resource Hints === */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />

        {/* === Google AdSense (lazy — never blocks render) === */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3793493831699803"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

        {/* === Global JSON-LD Structured Data (SSR — Googlebot reads immediately) === */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
      </head>
      <body className={`${roboto.className} h-full bg-google-bg text-google-text antialiased`}>
        <GoogleAnalytics />

        {/* Accessibility: skip-to-content link (also a ranking signal) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>

        <Header />
        <main id="main-content" role="main" aria-label="Main Content">
          {children}
        </main>
        <CalculatorFavorites />
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
