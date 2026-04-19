import { Metadata } from 'next'
import BMICalculator from '../components/calculators/BMICalculator'
import CalculatorWithAds from '../components/CalculatorWithAds'

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
    <div className="min-h-screen bg-google-bg py-8 sm:py-12">
      <CalculatorWithAds>
        <BMICalculator />
        
        <div className="mt-12 bg-white rounded-3xl shadow-google border border-google-border p-6 sm:p-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-normal text-google-text mb-6 flex items-center">
              <span className="w-1.5 h-8 bg-google-blue rounded-full mr-4"></span>
              About Body Mass Index (BMI)
            </h2>
            <div className="prose prose-gray max-w-none text-google-gray">
              <p className="mb-8 text-base leading-relaxed">
                Body Mass Index (BMI) is a simple calculation using a person's height and weight. 
                The formula is BMI = kg/m² where kg is a person's weight in kilograms and m² is 
                their height in meters squared.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-google-text mb-4">BMI Categories</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span><strong>Underweight:</strong> BMI less than 18.5</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span><strong>Normal:</strong> BMI 18.5 to 24.9</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span><strong>Overweight:</strong> BMI 25 to 29.9</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span><strong>Obese:</strong> BMI 30 or greater</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-google-text mb-4">Formula</h3>
                  <div className="bg-google-lightGray p-4 rounded-xl border border-google-border font-mono text-sm text-google-text">
                    BMI = Weight (kg) / Height (m)²
                  </div>
                  <p className="mt-4 text-sm italic">
                    Note: BMI is a screening tool, not a diagnostic of body fatness or health.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-medium text-google-text mb-4">Important Considerations</h3>
              <div className="bg-google-lightGray p-6 rounded-2xl border border-google-border">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-google-text">
                    <div className="w-1.5 h-1.5 bg-google-yellow rounded-full mr-3"></div>
                    BMI doesn't distinguish between muscle and fat mass
                  </li>
                  <li className="flex items-center text-google-text">
                    <div className="w-1.5 h-1.5 bg-google-yellow rounded-full mr-3"></div>
                    Athletes may have high BMI due to muscle mass
                  </li>
                  <li className="flex items-center text-google-text">
                    <div className="w-1.5 h-1.5 bg-google-yellow rounded-full mr-3"></div>
                    Not suitable for children and adolescents
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CalculatorWithAds>
    </div>
  );
}
