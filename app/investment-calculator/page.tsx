import InvestmentCalculator from '../components/calculators/InvestmentCalculator';

export default function InvestmentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <InvestmentCalculator />
      </div>
    </div>
  );
}
