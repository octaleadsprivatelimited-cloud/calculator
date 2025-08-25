'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Percent } from 'lucide-react'

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [timePeriod, setTimePeriod] = useState('')
  const [periodType, setPeriodType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculateInterest = useCallback(() => {
    const p = parseFloat(principal) || 0
    const rate = parseFloat(interestRate) || 0
    const time = parseFloat(timePeriod) || 0
    
    if (p === 0 || rate === 0 || time === 0) return { 
      simpleInterest: 0, 
      compoundInterest: 0,
      totalAmount: 0,
      recommendations: [],
      details: { principal: 0, rate: 0, time: 0, periodType: '' }
    }

    const periodRate = rate / 100
    const periods = periodType === 'years' ? time : time / 12
    
    const simpleInterest = p * periodRate * periods
    const compoundInterest = p * Math.pow(1 + periodRate, periods) - p
    const totalAmount = p + compoundInterest

    const recommendations = []
    recommendations.push(`Principal: $${p.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Time period: ${time} ${periodType}`)
    recommendations.push(`Simple interest: $${simpleInterest.toFixed(2)}`)
    recommendations.push(`Compound interest: $${compoundInterest.toFixed(2)}`)
    recommendations.push(`Total amount: $${totalAmount.toFixed(2)}`)

    if (rate > 15) recommendations.push('High interest rate - significant growth potential')
    else if (rate > 8) recommendations.push('Moderate rate - steady growth')
    else recommendations.push('Low rate - conservative growth')

    if (time > 10) recommendations.push('Long time period - compound interest advantage')
    else if (time > 5) recommendations.push('Medium time period - balanced growth')
    else recommendations.push('Short time period - simple interest sufficient')

    const details = { principal: p, rate, time, periodType }

    return { simpleInterest, compoundInterest, totalAmount, recommendations, details }
  }, [principal, interestRate, timePeriod, periodType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setPrincipal('')
    setInterestRate('')
    setTimePeriod('')
    setPeriodType('years')
    setShowResults(false)
  }

  const result = showResults ? calculateInterest() : { simpleInterest: 0, compoundInterest: 0, totalAmount: 0, recommendations: [], details: { principal: 0, rate: 0, time: 0, periodType: '' } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
        <div className="flex items-center">
          <Percent className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Interest Calculator</h2>
        </div>
        <p className="text-yellow-100 mt-1">Calculate simple and compound interest</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal ($)</label>
              <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Enter amount" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Enter rate" step="0.1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Enter time" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
              <select value={periodType} onChange={(e) => setPeriodType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" aria-label="Select period type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Compound Interest</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">${result.compoundInterest?.toFixed(2)}</div>
                <div className="text-yellow-700">Interest earned</div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Interest Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-yellow-700">Principal:</span><span className="font-semibold text-yellow-800">${result.details.principal?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-yellow-700">Interest Rate:</span><span className="font-semibold text-yellow-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-yellow-700">Time Period:</span><span className="font-semibold text-yellow-800">{result.details.time} {result.details.periodType}</span></div>
                <div className="flex justify-between"><span className="text-yellow-700">Simple Interest:</span><span className="font-semibold text-yellow-800">${result.simpleInterest?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-yellow-700">Compound Interest:</span><span className="font-semibold text-yellow-800">${result.compoundInterest?.toFixed(2)}</span></div>
                <div className="border-t border-yellow-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-yellow-700">Total Amount:</span>
                    <span className="text-yellow-800">${result.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span className="text-yellow-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Interest Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive interest calculator helps you understand the difference between simple and compound interest, 
              and how they affect your investments and loans. Whether you're planning savings, evaluating loan options, 
              or analyzing investment returns, this tool provides clear calculations and insights into interest growth.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Simple Interest:</strong> Interest earned only on the principal amount</li>
              <li><strong>Compound Interest:</strong> Interest earned on principal plus accumulated interest</li>
              <li><strong>Total Amount:</strong> Principal plus total interest earned</li>
              <li><strong>Interest Comparison:</strong> Side-by-side analysis of both interest types</li>
              <li><strong>Growth Analysis:</strong> How interest compounds over time</li>
              <li><strong>Period Flexibility:</strong> Calculations in years or months</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Simple vs. Compound Interest</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Simple Interest</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Formula: I = P × r × t</li>
                  <li>Interest earned only on principal</li>
                  <li>Linear growth over time</li>
                  <li>Common in short-term loans</li>
                  <li>Easier to calculate</li>
                  <li>Lower total returns</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Compound Interest</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Formula: A = P(1 + r)^t</li>
                  <li>Interest earned on principal + interest</li>
                  <li>Exponential growth over time</li>
                  <li>Standard for investments</li>
                  <li>More complex calculation</li>
                  <li>Higher total returns</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-1">Simple Interest</h5>
                <p className="text-yellow-700 text-sm">Basic interest calculation</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Compound Interest</h5>
                <p className="text-orange-700 text-sm">Interest on interest growth</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Total Amount</h5>
                <p className="text-green-700 text-sm">Principal plus all interest</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your principal amount, interest rate, and time period. Choose between years or months, then click 
              calculate to see both simple and compound interest results, along with a detailed breakdown.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Savings Accounts:</strong> Calculate interest earned on deposits</li>
              <li><strong>Investment Planning:</strong> Project future investment growth</li>
              <li><strong>Loan Analysis:</strong> Understand total loan costs</li>
              <li><strong>Retirement Planning:</strong> Estimate long-term savings growth</li>
              <li><strong>Business Finance:</strong> Evaluate investment opportunities</li>
              <li><strong>Educational Purposes:</strong> Learn about interest concepts</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Interest Rate Considerations</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Annual Percentage Rate (APR):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Includes all loan costs</li>
                    <li>Standardized comparison tool</li>
                    <li>Required by law for loans</li>
                    <li>May include fees</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Annual Percentage Yield (APY):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Effective annual rate</li>
                    <li>Accounts for compounding</li>
                    <li>Used for investments</li>
                    <li>Higher than stated rate</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Interest Growth</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Principal Amount:</strong> Larger investments earn more interest</li>
              <li><strong>Interest Rate:</strong> Higher rates accelerate growth</li>
              <li><strong>Time Period:</strong> Longer periods maximize compound effects</li>
              <li><strong>Compounding Frequency:</strong> More frequent compounding increases returns</li>
              <li><strong>Tax Implications:</strong> Taxable interest reduces net returns</li>
              <li><strong>Inflation:</strong> Reduces real purchasing power of returns</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Investment Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Start Early:</strong> Time is the most powerful factor in compound growth</li>
              <li><strong>Regular Contributions:</strong> Consistent investing builds wealth over time</li>
              <li><strong>Reinvest Interest:</strong> Let compound interest work for you</li>
              <li><strong>Diversify:</strong> Spread risk across different investments</li>
              <li><strong>Monitor Rates:</strong> Seek competitive interest rates</li>
              <li><strong>Long-term Focus:</strong> Compound interest works best over decades</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                The power of compound interest is most evident over long periods. Even small differences in interest 
                rates can result in dramatically different outcomes over 20-30 years. Start investing early and let 
                compound interest work its magic - it's often called the "eighth wonder of the world" for good reason.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
