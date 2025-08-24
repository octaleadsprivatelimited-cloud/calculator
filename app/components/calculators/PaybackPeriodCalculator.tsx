'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Clock } from 'lucide-react'

export default function PaybackPeriodCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('')
  const [annualCashFlow, setAnnualCashFlow] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculatePaybackPeriod = useCallback(() => {
    const investment = parseFloat(initialInvestment) || 0
    const cashFlow = parseFloat(annualCashFlow) || 0
    
    if (investment === 0 || cashFlow === 0) return { 
      paybackPeriod: 0, 
      monthlyPayback: 0,
      recommendations: [],
      details: { investment: 0, cashFlow: 0 }
    }

    const paybackPeriod = investment / cashFlow
    const monthlyPayback = investment / (cashFlow / 12)

    const recommendations = []
    recommendations.push(`Initial investment: $${investment.toLocaleString()}`)
    recommendations.push(`Annual cash flow: $${cashFlow.toLocaleString()}`)
    recommendations.push(`Payback period: ${paybackPeriod.toFixed(2)} years`)
    recommendations.push(`Payback period: ${monthlyPayback.toFixed(1)} months`)

    if (paybackPeriod < 2) recommendations.push('Very fast payback - excellent investment')
    else if (paybackPeriod < 5) recommendations.push('Fast payback - good investment')
    else if (paybackPeriod < 10) recommendations.push('Moderate payback - acceptable investment')
    else if (paybackPeriod < 20) recommendations.push('Slow payback - consider carefully')
    else recommendations.push('Very slow payback - not recommended')

    const details = { investment, cashFlow }

    return { paybackPeriod, monthlyPayback, recommendations, details }
  }, [initialInvestment, annualCashFlow])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setInitialInvestment('')
    setAnnualCashFlow('')
    setShowResults(false)
  }

  const result = showResults ? calculatePaybackPeriod() : { paybackPeriod: 0, monthlyPayback: 0, recommendations: [], details: { investment: 0, cashFlow: 0 } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Payback Period Calculator</h2>
        </div>
        <p className="text-rose-100 mt-1">Calculate investment payback period</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment ($)</label>
              <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Enter investment" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Cash Flow ($)</label>
              <input type="number" value={annualCashFlow} onChange={(e) => setAnnualCashFlow(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Enter cash flow" step="100" />
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-2">Payback Period</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600 mb-2">{result.paybackPeriod?.toFixed(2)} years</div>
                <div className="text-rose-700">Time to recover investment</div>
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-3">Investment Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-rose-700">Initial Investment:</span><span className="font-semibold text-rose-800">${result.details.investment?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-rose-700">Annual Cash Flow:</span><span className="font-semibold text-rose-800">${result.details.cashFlow?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-rose-700">Payback Period:</span><span className="font-semibold text-rose-800">{result.paybackPeriod?.toFixed(2)} years</span></div>
                <div className="flex justify-between"><span className="text-rose-700">Payback Period:</span><span className="font-semibold text-rose-800">{result.monthlyPayback?.toFixed(1)} months</span></div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <h3 className="text-lg font-semibold text-rose-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-rose-600 mr-2">•</span>
                      <span className="text-rose-700">{rec}</span>
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
