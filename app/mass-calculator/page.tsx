import MassCalculator from '../components/calculators/MassCalculator';

export default function MassCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Mass Calculator
        </h1>
        <MassCalculator />
      </div>
    </div>
  );
}
