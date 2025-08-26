'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, CreditCard } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [termType, setTermType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculateLoan = useCallback(() => {
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
    else if (rate > 10) recommendations.push('Moderate rate - typical loan')
    else recommendations.push('Low rate - excellent terms')

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

  const result = showResults ? calculateLoan() : { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, recommendations: [], details: { amount: 0, rate: 0, term: 0, termType: '' } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
        <div className="flex items-center">
          <CreditCard className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Loan Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate loan payments and costs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter rate" step="0.1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
              <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter term" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term Type</label>
              <select value={termType} onChange={(e) => setTermType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Select term type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <ResultSharing
                title="Loan Calculation Result"
                inputs={[
                  { label: "Loan Amount", value: `$${loanAmount}` },
                  { label: "Interest Rate", value: `${interestRate}%` },
                  { label: "Loan Term", value: `${loanTerm} ${termType}` }
                ]}
                result={{ 
                  label: "Monthly Payment", 
                  value: `$${result.monthlyPayment?.toFixed(2)}`,
                  unit: ""
                }}
                calculatorName="Loan Calculator"
                className="mb-0"
              />
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Monthly Payment</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">${result.monthlyPayment?.toFixed(2)}</div>
                <div className="text-green-700">Monthly loan payment</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Loan Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-green-700">Loan Amount:</span><span className="font-semibold text-green-800">${result.details.amount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Interest Rate:</span><span className="font-semibold text-green-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-green-700">Loan Term:</span><span className="font-semibold text-green-800">{result.details.term} {result.details.termType}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Total Interest:</span><span className="font-semibold text-green-800">${result.totalInterest?.toFixed(2)}</span></div>
                <div className="border-t border-green-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-green-700">Total Payment:</span>
                    <span className="text-green-800">${result.totalPayment?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-green-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Loan Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive loan calculator helps you understand the true cost of borrowing money. Whether you're 
              considering a personal loan, auto loan, home improvement loan, or any other type of financing, this tool 
              provides accurate monthly payment calculations and total cost breakdowns.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Payment:</strong> Your fixed monthly loan payment amount</li>
              <li><strong>Total Interest:</strong> Total interest paid over the loan term</li>
              <li><strong>Total Payment:</strong> Principal + interest over the entire loan</li>
              <li><strong>Loan Analysis:</strong> Smart recommendations based on your inputs</li>
              <li><strong>Amortization:</strong> Payment breakdown and loan progression</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Types of Loans Supported</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Personal Loans</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Debt consolidation</li>
                  <li>Home improvements</li>
                  <li>Medical expenses</li>
                  <li>Wedding costs</li>
                  <li>Emergency funds</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Secured Loans</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Auto loans</li>
                  <li>Home equity loans</li>
                  <li>Secured personal loans</li>
                  <li>Business loans</li>
                  <li>Equipment financing</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your loan amount, annual interest rate, and loan term (in years or months). The calculator will 
              instantly compute your monthly payment and provide a complete breakdown of costs, including total interest 
              and recommendations for better loan terms.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Monthly Payment</h5>
                <p className="text-green-700 text-sm">Fixed amount due each month</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Total Interest</h5>
                <p className="text-blue-700 text-sm">Cost of borrowing the money</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Total Payment</h5>
                <p className="text-purple-700 text-sm">Principal + all interest</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Loan Optimization Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Shorter Terms:</strong> Pay less interest but higher monthly payments</li>
              <li><strong>Lower Rates:</strong> Shop around and improve your credit score</li>
              <li><strong>Larger Down Payments:</strong> Reduce loan amount and interest costs</li>
              <li><strong>Extra Payments:</strong> Pay off principal faster to save on interest</li>
              <li><strong>Refinancing:</strong> Consider when rates drop significantly</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Always compare the total cost of loans, not just the monthly payment. A lower monthly payment with a 
                longer term often means paying significantly more in total interest. Use this calculator to find the 
                optimal balance between affordability and total cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
