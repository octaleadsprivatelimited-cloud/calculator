import { Metadata } from 'next'
import DiceRollerCalculator from '../components/calculators/DiceRollerCalculator';

export const metadata: Metadata = {
  title: 'Dice Roller Calculator - Roll Virtual Dice Online | Online Calculator.live',
  description: 'Free online dice roller calculator. Roll virtual dice with customizable sides (D4, D6, D8, D10, D12, D20, D100). Perfect for tabletop games, probability calculations, and random number generation.',
  keywords: ['dice roller calculator', 'virtual dice', 'random dice', 'D20 calculator', 'tabletop games', 'probability calculator', 'random number generator'],
  openGraph: {
    title: 'Dice Roller Calculator - Roll Virtual Dice Online | Online Calculator.live',
    description: 'Free online dice roller calculator. Roll virtual dice with customizable sides (D4, D6, D8, D10, D12, D20, D100). Perfect for tabletop games, probability calculations, and random number generation.',
    url: 'https://onlinecalculator.live/dice-roller-calculator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dice Roller Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dice Roller Calculator - Roll Virtual Dice Online | Online Calculator.live',
    description: 'Free online dice roller calculator. Roll virtual dice with customizable sides (D4, D6, D8, D10, D12, D20, D100). Perfect for tabletop games, probability calculations, and random number generation.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/dice-roller-calculator',
  },
}

export default function DiceRollerCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dice Roller Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Roll virtual dice with customizable sides for tabletop games and probability calculations
          </p>
        </div>
        <DiceRollerCalculator />
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Dice Rolling
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Our virtual dice roller provides a convenient way to roll dice for tabletop games, 
              probability calculations, and random number generation without needing physical dice.
            </p>
            <h3 className="text-xl font-semibold mb-2">Common Dice Types:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>D4:</strong> Four-sided die, commonly used in tabletop RPGs</li>
              <li><strong>D6:</strong> Standard six-sided die, most common type</li>
              <li><strong>D8:</strong> Eight-sided die, used in various games</li>
              <li><strong>D10:</strong> Ten-sided die, often used for percentages</li>
              <li><strong>D12:</strong> Twelve-sided die, used in some RPGs</li>
              <li><strong>D20:</strong> Twenty-sided die, standard in D&D and similar games</li>
              <li><strong>D100:</strong> Hundred-sided die, used for percentage rolls</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Perfect For:</h3>
            <ul className="list-disc pl-6">
              <li>Tabletop role-playing games (D&D, Pathfinder, etc.)</li>
              <li>Board games requiring dice</li>
              <li>Probability and statistics calculations</li>
              <li>Random number generation for any purpose</li>
              <li>Educational purposes and learning probability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
