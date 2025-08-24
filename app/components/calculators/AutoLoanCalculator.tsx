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
      </div>
    </div>
  )
}
