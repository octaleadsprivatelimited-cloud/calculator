'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Home } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [showResults, setShowResults] = useState(false)

  const calculateMortgage = useCallback(() => {
    const price = parseFloat(homePrice) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 30
    
    if (price === 0 || rate === 0) return { 
      loanAmount: 0, 
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
      recommendations: [],
      details: { price: 0, down: 0, rate: 0, term: 0 }
    }

    const loanAmount = price - down
    const monthlyRate = rate / 100 / 12
    const termMonths = term * 12
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
    
    const totalPayment = monthlyPayment * termMonths
    const totalInterest = totalPayment - loanAmount

    const recommendations = []
    recommendations.push(`Home price: $${price.toLocaleString()}`)
    recommendations.push(`Down payment: $${down.toLocaleString()}`)
    recommendations.push(`Loan amount: $${loanAmount.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Loan term: ${term} years`)
    recommendations.push(`Monthly payment: $${monthlyPayment.toFixed(2)}`)
    recommendations.push(`Total interest: $${totalInterest.toFixed(2)}`)
    recommendations.push(`Total payment: $${totalPayment.toFixed(2)}`)

    const details = { price, down, rate, term }

    return { loanAmount, monthlyPayment, totalInterest, totalPayment, recommendations, details }
  }, [homePrice, downPayment, interestRate, loanTerm])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setHomePrice('')
    setDownPayment('')
    setInterestRate('')
    setLoanTerm('30')
    setShowResults(false)
  }

  const result = showResults ? calculateMortgage() : { loanAmount: 0, monthlyPayment: 0, totalInterest: 0, totalPayment: 0, recommendations: [], details: { price: 0, down: 0, rate: 0, term: 0 } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
        <div className="flex items-center">
          <Home className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Mortgage Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate mortgage payments and costs</p>
      </div>

      <div className="p-6">
        {/* Share Options - Moved to Top */}
        {showResults && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <ResultSharing
              title="Mortgage Calculator Result"
              inputs={[
                { label: "Home Price", value: `$${result.details.price.toLocaleString()}` },
                { label: "Down Payment", value: `$${result.details.down.toLocaleString()}` },
                { label: "Interest Rate", value: `${result.details.rate}%` },
                { label: "Loan Term", value: `${result.details.term} years` }
              ]}
              result={{ 
                label: "Monthly Payment", 
                value: `$${result.monthlyPayment.toFixed(2)}`,
                unit: ""
              }}
              calculatorName="Mortgage Calculator"
              className="mb-0"
            />
          </div>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Price ($)</label>
              <input type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter price" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter down payment" step="1000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter rate" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
              <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Select loan term">
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Monthly Payment</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">${result.monthlyPayment?.toFixed(2)}</div>
                <div className="text-blue-700">Monthly mortgage payment</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Mortgage Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-blue-700">Home Price:</span><span className="font-semibold text-blue-800">${result.details.price?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Down Payment:</span><span className="font-semibold text-blue-800">${result.details.down?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Loan Amount:</span><span className="font-semibold text-blue-800">${result.loanAmount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Interest Rate:</span><span className="font-semibold text-blue-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Loan Term:</span><span className="font-semibold text-blue-800">{result.details.term} years</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Total Interest:</span><span className="font-semibold text-blue-800">${result.totalInterest?.toFixed(2)}</span></div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-700">Total Payment:</span>
                    <span className="text-blue-800">${result.totalPayment?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Summary</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Mortgage Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our free mortgage calculator helps you estimate monthly mortgage payments, calculate total interest costs, 
              and determine home affordability. This essential tool is perfect for first-time homebuyers, refinancing decisions, 
              and understanding the true cost of homeownership.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How Mortgage Payments are Calculated</h4>
            <p className="text-gray-700 mb-4">
              Mortgage payments are calculated using the principal and interest formula, which considers your loan amount, 
              interest rate, and loan term. The calculator automatically computes your monthly payment, total interest over 
              the life of the loan, and the total amount you'll pay.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Factors Affecting Your Payment</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Home Price:</strong> The total cost of the property</li>
              <li><strong>Down Payment:</strong> Initial payment that reduces your loan amount</li>
              <li><strong>Interest Rate:</strong> Annual percentage rate charged by the lender</li>
              <li><strong>Loan Term:</strong> Length of time to repay the loan (15, 20, or 30 years)</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Features</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Accurate monthly payment calculations</li>
              <li>Total interest and payment breakdown</li>
              <li>Multiple loan term options</li>
              <li>Instant results and recommendations</li>
              <li>Mobile-friendly design</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Use</h4>
            <p className="text-gray-700">
              Use this mortgage calculator to compare different loan scenarios, understand the impact of down payments 
              and interest rates, plan your home purchase budget, or evaluate refinancing options. It's an essential 
              tool for making informed decisions about one of life's biggest financial commitments.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
