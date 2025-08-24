'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, TrendingUp } from 'lucide-react'

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState('')
  const [finalValue, setFinalValue] = useState('')
  const [timePeriod, setTimePeriod] = useState('')
  const [periodType, setPeriodType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculateROI = useCallback(() => {
    const initial = parseFloat(initialInvestment) || 0
    const final = parseFloat(finalValue) || 0
    const time = parseFloat(timePeriod) || 0
    
    if (initial === 0) return { roi: 0, annualizedROI: 0, profit: 0, recommendations: [], details: { initial: 0, final: 0, time: 0, periodType: '' } }

    const profit = final - initial
    const roi = (profit / initial) * 100
    const annualizedROI = time > 0 ? (Math.pow(final / initial, 1 / time) - 1) * 100 : 0

    const recommendations = []
    recommendations.push(`Initial investment: $${initial.toLocaleString()}`)
    recommendations.push(`Final value: $${final.toLocaleString()}`)
    recommendations.push(`Profit/Loss: $${profit.toLocaleString()}`)
    recommendations.push(`ROI: ${roi.toFixed(2)}%`)
    if (time > 0) recommendations.push(`Annualized ROI: ${annualizedROI.toFixed(2)}%`)

    if (roi > 100) recommendations.push('Excellent return - outstanding investment!')
    else if (roi > 50) recommendations.push('Very good return - strong performance')
    else if (roi > 20) recommendations.push('Good return - solid investment')
    else if (roi > 0) recommendations.push('Positive return - investment profitable')
    else recommendations.push('Negative return - investment lost money')

    const details = { initial, final, time, periodType }

    return { roi, annualizedROI, profit, recommendations, details }
  }, [initialInvestment, finalValue, timePeriod, periodType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setInitialInvestment('')
    setFinalValue('')
    setTimePeriod('')
    setPeriodType('years')
    setShowResults(false)
  }

  const result = showResults ? calculateROI() : { roi: 0, annualizedROI: 0, profit: 0, recommendations: [], details: { initial: 0, final: 0, time: 0, periodType: '' } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">ROI Calculator</h2>
        </div>
        <p className="text-emerald-100 mt-1">Calculate Return on Investment</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment ($)</label>
              <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Final Value ($)</label>
              <input type="number" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter value" step="100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter time" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
              <select value={periodType} onChange={(e) => setPeriodType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Select period type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">ROI Results</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{result.roi.toFixed(2)}%</div>
                <div className="text-emerald-700">Return on Investment</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Investment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-emerald-700">Initial Investment:</span><span className="font-semibold text-emerald-800">${result.details.initial?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Final Value:</span><span className="font-semibold text-emerald-800">${result.details.final?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Profit/Loss:</span><span className="font-semibold text-emerald-800">${result.profit?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Time Period:</span><span className="font-semibold text-emerald-800">{result.details.time} {result.details.periodType}</span></div>
                {result.details.time > 0 && (
                  <div className="flex justify-between"><span className="text-emerald-700">Annualized ROI:</span><span className="font-semibold text-emerald-800">{result.annualizedROI.toFixed(2)}%</span></div>
                )}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      <span className="text-emerald-700">{rec}</span>
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
