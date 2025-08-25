import CalculatorSearch from '../components/CalculatorSearch'

export const metadata = {
  title: 'Search Calculators - Find the Right Tool | Online Calculator.live',
  description: 'Search through our collection of 40+ calculators. Filter by category, tags, or search by name to find the perfect calculator for your needs.',
  keywords: ['calculator search', 'find calculator', 'calculator directory', 'calculator categories', 'online calculators'],
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CalculatorSearch />
    </div>
  )
}
