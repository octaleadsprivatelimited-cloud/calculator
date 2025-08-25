import CalculatorComparison from '../components/CalculatorComparison'

export const metadata = {
  title: 'Compare Calculators - Side by Side Analysis | Online Calculator.live',
  description: 'Compare different calculators side by side to find the best tool for your needs. Analyze features, accuracy, and ease of use.',
  keywords: ['compare calculators', 'calculator comparison', 'best calculator', 'calculator analysis', 'online calculators'],
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CalculatorComparison />
    </div>
  )
}
