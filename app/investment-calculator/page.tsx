import InvestmentCalculator from '../components/calculators/InvestmentCalculator';

export default function InvestmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Investment Calculator
        </h1>
        <InvestmentCalculator />
      </div>
    </div>
  );
}
