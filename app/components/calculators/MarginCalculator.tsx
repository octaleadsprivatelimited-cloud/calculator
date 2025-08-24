'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Percent } from 'lucide-react'

export default function MarginCalculator() {
  const [revenue, setRevenue] = useState('')
  const [cost, setCost] = useState('')
  const [price, setPrice] = useState('')
  const [costPerUnit, setCostPerUnit] = useState('')
  const [units, setUnits] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateMargin = useCallback(() => {
    const rev = parseFloat(revenue) || 0
    const c = parseFloat(cost) || 0
    const p = parseFloat(price) || 0
    const cpu = parseFloat(costPerUnit) || 0
    const u = parseFloat(units) || 0

    if (rev === 0 && p === 0) return { 
      grossMargin: 0, 
      grossMarginPercent: 0,
      netMargin: 0,
      netMarginPercent: 0,
      markup: 0,
      markupPercent: 0,
      recommendations: [],
      details: {
        revenue: 0,
        cost: 0,
        price: 0,
        costPerUnit: 0,
        units: 0,
        operatingExpenses: 0
      }
    }

    let grossMargin = 0
    let grossMarginPercent = 0
    let netMargin = 0
    let netMarginPercent = 0
    let markup = 0
    let markupPercent = 0

    // Calculate based on available inputs
    if (rev > 0 && c > 0) {
      // Revenue and cost provided
      grossMargin = rev - c
      grossMarginPercent = (grossMargin / rev) * 100
      markup = grossMargin
      markupPercent = (markup / c) * 100
    } else if (p > 0 && cpu > 0) {
      // Price and cost per unit provided
      const totalRevenue = p * u
      const totalCost = cpu * u
      grossMargin = totalRevenue - totalCost
      grossMarginPercent = (grossMargin / totalRevenue) * 100
      markup = p - cpu
      markupPercent = (markup / cpu) * 100
    } else if (p > 0 && c > 0) {
      // Price and total cost provided
      grossMargin = p - c
      grossMarginPercent = (grossMargin / p) * 100
      markup = grossMargin
      markupPercent = (markup / c) * 100
    }

    // Estimate net margin (assuming 30% operating expenses)
    const operatingExpenses = rev > 0 ? rev * 0.3 : (p * u) * 0.3
    netMargin = grossMargin - operatingExpenses
    netMarginPercent = rev > 0 ? (netMargin / rev) * 100 : (netMargin / (p * u)) * 100

    // Generate recommendations
    const recommendations = []
    if (grossMarginPercent > 0) {
      recommendations.push(`Gross margin: ${grossMarginPercent.toFixed(1)}%`)
      
      if (grossMarginPercent > 50) {
        recommendations.push('Excellent gross margin - strong pricing power')
        recommendations.push('Consider reinvesting in growth or R&D')
      } else if (grossMarginPercent > 30) {
        recommendations.push('Good gross margin - competitive position')
        recommendations.push('Monitor costs and pricing strategies')
      } else if (grossMarginPercent > 15) {
        recommendations.push('Moderate gross margin - room for improvement')
        recommendations.push('Consider cost reduction or price increases')
      } else {
        recommendations.push('Low gross margin - immediate attention needed')
        recommendations.push('Review pricing, costs, and business model')
      }

      if (markupPercent > 100) {
        recommendations.push('High markup - ensure value proposition is clear')
      } else if (markupPercent > 50) {
        recommendations.push('Reasonable markup - typical for many industries')
      } else {
        recommendations.push('Low markup - may need pricing review')
      }
    }

    const details = {
      revenue: rev > 0 ? rev : p * u,
      cost: c > 0 ? c : cpu * u,
      price: p,
      costPerUnit: cpu,
      units: u,
      operatingExpenses
    }

    return { 
      grossMargin, 
      grossMarginPercent, 
      netMargin, 
      netMarginPercent, 
      markup, 
      markupPercent, 
      recommendations, 
      details 
    }
  }, [revenue, cost, price, costPerUnit, units])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setRevenue('')
    setCost('')
    setPrice('')
    setCostPerUnit('')
    setUnits('')
    setShowResults(false)
  }

  const result = showResults ? calculateMargin() : { 
    grossMargin: 0, 
    grossMarginPercent: 0,
    netMargin: 0,
    netMarginPercent: 0,
    markup: 0,
    markupPercent: 0,
    recommendations: [],
    details: {
      revenue: 0,
      cost: 0,
      price: 0,
      costPerUnit: 0,
      units: 0,
      operatingExpenses: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
        <div className="flex items-center">
          <Percent className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Margin Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate gross margin, net margin, and markup</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revenue ($)
              </label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter revenue"
                step="0.01"
                aria-label="Total revenue in dollars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Cost ($)
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter total cost"
                step="0.01"
                aria-label="Total cost in dollars"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Unit ($)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                step="0.01"
                aria-label="Price per unit in dollars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost per Unit ($)
              </label>
              <input
                type="number"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter cost"
                step="0.01"
                aria-label="Cost per unit in dollars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Units Sold
              </label>
              <input
                type="number"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter units"
                aria-label="Number of units sold"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Gross Margin</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${result.grossMargin.toFixed(2)}
                </div>
                <div className="text-blue-700">
                  {result.grossMarginPercent.toFixed(1)}% of revenue
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Margin Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Gross Margin:</span>
                  <span className="font-semibold text-blue-800">${result.grossMargin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Gross Margin %:</span>
                  <span className="font-semibold text-blue-800">{result.grossMarginPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Net Margin:</span>
                  <span className="font-semibold text-blue-800">${result.netMargin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Net Margin %:</span>
                  <span className="font-semibold text-blue-800">{result.netMarginPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Markup:</span>
                  <span className="font-semibold text-blue-800">${result.markup.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Markup %:</span>
                  <span className="font-semibold text-blue-800">{result.markupPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Input Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Revenue:</span>
                  <span className="font-semibold text-blue-800">${result.details.revenue?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Cost:</span>
                  <span className="font-semibold text-blue-800">${result.details.cost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Operating Expenses:</span>
                  <span className="font-semibold text-blue-800">${result.details.operatingExpenses?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-700">{rec}</span>
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
