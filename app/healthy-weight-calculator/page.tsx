import HealthyWeightCalculator from '../components/calculators/HealthyWeightCalculator'

export default function HealthyWeightCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Healthy Weight Calculator
        </h1>
        <HealthyWeightCalculator />
      </div>
    </div>
  )
}
