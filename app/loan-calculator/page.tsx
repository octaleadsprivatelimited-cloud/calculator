import LoanCalculator from '../components/calculators/LoanCalculator';

export default function LoanPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <LoanCalculator />
      </div>
    </div>
  );
}
