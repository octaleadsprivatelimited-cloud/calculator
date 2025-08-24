'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, RefreshCw } from 'lucide-react'

export default function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState('')
  const [currentRate, setCurrentRate] = useState('')
  const [newRate, setNewRate] = useState('')
  const [remainingTerm, setRemainingTerm] = useState('')
  const [termType, setTermType] = useState('years')
  const [closingCosts, setClosingCosts] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateRefinance = useCallback(() => {
    const balance = parseFloat(currentBalance) || 0
    const oldRate = parseFloat(currentRate) || 0
    const newRateVal = parseFloat(newRate) || 0
    const term = parseFloat(remainingTerm) || 0
    const costs = parseFloat(closingCosts) || 0
    
    if (balance === 0 || oldRate === 0 || newRateVal === 0 || term === 0) return { 
      currentPayment: 0, 
      newPayment: 0,
      monthlySavings: 0,
      breakEvenMonths: 0,
      totalSavings: 0,
      recommendations: [],
      details: { balance: 0, oldRate: 0, newRate: 0, term: 0, termType: '', costs: 0 }
    }

    const termMonths = termType === 'years' ? term * 12 : term
    const oldMonthlyRate = oldRate / 100 / 12
    const newMonthlyRate = newRateVal / 100 / 12
    
    const currentPayment = balance * (oldMonthlyRate * Math.pow(1 + oldMonthlyRate, termMonths)) / 
                          (Math.pow(1 + oldMonthlyRate, termMonths) - 1)
    
    const newPayment = balance * (newMonthlyRate * Math.pow(1 + newMonthlyRate, termMonths)) / 
                      (Math.pow(1 + newMonthlyRate, termMonths) - 1)
    
    const monthlySavings = currentPayment - newPayment
    const breakEvenMonths = costs / monthlySavings
    const totalSavings = monthlySavings * termMonths - costs

    const recommendations = []
    recommendations.push(`Current balance: $${balance.toLocaleString()}`)
    recommendations.push(`Current rate: ${oldRate.toFixed(2)}%`)
    recommendations.push(`New rate: ${newRateVal.toFixed(2)}%`)
    recommendations.push(`Remaining term: ${term} ${termType}`)
    recommendations.push(`Current payment: $${currentPayment.toFixed(2)}`)
    recommendations.push(`New payment: $${newPayment.toFixed(2)}`)
    recommendations.push(`Monthly savings: $${monthlySavings.toFixed(2)}`)
    recommendations.push(`Closing costs: $${costs.toFixed(2)}`)
    recommendations.push(`Break-even: ${breakEvenMonths.toFixed(1)} months`)
    recommendations.push(`Total savings: $${totalSavings.toFixed(2)}`)

    if (newRateVal >= oldRate) recommendations.push('New rate is higher - refinancing not recommended')
    else if (breakEvenMonths > 24) recommendations.push('Long break-even period - consider carefully')
    else if (breakEvenMonths > 12) recommendations.push('Moderate break-even period - good refinance')
    else recommendations.push('Quick break-even - excellent refinance opportunity')

    const details = { balance, oldRate, newRate: newRateVal, term, termType, costs }

    return { currentPayment, newPayment, monthlySavings, breakEvenMonths, totalSavings, recommendations, details }
  }, [currentBalance, currentRate, newRate, remainingTerm, termType, closingCosts])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setCurrentBalance('')
    setCurrentRate('')
    setNewRate('')
    setRemainingTerm('')
    setTermType('years')
    setClosingCosts('')
    setShowResults(false)
  }

  const result = showResults ? calculateRefinance() : { currentPayment: 0, newPayment: 0, monthlySavings: 0, breakEvenMonths: 0, totalSavings: 0, recommendations: [], details: { balance: 0, oldRate: 0, newRate: 0, term: 0, termType: '', costs: 0 } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
        <div className="flex items-center">
          <RefreshCw className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Refinance Calculator</h2>
        </div>
        <p className="text-amber-100 mt-1">Calculate refinancing savings and break-even</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Balance ($)</label>
              <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter balance" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Rate (%)</label>
              <input type="number" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter rate" step="0.1" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Rate (%)</label>
              <input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter new rate" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remaining Term</label>
              <input type="number" value={remainingTerm} onChange={(e) => setRemainingTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter term" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term Type</label>
              <select value={termType} onChange={(e) => setTermType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" aria-label="Select term type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Closing Costs ($)</label>
            <input type="number" value={closingCosts} onChange={(e) => setClosingCosts(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter closing costs" step="100" />
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Monthly Savings</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">${result.monthlySavings?.toFixed(2)}</div>
                <div className="text-amber-700">Monthly payment reduction</div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Refinance Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-amber-700">Current Payment:</span><span className="font-semibold text-amber-800">${result.currentPayment?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-amber-700">New Payment:</span><span className="font-semibold text-amber-800">${result.newPayment?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-amber-700">Monthly Savings:</span><span className="font-semibold text-amber-800">${result.monthlySavings?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-amber-700">Closing Costs:</span><span className="font-semibold text-amber-800">${result.details.costs?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-amber-700">Break-even:</span><span className="font-semibold text-amber-800">{result.breakEvenMonths?.toFixed(1)} months</span></div>
                <div className="border-t border-amber-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-700">Total Savings:</span>
                    <span className="text-amber-800">${result.totalSavings?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">Summary</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span className="text-amber-700">{rec}</span>
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
