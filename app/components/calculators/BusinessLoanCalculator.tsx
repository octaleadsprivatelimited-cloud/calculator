'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Building2 } from 'lucide-react'

export default function BusinessLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [termType, setTermType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculateBusinessLoan = useCallback(() => {
    const amount = parseFloat(loanAmount) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 0
    
    if (amount === 0 || rate === 0 || term === 0) return { 
      monthlyPayment: 0, 
      totalInterest: 0,
      totalPayment: 0,
      recommendations: [],
      details: { amount: 0, rate: 0, term: 0, termType: '' }
    }

    const monthlyRate = rate / 100 / 12
    const termMonths = termType === 'years' ? term * 12 : term
    
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
    
    const totalPayment = monthlyPayment * termMonths
    const totalInterest = totalPayment - amount

    const recommendations = []
    recommendations.push(`Loan amount: $${amount.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Loan term: ${term} ${termType}`)
    recommendations.push(`Monthly payment: $${monthlyPayment.toFixed(2)}`)
    recommendations.push(`Total interest: $${totalInterest.toFixed(2)}`)
    recommendations.push(`Total payment: $${totalPayment.toFixed(2)}`)

    if (rate > 15) recommendations.push('High interest rate - consider refinancing options')
    else if (rate > 10) recommendations.push('Moderate interest rate - typical business loan')
    else recommendations.push('Low interest rate - excellent terms')

    if (term > 10) recommendations.push('Long-term loan - lower monthly payments')
    else if (term > 5) recommendations.push('Medium-term loan - balanced approach')
    else recommendations.push('Short-term loan - higher monthly payments, less interest')

    const details = { amount, rate, term, termType }

    return { monthlyPayment, totalInterest, totalPayment, recommendations, details }
  }, [loanAmount, interestRate, loanTerm, termType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLoanAmount('')
    setInterestRate('')
    setLoanTerm('')
    setTermType('years')
    setShowResults(false)
  }

  const result = showResults ? calculateBusinessLoan() : { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, recommendations: [], details: { amount: 0, rate: 0, term: 0, termType: '' } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Business Loan Calculator</h2>
        </div>
        <p className="text-indigo-100 mt-1">Calculate business loan payments and costs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter amount" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter rate" step="0.1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
              <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter term" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term Type</label>
              <select value={termType} onChange={(e) => setTermType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Select term type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Monthly Payment</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">${result.monthlyPayment?.toFixed(2)}</div>
                <div className="text-indigo-700">Monthly loan payment</div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Loan Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-indigo-700">Loan Amount:</span><span className="font-semibold text-indigo-800">${result.details.amount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-indigo-700">Interest Rate:</span><span className="font-semibold text-indigo-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-indigo-700">Loan Term:</span><span className="font-semibold text-indigo-800">{result.details.term} {result.details.termType}</span></div>
                <div className="flex justify-between"><span className="text-indigo-700">Total Interest:</span><span className="font-semibold text-indigo-800">${result.totalInterest?.toFixed(2)}</span></div>
                <div className="border-t border-indigo-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-indigo-700">Total Payment:</span>
                    <span className="text-indigo-800">${result.totalPayment?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className="text-indigo-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Business Loan Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive business loan calculator helps entrepreneurs and business owners determine monthly 
              payments and total costs for business financing. Whether you're starting a new business, expanding 
              operations, purchasing equipment, or managing cash flow, this tool provides essential calculations 
              to help you understand the true cost of business borrowing and make informed financial decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Payment:</strong> Regular business loan payment amount</li>
              <li><strong>Total Interest:</strong> Complete interest cost over loan term</li>
              <li><strong>Total Payment:</strong> Principal plus all interest costs</li>
              <li><strong>Payment Breakdown:</strong> Detailed cost analysis</li>
              <li><strong>Loan Affordability:</strong> Whether the loan fits your business budget</li>
              <li><strong>Cost Comparison:</strong> Compare different loan terms and rates</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Business Loan vs. Other Financing</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Business Loan Advantages</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Dedicated business financing</li>
                  <li>Potentially lower rates than personal loans</li>
                  <li>Business credit building</li>
                  <li>Tax-deductible interest</li>
                  <li>Flexible use of funds</li>
                  <li>Professional lender relationships</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Business Loan Considerations</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Business plan requirements</li>
                  <li>Financial documentation needed</li>
                  <li>Personal guarantee often required</li>
                  <li>Collateral may be needed</li>
                  <li>Business credit history matters</li>
                  <li>Application process can be lengthy</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-1">Monthly Payment</h5>
                <p className="text-indigo-700 text-sm">Regular loan amount</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Total Interest</h5>
                <p className="text-purple-700 text-sm">Cost of borrowing</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Total Cost</h5>
                <p className="text-green-700 text-sm">Complete loan cost</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your desired loan amount, interest rate, and loan term. Choose between years or months, then 
              click calculate to see your monthly payment, total interest costs, and complete loan breakdown.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Business Loan Uses</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Working Capital:</strong> Daily operations and cash flow management</li>
              <li><strong>Equipment Financing:</strong> Machinery, vehicles, and technology</li>
              <li><strong>Business Expansion:</strong> New locations, markets, or product lines</li>
              <li><strong>Inventory Financing:</strong> Stock purchases and seasonal needs</li>
              <li><strong>Startup Funding:</strong> New business launch and initial costs</li>
              <li><strong>Debt Consolidation:</strong> Combine multiple business debts</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Business Loan Requirements</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Business Requirements:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Business plan and financial projections</li>
                    <li>Business credit history</li>
                    <li>Revenue and profitability</li>
                    <li>Industry experience</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Personal Requirements:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Personal credit score (680+)</li>
                    <li>Personal financial statements</li>
                    <li>Personal guarantee</li>
                    <li>Industry expertise</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Types of Business Loans</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Term Loans:</strong> Traditional installment loans with fixed payments</li>
              <li><strong>SBA Loans:</strong> Government-backed loans with favorable terms</li>
              <li><strong>Equipment Financing:</strong> Secured by the equipment being purchased</li>
              <li><strong>Invoice Financing:</strong> Based on outstanding customer invoices</li>
              <li><strong>Merchant Cash Advances:</strong> Based on future credit card sales</li>
              <li><strong>Business Lines of Credit:</strong> Revolving credit for ongoing needs</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Business Loan Rates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Business Credit Score:</strong> Higher scores mean lower rates</li>
              <li><strong>Personal Credit Score:</strong> Often required for small business loans</li>
              <li><strong>Business Financials:</strong> Revenue, profitability, and cash flow</li>
              <li><strong>Industry Risk:</strong> Some industries are considered higher risk</li>
              <li><strong>Loan Amount:</strong> Larger loans may have different rate structures</li>
              <li><strong>Collateral:</strong> Secured loans typically have lower rates</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Business Loan Application Process</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Business Plan:</strong> Comprehensive business strategy and financials</li>
              <li><strong>Financial Documents:</strong> Tax returns, bank statements, P&L statements</li>
              <li><strong>Legal Documents:</strong> Business licenses, contracts, and registrations</li>
              <li><strong>Personal Information:</strong> Credit reports and financial statements</li>
              <li><strong>Collateral Documentation:</strong> Asset appraisals and ownership proof</li>
              <li><strong>Lender Interview:</strong> Discussion of business and loan purpose</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Alternative Business Financing</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Business Credit Cards:</strong> Revolving credit for smaller expenses</li>
              <li><strong>Invoice Factoring:</strong> Sell outstanding invoices for immediate cash</li>
              <li><strong>Equipment Leasing:</strong> Rent equipment instead of purchasing</li>
              <li><strong>Angel Investors:</strong> Equity investment from wealthy individuals</li>
              <li><strong>Venture Capital:</strong> Equity investment for high-growth businesses</li>
              <li><strong>Crowdfunding:</strong> Raise funds from many small investors</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Business Loan Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Prepare Thoroughly:</strong> Have all documentation ready before applying</li>
              <li><strong>Shop Around:</strong> Compare rates and terms from multiple lenders</li>
              <li><strong>Build Business Credit:</strong> Establish business credit history early</li>
              <li><strong>Consider SBA Loans:</strong> Often have the most favorable terms</li>
              <li><strong>Negotiate Terms:</strong> Don't accept the first offer</li>
              <li><strong>Plan for Repayment:</strong> Ensure the loan fits your cash flow</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Before applying for a business loan, ensure your business financials are in order and you have a 
                solid business plan. Lenders want to see that you can afford the loan and have a clear plan for 
                using the funds. Also, consider starting with smaller loans to build your business credit history, 
                which will help you qualify for larger, more favorable loans in the future. Remember that business 
                loans often require personal guarantees, so your personal credit and finances matter too.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
