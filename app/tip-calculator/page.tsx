import { Metadata } from 'next'
import TipCalculator from '../components/calculators/TipCalculator';

export const metadata: Metadata = {
  title: 'Tip Calculator - Calculate Tips and Split Bills | Online Calculator.live',
  description: 'Free tip calculator to calculate gratuity, split bills, and determine total amounts. Perfect for restaurants, services, and group dining. Calculate tips by percentage or amount.',
  keywords: ['tip calculator', 'gratuity calculator', 'bill splitter', 'restaurant tip calculator', 'service tip calculator', 'bill calculator'],
  openGraph: {
    title: 'Tip Calculator - Calculate Tips and Split Bills | Online Calculator.live',
    description: 'Free tip calculator to calculate gratuity, split bills, and determine total amounts. Perfect for restaurants, services, and group dining. Calculate tips by percentage or amount.',
    url: 'https://onlinecalculator.live/tip-calculator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tip Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tip Calculator - Calculate Tips and Split Bills | Online Calculator.live',
    description: 'Free tip calculator to calculate gratuity, split bills, and determine total amounts. Perfect for restaurants, services, and group dining. Calculate tips by percentage or amount.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/tip-calculator',
  },
}

export default function TipCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tip Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate tips, split bills, and determine total amounts for services and dining
          </p>
        </div>
        <TipCalculator />
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Tip Calculation
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Tipping is a customary practice in many countries to show appreciation for good service. 
              Our tip calculator helps you determine appropriate gratuity amounts and split bills 
              among multiple people.
            </p>
            <h3 className="text-xl font-semibold mb-2">Standard Tip Percentages:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Restaurants:</strong> 15-20% of pre-tax bill</li>
              <li><strong>Bars:</strong> $1-2 per drink or 15-20% of total</li>
              <li><strong>Taxi/Rideshare:</strong> 15-20% of fare</li>
              <li><strong>Hair Salons:</strong> 15-20% of service cost</li>
              <li><strong>Hotel Staff:</strong> $2-5 per night for housekeeping</li>
              <li><strong>Food Delivery:</strong> 15-20% of order total</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Tip Calculation Formula:</h3>
            <p className="mb-4 font-mono bg-gray-100 p-3 rounded">
              Tip Amount = Bill Amount × Tip Percentage
              Total Amount = Bill Amount + Tip Amount
            </p>
            <h3 className="text-xl font-semibold mb-2">When to Adjust Tips:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Increase tip for:</strong> Exceptional service, large groups, special requests</li>
              <li><strong>Decrease tip for:</strong> Poor service, long wait times, mistakes</li>
              <li><strong>Consider factors:</strong> Service quality, restaurant type, location</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Bill Splitting Tips:</h3>
            <ul className="list-disc pl-6">
              <li>Calculate tip on the total bill before splitting</li>
              <li>Consider individual orders vs. shared items</li>
              <li>Use apps or calculators for complex splits</li>
              <li>Communicate clearly about how the bill will be divided</li>
              <li>Round up for convenience when splitting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
