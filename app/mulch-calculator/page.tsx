import MulchCalculator from '../components/calculators/MulchCalculator';

export default function MulchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Mulch Calculator
        </h1>
        <MulchCalculator />
      </div>
    </div>
  );
}
