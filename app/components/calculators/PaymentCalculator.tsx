'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, CreditCard } from 'lucide-react'

export default function PaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [termType, setTermType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculatePayment = useCallback(() => {
    const amount = parseFloat(loanAmount) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 0
    
    if (amount === 0 || rate === 0 || term === 0) return { 
      monthlyPayment: 0, 
      totalPayment: 0,
      totalInterest: 0,
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

    if (term > 10) recommendations.push('Long-term loan - lower monthly payments')
    else if (term > 5) recommendations.push('Medium-term loan - balanced approach')
    else recommendations.push('Short-term loan - higher payments, less interest')

    const details = { amount, rate, term, termType }

    return { monthlyPayment, totalPayment, totalInterest, recommendations, details }
  }, [loanAmount, interestRate, loanTerm, termType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLoanAmount('')
    setInterestRate('')
    setLoanTerm('')
    setTermType('years')
    setShowResults(false)
  }

  const result = showResults ? calculatePayment() : { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, recommendations: [], details: { amount: 0, rate: 0, term: 0, termType: '' } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <CreditCard className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Payment Calculator</h2>
        </div>
        <p className="text-indigo-100 mt-1">Calculate loan payments and costs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter amount" step="100" />
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
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Payment Summary</h3>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Payment Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive payment calculator helps you determine monthly loan payments and understand the total cost 
              of borrowing. Whether you're planning a mortgage, auto loan, personal loan, or any other financing, this tool 
              provides accurate payment calculations and cost breakdowns to help you make informed financial decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Payment:</strong> Regular payment amount due each month</li>
              <li><strong>Total Interest:</strong> Total interest paid over the loan term</li>
              <li><strong>Total Payment:</strong> Principal plus all interest costs</li>
              <li><strong>Payment Breakdown:</strong> Detailed cost analysis</li>
              <li><strong>Term Flexibility:</strong> Calculations in years or months</li>
              <li><strong>Cost Analysis:</strong> Understanding the true cost of borrowing</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Loan Payment Components</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Principal</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Original loan amount borrowed</li>
                  <li>Reduces with each payment</li>
                  <li>Not subject to interest charges</li>
                  <li>Builds equity over time</li>
                  <li>Tax-deductible for mortgages</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Interest</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Cost of borrowing money</li>
                  <li>Based on current balance</li>
                  <li>Higher in early payments</li>
                  <li>Decreases over time</li>
                  <li>May be tax-deductible</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-1">Monthly Payment</h5>
                <p className="text-indigo-700 text-sm">Amount due each month</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Total Interest</h5>
                <p className="text-purple-700 text-sm">Cost of borrowing</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Total Cost</h5>
                <p className="text-green-700 text-sm">Principal + interest</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your loan amount, interest rate, and loan term. Choose between years or months, then click calculate 
              to see your monthly payment, total interest costs, and complete payment breakdown.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Loan Types</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Mortgage Loans:</strong> Home financing with long terms (15-30 years)</li>
              <li><strong>Auto Loans:</strong> Vehicle financing with medium terms (3-7 years)</li>
              <li><strong>Personal Loans:</strong> Unsecured borrowing with shorter terms (1-7 years)</li>
              <li><strong>Student Loans:</strong> Educational financing with extended terms</li>
              <li><strong>Business Loans:</strong> Commercial financing with various terms</li>
              <li><strong>Credit Cards:</strong> Revolving credit with minimum payments</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment Calculation Formula</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <p className="text-gray-700 text-sm mb-3">
                <strong>Monthly Payment Formula:</strong> P = L[c(1 + c)^n]/[(1 + c)^n - 1]
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Where:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>P = Monthly payment</li>
                    <li>L = Loan amount</li>
                    <li>c = Monthly interest rate</li>
                    <li>n = Total number of payments</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Example:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>$200,000 loan</li>
                    <li>4% annual rate</li>
                    <li>30-year term</li>
                    <li>Monthly payment: $954.83</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Payments</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Loan Amount:</strong> Larger loans mean higher payments</li>
              <li><strong>Interest Rate:</strong> Higher rates significantly increase payments</li>
              <li><strong>Loan Term:</strong> Longer terms reduce monthly payments but increase total cost</li>
              <li><strong>Down Payment:</strong> Larger down payments reduce loan amounts</li>
              <li><strong>Credit Score:</strong> Better credit often means lower rates</li>
              <li><strong>Loan Type:</strong> Different loan types have varying terms and rates</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Extra Payments:</strong> Pay additional principal to reduce total interest</li>
              <li><strong>Bi-weekly Payments:</strong> Make half payments every two weeks (26 payments/year)</li>
              <li><strong>Refinancing:</strong> Lower rates can reduce payments and total cost</li>
              <li><strong>Loan Consolidation:</strong> Combine multiple loans for better terms</li>
              <li><strong>Payment Acceleration:</strong> Pay more than minimum when possible</li>
              <li><strong>Budget Planning:</strong> Ensure payments fit your monthly budget</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Consider making extra principal payments when possible. Even small additional amounts can significantly 
                reduce your total interest costs and shorten your loan term. For example, adding just $50 extra to a 
                $200,000 mortgage payment can save thousands in interest and reduce the loan term by several years.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
