import VolumeCalculator from '../components/calculators/VolumeCalculator';

export default function VolumePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <VolumeCalculator />
      </div>
    </div>
  );
}
