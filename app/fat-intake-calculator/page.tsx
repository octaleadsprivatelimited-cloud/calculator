import FatIntakeCalculator from '../components/calculators/FatIntakeCalculator'

export default function FatIntakeCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Fat Intake Calculator
        </h1>
        <FatIntakeCalculator />
      </div>
    </div>
  )
}
