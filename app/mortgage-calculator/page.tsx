import { Metadata } from 'next'
import MortgageCalculator from '../components/calculators/MortgageCalculator'
import CalculatorWithAds from '../components/CalculatorWithAds'

export const metadata: Metadata = {
  title: 'Mortgage Calculator - Calculate Monthly Payments | Online Calculator.live',
  description: 'Free mortgage calculator to estimate monthly payments, interest costs, and loan terms. Calculate mortgage payments for home loans with taxes, insurance, and PMI included.',
  keywords: ['mortgage calculator', 'home loan calculator', 'monthly payment calculator', 'mortgage payment calculator', 'home financing', 'loan calculator'],
  openGraph: {
    title: 'Mortgage Calculator - Calculate Monthly Payments | Online Calculator.live',
    description: 'Free mortgage calculator to estimate monthly payments, interest costs, and loan terms. Calculate mortgage payments for home loans with taxes, insurance, and PMI included.',
    url: 'https://onlinecalculator.live/mortgage-calculator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mortgage Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator - Calculate Monthly Payments | Online Calculator.live',
    description: 'Free mortgage calculator to estimate monthly payments, interest costs, and loan terms. Calculate mortgage payments for home loans with taxes, insurance, and PMI included.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/mortgage-calculator',
  },
}

export default function MortgagePage() {
  return (
    <div className="min-h-screen bg-google-bg py-8 sm:py-12">
      <CalculatorWithAds>
        <MortgageCalculator />
        
        <div className="mt-12 bg-white rounded-3xl shadow-google border border-google-border p-6 sm:p-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-normal text-google-text mb-6 flex items-center">
              <span className="w-1.5 h-8 bg-google-blue rounded-full mr-4"></span>
              About Mortgage Calculations
            </h2>
            <div className="prose prose-gray max-w-none text-google-gray">
              <p className="mb-8 text-base leading-relaxed">
                A mortgage calculator helps you estimate the monthly payments and total costs 
                associated with a home loan. Understanding these costs is crucial for budgeting 
                and making informed decisions about homeownership.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-google-text mb-4">Key Components</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span><strong>Principal:</strong> The amount borrowed to purchase the home</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span><strong>Interest Rate:</strong> Annual percentage rate charged by the lender</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span><strong>Loan Term:</strong> Length of time to repay (typically 15-30 years)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-google-text mb-4">Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span>Compare different loan scenarios and terms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span>Plan your budget and monthly expenses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-google-blue mr-3">•</span>
                      <span>Evaluate refinancing opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-medium text-google-text mb-4">Quick Tips</h3>
              <div className="bg-google-lightGray p-6 rounded-2xl border border-google-border">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-google-text">
                    <div className="w-1.5 h-1.5 bg-google-green rounded-full mr-3"></div>
                    Consider your total monthly budget, not just the mortgage payment
                  </li>
                  <li className="flex items-center text-google-text">
                    <div className="w-1.5 h-1.5 bg-google-green rounded-full mr-3"></div>
                    Shop around for the best interest rates and terms
                  </li>
                  <li className="flex items-center text-google-text">
                    <div className="w-1.5 h-1.5 bg-google-green rounded-full mr-3"></div>
                    Understand the difference between fixed and adjustable rates
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
