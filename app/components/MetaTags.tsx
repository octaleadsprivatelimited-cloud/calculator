'use client'

import React from 'react'
import Head from 'next/head'

interface MetaTagsProps {
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
  ogImage?: string
  calculatorType?: string
}

export default function MetaTags({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/og-image.jpg',
  calculatorType = 'Calculator'
}: MetaTagsProps) {
  const fullTitle = `${title} - Free Online ${calculatorType} | Online Calculator.live`
  const fullDescription = `${description} Use our free online ${calculatorType.toLowerCase()} for accurate calculations.`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Online Calculator.live" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Online Calculator.live" />
      <meta property="og:image" content="/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content="/og-image.jpg" />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Mobile App */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Online Calculator.live" />
      <meta name="application-name" content="Online Calculator.live" />
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Additional Meta */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": `${title} Calculator`,
            "description": fullDescription,
            "url": canonicalUrl,
            "applicationCategory": "CalculatorApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Online Calculator.live",
              "url": "https://onlinecalculator.live"
            }
          })
        }}
      />
    </>
  )
}
