'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, TrendingUp } from 'lucide-react'

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState('')
  const [finalValue, setFinalValue] = useState('')
  const [timePeriod, setTimePeriod] = useState('')
  const [periodType, setPeriodType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculateROI = useCallback(() => {
    const initial = parseFloat(initialInvestment) || 0
    const final = parseFloat(finalValue) || 0
    const time = parseFloat(timePeriod) || 0
    
    if (initial === 0) return { roi: 0, annualizedROI: 0, profit: 0, recommendations: [], details: { initial: 0, final: 0, time: 0, periodType: '' } }

    const profit = final - initial
    const roi = (profit / initial) * 100
    const annualizedROI = time > 0 ? (Math.pow(final / initial, 1 / time) - 1) * 100 : 0

    const recommendations = []
    recommendations.push(`Initial investment: $${initial.toLocaleString()}`)
    recommendations.push(`Final value: $${final.toLocaleString()}`)
    recommendations.push(`Profit/Loss: $${profit.toLocaleString()}`)
    recommendations.push(`ROI: ${roi.toFixed(2)}%`)
    if (time > 0) recommendations.push(`Annualized ROI: ${annualizedROI.toFixed(2)}%`)

    if (roi > 100) recommendations.push('Excellent return - outstanding investment!')
    else if (roi > 50) recommendations.push('Very good return - strong performance')
    else if (roi > 20) recommendations.push('Good return - solid investment')
    else if (roi > 0) recommendations.push('Positive return - investment profitable')
    else recommendations.push('Negative return - investment lost money')

    const details = { initial, final, time, periodType }

    return { roi, annualizedROI, profit, recommendations, details }
  }, [initialInvestment, finalValue, timePeriod, periodType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setInitialInvestment('')
    setFinalValue('')
    setTimePeriod('')
    setPeriodType('years')
    setShowResults(false)
  }

  const result = showResults ? calculateROI() : { roi: 0, annualizedROI: 0, profit: 0, recommendations: [], details: { initial: 0, final: 0, time: 0, periodType: '' } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">ROI Calculator</h2>
        </div>
        <p className="text-emerald-100 mt-1">Calculate Return on Investment</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment ($)</label>
              <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Final Value ($)</label>
              <input type="number" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter value" step="100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter time" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
              <select value={periodType} onChange={(e) => setPeriodType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Select period type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">ROI Results</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{result.roi.toFixed(2)}%</div>
                <div className="text-emerald-700">Return on Investment</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Investment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-emerald-700">Initial Investment:</span><span className="font-semibold text-emerald-800">${result.details.initial?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Final Value:</span><span className="font-semibold text-emerald-800">${result.details.final?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Profit/Loss:</span><span className="font-semibold text-emerald-800">${result.profit?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Time Period:</span><span className="font-semibold text-emerald-800">{result.details.time} {result.details.periodType}</span></div>
                {result.details.time > 0 && (
                  <div className="flex justify-between"><span className="text-emerald-700">Annualized ROI:</span><span className="font-semibold text-emerald-800">{result.annualizedROI.toFixed(2)}%</span></div>
                )}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      <span className="text-emerald-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About ROI Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive ROI (Return on Investment) calculator helps investors, business owners, and 
              financial analysts evaluate the profitability and performance of investments. This essential 
              financial tool calculates both simple ROI and annualized ROI, providing insights into investment 
              efficiency and helping you make informed decisions about where to allocate your capital.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Simple ROI:</strong> Total return percentage over the investment period</li>
              <li><strong>Annualized ROI:</strong> Average annual return rate</li>
              <li><strong>Profit/Loss Amount:</strong> Absolute dollar gain or loss</li>
              <li><strong>Investment Performance:</strong> How well your investment performed</li>
              <li><strong>Time-Adjusted Returns:</strong> Returns considering investment duration</li>
              <li><strong>Performance Analysis:</strong> Investment success evaluation</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">ROI vs. Other Return Metrics</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Simple ROI</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Total return over entire period</li>
                  <li>Easy to calculate and understand</li>
                  <li>Good for single-period investments</li>
                  <li>Formula: (Final - Initial) ÷ Initial × 100</li>
                  <li>Doesn't account for time</li>
                  <li>Best for quick comparisons</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Annualized ROI</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Average annual return rate</li>
                  <li>Accounts for investment duration</li>
                  <li>Better for long-term investments</li>
                  <li>Formula: (Final/Initial)^(1/time) - 1</li>
                  <li>Standardizes returns across time</li>
                  <li>Best for comparing investments</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 mb-1">ROI Percentage</h5>
                <p className="text-emerald-700 text-sm">Total return rate</p>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                <h5 className="font-semibold text-teal-800 mb-1">Annualized ROI</h5>
                <p className="text-teal-700 text-sm">Yearly return rate</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Profit/Loss</h5>
                <p className="text-green-700 text-sm">Absolute dollar return</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your initial investment amount, final value, and time period. Choose between years or months, 
              then click calculate to see your ROI percentage, annualized returns, and complete investment analysis.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">ROI Interpretation Guidelines</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Negative ROI:</strong> Investment lost money - evaluate strategy</li>
              <li><strong>0-10% ROI:</strong> Low return - consider alternatives</li>
              <li><strong>10-20% ROI:</strong> Moderate return - acceptable performance</li>
              <li><strong>20-50% ROI:</strong> Good return - strong performance</li>
              <li><strong>50-100% ROI:</strong> Very good return - excellent performance</li>
              <li><strong>100%+ ROI:</strong> Outstanding return - exceptional performance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Investment Types and Expected ROIs</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Conservative Investments:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Savings accounts: 1-3% annually</li>
                    <li>Government bonds: 2-5% annually</li>
                    <li>Corporate bonds: 3-7% annually</li>
                    <li>Dividend stocks: 4-8% annually</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Growth Investments:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Stock market: 7-10% annually</li>
                    <li>Real estate: 8-12% annually</li>
                    <li>Small business: 15-25% annually</li>
                    <li>Venture capital: 20-40% annually</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting ROI</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Market Conditions:</strong> Economic environment and market trends</li>
              <li><strong>Investment Timing:</strong> When you buy and sell</li>
              <li><strong>Risk Level:</strong> Higher risk typically means higher potential returns</li>
              <li><strong>Investment Duration:</strong> Time in the market matters</li>
              <li><strong>Management Quality:</strong> For managed investments</li>
              <li><strong>Fees and Costs:</strong> Transaction costs reduce net returns</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">ROI vs. Other Performance Metrics</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>ROI:</strong> Simple return on investment percentage</li>
              <li><strong>IRR:</strong> Internal rate of return for complex cash flows</li>
              <li><strong>NPV:</strong> Net present value considering time value of money</li>
              <li><strong>Payback Period:</strong> Time to recover initial investment</li>
              <li><strong>Sharpe Ratio:</strong> Risk-adjusted return measure</li>
              <li><strong>Alpha:</strong> Excess return vs. market benchmark</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">ROI Calculation Methods</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Simple ROI:</strong> (Final Value - Initial Investment) ÷ Initial Investment × 100</li>
              <li><strong>Annualized ROI:</strong> (Final Value ÷ Initial Investment)^(1 ÷ Years) - 1 × 100</li>
              <li><strong>ROI with Cash Flows:</strong> (Total Cash In - Total Cash Out) ÷ Total Cash Out × 100</li>
              <li><strong>ROI with Dividends:</strong> (Final Value + Dividends - Initial Investment) ÷ Initial Investment × 100</li>
              <li><strong>ROI with Inflation:</strong> Real ROI = Nominal ROI - Inflation Rate</li>
              <li><strong>ROI with Taxes:</strong> After-tax ROI = Pre-tax ROI × (1 - Tax Rate)</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common ROI Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ignoring Time:</strong> Not considering investment duration</li>
              <li><strong>Excluding Costs:</strong> Forgetting fees, taxes, and expenses</li>
              <li><strong>Inflation Neglect:</strong> Not adjusting for purchasing power loss</li>
              <li><strong>Risk Ignorance:</strong> Focusing only on returns, not risk</li>
              <li><strong>Market Timing:</strong> Trying to predict market movements</li>
              <li><strong>Overlooking Taxes:</strong> Not considering tax implications</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">ROI in Different Contexts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Stock Investments:</strong> Capital gains and dividends</li>
              <li><strong>Real Estate:</strong> Property appreciation and rental income</li>
              <li><strong>Business Ventures:</strong> Profit generation and growth</li>
              <li><strong>Education:</strong> Career advancement and salary increases</li>
              <li><strong>Marketing Campaigns:</strong> Revenue generation vs. ad spend</li>
              <li><strong>Equipment Purchases:</strong> Productivity gains vs. costs</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When evaluating investments, always consider both ROI and risk. A 50% ROI might look impressive, 
                but if it comes with high volatility or the potential for significant losses, it may not be 
                suitable for your risk tolerance. Also, remember that past performance doesn't guarantee future 
                results. Use ROI as one of several metrics to evaluate investments, and consider factors like 
                diversification, time horizon, and your overall financial goals when making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
