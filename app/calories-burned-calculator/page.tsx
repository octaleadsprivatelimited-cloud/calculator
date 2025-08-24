import CaloriesBurnedCalculator from '../components/calculators/CaloriesBurnedCalculator'

export default function CaloriesBurnedCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Calories Burned Calculator
        </h1>
        <CaloriesBurnedCalculator />
      </div>
    </div>
  )
}
