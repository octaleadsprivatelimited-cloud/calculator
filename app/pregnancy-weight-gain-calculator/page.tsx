import PregnancyWeightGainCalculator from '../components/calculators/PregnancyWeightGainCalculator'

export default function PregnancyWeightGainCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Pregnancy Weight Gain Calculator
        </h1>
        <PregnancyWeightGainCalculator />
      </div>
    </div>
  )
}
