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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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
                Revenue
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
                Total Cost
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
                Price per Unit
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
                Cost per Unit
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
                  {result.grossMargin.toFixed(2)}
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
                  <span className="font-semibold text-blue-800">{result.grossMargin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Gross Margin %:</span>
                  <span className="font-semibold text-blue-800">{result.grossMarginPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Net Margin:</span>
                  <span className="font-semibold text-blue-800">{result.netMargin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Net Margin %:</span>
                  <span className="font-semibold text-blue-800">{result.netMarginPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Markup:</span>
                  <span className="font-semibold text-blue-800">{result.markup.toFixed(2)}</span>
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
                  <span className="font-semibold text-blue-800">{result.details.revenue?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Cost:</span>
                  <span className="font-semibold text-blue-800">{result.details.cost?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Operating Expenses:</span>
                  <span className="font-semibold text-blue-800">{result.details.operatingExpenses?.toFixed(2)}</span>
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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Margin Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive margin calculator helps business owners, managers, and financial analysts 
              determine profitability metrics including gross margin, net margin, and markup percentages. 
              This essential business tool provides insights into pricing strategies, cost management, and 
              overall business profitability, helping you make informed decisions about pricing, operations, 
              and business strategy.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Gross Margin:</strong> Profit after direct costs, before operating expenses</li>
              <li><strong>Net Margin:</strong> Final profit after all costs and expenses</li>
              <li><strong>Markup:</strong> Amount added to cost to determine selling price</li>
              <li><strong>Margin Percentages:</strong> Profit margins as percentages of revenue</li>
              <li><strong>Profitability Analysis:</strong> Business performance evaluation</li>
              <li><strong>Pricing Insights:</strong> How pricing affects profitability</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Margin vs. Markup</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Margin</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Profit as percentage of selling price</li>
                  <li>Shows profit per dollar of revenue</li>
                  <li>Formula: (Revenue - Cost) ÷ Revenue × 100</li>
                  <li>Always less than 100%</li>
                  <li>Used for profitability analysis</li>
                  <li>Standard business metric</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Markup</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Profit as percentage of cost</li>
                  <li>Shows how much to add to cost</li>
                  <li>Formula: (Revenue - Cost) ÷ Cost × 100</li>
                  <li>Can exceed 100%</li>
                  <li>Used for pricing decisions</li>
                  <li>Common in retail and manufacturing</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Gross Margin</h5>
                <p className="text-blue-700 text-sm">Profit after direct costs</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Net Margin</h5>
                <p className="text-green-700 text-sm">Final profit percentage</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Markup</h5>
                <p className="text-purple-700 text-sm">Price increase over cost</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your total revenue, total costs, and optionally price per unit, cost per unit, and units 
              sold. The calculator will compute gross margin, net margin, markup, and provide profitability 
              analysis and recommendations.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Business Metrics</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Revenue:</strong> Total income from sales before any deductions</li>
              <li><strong>Cost of Goods Sold (COGS):</strong> Direct costs to produce or acquire products</li>
              <li><strong>Operating Expenses:</strong> Indirect costs like rent, salaries, utilities</li>
              <li><strong>Gross Profit:</strong> Revenue minus direct costs</li>
              <li><strong>Net Profit:</strong> Revenue minus all costs and expenses</li>
              <li><strong>Profitability Ratios:</strong> Margins as percentages of revenue</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Industry Margin Benchmarks</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>High-Margin Industries:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Software: 60-80% gross margin</li>
                    <li>Pharmaceuticals: 50-70% gross margin</li>
                    <li>Luxury goods: 40-60% gross margin</li>
                    <li>Consulting: 30-50% net margin</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Low-Margin Industries:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Retail: 20-40% gross margin</li>
                    <li>Manufacturing: 15-35% gross margin</li>
                    <li>Restaurants: 10-25% net margin</li>
                    <li>Transportation: 5-15% net margin</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Margins</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Pricing Strategy:</strong> Higher prices typically mean higher margins</li>
              <li><strong>Cost Structure:</strong> Lower costs increase profit margins</li>
              <li><strong>Market Competition:</strong> Competitive markets may reduce margins</li>
              <li><strong>Economies of Scale:</strong> Larger operations often have better margins</li>
              <li><strong>Product Mix:</strong> High-margin products improve overall margins</li>
              <li><strong>Operational Efficiency:</strong> Streamlined processes reduce costs</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Margin Improvement Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Increase Prices:</strong> Raise selling prices strategically</li>
              <li><strong>Reduce Costs:</strong> Negotiate better supplier terms</li>
              <li><strong>Improve Efficiency:</strong> Streamline operations and processes</li>
              <li><strong>Product Mix Optimization:</strong> Focus on high-margin products</li>
              <li><strong>Volume Discounts:</strong> Negotiate bulk purchase savings</li>
              <li><strong>Technology Investment:</strong> Automate to reduce labor costs</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Pricing Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Cost-Plus Pricing:</strong> Add markup to cost</li>
              <li><strong>Value-Based Pricing:</strong> Price based on customer value</li>
              <li><strong>Competitive Pricing:</strong> Match or beat competitor prices</li>
              <li><strong>Dynamic Pricing:</strong> Adjust prices based on demand</li>
              <li><strong>Bundle Pricing:</strong> Package products for better margins</li>
              <li><strong>Premium Pricing:</strong> Higher prices for quality positioning</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Margin Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ignoring Hidden Costs:</strong> Not including all expenses</li>
              <li><strong>Pricing Too Low:</strong> Undervaluing products or services</li>
              <li><strong>Cost Creep:</strong> Allowing costs to increase over time</li>
              <li><strong>Poor Cost Allocation:</strong> Incorrectly assigning costs</li>
              <li><strong>Ignoring Market Changes:</strong> Not adjusting to new conditions</li>
              <li><strong>Focusing Only on Revenue:</strong> Neglecting cost control</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Margin Analysis Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Business Planning:</strong> Set realistic profit targets</li>
              <li><strong>Pricing Decisions:</strong> Determine optimal selling prices</li>
              <li><strong>Cost Control:</strong> Identify areas for cost reduction</li>
              <li><strong>Performance Evaluation:</strong> Compare actual vs. target margins</li>
              <li><strong>Investment Analysis:</strong> Evaluate business profitability</li>
              <li><strong>Strategic Planning:</strong> Plan for growth and expansion</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When analyzing margins, always consider both the percentage and absolute dollar amounts. A 
                50% margin on a $10 product ($5 profit) is very different from a 20% margin on a $100 
                product ($20 profit). Also, regularly review your margins to ensure they're keeping pace 
                with rising costs. Many businesses fail to adjust prices when costs increase, leading to 
                margin erosion over time. Remember that healthy margins are essential for business growth, 
                reinvestment, and weathering economic downturns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
