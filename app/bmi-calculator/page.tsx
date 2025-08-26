import { Metadata } from 'next'
import BMICalculator from '../components/calculators/BMICalculator';

export const metadata: Metadata = {
  title: 'BMI Calculator - Calculate Body Mass Index | Online Calculator.live',
  description: 'Free BMI calculator to determine your Body Mass Index. Calculate BMI using height and weight, understand BMI categories, and get health recommendations based on your results.',
  keywords: ['BMI calculator', 'body mass index calculator', 'BMI chart', 'weight calculator', 'health calculator', 'body mass index'],
  openGraph: {
    title: 'BMI Calculator - Calculate Body Mass Index | Online Calculator.live',
    description: 'Free BMI calculator to determine your Body Mass Index. Calculate BMI using height and weight, understand BMI categories, and get health recommendations based on your results.',
    url: 'https://onlinecalculator.live/bmi-calculator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BMI Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator - Calculate Body Mass Index | Online Calculator.live',
    description: 'Free BMI calculator to determine your Body Mass Index. Calculate BMI using height and weight, understand BMI categories, and get health recommendations based on your results.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/bmi-calculator',
  },
}

export default function BMIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BMI Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate your Body Mass Index and understand what it means for your health
          </p>
        </div>
        <BMICalculator />
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Body Mass Index (BMI)
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Body Mass Index (BMI) is a simple calculation using a person's height and weight. 
              The formula is BMI = kg/m² where kg is a person's weight in kilograms and m² is 
              their height in meters squared.
            </p>
            <h3 className="text-xl font-semibold mb-2">BMI Categories:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Underweight:</strong> BMI less than 18.5</li>
              <li><strong>Normal weight:</strong> BMI 18.5 to 24.9</li>
              <li><strong>Overweight:</strong> BMI 25 to 29.9</li>
              <li><strong>Obese:</strong> BMI 30 or greater</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">BMI Formula:</h3>
            <p className="mb-4 font-mono bg-gray-100 p-3 rounded">
              BMI = Weight (kg) ÷ Height (m)²
            </p>
            <h3 className="text-xl font-semibold mb-2">Important Considerations:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>BMI doesn't distinguish between muscle and fat mass</li>
              <li>Athletes may have high BMI due to muscle mass</li>
              <li>Elderly people may have low BMI due to muscle loss</li>
              <li>BMI ranges may vary by ethnicity</li>
              <li>Not suitable for children and adolescents</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">When to Use BMI:</h3>
            <ul className="list-disc pl-6">
              <li>General health screening and population studies</li>
              <li>Initial assessment of weight status</li>
              <li>Tracking weight changes over time</li>
              <li>Discussing weight with healthcare providers</li>
              <li>Setting general health and fitness goals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
