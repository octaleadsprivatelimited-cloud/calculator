import { Metadata } from 'next'
import WeightWatchersPointsCalculator from '../components/calculators/WeightWatchersPointsCalculator'

export const metadata: Metadata = {
  title: 'Weight Watchers Points Calculator - Calculate SmartPoints for Food',
  description: 'Calculate Weight Watchers SmartPoints for any food item. Enter calories, saturated fat, sugar, protein, and fiber to get accurate points calculation.',
  keywords: 'weight watchers, smartpoints, points calculator, food points, diet calculator, weight loss',
  openGraph: {
    title: 'Weight Watchers Points Calculator',
    description: 'Calculate Weight Watchers SmartPoints for any food item with our free online calculator.',
    url: 'https://calculator.net/weight-watchers-points-calculator',
    siteName: 'Calculator.net',
    images: [
      {
        url: 'https://calculator.net/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Weight Watchers Points Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weight Watchers Points Calculator',
    description: 'Calculate Weight Watchers SmartPoints for any food item with our free online calculator.',
    images: ['https://calculator.net/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://calculator.net/weight-watchers-points-calculator',
  },
}

export default function WeightWatchersPointsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Weight Watchers Points Calculator
            </h1>
            <p className="text-lg text-gray-600">
              Calculate SmartPoints for any food item using the official Weight Watchers formula
            </p>
          </div>
          
          <WeightWatchersPointsCalculator />
          
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About Weight Watchers SmartPoints
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="mb-4">
                Weight Watchers SmartPoints is a simplified way to track your daily food intake. 
                The system assigns points to foods based on calories, saturated fat, sugar, protein, and fiber content.
              </p>
              <h3 className="text-xl font-semibold mb-2">How SmartPoints Work:</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Calories:</strong> Higher calorie foods have more points</li>
                <li><strong>Saturated Fat:</strong> Foods high in saturated fat increase points</li>
                <li><strong>Sugar:</strong> Added sugars contribute to higher points</li>
                <li><strong>Protein:</strong> Protein can reduce points (good for you!)</li>
                <li><strong>Fiber:</strong> High fiber foods can reduce points</li>
              </ul>
              <p className="mb-4">
                Most people get 23-30 SmartPoints per day, depending on their weight loss goals and activity level.
              </p>
              <h3 className="text-xl font-semibold mb-2">Tips for Success:</h3>
              <ul className="list-disc pl-6">
                <li>Focus on whole foods with protein and fiber</li>
                <li>Plan your meals to stay within your daily points</li>
                <li>Use zero-point foods (fruits, vegetables, lean proteins) to fill up</li>
                <li>Track everything you eat for best results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
