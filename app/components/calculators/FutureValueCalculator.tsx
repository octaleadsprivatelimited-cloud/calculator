'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, TrendingUp } from 'lucide-react'

export default function FutureValueCalculator() {
  const [presentValue, setPresentValue] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [timePeriod, setTimePeriod] = useState('')
  const [periodType, setPeriodType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculateFV = useCallback(() => {
    const pv = parseFloat(presentValue) || 0
    const rate = parseFloat(interestRate) || 0
    const time = parseFloat(timePeriod) || 0
    
    if (pv === 0 || rate === 0 || time === 0) return { 
      futureValue: 0, 
      growthFactor: 0,
      recommendations: [],
      details: { presentValue: 0, rate: 0, time: 0, periodType: '' }
    }

    const periodRate = rate / 100
    const periods = periodType === 'years' ? time : time / 12
    const growthFactor = Math.pow(1 + periodRate, periods)
    const futureValue = pv * growthFactor

    const recommendations = []
    recommendations.push(`Present value: ${pv.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Time period: ${time} ${periodType}`)
    recommendations.push(`Growth factor: ${growthFactor.toFixed(4)}`)
    recommendations.push(`Future value: ${futureValue.toLocaleString(undefined, {maximumFractionDigits: 2})}`)

    if (rate > 10) recommendations.push('High interest rate - significant growth potential')
    else if (rate > 5) recommendations.push('Moderate interest rate - steady growth')
    else recommendations.push('Low interest rate - conservative growth')

    if (time > 20) recommendations.push('Long time period - substantial growth potential')
    else if (time > 10) recommendations.push('Medium time period - moderate growth')
    else recommendations.push('Short time period - limited growth')

    const details = { presentValue: pv, rate, time, periodType }

    return { futureValue, growthFactor, recommendations, details }
  }, [presentValue, interestRate, timePeriod, periodType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setPresentValue('')
    setInterestRate('')
    setTimePeriod('')
    setPeriodType('years')
    setShowResults(false)
  }

  const result = showResults ? calculateFV() : { futureValue: 0, growthFactor: 0, recommendations: [], details: { presentValue: 0, rate: 0, time: 0, periodType: '' } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-4">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Future Value Calculator</h2>
        </div>
        <p className="text-emerald-100 mt-1">Calculate future value of investments</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Present Value</label>
              <input type="number" value={presentValue} onChange={(e) => setPresentValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter rate" step="0.1" />
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
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Future Value</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{result.futureValue?.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                <div className="text-emerald-700">Future value of investment</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Calculation Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-emerald-700">Present Value:</span><span className="font-semibold text-emerald-800">{result.details.presentValue?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Interest Rate:</span><span className="font-semibold text-emerald-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Time Period:</span><span className="font-semibold text-emerald-800">{result.details.time} {result.details.periodType}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Growth Factor:</span><span className="font-semibold text-emerald-800">{result.growthFactor?.toFixed(4)}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Future Value:</span><span className="font-semibold text-emerald-800">{result.futureValue?.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Future Value Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive future value calculator helps investors and financial planners determine how much 
              an investment will be worth in the future based on compound interest. This essential financial tool 
              demonstrates the power of compound growth over time, helping you make informed decisions about 
              investments, retirement planning, and long-term financial goals.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Future Value:</strong> Final amount after compound interest growth</li>
              <li><strong>Growth Factor:</strong> Multiplier effect of compound interest</li>
              <li><strong>Investment Growth:</strong> Total increase in value over time</li>
              <li><strong>Compound Interest Impact:</strong> How interest compounds on interest</li>
              <li><strong>Time Value Analysis:</strong> Impact of investment duration</li>
              <li><strong>Rate Sensitivity:</strong> How interest rates affect growth</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Compound Interest vs. Simple Interest</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Compound Interest</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Interest earned on interest</li>
                  <li>Exponential growth over time</li>
                  <li>Higher returns in long term</li>
                  <li>Standard for most investments</li>
                  <li>Formula: FV = PV × (1 + r)^n</li>
                  <li>Best for long-term investing</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Simple Interest</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Interest only on principal</li>
                  <li>Linear growth over time</li>
                  <li>Lower returns in long term</li>
                  <li>Rare in modern investing</li>
                  <li>Formula: FV = PV × (1 + r×n)</li>
                  <li>Limited growth potential</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 mb-1">Future Value</h5>
                <p className="text-emerald-700 text-sm">Final investment amount</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Growth Factor</h5>
                <p className="text-green-700 text-sm">Compound interest multiplier</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Time Period</h5>
                <p className="text-blue-700 text-sm">Investment duration</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your present investment amount, annual interest rate, and time period. Choose between years 
              or months, then click calculate to see how much your investment will grow through compound interest.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Investment Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Present Value (PV):</strong> Current amount of money invested</li>
              <li><strong>Future Value (FV):</strong> Amount money will grow to in the future</li>
              <li><strong>Interest Rate (r):</strong> Annual rate of return (as decimal)</li>
              <li><strong>Time Period (n):</strong> Number of years or periods invested</li>
              <li><strong>Growth Factor:</strong> (1 + r)^n - shows compound growth multiplier</li>
              <li><strong>Compound Frequency:</strong> How often interest is calculated</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Investment Growth Examples</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Conservative Growth (5%):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>$10,000 → $16,289 in 10 years</li>
                    <li>$10,000 → $26,533 in 20 years</li>
                    <li>$10,000 → $43,219 in 30 years</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Moderate Growth (8%):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>$10,000 → $21,589 in 10 years</li>
                    <li>$10,000 → $46,610 in 20 years</li>
                    <li>$10,000 → $100,627 in 30 years</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Future Value</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Initial Investment:</strong> Larger amounts grow to larger future values</li>
              <li><strong>Interest Rate:</strong> Higher rates dramatically increase growth</li>
              <li><strong>Time Period:</strong> Longer time allows compound interest to work</li>
              <li><strong>Compound Frequency:</strong> More frequent compounding increases growth</li>
              <li><strong>Investment Consistency:</strong> Regular contributions accelerate growth</li>
              <li><strong>Tax Efficiency:</strong> Tax-advantaged accounts maximize growth</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Investment Vehicles</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Savings Accounts:</strong> Low risk, low return (1-3% typically)</li>
              <li><strong>Certificates of Deposit:</strong> Fixed terms, predictable returns</li>
              <li><strong>Bonds:</strong> Fixed income with varying risk levels</li>
              <li><strong>Stock Market:</strong> Higher risk, higher potential returns (7-10% average)</li>
              <li><strong>Mutual Funds:</strong> Diversified portfolios with professional management</li>
              <li><strong>Real Estate:</strong> Tangible assets with rental income potential</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Investment Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Dollar-Cost Averaging:</strong> Invest fixed amounts regularly</li>
              <li><strong>Buy and Hold:</strong> Long-term investment strategy</li>
              <li><strong>Diversification:</strong> Spread risk across different assets</li>
              <li><strong>Asset Allocation:</strong> Balance stocks, bonds, and other assets</li>
              <li><strong>Rebalancing:</strong> Periodically adjust portfolio mix</li>
              <li><strong>Tax-Loss Harvesting:</strong> Offset gains with losses</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Time Value of Money</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Early Investing:</strong> More time for compound interest to work</li>
              <li><strong>Delayed Investing:</strong> Requires larger amounts to reach goals</li>
              <li><strong>Rule of 72:</strong> Divide 72 by interest rate to find doubling time</li>
              <li><strong>Power of Compounding:</strong> Exponential growth over long periods</li>
              <li><strong>Opportunity Cost:</strong> Lost growth from delayed investing</li>
              <li><strong>Inflation Impact:</strong> Real returns may be lower than nominal</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Investment Planning Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Start Early:</strong> Time is your greatest ally in investing</li>
              <li><strong>Invest Regularly:</strong> Consistent contributions build wealth</li>
              <li><strong>Reinvest Dividends:</strong> Compound growth accelerates returns</li>
              <li><strong>Consider Inflation:</strong> Plan for real purchasing power</li>
              <li><strong>Diversify Risk:</strong> Don't put all eggs in one basket</li>
              <li><strong>Review Periodically:</strong> Adjust strategy as goals change</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                The most powerful factor in investment growth is time. Starting to invest just 5-10 years earlier 
                can result in dramatically larger future values due to compound interest. For example, investing 
                $10,000 at 8% for 30 years grows to $100,627, but starting 10 years earlier (40 years total) 
                grows to $217,245. This demonstrates why it's crucial to start investing as early as possible, 
                even with smaller amounts. Remember, compound interest works best when given time to work its magic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
