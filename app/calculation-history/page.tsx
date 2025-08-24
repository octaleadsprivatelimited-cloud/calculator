import CalculatorHistory from '../components/CalculatorHistory'

export const metadata = {
  title: 'Calculation History - Track Your Calculator Usage | Calculator.net',
  description: 'Review your calculation history, track usage patterns, and analyze your calculator usage with detailed records and export capabilities.',
  keywords: ['calculation history', 'calculator usage', 'calculation records', 'usage tracking', 'calculation export'],
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CalculatorHistory />
    </div>
  )
}
