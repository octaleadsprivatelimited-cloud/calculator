import { Metadata } from 'next'
import MortgageCalculator from '../components/calculators/MortgageCalculator';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-4">
      <div className="max-w-2xl mx-auto px-2 sm:px-4">
        <MortgageCalculator />
        
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            About Mortgage Calculations
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-3 text-sm sm:text-base">
              A mortgage calculator helps you estimate the monthly payments and total costs 
              associated with a home loan. Understanding these costs is crucial for budgeting 
              and making informed decisions about homeownership.
            </p>
            <h3 className="text-lg font-semibold mb-2">Key Components:</h3>
            <ul className="list-disc pl-4 mb-3 text-sm sm:text-base space-y-1">
              <li><strong>Principal:</strong> The amount borrowed to purchase the home</li>
              <li><strong>Interest Rate:</strong> Annual percentage rate charged by the lender</li>
              <li><strong>Loan Term:</strong> Length of time to repay the loan (typically 15-30 years)</li>
              <li><strong>Property Taxes:</strong> Annual taxes assessed by local government</li>
              <li><strong>Insurance:</strong> Homeowner's insurance and PMI if applicable</li>
            </ul>
            <h3 className="text-lg font-semibold mb-2">Benefits of Using a Mortgage Calculator:</h3>
            <ul className="list-disc pl-4 mb-3 text-sm sm:text-base space-y-1">
              <li>Compare different loan scenarios and terms</li>
              <li>Understand the true cost of homeownership</li>
              <li>Plan your budget and monthly expenses</li>
              <li>Evaluate refinancing opportunities</li>
              <li>Make informed decisions about down payments</li>
            </ul>
            <h3 className="text-lg font-semibold mb-2">Tips for Homebuyers:</h3>
            <ul className="list-disc pl-4 text-sm sm:text-base space-y-1">
              <li>Consider your total monthly budget, not just the mortgage payment</li>
              <li>Factor in maintenance costs and emergency funds</li>
              <li>Shop around for the best interest rates and terms</li>
              <li>Understand the difference between fixed and adjustable rates</li>
              <li>Calculate the break-even point for refinancing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
