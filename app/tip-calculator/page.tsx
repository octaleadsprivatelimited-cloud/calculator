import TipCalculator from '../components/calculators/TipCalculator';

export default function TipCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Tip Calculator
        </h1>
        <TipCalculator />
      </div>
    </div>
  );
}
