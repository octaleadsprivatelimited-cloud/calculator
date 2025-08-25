'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Car } from 'lucide-react'

export default function AutoLoanCalculator() {
  const [carPrice, setCarPrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [termType, setTermType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculateAutoLoan = useCallback(() => {
    const price = parseFloat(carPrice) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 0
    
    if (price === 0 || rate === 0 || term === 0) return { 
      loanAmount: 0, 
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
      recommendations: [],
      details: { price: 0, down: 0, rate: 0, term: 0, termType: '' }
    }

    const loanAmount = price - down
    const monthlyRate = rate / 100 / 12
    const termMonths = termType === 'years' ? term * 12 : term
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
    
    const totalPayment = monthlyPayment * termMonths
    const totalInterest = totalPayment - loanAmount
    const downPaymentPercent = (down / price) * 100

    const recommendations = []
    recommendations.push(`Car price: $${price.toLocaleString()}`)
    recommendations.push(`Down payment: $${down.toLocaleString()} (${downPaymentPercent.toFixed(1)}%)`)
    recommendations.push(`Loan amount: $${loanAmount.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Loan term: ${term} ${termType}`)
    recommendations.push(`Monthly payment: $${monthlyPayment.toFixed(2)}`)
    recommendations.push(`Total interest: $${totalInterest.toFixed(2)}`)
    recommendations.push(`Total payment: $${totalPayment.toFixed(2)}`)

    if (rate > 12) recommendations.push('High interest rate - consider alternatives')
    else if (rate > 8) recommendations.push('Moderate rate - typical auto loan')
    else recommendations.push('Low rate - excellent financing')

    if (downPaymentPercent < 10) recommendations.push('Low down payment - higher monthly payments')
    else if (downPaymentPercent < 20) recommendations.push('Moderate down payment - balanced approach')
    else recommendations.push('High down payment - lower monthly payments')

    const details = { price, down, rate, term, termType }

    return { loanAmount, monthlyPayment, totalInterest, totalPayment, recommendations, details }
  }, [carPrice, downPayment, interestRate, loanTerm, termType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setCarPrice('')
    setDownPayment('')
    setInterestRate('')
    setLoanTerm('')
    setTermType('years')
    setShowResults(false)
  }

  const result = showResults ? calculateAutoLoan() : { loanAmount: 0, monthlyPayment: 0, totalInterest: 0, totalPayment: 0, recommendations: [], details: { price: 0, down: 0, rate: 0, term: 0, termType: '' } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Car className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Auto Loan Calculator</h2>
        </div>
        <p className="text-red-100 mt-1">Calculate auto loan payments and costs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Car Price ($)</label>
              <input type="number" value={carPrice} onChange={(e) => setCarPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter price" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter down payment" step="500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter rate" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
              <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter term" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term Type</label>
              <select value={termType} onChange={(e) => setTermType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Select term type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Monthly Payment</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">${result.monthlyPayment?.toFixed(2)}</div>
                <div className="text-red-700">Monthly auto loan payment</div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Loan Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-red-700">Car Price:</span><span className="font-semibold text-red-800">${result.details.price?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-red-700">Down Payment:</span><span className="font-semibold text-red-800">${result.details.down?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-red-700">Loan Amount:</span><span className="font-semibold text-red-800">${result.loanAmount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-red-700">Interest Rate:</span><span className="font-semibold text-red-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-red-700">Loan Term:</span><span className="font-semibold text-red-800">{result.details.term} {result.details.termType}</span></div>
                <div className="flex justify-between"><span className="text-red-700">Total Interest:</span><span className="font-semibold text-red-800">${result.totalInterest?.toFixed(2)}</span></div>
                <div className="border-t border-red-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-red-700">Total Payment:</span>
                    <span className="text-red-800">${result.totalPayment?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-red-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Auto Loan Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive auto loan calculator helps you understand the true cost of financing a vehicle. Whether 
              you're buying a new car, used car, or refinancing an existing auto loan, this tool provides accurate 
              monthly payment calculations and total cost breakdowns to help you make informed decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Payment:</strong> Your fixed monthly auto loan payment</li>
              <li><strong>Loan Amount:</strong> Total amount financed after down payment</li>
              <li><strong>Total Interest:</strong> Total interest paid over the loan term</li>
              <li><strong>Total Payment:</strong> Principal + interest over the entire loan</li>
              <li><strong>Loan Analysis:</strong> Smart recommendations for better terms</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Auto Loan Components</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Vehicle Costs</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Car price (MSRP or negotiated price)</li>
                  <li>Sales tax and registration fees</li>
                  <li>Dealer add-ons and warranties</li>
                  <li>Trade-in value considerations</li>
                  <li>Down payment amount</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Loan Terms</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Interest rate (APR)</li>
                  <li>Loan duration (months/years)</li>
                  <li>Credit score impact</li>
                  <li>Lender requirements</li>
                  <li>Prepayment penalties</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the car price, down payment, interest rate, and loan term. The calculator will instantly compute 
              your monthly payment and provide a complete breakdown of costs, including total interest and recommendations 
              for optimizing your auto loan.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-1">Monthly Payment</h5>
                <p className="text-red-700 text-sm">Fixed amount due each month</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Total Interest</h5>
                <p className="text-blue-700 text-sm">Cost of financing the vehicle</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Total Cost</h5>
                <p className="text-green-700 text-sm">Car price + all interest</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Auto Loan Optimization Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Larger Down Payment:</strong> Reduces loan amount and interest costs</li>
              <li><strong>Shorter Terms:</strong> Pay less interest but higher monthly payments</li>
              <li><strong>Better Credit Score:</strong> Qualify for lower interest rates</li>
              <li><strong>Shop Around:</strong> Compare rates from multiple lenders</li>
              <li><strong>Consider Total Cost:</strong> Don't just focus on monthly payment</li>
              <li><strong>Pre-approval:</strong> Get loan approval before car shopping</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Auto Loan Terms</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>APR:</strong> Annual Percentage Rate - total cost of borrowing</p>
                  <p><strong>MSRP:</strong> Manufacturer's Suggested Retail Price</p>
                  <p><strong>GAP Insurance:</strong> Covers difference if car is totaled</p>
                </div>
                <div>
                  <p><strong>Pre-approval:</strong> Loan approval before car purchase</p>
                  <p><strong>Refinancing:</strong> Replacing existing loan with better terms</p>
                  <p><strong>Trade-in:</strong> Using old car value as down payment</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Always negotiate the car price first, then discuss financing. A lower purchase price will save you money 
                on both the principal and interest. Consider getting pre-approved for a loan from your bank or credit union 
                before visiting dealerships to have leverage in negotiations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
