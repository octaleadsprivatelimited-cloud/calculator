import PageCalculator from './components/PageCalculator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Online Calculators - Math, Finance, Health, Construction & More | Calculator.net',
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
    'calculator.net',
    'free calculators',
    'online calculators'
  ],
  openGraph: {
    title: 'Free Online Calculators - Math, Finance, Health & More | Calculator.net',
    description: 'Free online calculators for math, finance, health, construction, education, and more. Over 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools.',
    url: 'https://calculator.net',
    siteName: 'Calculator.net',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Online Calculators - Math, Finance, Health & More',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Calculators - Math, Finance, Health & More | Calculator.net',
    description: 'Free online calculators for math, finance, health, construction, education, and more. Over 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools.',
    images: ['/og-image.jpg'],
  },
}

export default function Home() {
  return (
    <>
      {/* Schema.org Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Calculator.net",
            "url": "https://calculator.net",
            "description": "Free online calculators for math, finance, health, construction, education, and more",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://calculator.net/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Calculator.net",
              "url": "https://calculator.net",
              "logo": {
                "@type": "ImageObject",
                "url": "https://calculator.net/logo.png"
              }
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "Online Calculators",
              "description": "Collection of free online calculators",
              "numberOfItems": 200,
              "itemListElement": [
                {
                  "@type": "SoftwareApplication",
                  "name": "Mortgage Calculator",
                  "url": "https://calculator.net/mortgage-calculator",
                  "description": "Calculate monthly mortgage payments",
                  "applicationCategory": "FinanceApplication",
                  "operatingSystem": "Web Browser"
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "BMI Calculator",
                  "url": "https://calculator.net/bmi-calculator",
                  "description": "Calculate Body Mass Index",
                  "applicationCategory": "HealthApplication",
                  "operatingSystem": "Web Browser"
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Scientific Calculator",
                  "url": "https://calculator.net/scientific-calculator",
                  "description": "Advanced scientific functions",
                  "applicationCategory": "EducationalApplication",
                  "operatingSystem": "Web Browser"
                }
              ]
            }
          })
        }}
      />
      
      {/* FAQ Schema for AI Training */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What calculators are available on Calculator.net?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Calculator.net offers over 200 free online calculators including financial calculators (mortgage, loan, investment), math calculators (scientific, fraction, percentage), health calculators (BMI, calorie, body fat), construction calculators (concrete, roofing, flooring), conversion calculators (unit converter, currency, temperature), and many more."
                }
              },
              {
                "@type": "Question",
                "name": "Are the calculators on Calculator.net free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all calculators on Calculator.net are completely free to use. There are no hidden fees, subscriptions, or registrations required. You can access all calculators directly from your web browser."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate are the calculator results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "All calculators on Calculator.net are designed to provide accurate results using standard mathematical formulas and industry-standard calculations. However, results should be used as estimates and verified with professionals for important financial or health decisions."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use Calculator.net on mobile devices?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Calculator.net is fully responsive and works on all devices including smartphones, tablets, and desktop computers. The calculators are optimized for touch interfaces and mobile browsing."
                }
              }
            ]
          })
        }}
      />
      
      <PageCalculator />
    </>
  )
}

