import PageCalculator from './components/PageCalculator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Online Calculators - Math, Finance, Health, Construction & More',
  description:
    'Explore 200+ free online calculators: mortgage, BMI, scientific, loan, percentage, investment, and more. No registration needed — instant, accurate results on any device.',
  alternates: { canonical: 'https://onlinecalculator.live' },
  openGraph: {
    title: 'Free Online Calculators — 200+ Tools | Online Calculator.live',
    description:
      'Mortgage, BMI, loan, scientific, investment, percentage, and 200+ more free calculators. Instant results. No sign-up required.',
    url: 'https://onlinecalculator.live',
    siteName: 'Online Calculator.live',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Online Calculator.live — Free Online Calculators' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Calculators — 200+ Tools | Online Calculator.live',
    description: 'Mortgage, BMI, loan, scientific, investment, percentage, and 200+ more free calculators.',
    images: ['/og-image.jpg'],
  },
}

const baseUrl = 'https://onlinecalculator.live'

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Free Online Calculators',
  description: 'Comprehensive collection of 200+ free online calculators',
  numberOfItems: 200,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Mortgage Calculator', url: `${baseUrl}/mortgage-calculator`, description: 'Calculate monthly mortgage payments, total interest, and amortization schedule' },
    { '@type': 'ListItem', position: 2, name: 'BMI Calculator', url: `${baseUrl}/bmi-calculator`, description: 'Calculate Body Mass Index and understand your health category' },
    { '@type': 'ListItem', position: 3, name: 'Scientific Calculator', url: `${baseUrl}/scientific-calculator`, description: 'Advanced scientific functions including trigonometry, logarithms, and more' },
    { '@type': 'ListItem', position: 4, name: 'Loan Calculator', url: `${baseUrl}/loan-calculator`, description: 'Calculate monthly loan payments, total interest, and payoff schedule' },
    { '@type': 'ListItem', position: 5, name: 'Percentage Calculator', url: `${baseUrl}/percentage-calculator`, description: 'Calculate percentages, percent change, and percent of a number' },
    { '@type': 'ListItem', position: 6, name: 'Compound Interest Calculator', url: `${baseUrl}/compound-interest-calculator`, description: 'Calculate compound interest and investment growth over time' },
    { '@type': 'ListItem', position: 7, name: 'Calorie Calculator', url: `${baseUrl}/calorie-calculator`, description: 'Calculate daily calorie needs based on age, weight, height, and activity' },
    { '@type': 'ListItem', position: 8, name: 'Age Calculator', url: `${baseUrl}/age-calculator`, description: 'Calculate exact age in years, months, and days' },
    { '@type': 'ListItem', position: 9, name: 'GPA Calculator', url: `${baseUrl}/gpa-calculator`, description: 'Calculate your GPA from grades and credit hours' },
    { '@type': 'ListItem', position: 10, name: 'Retirement Calculator', url: `${baseUrl}/retirement-calculator`, description: 'Plan your retirement savings and estimate future wealth' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What calculators are available on Online Calculator.live?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Online Calculator.live offers 200+ free calculators including mortgage, loan, BMI, calorie, scientific, percentage, compound interest, GPA, retirement, age, tip, tax, investment, body fat, pregnancy, and many more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are all calculators on Online Calculator.live free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, every calculator on Online Calculator.live is 100% free. No registration, no subscription, and no hidden fees — ever.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate are the calculator results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All calculators use verified mathematical formulas and industry-standard calculations. Results are highly accurate and suitable for everyday use. For major financial or medical decisions, consult a professional.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Online Calculator.live on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Online Calculator.live is fully responsive and optimized for all devices including smartphones, tablets, and desktops, with touch-friendly interfaces.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account to use the calculators?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account or registration is required. All 200+ calculators are instantly accessible to everyone, for free.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the most popular calculator on the site?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most popular calculators include the Mortgage Calculator, BMI Calculator, Compound Interest Calculator, Loan Calculator, and Scientific Calculator.',
      },
    },
  ],
}

const siteNavSchema = {
  '@context': 'https://schema.org',
  '@type': 'SiteNavigationElement',
  name: ['Financial Calculators', 'Health Calculators', 'Math Calculators', 'Construction Calculators', 'Time & Date Calculators'],
  url: [
    `${baseUrl}/mortgage-calculator`,
    `${baseUrl}/bmi-calculator`,
    `${baseUrl}/scientific-calculator`,
    `${baseUrl}/concrete-calculator`,
    `${baseUrl}/date-calculator`,
  ],
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavSchema) }} />
      <PageCalculator />
    </>
  )
}
