'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, TrendingDown } from 'lucide-react'

export default function PresentValueCalculator() {
  const [futureValue, setFutureValue] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [timePeriod, setTimePeriod] = useState('')
  const [periodType, setPeriodType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculatePV = useCallback(() => {
    const fv = parseFloat(futureValue) || 0
    const rate = parseFloat(interestRate) || 0
    const time = parseFloat(timePeriod) || 0
    
    if (fv === 0 || rate === 0 || time === 0) return { 
      presentValue: 0, 
      discountFactor: 0,
      recommendations: [],
      details: { futureValue: 0, rate: 0, time: 0, periodType: '' }
    }

    const periodRate = rate / 100
    const periods = periodType === 'years' ? time : time / 12
    const discountFactor = Math.pow(1 + periodRate, -periods)
    const presentValue = fv * discountFactor

    const recommendations = []
    recommendations.push(`Future value: $${fv.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Time period: ${time} ${periodType}`)
    recommendations.push(`Discount factor: ${discountFactor.toFixed(4)}`)
    recommendations.push(`Present value: $${presentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}`)

    if (rate > 10) recommendations.push('High interest rate - significant discounting')
    else if (rate > 5) recommendations.push('Moderate interest rate - standard discounting')
    else recommendations.push('Low interest rate - minimal discounting')

    if (time > 20) recommendations.push('Long time period - substantial present value reduction')
    else if (time > 10) recommendations.push('Medium time period - moderate discounting')
    else recommendations.push('Short time period - minimal discounting')

    const details = { futureValue: fv, rate, time, periodType }

    return { presentValue, discountFactor, recommendations, details }
  }, [futureValue, interestRate, timePeriod, periodType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setFutureValue('')
    setInterestRate('')
    setTimePeriod('')
    setPeriodType('years')
    setShowResults(false)
  }

  const result = showResults ? calculatePV() : { presentValue: 0, discountFactor: 0, recommendations: [], details: { futureValue: 0, rate: 0, time: 0, periodType: '' } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
        <div className="flex items-center">
          <TrendingDown className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Present Value Calculator</h2>
        </div>
        <p className="text-cyan-100 mt-1">Calculate present value of future cash flows</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Future Value ($)</label>
              <input type="number" value={futureValue} onChange={(e) => setFutureValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Enter rate" step="0.1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Enter time" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
              <select value={periodType} onChange={(e) => setPeriodType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Select period type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <h3 className="text-lg font-semibold text-cyan-800 mb-2">Present Value</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">${result.presentValue?.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                <div className="text-cyan-700">Current value of future amount</div>
              </div>
            </div>

            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <h3 className="text-lg font-semibold text-cyan-800 mb-3">Calculation Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-cyan-700">Future Value:</span><span className="font-semibold text-cyan-800">${result.details.futureValue?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-cyan-700">Interest Rate:</span><span className="font-semibold text-cyan-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-cyan-700">Time Period:</span><span className="font-semibold text-cyan-800">{result.details.time} {result.details.periodType}</span></div>
                <div className="flex justify-between"><span className="text-cyan-700">Discount Factor:</span><span className="font-semibold text-cyan-800">{result.discountFactor?.toFixed(4)}</span></div>
                <div className="flex justify-between"><span className="text-cyan-700">Present Value:</span><span className="font-semibold text-cyan-800">${result.presentValue?.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <h3 className="text-lg font-semibold text-cyan-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span className="text-cyan-700">{rec}</span>
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
