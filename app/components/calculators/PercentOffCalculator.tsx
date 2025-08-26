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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Percent Off Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive Percent Off Calculator helps shoppers, retailers, and financial planners determine 
              exact savings and final prices when applying percentage discounts. This essential tool provides 
              accurate calculations for sales, promotions, and budget planning, ensuring you make informed 
              purchasing decisions and understand the true value of discounts.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Savings Amount:</strong> Dollar value of the discount</li>
              <li><strong>Final Price:</strong> Price after discount is applied</li>
              <li><strong>Discount Analysis:</strong> Assessment of discount value</li>
              <li><strong>Price Breakdown:</strong> Complete cost structure</li>
              <li><strong>Deal Evaluation:</strong> Whether the discount is worthwhile</li>
              <li><strong>Budget Planning:</strong> Cost savings for financial planning</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Discount Categories and Value</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Small Discounts (1-10%)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Typical Savings:</strong> $1-10 on $100 purchase</li>
                  <li><strong>Common Use:</strong> Regular sales and promotions</li>
                  <li><strong>Value Assessment:</strong> Minimal but immediate savings</li>
                  <li><strong>Best For:</strong> Essential purchases and necessities</li>
                  <li><strong>Timing:</strong> Can be used anytime</li>
                  <li><strong>Strategy:</strong> Stack with other small discounts</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Major Discounts (50%+)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Typical Savings:</strong> $50+ on $100 purchase</li>
                  <li><strong>Common Use:</strong> Clearance sales and special events</li>
                  <li><strong>Value Assessment:</strong> Significant savings opportunity</li>
                  <li><strong>Best For:</strong> Non-essential items and luxury goods</li>
                  <li><strong>Timing:</strong> Limited time offers</li>
                  <li><strong>Strategy:</strong> Act quickly, verify quality</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Savings</h5>
                <p className="text-orange-700 text-sm">Money you save</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Final Price</h5>
                <p className="text-green-700 text-sm">What you pay</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Original Price</h5>
                <p className="text-blue-700 text-sm">Starting price</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Discount %</h5>
                <p className="text-purple-700 text-sm">Percentage off</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the original price of the item and the discount percentage being offered. The calculator will 
              automatically compute your total savings, the final price you'll pay, and provide recommendations 
              on whether the discount represents good value for your money.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Shopping Strategies</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Timing Your Purchases:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>End-of-season sales (30-70% off)</li>
                    <li>Holiday promotions (10-50% off)</li>
                    <li>Clearance events (50-90% off)</li>
                    <li>Flash sales (24-48 hour deals)</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Discount Stacking:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Store discounts + coupons</li>
                    <li>Sale prices + cashback</li>
                    <li>Membership rewards + sales</li>
                    <li>Credit card rewards + discounts</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Value Assessment Framework</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Good Value Indicators</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>High Discount %:</strong> 30% or more off</li>
                  <li><strong>Quality Product:</strong> Well-reviewed items</li>
                  <li><strong>Genuine Need:</strong> Actually useful to you</li>
                  <li><strong>Competitive Price:</strong> Better than other retailers</li>
                  <li><strong>Limited Availability:</strong> Rare or seasonal items</li>
                  <li><strong>Brand Reputation:</strong> Trusted manufacturer</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Poor Value Indicators</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Low Discount %:</strong> Less than 10% off</li>
                  <li><strong>Inflated Original Price:</strong> Artificially high MSRP</li>
                  <li><strong>Poor Quality:</strong> Substandard materials</li>
                  <li><strong>No Real Need:</strong> Impulse purchase</li>
                  <li><strong>Better Alternatives:</strong> Superior options available</li>
                  <li><strong>Hidden Costs:</strong> Shipping, taxes, fees</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Discount Scenarios</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Retail Sales:</strong> Seasonal promotions and clearance events</li>
              <li><strong>Online Shopping:</strong> Digital coupons and promo codes</li>
              <li><strong>Membership Discounts:</strong> Store loyalty programs</li>
              <li><strong>Student/Employee:</strong> Educational and corporate discounts</li>
              <li><strong>Bulk Purchases:</strong> Volume discounts and wholesale pricing</li>
              <li><strong>First-time Buyers:</strong> New customer incentives</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Psychological Pricing Strategies</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Charm Pricing</h5>
                <p className="text-blue-700 text-sm">$9.99 vs $10.00</p>
                <p className="text-blue-600 text-xs mt-1">Perceived as significantly cheaper</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Anchoring</h5>
                <p className="text-green-700 text-sm">Original price as reference</p>
                <p className="text-green-600 text-xs mt-1">Makes discount seem larger</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Urgency</h5>
                <p className="text-purple-700 text-sm">Limited time offers</p>
                <p className="text-purple-600 text-xs mt-1">Creates fear of missing out</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Budget Planning with Discounts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Savings Allocation:</strong> Put discount savings toward other goals</li>
              <li><strong>Purchase Timing:</strong> Plan major purchases around sales</li>
              <li><strong>Emergency Fund:</strong> Use unexpected savings for emergencies</li>
              <li><strong>Investment Opportunities:</strong> Invest discount savings for growth</li>
              <li><strong>Debt Reduction:</strong> Apply savings to outstanding balances</li>
              <li><strong>Future Purchases:</strong> Save for larger, more expensive items</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Avoiding Common Discount Pitfalls</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Impulse Buying</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Wait 24 Hours:</strong> Sleep on major purchase decisions</li>
                  <li><strong>Need vs. Want:</strong> Distinguish between necessities and desires</li>
                  <li><strong>Budget Check:</strong> Ensure purchase fits your financial plan</li>
                  <li><strong>Research First:</strong> Compare prices and read reviews</li>
                  <li><strong>Quality Assessment:</strong> Don't sacrifice quality for price</li>
                  <li><strong>Return Policy:</strong> Understand terms before buying</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Hidden Costs</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Shipping Fees:</strong> Factor in delivery costs</li>
                  <li><strong>Taxes:</strong> Include applicable sales tax</li>
                  <li><strong>Maintenance:</strong> Consider ongoing care costs</li>
                  <li><strong>Accessories:</strong> Additional items needed</li>
                  <li><strong>Warranty:</strong> Extended protection costs</li>
                  <li><strong>Storage:</strong> Space requirements and costs</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Maximizing Discount Benefits</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Combine Offers:</strong> Stack multiple discount types</li>
              <li><strong>Time Your Purchases:</strong> Buy during optimal sales periods</li>
              <li><strong>Use Rewards Programs:</strong> Earn points and cashback</li>
              <li><strong>Negotiate Prices:</strong> Ask for additional discounts</li>
              <li><strong>Buy in Bulk:</strong> Take advantage of volume discounts</li>
              <li><strong>Consider Alternatives:</strong> Look for similar items on sale</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Technology and Discounts</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Digital Tools</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Price Tracking:</strong> Monitor price changes over time</li>
                  <li><strong>Coupon Apps:</strong> Find and apply digital coupons</li>
                  <li><strong>Cashback Services:</strong> Earn money back on purchases</li>
                  <li><strong>Price Comparison:</strong> Compare across multiple retailers</li>
                  <li><strong>Deal Alerts:</strong> Get notified of price drops</li>
                  <li><strong>Browser Extensions:</strong> Automatic coupon application</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Online Shopping</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Free Shipping:</strong> Look for shipping cost waivers</li>
                  <li><strong>Email Subscriptions:</strong> Sign up for sale notifications</li>
                  <li><strong>Social Media:</strong> Follow brands for exclusive offers</li>
                  <li><strong>Mobile Apps:</strong> Use retailer mobile applications</li>
                  <li><strong>Virtual Shopping:</strong> Try before you buy</li>
                  <li><strong>Digital Wallets:</strong> Use payment apps for rewards</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that a discount is only valuable if you actually need the item and it fits your budget. 
                Don't let the excitement of saving money lead to spending money you wouldn't otherwise spend. 
                Always calculate the final price and consider whether you'd buy the item at that price without 
                the discount. The best deals are on items you were already planning to purchase, not on 
                impulse buys triggered by the discount itself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
