import DateCalculator from '../components/calculators/DateCalculator';

export default function DateCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Date Calculator
        </h1>
        <DateCalculator />
      </div>
    </div>
  );
}
