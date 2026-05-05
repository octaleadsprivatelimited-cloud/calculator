'use client'

import { useEffect } from 'react'

interface CalculatorSchemaProps {
  name: string
  description: string
  url: string
  category: 'FinanceApplication' | 'HealthApplication' | 'EducationalApplication' | 'UtilitiesApplication'
  keywords?: string[]
  faqs?: { question: string; answer: string }[]
  howToSteps?: { name: string; text: string }[]
}

export default function CalculatorSchema({
  name,
  description,
  url,
  category,
  keywords = [],
  faqs = [],
  howToSteps = [],
}: CalculatorSchemaProps) {
  const baseUrl = 'https://onlinecalculator.live'
  const fullUrl = `${baseUrl}${url}`

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: fullUrl,
    applicationCategory: category,
    applicationSubCategory: 'Calculator',
    operatingSystem: 'Web Browser, iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: keywords.slice(0, 10),
    isPartOf: { '@type': 'WebSite', name: 'Online Calculator.live', url: baseUrl },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name, item: fullUrl },
    ],
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${fullUrl}#webpage`,
    url: fullUrl,
    name,
    description,
    isPartOf: { '@id': `${baseUrl}/#website` },
    breadcrumb: { '@id': `${fullUrl}#breadcrumb` },
    inLanguage: 'en-US',
    dateModified: new Date().toISOString(),
    potentialAction: { '@type': 'ReadAction', target: [fullUrl] },
  }

  const schemas = [softwareSchema, breadcrumbSchema, webPageSchema]

  if (faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    } as any)
  }

  if (howToSteps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use the ${name}`,
      description: `Step-by-step guide to using the free ${name} on Online Calculator.live`,
      step: howToSteps.map((step, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: step.name,
        text: step.text,
      })),
    } as any)
  }

  // Inject schemas as individual script tags into <head>
  useEffect(() => {
    schemas.forEach((schema, i) => {
      const existing = document.getElementById(`calc-schema-${i}`)
      if (existing) existing.remove()
      const script = document.createElement('script')
      script.id = `calc-schema-${i}`
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    })
    return () => {
      schemas.forEach((_, i) => {
        document.getElementById(`calc-schema-${i}`)?.remove()
      })
    }
  }, [url])

  return null
}
