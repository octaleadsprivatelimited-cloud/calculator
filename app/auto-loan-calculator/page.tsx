import AutoLoanCalculator from '../components/calculators/AutoLoanCalculator';

export default function AutoLoanPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <AutoLoanCalculator />
      </div>
    </div>
  );
}
