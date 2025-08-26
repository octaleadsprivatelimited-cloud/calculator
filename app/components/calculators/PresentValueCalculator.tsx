'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, TrendingDown } from 'lucide-react'

export default function PresentValueCalculator() {
  const [futureValue, setFutureValue] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [timePeriod, setTimePeriod] = useState('')
  const [periodType, setPeriodType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculatePV = useCallback(() => {
    const fv = parseFloat(futureValue) || 0
    const rate = parseFloat(interestRate) || 0
    const time = parseFloat(timePeriod) || 0
    
    if (fv === 0 || rate === 0 || time === 0) return { 
      presentValue: 0, 
      discountFactor: 0,
      recommendations: [],
      details: { futureValue: 0, rate: 0, time: 0, periodType: '' }
    }

    const periodRate = rate / 100
    const periods = periodType === 'years' ? time : time / 12
    const discountFactor = Math.pow(1 + periodRate, -periods)
    const presentValue = fv * discountFactor

    const recommendations = []
    recommendations.push(`Future value: $${fv.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Time period: ${time} ${periodType}`)
    recommendations.push(`Discount factor: ${discountFactor.toFixed(4)}`)
    recommendations.push(`Present value: $${presentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}`)

    if (rate > 10) recommendations.push('High interest rate - significant discounting')
    else if (rate > 5) recommendations.push('Moderate interest rate - standard discounting')
    else recommendations.push('Low interest rate - minimal discounting')

    if (time > 20) recommendations.push('Long time period - substantial present value reduction')
    else if (time > 10) recommendations.push('Medium time period - moderate discounting')
    else recommendations.push('Short time period - minimal discounting')

    const details = { futureValue: fv, rate, time, periodType }

    return { presentValue, discountFactor, recommendations, details }
  }, [futureValue, interestRate, timePeriod, periodType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setFutureValue('')
    setInterestRate('')
    setTimePeriod('')
    setPeriodType('years')
    setShowResults(false)
  }

  const result = showResults ? calculatePV() : { presentValue: 0, discountFactor: 0, recommendations: [], details: { futureValue: 0, rate: 0, time: 0, periodType: '' } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
        <div className="flex items-center">
          <TrendingDown className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Present Value Calculator</h2>
        </div>
        <p className="text-cyan-100 mt-1">Calculate present value of future cash flows</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Future Value ($)</label>
              <input type="number" value={futureValue} onChange={(e) => setFutureValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Enter rate" step="0.1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Enter time" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
              <select value={periodType} onChange={(e) => setPeriodType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label="Select period type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <h3 className="text-lg font-semibold text-cyan-800 mb-2">Present Value</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">${result.presentValue?.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                <div className="text-cyan-700">Current value of future amount</div>
              </div>
            </div>

            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <h3 className="text-lg font-semibold text-cyan-800 mb-3">Calculation Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-cyan-700">Future Value:</span><span className="font-semibold text-cyan-800">${result.details.futureValue?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-cyan-700">Interest Rate:</span><span className="font-semibold text-cyan-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-cyan-700">Time Period:</span><span className="font-semibold text-cyan-800">{result.details.time} {result.details.periodType}</span></div>
                <div className="flex justify-between"><span className="text-cyan-700">Discount Factor:</span><span className="font-semibold text-cyan-800">{result.discountFactor?.toFixed(4)}</span></div>
                <div className="flex justify-between"><span className="text-cyan-700">Present Value:</span><span className="font-semibold text-cyan-800">${result.presentValue?.toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <h3 className="text-lg font-semibold text-cyan-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span className="text-cyan-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Present Value Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive present value calculator helps investors, financial planners, and business 
              professionals determine the current worth of future cash flows. This essential financial tool 
              demonstrates the time value of money, helping you evaluate investments, compare financial options, 
              and make informed decisions about long-term financial commitments.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Present Value:</strong> Current worth of future cash flows</li>
              <li><strong>Discount Factor:</strong> Reduction factor applied to future amounts</li>
              <li><strong>Time Value Analysis:</strong> Impact of time on money's worth</li>
              <li><strong>Investment Evaluation:</strong> Whether future returns justify current costs</li>
              <li><strong>Cash Flow Comparison:</strong> Compare different financial options</li>
              <li><strong>Risk Assessment:</strong> How interest rates affect present values</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Present Value vs. Future Value</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Present Value (PV)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Current worth of future money</li>
                  <li>Accounts for time value of money</li>
                  <li>Used for investment decisions</li>
                  <li>Formula: PV = FV ÷ (1 + r)^n</li>
                  <li>Always less than future value</li>
                  <li>Essential for financial planning</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Future Value (FV)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Future worth of current money</li>
                  <li>Shows growth potential</li>
                  <li>Used for savings planning</li>
                  <li>Formula: FV = PV × (1 + r)^n</li>
                  <li>Always greater than present value</li>
                  <li>Shows compound growth</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                <h5 className="font-semibold text-cyan-800 mb-1">Present Value</h5>
                <p className="text-cyan-700 text-sm">Current worth</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Discount Factor</h5>
                <p className="text-blue-700 text-sm">Reduction multiplier</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Time Period</h5>
                <p className="text-green-700 text-sm">Investment duration</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the future amount you expect to receive, the interest rate (discount rate), and the time 
              period. Choose between years or months, then click calculate to see the present value of that 
              future cash flow.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Financial Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Time Value of Money:</strong> Money today is worth more than money tomorrow</li>
              <li><strong>Discount Rate:</strong> Interest rate used to calculate present value</li>
              <li><strong>Discount Factor:</strong> (1 + r)^-n - reduces future value to present value</li>
              <li><strong>Opportunity Cost:</strong> What you could earn by investing elsewhere</li>
              <li><strong>Inflation Impact:</strong> Purchasing power decreases over time</li>
              <li><strong>Risk Premium:</strong> Higher returns for higher risk investments</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Present Value Examples</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Conservative Rate (5%):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>$10,000 in 10 years = $6,139 today</li>
                    <li>$10,000 in 20 years = $3,769 today</li>
                    <li>$10,000 in 30 years = $2,314 today</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Moderate Rate (8%):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>$10,000 in 10 years = $4,632 today</li>
                    <li>$10,000 in 20 years = $2,145 today</li>
                    <li>$10,000 in 30 years = $994 today</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Present Value</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Future Amount:</strong> Larger future amounts have larger present values</li>
              <li><strong>Interest Rate:</strong> Higher rates reduce present value more</li>
              <li><strong>Time Period:</strong> Longer time periods reduce present value more</li>
              <li><strong>Risk Level:</strong> Higher risk requires higher discount rates</li>
              <li><strong>Market Conditions:</strong> Economic factors affect discount rates</li>
              <li><strong>Inflation Expectations:</strong> Higher inflation reduces present value</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Investment Analysis:</strong> Evaluate potential investment returns</li>
              <li><strong>Loan Decisions:</strong> Compare loan costs and benefits</li>
              <li><strong>Insurance Planning:</strong> Value future insurance benefits</li>
              <li><strong>Retirement Planning:</strong> Determine needed savings amounts</li>
              <li><strong>Business Valuation:</strong> Assess company worth and cash flows</li>
              <li><strong>Real Estate:</strong> Evaluate property investment potential</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Investment Decision Making</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Net Present Value (NPV):</strong> Present value minus initial cost</li>
              <li><strong>Internal Rate of Return (IRR):</strong> Rate that makes NPV zero</li>
              <li><strong>Payback Period:</strong> Time to recover initial investment</li>
              <li><strong>Profitability Index:</strong> Present value divided by initial cost</li>
              <li><strong>Risk-Adjusted Returns:</strong> Returns considering risk factors</li>
              <li><strong>Opportunity Cost Analysis:</strong> Compare with alternative investments</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Discount Rate Selection</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Risk-Free Rate:</strong> Government bond yields as baseline</li>
              <li><strong>Market Risk Premium:</strong> Additional return for market risk</li>
              <li><strong>Company-Specific Risk:</strong> Additional risk for specific investments</li>
              <li><strong>Industry Standards:</strong> Typical rates for specific sectors</li>
              <li><strong>Personal Risk Tolerance:</strong> Individual comfort with risk</li>
              <li><strong>Alternative Returns:</strong> What you could earn elsewhere</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Present Value vs. Other Metrics</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Present Value:</strong> Current worth of future cash flows</li>
              <li><strong>Net Present Value:</strong> Present value minus initial investment</li>
              <li><strong>Internal Rate of Return:</strong> Rate that makes NPV zero</li>
              <li><strong>Payback Period:</strong> Time to recover initial investment</li>
              <li><strong>Profitability Index:</strong> Present value divided by cost</li>
              <li><strong>Modified Internal Rate of Return:</strong> IRR considering reinvestment</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Financial Planning Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Retirement Planning:</strong> Calculate needed savings for future income</li>
              <li><strong>Education Funding:</strong> Determine college savings requirements</li>
              <li><strong>Insurance Planning:</strong> Value future insurance benefits</li>
              <li><strong>Estate Planning:</strong> Plan for future inheritance needs</li>
              <li><strong>Business Planning:</strong> Evaluate business investment opportunities</li>
              <li><strong>Debt Management:</strong> Compare different debt repayment options</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-cyan-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When using present value calculations for investment decisions, always consider the opportunity 
                cost of your money. A $10,000 investment that returns $15,000 in 10 years might seem good, 
                but if you could earn 8% annually elsewhere, the present value is only $6,945. This means 
                you'd need to invest just $6,945 today at 8% to have $15,000 in 10 years, making the 
                $10,000 investment less attractive. Always compare present values to make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
