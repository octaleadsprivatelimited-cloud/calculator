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
    </div>
  )
}
