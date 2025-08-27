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
    // Only run on client side
    if (typeof window === 'undefined') return

    // Update page title for better SEO
    const updatePageTitle = () => {
      try {
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
      } catch (error) {
        console.log('Safe to ignore: Error updating page title')
      }
    }

    // Update meta description
    const updateMetaDescription = () => {
      try {
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
      } catch (error) {
        console.log('Safe to ignore: Error updating meta description')
      }
    }

    // Update canonical URL
    const updateCanonical = () => {
      try {
        const canonical = document.querySelector('link[rel="canonical"]')
        if (canonical) {
          canonical.setAttribute('href', `https://onlinecalculator.live${pathname}`)
        }
      } catch (error) {
        console.log('Safe to ignore: Error updating canonical URL')
      }
    }

    // Update Open Graph tags
    const updateOpenGraph = () => {
      try {
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
      } catch (error) {
        console.log('Safe to ignore: Error updating Open Graph tags')
      }
    }

    // Update Twitter Card tags
    const updateTwitterCard = () => {
      try {
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
      } catch (error) {
        console.log('Safe to ignore: Error updating Twitter Card tags')
      }
    }

    // Track page view for analytics
    const trackPageView = () => {
      try {
        if (window.gtag) {
          window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
            page_path: pathname,
            page_title: document.title,
            page_location: window.location.href
          })
        }
      } catch (error) {
        console.log('Safe to ignore: Error tracking page view')
      }
    }

    // Execute all SEO updates safely
    updatePageTitle()
    updateMetaDescription()
    updateCanonical()
    updateOpenGraph()
    updateTwitterCard()
    trackPageView()

  }, [pathname])

  return null
}
