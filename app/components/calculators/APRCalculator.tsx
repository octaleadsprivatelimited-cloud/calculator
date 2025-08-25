'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Percent } from 'lucide-react'

export default function APRCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [fees, setFees] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateAPR = useCallback(() => {
    const principal = parseFloat(loanAmount) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 0
    const fee = parseFloat(fees) || 0
    
    if (principal === 0 || rate === 0 || term === 0) return { 
      apr: 0, 
      totalCost: 0,
      monthlyPayment: 0,
      recommendations: [],
      details: { principal: 0, rate: 0, term: 0, fees: 0 }
    }

    const monthlyRate = rate / 100 / 12
    const termMonths = term * 12

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
    
    const totalInterest = (monthlyPayment * termMonths) - principal
    const totalCost = principal + totalInterest + fee
    const apr = ((totalCost - principal) / principal) * (12 / term) * 100

    const recommendations = []
    recommendations.push(`Loan amount: $${principal.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Loan term: ${term} years`)
    recommendations.push(`Fees: $${fee.toFixed(2)}`)
    recommendations.push(`Monthly payment: $${monthlyPayment.toFixed(2)}`)
    recommendations.push(`Total interest: $${totalInterest.toFixed(2)}`)
    recommendations.push(`APR: ${apr.toFixed(2)}%`)

    if (apr > rate + 2) recommendations.push('High APR - significant fees impact')
    else if (apr > rate + 1) recommendations.push('Moderate APR - some fees')
    else recommendations.push('Low APR - minimal fees')

    const details = { principal, rate, term, fees }

    return { apr, totalCost, monthlyPayment, recommendations, details }
  }, [loanAmount, interestRate, loanTerm, fees])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLoanAmount('')
    setInterestRate('')
    setLoanTerm('')
    setFees('')
    setShowResults(false)
  }

  const result = showResults ? calculateAPR() : { apr: 0, totalCost: 0, monthlyPayment: 0, recommendations: [], details: { principal: 0, rate: 0, term: 0, fees: 0 } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <Percent className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">APR Calculator</h2>
        </div>
        <p className="text-violet-100 mt-1">Calculate Annual Percentage Rate</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter rate" step="0.1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (years)</label>
              <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter term" step="0.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fees ($)</label>
              <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter fees" step="10" />
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="text-lg font-semibold text-violet-800 mb-2">APR Results</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 mb-2">{result.apr.toFixed(2)}%</div>
                <div className="text-violet-700">Annual Percentage Rate</div>
              </div>
            </div>

            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="text-lg font-semibold text-violet-800 mb-3">Loan Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-violet-700">Principal:</span><span className="font-semibold text-violet-800">${Number(result.details.principal).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-violet-700">Interest Rate:</span><span className="font-semibold text-violet-800">{Number(result.details.rate).toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-violet-700">Term:</span><span className="font-semibold text-violet-800">{result.details.term} years</span></div>
                <div className="flex justify-between"><span className="text-violet-700">Fees:</span><span className="font-semibold text-violet-800">${Number(result.details.fees).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-violet-700">Monthly Payment:</span><span className="font-semibold text-violet-800">${Number(result.monthlyPayment).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-violet-700">Total Cost:</span><span className="font-semibold text-violet-800">${Number(result.totalCost).toFixed(2)}</span></div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                <h3 className="text-lg font-semibold text-violet-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-violet-600 mr-2">•</span>
                      <span className="text-violet-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calculator Description Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About APR Calculator</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Our comprehensive APR calculator helps borrowers understand the true cost of loans by 
            calculating the Annual Percentage Rate, which includes both interest and fees. This 
            essential financial tool provides accurate cost comparisons between different loan 
            offers, helping you make informed borrowing decisions and avoid hidden costs.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Annual Percentage Rate (APR):</strong> True cost of borrowing including fees</li>
            <li><strong>Total Cost:</strong> Complete amount paid over loan term</li>
            <li><strong>Monthly Payment:</strong> Regular payment amount</li>
            <li><strong>Interest vs. APR:</strong> Comparison of nominal rate vs. actual cost</li>
            <li><strong>Fee Impact:</strong> How fees affect total borrowing cost</li>
            <li><strong>Loan Analysis:</strong> Comprehensive cost breakdown</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">APR vs. Interest Rate</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Interest Rate</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Cost of borrowing money</li>
                <li>Expressed as annual percentage</li>
                <li>Doesn't include fees</li>
                <li>Base rate for calculations</li>
                <li>Advertised rate</li>
                <li>Simple interest calculation</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">APR (Annual Percentage Rate)</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>True cost of borrowing</li>
                <li>Includes interest + fees</li>
                <li>Standardized comparison tool</li>
                <li>Required by law disclosure</li>
                <li>Higher than interest rate</li>
                <li>Better cost comparison</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-violet-50 p-3 rounded-lg border border-violet-200">
              <h5 className="font-semibold text-violet-800 mb-1">APR</h5>
              <p className="text-violet-700 text-sm">True borrowing cost</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-1">Total Cost</h5>
              <p className="text-purple-700 text-sm">Complete loan cost</p>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
              <h5 className="font-semibold text-pink-800 mb-1">Monthly Payment</h5>
              <p className="text-pink-700 text-sm">Regular payment amount</p>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
          <p className="text-gray-700 mb-4">
            Enter your loan amount, interest rate, loan term, and any fees. The calculator will 
            compute the APR, total cost, and monthly payments, providing a complete picture of 
            your loan's true cost to help you compare different loan offers.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Types of Loan Fees</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Origination Fees:</strong> 1-6% of loan amount for processing</li>
            <li><strong>Application Fees:</strong> One-time fee for loan application</li>
            <li><strong>Underwriting Fees:</strong> Cost of loan evaluation and approval</li>
            <li><strong>Documentation Fees:</strong> Cost of preparing loan documents</li>
            <li><strong>Credit Report Fees:</strong> Cost of credit history check</li>
            <li><strong>Appraisal Fees:</strong> Property valuation costs (for mortgages)</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Loan Type APR Ranges</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Mortgages:</strong> 3-8% APR (government-backed loans often lower)</li>
            <li><strong>Auto Loans:</strong> 3-18% APR (new cars lower than used)</li>
            <li><strong>Personal Loans:</strong> 6-36% APR (credit score dependent)</li>
            <li><strong>Student Loans:</strong> 3-12% APR (federal vs. private)</li>
            <li><strong>Business Loans:</strong> 7-30% APR (SBA loans often lower)</li>
            <li><strong>Credit Cards:</strong> 12-30% APR (revolving credit)</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">APR Comparison Strategies</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Same Loan Type:</strong> Compare similar loan products</li>
            <li><strong>Same Term Length:</strong> Equal repayment periods for fair comparison</li>
            <li><strong>Fee Breakdown:</strong> Understand what fees are included</li>
            <li><strong>Total Cost Analysis:</strong> Look beyond just the APR</li>
            <li><strong>Prepayment Penalties:</strong> Consider early repayment costs</li>
            <li><strong>Rate Changes:</strong> Fixed vs. variable rate implications</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-violet-500">
            <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
            <p className="text-gray-700 text-sm">
              When comparing loan offers, always look at the APR rather than just the interest rate, 
              as APR gives you the true cost of borrowing. However, remember that APR is just one 
              factor to consider. Also evaluate the total cost, monthly payment, loan term, and any 
              prepayment penalties. For the most accurate comparison, get loan estimates from multiple 
              lenders and compare them side by side.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
