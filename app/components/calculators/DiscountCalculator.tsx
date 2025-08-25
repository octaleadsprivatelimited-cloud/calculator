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
      details: {
        originalPrice: 0,
        discountPercent: 0,
        discountAmount: 0,
        finalPrice: 0,
        savingsPercent: 0
      }
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
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Discount Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive discount calculator helps shoppers, business owners, and financial 
              planners determine savings, final prices, and discount percentages. This essential tool 
              calculates various discount scenarios, providing clear breakdowns of original prices, 
              savings amounts, and final costs to help make informed purchasing decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Discount Amount:</strong> Dollar value of savings</li>
              <li><strong>Discount Percentage:</strong> Percentage off original price</li>
              <li><strong>Final Price:</strong> Price after discount applied</li>
              <li><strong>Savings Percentage:</strong> Percentage saved from original</li>
              <li><strong>Price Breakdown:</strong> Complete cost analysis</li>
              <li><strong>Purchase Recommendations:</strong> Smart shopping advice</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Types</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Percentage Discount</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Input:</strong> Original price + discount %</li>
                  <li><strong>Output:</strong> Final price and savings</li>
                  <li><strong>Use Case:</strong> Sale price calculations</li>
                  <li><strong>Example:</strong> 20% off $100 item</li>
                  <li><strong>Formula:</strong> Final = Original × (1 - %)</li>
                  <li><strong>Common:</strong> Most retail discounts</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Fixed Amount Discount</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Input:</strong> Original price + discount amount</li>
                  <li><strong>Output:</strong> Final price and discount %</li>
                  <li><strong>Use Case:</strong> Dollar-off promotions</li>
                  <li><strong>Example:</strong> $25 off $100 item</li>
                  <li><strong>Formula:</strong> Final = Original - Amount</li>
                  <li><strong>Common:</strong> Coupon and rebate offers</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Savings</h5>
                <p className="text-orange-700 text-sm">Total money saved</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Discount %</h5>
                <p className="text-blue-700 text-sm">Percentage off</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Final Price</h5>
                <p className="text-green-700 text-sm">Price after discount</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Savings %</h5>
                <p className="text-purple-700 text-sm">Percentage saved</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter any two values (original price, discount percentage, discount amount, or final price) 
              and the calculator will automatically compute the remaining values. This flexible approach 
              allows you to work with whatever information you have available, whether it's a sale 
              percentage, dollar amount off, or final price.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Discount Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Basic Concepts:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Original price is 100%</li>
                    <li>Discount reduces the price</li>
                    <li>Final price is what you pay</li>
                    <li>Savings is the difference</li>
                    <li>Percentage is relative to original</li>
                    <li>Amount is absolute dollar value</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Mathematical Relationships:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Final = Original - Discount</li>
                    <li>Discount = Original - Final</li>
                    <li>Discount % = (Discount/Original) × 100</li>
                    <li>Savings % = (Savings/Original) × 100</li>
                    <li>Final % = (Final/Original) × 100</li>
                    <li>All percentages add to 100%</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Discount Scenarios</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Retail Shopping</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Seasonal Sales:</strong> End-of-season clearances</li>
                  <li><strong>Holiday Promotions:</strong> Black Friday, Cyber Monday</li>
                  <li><strong>Clearance Events:</strong> Overstock and discontinued items</li>
                  <li><strong>Member Discounts:</strong> Loyalty program benefits</li>
                  <li><strong>Bundle Offers:</strong> Buy more, save more deals</li>
                  <li><strong>Flash Sales:</strong> Limited-time offers</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Business Applications</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Bulk Purchasing:</strong> Volume discount calculations</li>
                  <li><strong>Contract Negotiations:</strong> Price reduction analysis</li>
                  <li><strong>Competitive Pricing:</strong> Market rate adjustments</li>
                  <li><strong>Promotional Campaigns:</strong> Marketing discount strategies</li>
                  <li><strong>Inventory Management:</strong> Clearance pricing decisions</li>
                  <li><strong>Customer Retention:</strong> Loyalty discount programs</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Discount Calculation Methods</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Percentage Method:</strong> Calculate discount as percentage of original</li>
              <li><strong>Fixed Amount Method:</strong> Subtract specific dollar amount</li>
              <li><strong>Reverse Calculation:</strong> Work backwards from final price</li>
              <li><strong>Compound Discounts:</strong> Multiple discounts applied sequentially</li>
              <li><strong>Stacking Discounts:</strong> Combine different discount types</li>
              <li><strong>Threshold Discounts:</strong> Discounts based on purchase amount</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Smart Shopping Strategies</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Price Comparison</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Unit Price Analysis:</strong> Cost per unit comparison</li>
                  <li><strong>Brand Comparison:</strong> Similar products across brands</li>
                  <li><strong>Store Comparison:</strong> Same product at different retailers</li>
                  <li><strong>Online vs. In-Store:</strong> Digital vs. physical pricing</li>
                  <li><strong>Seasonal Timing:</strong> Best time to buy specific items</li>
                  <li><strong>Historical Pricing:</strong> Track price trends over time</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Discount Optimization</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Coupon Stacking:</strong> Combine multiple discount offers</li>
                  <li><strong>Cashback Programs:</strong> Additional savings through apps</li>
                  <li><strong>Credit Card Rewards:</strong> Points and cashback benefits</li>
                  <li><strong>Loyalty Programs:</strong> Member-exclusive discounts</li>
                  <li><strong>Student/Employee Discounts:</strong> Special pricing programs</li>
                  <li><strong>Bulk Purchase Savings:</strong> Volume discount opportunities</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Discount Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Always Compare:</strong> Check multiple retailers and prices</li>
              <li><strong>Consider Total Cost:</strong> Include taxes, shipping, and fees</li>
              <li><strong>Factor in Quality:</strong> Cheaper isn't always better value</li>
              <li><strong>Timing Matters:</strong> Wait for better sales when possible</li>
              <li><strong>Read Fine Print:</strong> Understand discount terms and conditions</li>
              <li><strong>Track Your Savings:</strong> Monitor total money saved over time</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Discount Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Impulse Buying:</strong> Purchasing just because it's on sale</li>
              <li><strong>Ignoring Quality:</strong> Focusing only on price reduction</li>
              <li><strong>Missing Hidden Costs:</strong> Forgetting taxes, shipping, etc.</li>
              <li><strong>Overlooking Better Deals:</strong> Not comparing multiple options</li>
              <li><strong>Timing Errors:</strong> Buying before better sales</li>
              <li><strong>Ignoring Return Policies:</strong> Not considering post-purchase options</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Discount Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Compound Discounts:</strong> Multiple percentage discounts applied</li>
              <li><strong>Stacking Rules:</strong> How different discounts combine</li>
              <li><strong>Threshold Discounts:</strong> Discounts based on purchase amount</li>
              <li><strong>Seasonal Pricing:</strong> Time-based discount patterns</li>
              <li><strong>Dynamic Pricing:</strong> Algorithm-based price adjustments</li>
              <li><strong>Psychological Pricing:</strong> $9.99 vs. $10.00 effects</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When calculating discounts, always consider the total cost of ownership, not just the 
                initial price reduction. Factor in quality, durability, warranty, and long-term value. 
                Use this calculator to compare different discount scenarios and determine which offers 
                the best overall value. Remember that the highest percentage discount isn't always the 
                best deal - sometimes a smaller discount on a higher-quality item provides better value. 
                Always shop around and compare multiple retailers to ensure you're getting the best 
                possible deal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
