'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Percent } from 'lucide-react'

export default function CommissionCalculator() {
  const [saleAmount, setSaleAmount] = useState('')
  const [commissionRate, setCommissionRate] = useState('')
  const [commissionType, setCommissionType] = useState('percentage')
  const [showResults, setShowResults] = useState(false)

  const calculateCommission = useCallback(() => {
    const sale = parseFloat(saleAmount) || 0
    const rate = parseFloat(commissionRate) || 0
    
    if (sale === 0 || rate === 0) return { 
      commission: 0, 
      netAmount: 0,
      recommendations: [],
      details: { sale: 0, rate: 0, type: '' }
    }

    let commission = 0
    if (commissionType === 'percentage') {
      commission = sale * (rate / 100)
    } else {
      commission = rate
    }
    
    const netAmount = sale - commission

    const recommendations = []
    recommendations.push(`Sale amount: $${sale.toLocaleString()}`)
    if (commissionType === 'percentage') {
      recommendations.push(`Commission rate: ${rate.toFixed(2)}%`)
      recommendations.push(`Commission amount: $${commission.toFixed(2)}`)
    } else {
      recommendations.push(`Commission amount: $${rate.toFixed(2)}`)
      recommendations.push(`Effective rate: ${((rate / sale) * 100).toFixed(2)}%`)
    }
    recommendations.push(`Net amount: $${netAmount.toFixed(2)}`)

    if (commissionType === 'percentage') {
      if (rate > 15) recommendations.push('High commission rate - typical for luxury goods')
      else if (rate > 10) recommendations.push('Moderate commission rate - standard sales')
      else recommendations.push('Low commission rate - high-volume sales')
    }

    const details = { sale, rate, type: commissionType }

    return { commission, netAmount, recommendations, details }
  }, [saleAmount, commissionRate, commissionType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setSaleAmount('')
    setCommissionRate('')
    setCommissionType('percentage')
    setShowResults(false)
  }

  const result = showResults ? calculateCommission() : { commission: 0, netAmount: 0, recommendations: [], details: { sale: 0, rate: 0, type: '' } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Percent className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Commission Calculator</h2>
        </div>
        <p className="text-purple-100 mt-1">Calculate sales commissions and net amounts</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sale Amount ($)</label>
              <input type="number" value={saleAmount} onChange={(e) => setSaleAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commission</label>
              <input type="number" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter rate/amount" step="0.1" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Commission Type</label>
            <select value={commissionType} onChange={(e) => setCommissionType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" aria-label="Select commission type">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Commission</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">${result.commission?.toFixed(2)}</div>
                <div className="text-purple-700">Commission amount</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Transaction Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-purple-700">Sale Amount:</span><span className="font-semibold text-purple-800">${result.details.sale?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-purple-700">Commission:</span><span className="font-semibold text-purple-800">${result.commission?.toFixed(2)}</span></div>
                <div className="border-t border-purple-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-purple-700">Net Amount:</span>
                    <span className="text-purple-800">${result.netAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Breakdown</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span className="text-purple-700">{rec}</span>
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
