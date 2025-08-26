import { Metadata } from 'next'
import GPACalculator from '../components/calculators/GPACalculator';

export const metadata: Metadata = {
  title: 'GPA Calculator - Calculate Grade Point Average | Online Calculator.live',
  description: 'Free GPA calculator to compute your Grade Point Average. Calculate GPA for high school, college, and university courses. Track academic performance and plan your studies.',
  keywords: ['GPA calculator', 'grade point average calculator', 'college GPA calculator', 'high school GPA calculator', 'academic calculator', 'grade calculator'],
  openGraph: {
    title: 'GPA Calculator - Calculate Grade Point Average | Online Calculator.live',
    description: 'Free GPA calculator to compute your Grade Point Average. Calculate GPA for high school, college, and university courses. Track academic performance and plan your studies.',
    url: 'https://onlinecalculator.live/gpa-calculator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GPA Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPA Calculator - Calculate Grade Point Average | Online Calculator.live',
    description: 'Free GPA calculator to compute your Grade Point Average. Calculate GPA for high school, college, and university courses. Track academic performance and plan your studies.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/gpa-calculator',
  },
}

export default function GPACalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GPA Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate your Grade Point Average and track your academic performance
          </p>
        </div>
        <GPACalculator />
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Grade Point Average (GPA)
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Grade Point Average (GPA) is a standardized way of measuring academic achievement 
              across different courses and institutions. It's calculated by averaging the grades 
              earned in all courses, weighted by the number of credit hours each course carries.
            </p>
            <h3 className="text-xl font-semibold mb-2">GPA Scale (4.0 Scale):</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>A (4.0):</strong> Excellent - 90-100%</li>
              <li><strong>B (3.0):</strong> Good - 80-89%</li>
              <li><strong>C (2.0):</strong> Satisfactory - 70-79%</li>
              <li><strong>D (1.0):</strong> Poor - 60-69%</li>
              <li><strong>F (0.0):</strong> Failing - Below 60%</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">GPA Calculation Formula:</h3>
            <p className="mb-4 font-mono bg-gray-100 p-3 rounded">
              GPA = Σ(Grade Points × Credit Hours) ÷ Σ(Credit Hours)
            </p>
            <h3 className="text-xl font-semibold mb-2">Why GPA Matters:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>College admissions and scholarships</li>
              <li>Graduate school applications</li>
              <li>Academic honors and recognition</li>
              <li>Employment opportunities</li>
              <li>Academic probation monitoring</li>
              <li>Transfer credit evaluation</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Tips for Maintaining a Good GPA:</h3>
            <ul className="list-disc pl-6">
              <li>Attend all classes and participate actively</li>
              <li>Complete assignments on time and to the best of your ability</li>
              <li>Study regularly and seek help when needed</li>
              <li>Balance course load with other commitments</li>
              <li>Monitor your progress throughout the semester</li>
              <li>Consider retaking courses if you receive poor grades</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
