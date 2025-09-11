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
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scientific Calculator
          </h1>
        </div>
        <ScientificCalculator />
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Scientific Calculator
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Our scientific calculator provides advanced mathematical functions beyond basic arithmetic. 
              It's designed for students, engineers, scientists, and anyone who needs to perform 
              complex mathematical calculations.
            </p>
            <h3 className="text-xl font-semibold mb-2">Key Functions:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Trigonometry:</strong> Sine, cosine, tangent, and their inverses</li>
              <li><strong>Logarithms:</strong> Natural log (ln) and common log (log)</li>
              <li><strong>Exponentials:</strong> e^x, 10^x, and power functions</li>
              <li><strong>Memory Functions:</strong> Store and recall values</li>
              <li><strong>Parentheses:</strong> Complex expression evaluation</li>
              <li><strong>Constants:</strong> π (pi), e (Euler's number)</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Perfect For:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>High school and college mathematics</li>
              <li>Engineering calculations and design</li>
              <li>Scientific research and analysis</li>
              <li>Financial calculations with complex formulas</li>
              <li>Statistical analysis and probability</li>
              <li>Physics and chemistry computations</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Usage Tips:</h3>
            <ul className="list-disc pl-6">
              <li>Use parentheses to group operations correctly</li>
              <li>Check your angle mode (degrees vs. radians)</li>
              <li>Clear memory when starting new calculations</li>
              <li>Double-check complex expressions before calculating</li>
              <li>Use the history feature to review previous calculations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
