import BodySurfaceAreaCalculator from '../components/calculators/BodySurfaceAreaCalculator'

export default function BodySurfaceAreaCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Body Surface Area Calculator
        </h1>
        <BodySurfaceAreaCalculator />
      </div>
    </div>
  )
}
