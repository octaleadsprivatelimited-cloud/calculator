'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Tag } from 'lucide-react'

export default function PercentOffCalculator() {
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculatePercentOff = useCallback(() => {
    const original = parseFloat(originalPrice) || 0
    const discount = parseFloat(discountPercent) || 0
    
    if (original === 0 || discount === 0) return { 
      savings: 0, 
      finalPrice: 0,
      recommendations: [],
      details: { original: 0, discount: 0 }
    }

    const savings = original * (discount / 100)
    const finalPrice = original - savings

    const recommendations = []
    recommendations.push(`Original price: $${original.toFixed(2)}`)
    recommendations.push(`Discount: ${discount.toFixed(1)}%`)
    recommendations.push(`Savings: $${savings.toFixed(2)}`)
    recommendations.push(`Final price: $${finalPrice.toFixed(2)}`)

    if (discount > 50) recommendations.push('Major discount - great deal!')
    else if (discount > 25) recommendations.push('Good discount - worth considering')
    else if (discount > 10) recommendations.push('Moderate discount - standard sale')
    else recommendations.push('Small discount - minimal savings')

    const details = { original, discount }

    return { savings, finalPrice, recommendations, details }
  }, [originalPrice, discountPercent])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setOriginalPrice('')
    setDiscountPercent('')
    setShowResults(false)
  }

  const result = showResults ? calculatePercentOff() : { savings: 0, finalPrice: 0, recommendations: [], details: { original: 0, discount: 0 } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <div className="flex items-center">
          <Tag className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Percent Off Calculator</h2>
        </div>
        <p className="text-orange-100 mt-1">Calculate savings and final prices</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($)</label>
              <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter price" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Enter discount" step="0.1" />
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">You Save</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">${result.savings?.toFixed(2)}</div>
                <div className="text-orange-700">Total savings</div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-orange-700">Original Price:</span><span className="font-semibold text-orange-800">${result.details.original?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-orange-700">Discount:</span><span className="font-semibold text-orange-800">{result.details.discount?.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span className="text-orange-700">Savings:</span><span className="font-semibold text-orange-800">${result.savings?.toFixed(2)}</span></div>
                <div className="border-t border-orange-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-orange-700">Final Price:</span>
                    <span className="text-orange-800">${result.finalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">Summary</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-orange-700">{rec}</span>
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
