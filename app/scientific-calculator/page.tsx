import { Metadata } from 'next'
import ScientificCalculator from '../components/calculators/ScientificCalculator';

export const metadata: Metadata = {
  title: 'Scientific Calculator - Advanced Math Functions Online | Online Calculator.live',
  description: 'Free online scientific calculator with advanced mathematical functions. Perform complex calculations, trigonometry, logarithms, exponentials, and more. Perfect for students, engineers, and professionals.',
  keywords: ['scientific calculator', 'advanced calculator', 'math calculator', 'trigonometry calculator', 'logarithm calculator', 'engineering calculator'],
  openGraph: {
    title: 'Scientific Calculator - Advanced Math Functions Online | Online Calculator.live',
    description: 'Free online scientific calculator with advanced mathematical functions. Perform complex calculations, trigonometry, logarithms, exponentials, and more. Perfect for students, engineers, and professionals.',
    url: 'https://onlinecalculator.live/scientific-calculator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Scientific Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scientific Calculator - Advanced Math Functions Online | Online Calculator.live',
    description: 'Free online scientific calculator with advanced mathematical functions. Perform complex calculations, trigonometry, logarithms, exponentials, and more. Perfect for students, engineers, and professionals.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/scientific-calculator',
  },
}

export default function ScientificCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scientific Calculator
          </h1>
        </div>
        <ScientificCalculator />
      </div>
    </div>
  );
}
