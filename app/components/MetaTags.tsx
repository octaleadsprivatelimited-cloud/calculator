'use client'

import React from 'react'
import Head from 'next/head'

interface MetaTagsProps {
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
  calculatorType?: string
  ogImage?: string
}

// Generate calculator-specific keywords based on type
const getCalculatorKeywords = (type: string): string[] => {
  const baseKeywords = ['free calculator', 'online calculator', 'calculator tool']
  
  switch (type.toLowerCase()) {
    case 'mortgage':
      return [
        'mortgage calculator',
        'home loan calculator',
        'monthly payment calculator',
        'mortgage payment calculator',
        'home affordability calculator',
        'mortgage rate calculator',
        'loan calculator',
        'house payment calculator',
        'mortgage affordability',
        'home loan payment'
      ]
    
    case 'bmi':
      return [
        'BMI calculator',
        'body mass index calculator',
        'weight calculator',
        'height weight calculator',
        'BMI chart calculator',
        'body mass index',
        'weight status calculator',
        'health calculator',
        'fitness calculator',
        'body composition'
      ]
    
    case 'scientific':
      return [
        'scientific calculator',
        'advanced calculator',
        'math calculator',
        'scientific functions',
        'calculator with functions',
        'math tool',
        'scientific computing',
        'advanced math calculator',
        'function calculator',
        'scientific computation'
      ]
    
    case 'percentage':
      return [
        'percentage calculator',
        'percent calculator',
        'percentage increase calculator',
        'percentage decrease calculator',
        'percent change calculator',
        'percentage of number',
        'percent of total',
        'percentage formula',
        'percent calculation',
        'percentage math'
      ]
    
    case 'loan':
      return [
        'loan calculator',
        'personal loan calculator',
        'auto loan calculator',
        'loan payment calculator',
        'loan interest calculator',
        'loan amount calculator',
        'loan term calculator',
        'loan rate calculator',
        'debt calculator',
        'borrowing calculator'
      ]
    
    case 'investment':
      return [
        'investment calculator',
        'return on investment calculator',
        'ROI calculator',
        'investment growth calculator',
        'compound interest calculator',
        'investment return calculator',
        'profit calculator',
        'investment planning',
        'financial calculator',
        'investment analysis'
      ]
    
    case 'retirement':
      return [
        'retirement calculator',
        'retirement planning calculator',
        '401k calculator',
        'retirement savings calculator',
        'retirement income calculator',
        'retirement age calculator',
        'pension calculator',
        'retirement fund calculator',
        'retirement planning tool',
        'financial planning'
      ]
    
    case 'tax':
      return [
        'tax calculator',
        'income tax calculator',
        'tax return calculator',
        'tax bracket calculator',
        'tax withholding calculator',
        'tax deduction calculator',
        'tax credit calculator',
        'tax planning calculator',
        'tax estimation tool',
        'tax preparation'
      ]
    
    case 'concrete':
      return [
        'concrete calculator',
        'concrete volume calculator',
        'concrete yard calculator',
        'concrete mix calculator',
        'concrete cost calculator',
        'concrete slab calculator',
        'concrete foundation calculator',
        'concrete material calculator',
        'construction calculator',
        'building calculator'
      ]
    
    case 'paint':
      return [
        'paint calculator',
        'paint coverage calculator',
        'paint quantity calculator',
        'paint cost calculator',
        'room painting calculator',
        'paint area calculator',
        'paint volume calculator',
        'house painting calculator',
        'interior paint calculator',
        'exterior paint calculator'
      ]
    
    case 'flooring':
      return [
        'flooring calculator',
        'floor area calculator',
        'tile calculator',
        'carpet calculator',
        'hardwood calculator',
        'flooring cost calculator',
        'room flooring calculator',
        'floor measurement calculator',
        'flooring material calculator',
        'floor installation calculator'
      ]
    
    case 'roofing':
      return [
        'roofing calculator',
        'roof area calculator',
        'roof pitch calculator',
        'shingle calculator',
        'roofing cost calculator',
        'roof measurement calculator',
        'roofing material calculator',
        'roof square calculator',
        'roofing estimate calculator',
        'roofing project calculator'
      ]
    
    case 'electrical':
      return [
        'electrical calculator',
        'voltage calculator',
        'current calculator',
        'power calculator',
        'ohms law calculator',
        'electrical load calculator',
        'circuit calculator',
        'electrical formula calculator',
        'voltage drop calculator',
        'electrical engineering calculator'
      ]
    
    case 'time':
      return [
        'time calculator',
        'time duration calculator',
        'time difference calculator',
        'time zone calculator',
        'time conversion calculator',
        'time addition calculator',
        'time subtraction calculator',
        'time measurement calculator',
        'clock calculator',
        'time tool'
      ]
    
    case 'date':
      return [
        'date calculator',
        'date difference calculator',
        'date addition calculator',
        'date subtraction calculator',
        'calendar calculator',
        'days between dates calculator',
        'date math calculator',
        'date conversion calculator',
        'age calculator',
        'date tool'
      ]
    
    case 'conversion':
      return [
        'unit converter',
        'conversion calculator',
        'measurement converter',
        'unit conversion calculator',
        'metric converter',
        'imperial converter',
        'length converter',
        'weight converter',
        'temperature converter',
        'volume converter'
      ]
    
    case 'math':
      return [
        'math calculator',
        'mathematics calculator',
        'algebra calculator',
        'geometry calculator',
        'trigonometry calculator',
        'calculus calculator',
        'statistics calculator',
        'math formula calculator',
        'mathematical tool',
        'math computation'
      ]
    
    case 'finance':
      return [
        'financial calculator',
        'finance calculator',
        'money calculator',
        'budget calculator',
        'expense calculator',
        'income calculator',
        'financial planning calculator',
        'money management calculator',
        'financial tool',
        'finance tool'
      ]
    
    case 'health':
      return [
        'health calculator',
        'fitness calculator',
        'nutrition calculator',
        'calorie calculator',
        'body calculator',
        'health tool',
        'fitness tool',
        'wellness calculator',
        'health measurement',
        'fitness measurement'
      ]
    
    default:
      return [
        'free calculator',
        'online calculator',
        'calculator tool',
        'web calculator',
        'calculator app',
        'digital calculator',
        'calculator website',
        'calculator online',
        'free tool',
        'online tool'
      ]
  }
}

// Generate calculator-specific descriptions for page content
export const getCalculatorDescription = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'mortgage':
      return 'Our free mortgage calculator helps you estimate monthly payments, calculate total interest costs, and determine home affordability. Perfect for first-time homebuyers and refinancing decisions. Get accurate mortgage calculations with our easy-to-use tool.'
    
    case 'bmi':
      return 'Calculate your Body Mass Index (BMI) instantly with our free BMI calculator. Determine if you are underweight, normal weight, overweight, or obese based on your height and weight. Essential tool for health and fitness tracking.'
    
    case 'scientific':
      return 'Advanced scientific calculator with trigonometric functions, logarithms, exponentials, and more. Perfect for students, engineers, and professionals. Perform complex mathematical calculations with precision and ease.'
    
    case 'percentage':
      return 'Calculate percentages, percentage increases, decreases, and changes with our free percentage calculator. Essential for financial calculations, discounts, markups, and statistical analysis. Simple and accurate percentage calculations.'
    
    case 'loan':
      return 'Calculate loan payments, interest costs, and loan terms with our comprehensive loan calculator. Supports personal loans, auto loans, and business loans. Plan your borrowing with accurate payment estimates and total cost calculations.'
    
    case 'investment':
      return 'Plan your investments with our ROI calculator and investment growth tools. Calculate compound interest, investment returns, and future values. Make informed investment decisions with our free financial planning calculators.'
    
    case 'retirement':
      return 'Plan your retirement with our comprehensive retirement calculator. Estimate retirement savings needs, calculate 401k growth, and determine retirement income requirements. Secure your financial future with accurate retirement planning.'
    
    case 'tax':
      return 'Calculate income taxes, estimate tax returns, and plan your tax strategy with our free tax calculator. Determine tax brackets, calculate deductions, and estimate your tax liability. Essential tool for tax planning and preparation.'
    
    case 'concrete':
      return 'Calculate concrete volume, cost, and material requirements for your construction projects. Perfect for concrete slabs, foundations, and structural elements. Get accurate estimates for concrete projects with our construction calculator.'
    
    case 'paint':
      return 'Calculate paint coverage, quantity, and cost for your painting projects. Determine how much paint you need for rooms, walls, and exterior surfaces. Plan your painting projects efficiently with our paint calculator.'
    
    case 'flooring':
      return 'Calculate flooring area, material requirements, and installation costs. Perfect for tile, carpet, hardwood, and laminate flooring projects. Get accurate estimates for your flooring installation with our comprehensive calculator.'
    
    case 'roofing':
      return 'Calculate roof area, pitch, and material requirements for roofing projects. Estimate shingle needs, roofing costs, and project requirements. Plan your roofing projects with precision using our roofing calculator.'
    
    case 'electrical':
      return 'Calculate voltage, current, power, and electrical loads with our electrical calculator. Perfect for electrical engineering, circuit design, and electrical planning. Perform accurate electrical calculations with our professional tools.'
    
    case 'time':
      return 'Calculate time differences, durations, and conversions with our time calculator. Perfect for scheduling, project planning, and time management. Convert between time zones and calculate time intervals accurately.'
    
    case 'date':
      return 'Calculate date differences, add or subtract days, and perform date calculations with our date calculator. Perfect for planning, scheduling, and date-based calculations. Essential tool for project management and planning.'
    
    case 'conversion':
      return 'Convert between different units of measurement with our comprehensive unit converter. Support for length, weight, volume, temperature, and more. Accurate conversions between metric and imperial units for global use.'
    
    case 'math':
      return 'Perform mathematical calculations with our advanced math calculator. Support for algebra, geometry, trigonometry, calculus, and statistics. Essential tool for students, professionals, and mathematical problem solving.'
    
    case 'finance':
      return 'Manage your finances with our comprehensive financial calculators. Budget planning, expense tracking, income analysis, and financial planning tools. Make informed financial decisions with our free financial calculators.'
    
    case 'health':
      return 'Track your health and fitness with our health calculators. BMI, calorie counting, nutrition analysis, and fitness tracking tools. Monitor your wellness journey with accurate health calculations and measurements.'
    
    default:
      return 'Free online calculator for accurate calculations. Easy to use, reliable, and perfect for everyday calculations. Get instant results with our user-friendly calculator tool.'
  }
}

export default function MetaTags({
  title,
  description,
  keywords,
  canonicalUrl,
  calculatorType = 'Calculator',
  ogImage = '/og-image.jpg'
}: MetaTagsProps) {
  const fullTitle = `${title} - Free Online ${calculatorType} | Online Calculator.live`
  const fullDescription = `${description} Use our free online ${calculatorType.toLowerCase()} for accurate calculations.`
  const calculatorKeywords = getCalculatorKeywords(calculatorType)
  const allKeywords = [...calculatorKeywords, ...keywords]
  const pageDescription = getCalculatorDescription(calculatorType)

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords.join(', ')} />
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
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      
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
