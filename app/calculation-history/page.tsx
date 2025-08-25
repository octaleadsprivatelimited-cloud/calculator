import CalculatorHistory from '../components/CalculatorHistory'

export const metadata = {
  title: 'Calculation History - Track Your Calculator Usage | Online Calculator.live',
  description: 'View your calculation history and track your usage patterns. Monitor your most used calculators and improve your productivity.',
  keywords: ['calculation history', 'calculator usage', 'track calculations', 'calculator history', 'online calculators'],
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CalculatorHistory />
    </div>
  )
}
