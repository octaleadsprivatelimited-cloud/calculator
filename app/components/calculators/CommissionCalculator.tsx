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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Commission Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive commission calculator helps sales professionals, business owners, and managers 
              determine commission amounts and net proceeds from sales transactions. Whether you're calculating 
              percentage-based commissions, fixed amounts, or analyzing sales profitability, this tool provides 
              essential calculations to help you understand earnings and make informed business decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Commission Amount:</strong> Total commission earned on the sale</li>
              <li><strong>Net Amount:</strong> Sale proceeds after commission deduction</li>
              <li><strong>Effective Rate:</strong> Commission as percentage of sale (for fixed amounts)</li>
              <li><strong>Transaction Breakdown:</strong> Complete sale analysis</li>
              <li><strong>Commission Analysis:</strong> Rate evaluation and recommendations</li>
              <li><strong>Profitability Assessment:</strong> Impact on business margins</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Commission Types</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Percentage-Based Commissions</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Commission varies with sale amount</li>
                  <li>Common in real estate and sales</li>
                  <li>Scalable with business growth</li>
                  <li>Motivates higher sales volumes</li>
                  <li>Typical rates: 5-15%</li>
                  <li>Easy to calculate and understand</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Fixed Amount Commissions</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Set commission regardless of sale size</li>
                  <li>Common in service industries</li>
                  <li>Predictable earnings</li>
                  <li>May not scale with sales growth</li>
                  <li>Good for consistent pricing</li>
                  <li>Simplifies payroll calculations</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Commission</h5>
                <p className="text-purple-700 text-sm">Amount earned</p>
              </div>
              <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-1">Net Amount</h5>
                <p className="text-pink-700 text-sm">Proceeds after commission</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Effective Rate</h5>
                <p className="text-green-700 text-sm">Commission percentage</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the sale amount and commission rate or amount. Choose between percentage-based or fixed 
              amount commissions, then click calculate to see your commission earnings, net proceeds, and 
              complete transaction breakdown.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Commission Structures</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Real Estate:</strong> 5-6% of sale price (split between agents)</li>
              <li><strong>Car Sales:</strong> 20-30% of gross profit per vehicle</li>
              <li><strong>Insurance:</strong> 10-15% of first-year premium</li>
              <li><strong>Financial Services:</strong> 1-3% of investment amount</li>
              <li><strong>Retail Sales:</strong> 2-8% of sale amount</li>
              <li><strong>Consulting:</strong> 10-25% of project value</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Commission Rate Guidelines</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Low Commission (2-8%):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>High-volume, low-margin products</li>
                    <li>Established brands and markets</li>
                    <li>Recurring sales opportunities</li>
                    <li>Team-based sales structures</li>
                  </ul>
                </div>
                <div>
                  <p><strong>High Commission (15-25%):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Luxury goods and services</li>
                    <li>Complex technical sales</li>
                    <li>New market development</li>
                    <li>High-risk sales situations</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Commission Rates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Product Margins:</strong> Higher margins allow higher commissions</li>
              <li><strong>Sales Difficulty:</strong> Complex sales justify higher rates</li>
              <li><strong>Market Competition:</strong> Competitive markets may require higher rates</li>
              <li><strong>Sales Volume:</strong> High-volume sales may have lower rates</li>
              <li><strong>Experience Level:</strong> Senior salespeople often earn higher rates</li>
              <li><strong>Industry Standards:</strong> Market norms influence commission structures</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Commission vs. Salary Structures</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Pure Commission:</strong> 100% performance-based earnings</li>
              <li><strong>Base + Commission:</strong> Guaranteed salary plus performance bonus</li>
              <li><strong>Draw Against Commission:</strong> Advance payment against future earnings</li>
              <li><strong>Salary + Bonus:</strong> Fixed salary with performance incentives</li>
              <li><strong>Profit Sharing:</strong> Percentage of company or team profits</li>
              <li><strong>Residual Commissions:</strong> Ongoing payments for repeat business</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Commission Calculation Methods</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Straight Percentage:</strong> Fixed rate on total sale amount</li>
              <li><strong>Tiered Commissions:</strong> Different rates for different sale levels</li>
              <li><strong>Profit-Based:</strong> Commission on gross or net profit</li>
              <li><strong>Volume Bonuses:</strong> Additional rewards for meeting targets</li>
              <li><strong>Team Commissions:</strong> Shared commissions for collaborative sales</li>
              <li><strong>Performance Multipliers:</strong> Rate adjustments based on metrics</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Commission Management Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Set Clear Expectations:</strong> Define commission structure upfront</li>
              <li><strong>Document Everything:</strong> Keep detailed records of all sales</li>
              <li><strong>Regular Reviews:</strong> Periodically evaluate commission structures</li>
              <li><strong>Performance Metrics:</strong> Align commissions with business goals</li>
              <li><strong>Fair Distribution:</strong> Ensure equitable commission allocation</li>
              <li><strong>Legal Compliance:</strong> Follow labor laws and regulations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Commission Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Unclear Structure:</strong> Vague commission terms lead to disputes</li>
              <li><strong>Inconsistent Application:</strong> Different rates for similar sales</li>
              <li><strong>Delayed Payments:</strong> Late commission payments hurt motivation</li>
              <li><strong>Complex Calculations:</strong> Overly complicated formulas confuse staff</li>
              <li><strong>Ignoring Market Rates:</strong> Below-market commissions hurt retention</li>
              <li><strong>No Performance Reviews:</strong> Failing to adjust rates as needed</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When designing commission structures, consider both the salesperson's motivation and your 
                business profitability. A well-balanced commission structure should incentivize the behaviors 
                that drive business growth while maintaining healthy profit margins. Also, remember that 
                commission structures should be reviewed and adjusted periodically to reflect changing market 
                conditions, business goals, and individual performance. Consider implementing tiered commission 
                structures that reward higher performance levels and encourage continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
