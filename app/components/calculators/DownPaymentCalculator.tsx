'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, DollarSign } from 'lucide-react'

export default function DownPaymentCalculator() {
  const [homePrice, setHomePrice] = useState('')
  const [downPaymentPercent, setDownPaymentPercent] = useState('20')
  const [showResults, setShowResults] = useState(false)

  const calculateDownPayment = useCallback(() => {
    const price = parseFloat(homePrice) || 0
    const percent = parseFloat(downPaymentPercent) || 20
    
    if (price === 0) return { 
      downPayment: 0, 
      loanAmount: 0,
      pmiRequired: false,
      recommendations: [],
      details: { price: 0, percent: 0 }
    }

    const downPayment = price * (percent / 100)
    const loanAmount = price - downPayment
    const pmiRequired = percent < 20

    const recommendations = []
    recommendations.push(`Home price: $${price.toLocaleString()}`)
    recommendations.push(`Down payment: $${downPayment.toLocaleString()} (${percent}%)`)
    recommendations.push(`Loan amount: $${loanAmount.toLocaleString()}`)
    
    if (pmiRequired) {
      recommendations.push('PMI required - down payment below 20%')
      recommendations.push('Consider increasing down payment to avoid PMI')
    } else {
      recommendations.push('No PMI required - down payment 20% or higher')
      recommendations.push('Good equity position')
    }

    if (percent < 5) recommendations.push('Very low down payment - may not qualify')
    else if (percent < 10) recommendations.push('Low down payment - FHA loans available')
    else if (percent < 20) recommendations.push('Moderate down payment - conventional loans')
    else recommendations.push('High down payment - excellent loan terms')

    const details = { price, percent }

    return { downPayment, loanAmount, pmiRequired, recommendations, details }
  }, [homePrice, downPaymentPercent])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setHomePrice('')
    setDownPaymentPercent('20')
    setShowResults(false)
  }

  const result = showResults ? calculateDownPayment() : { downPayment: 0, loanAmount: 0, pmiRequired: false, recommendations: [], details: { price: 0, percent: 0 } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Down Payment Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate down payment and loan amounts</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Price ($)</label>
              <input type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter price" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment (%)</label>
              <select value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Select down payment percentage">
                <option value="3.5">3.5% (FHA)</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
                <option value="30">30%</option>
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
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Down Payment Required</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">${result.downPayment?.toLocaleString()}</div>
                <div className="text-green-700">{result.details.percent}% of home price</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Loan Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-green-700">Home Price:</span><span className="font-semibold text-green-800">${result.details.price?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Down Payment:</span><span className="font-semibold text-green-800">${result.downPayment?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Loan Amount:</span><span className="font-semibold text-green-800">${result.loanAmount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-green-700">PMI Required:</span><span className="font-semibold text-green-800">{result.pmiRequired ? 'Yes' : 'No'}</span></div>
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
      </div>
    </div>
  )
}
