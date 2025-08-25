'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, User } from 'lucide-react'

export default function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [termType, setTermType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculatePersonalLoan = useCallback(() => {
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

    if (rate > 20) recommendations.push('High interest rate - consider alternatives')
    else if (rate > 15) recommendations.push('Moderate-high rate - shop around')
    else if (rate > 10) recommendations.push('Moderate rate - typical personal loan')
    else recommendations.push('Low rate - excellent terms')

    if (term > 7) recommendations.push('Long-term loan - lower monthly payments')
    else if (term > 3) recommendations.push('Medium-term loan - balanced approach')
    else recommendations.push('Short-term loan - higher payments, less interest')

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

  const result = showResults ? calculatePersonalLoan() : { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, recommendations: [], details: { amount: 0, rate: 0, term: 0, termType: '' } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
        <div className="flex items-center">
          <User className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Personal Loan Calculator</h2>
        </div>
        <p className="text-teal-100 mt-1">Calculate personal loan payments and costs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter rate" step="0.1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
              <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Enter term" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term Type</label>
              <select value={termType} onChange={(e) => setTermType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" aria-label="Select term type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-2">Monthly Payment</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">${result.monthlyPayment?.toFixed(2)}</div>
                <div className="text-teal-700">Monthly loan payment</div>
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-3">Loan Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-teal-700">Loan Amount:</span><span className="font-semibold text-teal-800">${result.details.amount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-teal-700">Interest Rate:</span><span className="font-semibold text-teal-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-teal-700">Loan Term:</span><span className="font-semibold text-teal-800">{result.details.term} {result.details.termType}</span></div>
                <div className="flex justify-between"><span className="text-teal-700">Total Interest:</span><span className="font-semibold text-teal-800">${result.totalInterest?.toFixed(2)}</span></div>
                <div className="border-t border-teal-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-teal-700">Total Payment:</span>
                    <span className="text-teal-800">${result.totalPayment?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="text-lg font-semibold text-teal-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-teal-600 mr-2">•</span>
                      <span className="text-teal-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Personal Loan Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive personal loan calculator helps you determine monthly payments and total costs for 
              unsecured personal loans. Whether you're consolidating debt, financing home improvements, covering 
              medical expenses, or funding other personal needs, this tool provides essential calculations to help 
              you understand the true cost of borrowing and make informed financial decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Payment:</strong> Regular loan payment amount</li>
              <li><strong>Total Interest:</strong> Complete interest cost over loan term</li>
              <li><strong>Total Payment:</strong> Principal plus all interest costs</li>
              <li><strong>Payment Breakdown:</strong> Detailed cost analysis</li>
              <li><strong>Loan Affordability:</strong> Whether the loan fits your budget</li>
              <li><strong>Cost Comparison:</strong> Compare different loan terms and rates</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Personal Loan vs. Other Financing</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Personal Loan Advantages</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Fixed interest rates</li>
                  <li>Predictable monthly payments</li>
                  <li>No collateral required</li>
                  <li>Flexible use of funds</li>
                  <li>Potentially lower rates than credit cards</li>
                  <li>Fixed repayment schedule</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Personal Loan Considerations</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Higher interest rates than secured loans</li>
                  <li>Credit score dependent</li>
                  <li>Origination fees common</li>
                  <li>Prepayment penalties possible</li>
                  <li>Income verification required</li>
                  <li>Debt-to-income ratio limits</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                <h5 className="font-semibold text-teal-800 mb-1">Monthly Payment</h5>
                <p className="text-teal-700 text-sm">Regular loan amount</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                <h5 className="font-semibold text-cyan-800 mb-1">Total Interest</h5>
                <p className="text-cyan-700 text-sm">Cost of borrowing</p>
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
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Personal Loan Uses</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Debt Consolidation:</strong> Combine multiple high-interest debts</li>
              <li><strong>Home Improvements:</strong> Renovations, repairs, and upgrades</li>
              <li><strong>Medical Expenses:</strong> Healthcare costs and procedures</li>
              <li><strong>Education:</strong> Tuition, books, and training programs</li>
              <li><strong>Major Purchases:</strong> Appliances, furniture, electronics</li>
              <li><strong>Emergency Expenses:</strong> Unexpected costs and repairs</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Personal Loan Requirements</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Credit Requirements:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Good to excellent credit (670+)</li>
                    <li>Stable income and employment</li>
                    <li>Low debt-to-income ratio</li>
                    <li>Positive payment history</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Documentation Needed:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Proof of income</li>
                    <li>Government ID</li>
                    <li>Bank statements</li>
                    <li>Credit report</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Personal Loan Rates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Credit Score:</strong> Higher scores mean lower rates</li>
              <li><strong>Income Level:</strong> Higher income often means better rates</li>
              <li><strong>Employment History:</strong> Stable employment improves rates</li>
              <li><strong>Debt-to-Income Ratio:</strong> Lower DTI means better rates</li>
              <li><strong>Loan Amount:</strong> Larger loans may have different rates</li>
              <li><strong>Loan Term:</strong> Shorter terms often have lower rates</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Personal Loan Types</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Unsecured Personal Loans:</strong> No collateral required</li>
              <li><strong>Secured Personal Loans:</strong> Backed by assets</li>
              <li><strong>Fixed-Rate Loans:</strong> Interest rate stays constant</li>
              <li><strong>Variable-Rate Loans:</strong> Interest rate can change</li>
              <li><strong>Co-signed Loans:</strong> Additional borrower guarantees</li>
              <li><strong>Joint Loans:</strong> Multiple borrowers share responsibility</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Loan Application Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Check Your Credit:</strong> Review credit report before applying</li>
              <li><strong>Compare Lenders:</strong> Shop around for best rates and terms</li>
              <li><strong>Pre-qualify:</strong> Check rates without affecting credit score</li>
              <li><strong>Gather Documents:</strong> Have all required paperwork ready</li>
              <li><strong>Consider Co-signer:</strong> May help qualify for better rates</li>
              <li><strong>Read Fine Print:</strong> Understand all terms and fees</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Fees and Charges</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Origination Fees:</strong> 1-8% of loan amount</li>
              <li><strong>Prepayment Penalties:</strong> Fees for early payoff</li>
              <li><strong>Late Payment Fees:</strong> Charges for missed payments</li>
              <li><strong>Returned Payment Fees:</strong> Charges for insufficient funds</li>
              <li><strong>Application Fees:</strong> One-time processing charges</li>
              <li><strong>Annual Fees:</strong> Yearly account maintenance charges</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Before taking out a personal loan, consider if you really need it and if you can afford the payments. 
                Calculate your debt-to-income ratio to ensure the new loan won't push you over 43% (the typical maximum 
                for most lenders). Also, consider alternatives like 0% APR credit cards for short-term financing, or 
                saving up for the purchase to avoid interest costs entirely. Remember, personal loans are unsecured, 
                so they typically have higher interest rates than secured loans like mortgages or auto loans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
