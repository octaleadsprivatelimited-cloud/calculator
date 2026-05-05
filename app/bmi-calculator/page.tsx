import { Metadata } from 'next'
import BMICalculator from '../components/calculators/BMICalculator'
import CalculatorWithAds from '../components/CalculatorWithAds'
import CalculatorSchema from '../components/CalculatorSchema'

export const metadata: Metadata = {
  title: 'BMI Calculator - Free Body Mass Index Calculator (Metric & Imperial)',
  description: 'Calculate your BMI instantly with our free BMI calculator. Supports metric and imperial units. Understand your weight category, health risks, and get personalized recommendations.',
  keywords: ['BMI calculator', 'body mass index calculator', 'BMI chart', 'healthy weight calculator', 'overweight calculator', 'BMI formula', 'BMI metric', 'BMI imperial'],
  alternates: { canonical: 'https://onlinecalculator.live/bmi-calculator' },
  openGraph: {
    title: 'Free BMI Calculator — Calculate Body Mass Index Online',
    description: 'Calculate your Body Mass Index instantly. Supports metric and imperial. Understand your BMI category and get health recommendations.',
    url: 'https://onlinecalculator.live/bmi-calculator',
    siteName: 'Online Calculator.live',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'BMI Calculator — Online Calculator.live' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free BMI Calculator — Calculate Body Mass Index Online',
    description: 'Calculate your Body Mass Index instantly. Supports metric and imperial. Get health recommendations based on your BMI.',
    images: ['/og-image.jpg'],
  },
}

export default function BMIPage() {
  return (
    <>
      <CalculatorSchema
        name="BMI Calculator"
        description="Free online BMI calculator. Calculate your Body Mass Index using height and weight in metric or imperial units."
        url="/bmi-calculator"
        category="HealthApplication"
        keywords={['BMI calculator', 'body mass index', 'healthy weight', 'weight calculator']}
        faqs={[
          { question: 'What is a healthy BMI?', answer: 'A healthy BMI is between 18.5 and 24.9. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is obese.' },
          { question: 'How is BMI calculated?', answer: 'BMI = weight (kg) / height (m)². In imperial: (weight lbs × 703) / height (in)².' },
          { question: 'Is BMI accurate for athletes?', answer: 'BMI may overestimate body fat in athletes with high muscle mass. It is a screening tool, not a direct measure of body fat.' },
        ]}
        howToSteps={[
          { name: 'Enter your weight', text: 'Type your weight in kilograms or pounds.' },
          { name: 'Enter your height', text: 'Enter your height in centimetres or feet/inches.' },
          { name: 'Click Calculate', text: 'Press Calculate to see your BMI and health category instantly.' },
        ]}
      />
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
    </>
  );
}
