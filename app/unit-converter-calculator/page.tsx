import { Metadata } from 'next'
import UnitConverterCalculator from '../components/calculators/UnitConverterCalculator';

export const metadata: Metadata = {
  title: 'Unit Converter Calculator - Convert Between Units Online | Online Calculator.live',
  description: 'Free online unit converter calculator. Convert between length, weight, temperature, area, volume, speed, and more. Comprehensive conversion tool for students, professionals, and everyday use.',
  keywords: ['unit converter calculator', 'unit conversion', 'length converter', 'weight converter', 'temperature converter', 'area converter', 'volume converter'],
  openGraph: {
    title: 'Unit Converter Calculator - Convert Between Units Online | Online Calculator.live',
    description: 'Free online unit converter calculator. Convert between length, weight, temperature, area, volume, speed, and more. Comprehensive conversion tool for students, professionals, and everyday use.',
    url: 'https://onlinecalculator.live/unit-converter-calculator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Unit Converter Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unit Converter Calculator - Convert Between Units Online | Online Calculator.live',
    description: 'Free online unit converter calculator. Convert between length, weight, temperature, area, volume, speed, and more. Comprehensive conversion tool for students, professionals, and everyday use.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/unit-converter-calculator',
  },
}

export default function UnitConverterCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unit Converter Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Convert between different units of measurement quickly and accurately
          </p>
        </div>
        <UnitConverterCalculator />
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Unit Conversion
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Unit conversion is the process of changing a quantity from one unit of measurement 
              to another. This is essential in many fields including science, engineering, 
              cooking, travel, and everyday calculations.
            </p>
            <h3 className="text-xl font-semibold mb-2">Common Conversion Categories:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Length:</strong> Meters, feet, inches, kilometers, miles, yards</li>
              <li><strong>Weight/Mass:</strong> Kilograms, pounds, ounces, grams, tons</li>
              <li><strong>Temperature:</strong> Celsius, Fahrenheit, Kelvin</li>
              <li><strong>Area:</strong> Square meters, square feet, acres, hectares</li>
              <li><strong>Volume:</strong> Liters, gallons, cubic meters, cubic feet</li>
              <li><strong>Speed:</strong> Miles per hour, kilometers per hour, meters per second</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Why Unit Conversion Matters:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>International communication and trade</li>
              <li>Scientific research and publications</li>
              <li>Engineering and construction projects</li>
              <li>Travel and navigation</li>
              <li>Cooking and recipe adjustments</li>
              <li>Educational purposes and learning</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Conversion Tips:</h3>
            <ul className="list-disc pl-6">
              <li>Always verify the conversion factor you're using</li>
              <li>Pay attention to significant figures and precision</li>
              <li>Use dimensional analysis for complex conversions</li>
              <li>Double-check your results, especially for critical applications</li>
              <li>Consider the context and appropriate precision needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
