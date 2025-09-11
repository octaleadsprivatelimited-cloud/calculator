import { Metadata } from 'next'
import SIPCalculator from '../components/calculators/SIPCalculator'

export const metadata: Metadata = {
  title: 'Free SIP Calculator - Calculate Systematic Investment Plan Returns | Online Calculator.live',
  description: 'Calculate your SIP returns with our free SIP calculator. Plan your systematic investment plan with accurate projections, yearly breakdown, and compound interest calculations.',
  keywords: 'SIP calculator,systematic investment plan,investment calculator,compound interest calculator,mutual fund calculator,investment planning,financial planning',
  authors: [{ name: 'Online Calculator.live Team' }],
  creator: 'Online Calculator.live',
  publisher: 'Online Calculator.live',
  robots: 'index, follow',
  openGraph: {
    title: 'Free SIP Calculator - Calculate Systematic Investment Plan Returns',
    description: 'Calculate your SIP returns with our free SIP calculator. Plan your systematic investment plan with accurate projections and yearly breakdown.',
    url: 'https://onlinecalculator.live/sip-calculator',
    siteName: 'Online Calculator.live',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SIP Calculator - Calculate Systematic Investment Plan Returns',
    description: 'Calculate your SIP returns with our free SIP calculator. Plan your systematic investment plan with accurate projections and yearly breakdown.',
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/sip-calculator',
  },
}

export default function SIPCalculatorPage() {
  return <SIPCalculator />
}
