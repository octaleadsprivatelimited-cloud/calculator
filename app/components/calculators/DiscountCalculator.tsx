'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Tag } from 'lucide-react'

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [finalPrice, setFinalPrice] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateDiscount = useCallback(() => {
    const original = parseFloat(originalPrice) || 0
    const percent = parseFloat(discountPercent) || 0
    const final = parseFloat(finalPrice) || 0
    const amount = parseFloat(discountAmount) || 0
    
    if (original === 0) return { 
      savings: 0, 
      finalPrice: 0,
      discountPercent: 0,
      recommendations: [],
      details: {}
    }

    let savings = 0
    let calculatedFinalPrice = 0
    let calculatedDiscountPercent = 0

    if (percent > 0) {
      // Calculate discount amount and final price
      savings = original * (percent / 100)
      calculatedFinalPrice = original - savings
      calculatedDiscountPercent = percent
    } else if (final > 0) {
      // Calculate discount from final price
      savings = original - final
      calculatedDiscountPercent = (savings / original) * 100
      calculatedFinalPrice = final
    } else if (amount > 0) {
      // Calculate discount from discount amount
      savings = amount
      calculatedDiscountPercent = (amount / original) * 100
      calculatedFinalPrice = original - amount
    }

    // Generate recommendations
    const recommendations = []
    recommendations.push(`Original price: $${original.toFixed(2)}`)
    recommendations.push(`Discount: ${calculatedDiscountPercent.toFixed(1)}%`)
    recommendations.push(`You save: $${savings.toFixed(2)}`)
    recommendations.push(`Final price: $${calculatedFinalPrice.toFixed(2)}`)

    if (calculatedDiscountPercent > 50) {
      recommendations.push('Excellent discount - great value!')
      recommendations.push('Consider if this is a limited-time offer')
    } else if (calculatedDiscountPercent > 25) {
      recommendations.push('Good discount - worth considering')
      recommendations.push('Compare with similar products')
    } else if (calculatedDiscountPercent > 10) {
      recommendations.push('Moderate discount - standard sale')
      recommendations.push('Check if better deals exist')
    } else {
      recommendations.push('Small discount - minimal savings')
      recommendations.push('Consider waiting for better deals')
    }

    const details = {
      originalPrice: original,
      discountPercent: calculatedDiscountPercent,
      discountAmount: savings,
      finalPrice: calculatedFinalPrice,
      savingsPercent: (savings / original) * 100
    }

    return { 
      savings, 
      finalPrice: calculatedFinalPrice, 
      discountPercent: calculatedDiscountPercent, 
      recommendations, 
      details 
    }
  }, [originalPrice, discountPercent, finalPrice, discountAmount])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setOriginalPrice('')
    setDiscountPercent('')
    setFinalPrice('')
    setDiscountAmount('')
    setShowResults(false)
  }

  const result = showResults ? calculateDiscount() : { 
    savings: 0, 
    finalPrice: 0,
    discountPercent: 0,
    recommendations: [],
    details: {
      originalPrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      finalPrice: 0,
      savingsPercent: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
        <div className="flex items-center">
          <Tag className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Discount Calculator</h2>
        </div>
        <p className="text-orange-100 mt-1">Calculate discounts, savings, and final prices</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price ($)
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter original price"
              step="0.01"
              aria-label="Original price in dollars"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter %"
                step="0.1"
                aria-label="Discount percentage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Price ($)
              </label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter price"
                step="0.01"
                aria-label="Final price in dollars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Amount ($)
              </label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter amount"
                step="0.01"
                aria-label="Discount amount in dollars"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Calculator className="h-5 w-5 inline mr-2" />
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <RotateCcw className="h-5 w-5 inline mr-2" />
              Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Your Savings</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  ${result.savings.toFixed(2)}
                </div>
                <div className="text-orange-700">
                  {result.discountPercent.toFixed(1)}% off
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-orange-700">Original Price:</span>
                  <span className="font-semibold text-orange-800">${result.details.originalPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Discount:</span>
                  <span className="font-semibold text-orange-800">{result.details.discountPercent?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Savings:</span>
                  <span className="font-semibold text-orange-800">${result.details.discountAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Final Price:</span>
                  <span className="font-semibold text-orange-800">${result.details.finalPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Savings %:</span>
                  <span className="font-semibold text-orange-800">{result.details.savingsPercent?.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">Summary & Recommendations</h3>
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
