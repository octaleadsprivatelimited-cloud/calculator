import { Metadata } from 'next'
import EngineHorsepowerCalculator from '../components/calculators/EngineHorsepowerCalculator';

export const metadata: Metadata = {
  title: 'Engine Horsepower Calculator - Calculate Engine Power | Online Calculator.live',
  description: 'Calculate engine horsepower using torque and RPM. Free online engine power calculator for automotive enthusiasts, mechanics, and engineers. Convert between different power units.',
  keywords: ['engine horsepower calculator', 'horsepower calculation', 'engine power calculator', 'torque to horsepower', 'automotive calculator', 'engine performance'],
  openGraph: {
    title: 'Engine Horsepower Calculator - Calculate Engine Power | Online Calculator.live',
    description: 'Calculate engine horsepower using torque and RPM. Free online engine power calculator for automotive enthusiasts, mechanics, and engineers. Convert between different power units.',
    url: 'https://onlinecalculator.live/engine-horsepower-calculator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Engine Horsepower Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engine Horsepower Calculator - Calculate Engine Power | Online Calculator.live',
    description: 'Calculate engine horsepower using torque and RPM. Free online engine power calculator for automotive enthusiasts, mechanics, and engineers. Convert between different power units.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/engine-horsepower-calculator',
  },
}

export default function EngineHorsepowerCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Engine Horsepower Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate engine horsepower using torque and RPM measurements
          </p>
        </div>
        <EngineHorsepowerCalculator />
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Engine Horsepower
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Horsepower is a unit of measurement for engine power that indicates how much work 
              an engine can perform over time. It's a crucial metric for understanding engine performance.
            </p>
            <h3 className="text-xl font-semibold mb-2">Horsepower Formula:</h3>
            <p className="mb-4 font-mono bg-gray-100 p-3 rounded">
              Horsepower = (Torque × RPM) ÷ 5,252
            </p>
            <h3 className="text-xl font-semibold mb-2">Key Concepts:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Torque:</strong> Rotational force measured in pound-feet (lb-ft) or Newton-meters (Nm)</li>
              <li><strong>RPM:</strong> Revolutions per minute - how fast the engine is spinning</li>
              <li><strong>Horsepower:</strong> Power output that determines acceleration and top speed</li>
              <li><strong>Power Curve:</strong> How horsepower changes across the RPM range</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Common Applications:</h3>
            <ul className="list-disc pl-6">
              <li>Automotive performance analysis</li>
              <li>Engine tuning and modifications</li>
              <li>Vehicle comparison and selection</li>
              <li>Racing and performance optimization</li>
              <li>Engine design and engineering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
