'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: any
  }
}

export default function SEOOptimizer() {
  const pathname = usePathname()

  useEffect(() => {
    // Update page title for better SEO
    const updatePageTitle = () => {
      const currentPath = pathname
      let pageTitle = 'Online Calculator.live'
      
      // Dynamic page titles based on route
      if (currentPath === '/') {
        pageTitle = 'Free Online Calculators - Math, Finance, Health & More | Online Calculator.live'
      } else if (currentPath.includes('calculator')) {
        const calculatorName = currentPath
          .split('/')
          .pop()
          ?.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        if (calculatorName) {
          pageTitle = `${calculatorName} - Free Online Calculator | Online Calculator.live`
        }
      }
      
      document.title = pageTitle
    }

    // Update meta description
    const updateMetaDescription = () => {
      const currentPath = pathname
      let description = 'Free online calculators for math, finance, health, construction, education, and more.'
      
      if (currentPath.includes('calculator')) {
        const calculatorName = currentPath
          .split('/')
          .pop()
          ?.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        if (calculatorName) {
          description = `Free online ${calculatorName.toLowerCase()} calculator. Fast, accurate, and easy to use. Calculate ${calculatorName.toLowerCase()} instantly with our free online tool.`
        }
      }
      
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', description)
      }
    }

    // Update canonical URL
    const updateCanonical = () => {
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', `https://onlinecalculator.live${pathname}`)
      }
    }

    // Update Open Graph tags
    const updateOpenGraph = () => {
      const currentPath = pathname
      let title = 'Free Online Calculators - Math, Finance, Health & More | Online Calculator.live'
      let description = 'Free online calculators for math, finance, health, construction, education, and more.'
      
      if (currentPath.includes('calculator')) {
        const calculatorName = currentPath
          .split('/')
          .pop()
          ?.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        if (calculatorName) {
          title = `${calculatorName} - Free Online Calculator | Online Calculator.live`
          description = `Free online ${calculatorName.toLowerCase()} calculator. Fast, accurate, and easy to use.`
        }
      }
      
      // Update OG title
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', title)
      }
      
      // Update OG description
      const ogDescription = document.querySelector('meta[property="og:description"]')
      if (ogDescription) {
        ogDescription.setAttribute('content', description)
      }
      
      // Update OG URL
      const ogUrl = document.querySelector('meta[property="og:url"]')
      if (ogUrl) {
        ogUrl.setAttribute('content', `https://onlinecalculator.live${pathname}`)
      }
    }

    // Update Twitter Card tags
    const updateTwitterCard = () => {
      const currentPath = pathname
      let title = 'Free Online Calculators - Math, Finance, Health & More | Online Calculator.live'
      let description = 'Free online calculators for math, finance, health, construction, education, and more.'
      
      if (currentPath.includes('calculator')) {
        const calculatorName = currentPath
          .split('/')
          .pop()
          ?.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        if (calculatorName) {
          title = `${calculatorName} - Free Online Calculator | Online Calculator.live`
          description = `Free online ${calculatorName.toLowerCase()} calculator. Fast, accurate, and easy to use.`
        }
      }
      
      // Update Twitter title
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) {
        twitterTitle.setAttribute('content', title)
      }
      
      // Update Twitter description
      const twitterDescription = document.querySelector('meta[name="twitter:description"]')
      if (twitterDescription) {
        twitterDescription.setAttribute('content', description)
      }
    }

    // Execute all SEO updates
    updatePageTitle()
    updateMetaDescription()
    updateCanonical()
    updateOpenGraph()
    updateTwitterCard()

    // Track page view for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href
      })
    }

    // Add structured data for better search results
    const addStructuredData = () => {
      const currentPath = pathname
      let structuredData: any = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Online Calculator.live",
        "url": "https://onlinecalculator.live",
        "description": "Free online calculators for math, finance, health, construction, education, and more",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://onlinecalculator.live/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }

      if (currentPath.includes('calculator')) {
        const calculatorName = currentPath
          .split('/')
          .pop()
          ?.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        if (calculatorName) {
          structuredData = {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": `${calculatorName} Calculator`,
            "description": `Free online ${calculatorName.toLowerCase()} calculator. Fast, accurate, and easy to use.`,
            "url": `https://onlinecalculator.live${pathname}`,
            "applicationCategory": "CalculatorApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "provider": {
              "@type": "Organization",
              "name": "Online Calculator.live",
              "url": "https://onlinecalculator.live"
            }
          }
        }
      }

      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        existingScript.remove()
      }

      // Add new structured data
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }

    addStructuredData()

  }, [pathname])

  return null
}
