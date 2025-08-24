import ConversionCalculator from '../components/calculators/ConversionCalculator';

export default function ConversionCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Conversion Calculator
        </h1>
        <ConversionCalculator />
      </div>
    </div>
  );
}
