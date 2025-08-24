import CalculatorComparison from '../components/CalculatorComparison'

export const metadata = {
  title: 'Compare Calculators - Side by Side Analysis | Calculator.net',
  description: 'Compare up to 4 calculators side by side. Analyze features, pros, cons, and find the perfect tool for your needs with our comprehensive comparison tool.',
  keywords: ['calculator comparison', 'compare calculators', 'calculator features', 'calculator analysis', 'tool comparison'],
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CalculatorComparison />
    </div>
  )
}
