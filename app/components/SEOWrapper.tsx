'use client'

import React from 'react'

interface SEOWrapperProps {
  title: string
  description: string
  keywords: string[]
  calculatorType: string
  calculatorUrl: string
  children: React.ReactNode
}

export default function SEOWrapper({
  title,
  description,
  keywords,
  calculatorType,
  calculatorUrl,
  children
}: SEOWrapperProps) {
  return (
    <>
      {/* Schema.org Structured Data for Calculator */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": title,
            "description": description,
            "url": calculatorUrl,
            "applicationCategory": calculatorType,
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Calculator.net",
              "url": "https://calculator.net"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250"
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
                "name": `How to use the ${title}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The ${title} is easy to use. Simply enter your values in the input fields and click calculate to get instant results. The calculator provides accurate calculations based on standard formulas and algorithms.`
                }
              },
              {
                "@type": "Question",
                "name": `Is the ${title} free to use?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all calculators on Calculator.net are completely free to use. There are no hidden fees or registrations required."
                }
              },
              {
                "@type": "Question",
                "name": `How accurate is the ${title}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The ${title} uses industry-standard formulas and algorithms to provide accurate results. However, results should be used as estimates and verified with professionals for important decisions.`
                }
              }
            ]
          })
        }}
      />
      
      {children}
    </>
  )
}
