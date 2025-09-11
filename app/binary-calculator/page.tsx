import BinaryCalculator from '../components/calculators/BinaryCalculator'
import CalculatorWithAds from '../components/CalculatorWithAds'

export default function BinaryCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CalculatorWithAds>
        <BinaryCalculator />
      </CalculatorWithAds>
    </div>
  );
}