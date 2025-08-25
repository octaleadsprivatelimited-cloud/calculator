'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, TrendingUp } from 'lucide-react'

export default function AverageReturnCalculator() {
  const [returns, setReturns] = useState('')
  const [periods, setPeriods] = useState('')
  const [method, setMethod] = useState('arithmetic')
  const [showResults, setShowResults] = useState(false)

  const calculateReturns = useCallback(() => {
    if (!returns.trim()) return { 
      averageReturn: 0, 
      methods: { arithmetic: 0, geometric: 0, timeWeighted: 0, dollarWeighted: 0 },
      recommendations: [],
      methodName: ''
    }

    const returnValues = returns.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r))
    const periodsCount = parseFloat(periods) || returnValues.length
    
    if (returnValues.length === 0) return { 
      averageReturn: 0, 
      methods: { arithmetic: 0, geometric: 0, timeWeighted: 0, dollarWeighted: 0 },
      recommendations: [],
      methodName: ''
    }

    // Arithmetic Mean
    const arithmeticMean = returnValues.reduce((sum, r) => sum + r, 0) / returnValues.length

    // Geometric Mean (for compound returns)
    const product = returnValues.reduce((prod, r) => prod * (1 + r/100), 1)
    const geometricMean = (Math.pow(product, 1/returnValues.length) - 1) * 100

    // Time-Weighted Return
    const timeWeighted = returnValues.reduce((sum, r, i) => sum + (r * (i + 1)), 0) / 
                         returnValues.reduce((sum, _, i) => sum + (i + 1), 0)

    // Dollar-Weighted Return (simplified)
    const dollarWeighted = returnValues.reduce((sum, r) => sum + r, 0) / returnValues.length

    const methods = {
      arithmetic: arithmeticMean,
      geometric: geometricMean,
      timeWeighted: timeWeighted,
      dollarWeighted: dollarWeighted
    }

    let averageReturn = 0
    let methodName = ''

    switch (method) {
      case 'arithmetic':
        averageReturn = arithmeticMean
        methodName = 'Arithmetic Mean'
        break
      case 'geometric':
        averageReturn = geometricMean
        methodName = 'Geometric Mean'
        break
      case 'timeWeighted':
        averageReturn = timeWeighted
        methodName = 'Time-Weighted Return'
        break
      case 'dollarWeighted':
        averageReturn = dollarWeighted
        methodName = 'Dollar-Weighted Return'
        break
      default:
        averageReturn = arithmeticMean
        methodName = 'Arithmetic Mean'
    }

    // Generate recommendations
    const recommendations = []
    if (returnValues.length > 0) {
      recommendations.push(`Analyzed ${returnValues.length} return periods`)
      
      if (method === 'geometric') {
        recommendations.push('Geometric mean is best for compound returns over time')
        recommendations.push('Useful for long-term investment analysis')
      } else if (method === 'timeWeighted') {
        recommendations.push('Time-weighted returns eliminate impact of cash flows')
        recommendations.push('Best for comparing investment managers')
      } else if (method === 'dollarWeighted') {
        recommendations.push('Dollar-weighted considers timing of investments')
        recommendations.push('Reflects actual investor experience')
      } else {
        recommendations.push('Arithmetic mean is simplest but may overstate returns')
        recommendations.push('Good for short-term analysis')
      }

      const volatility = Math.sqrt(returnValues.reduce((sum, r) => sum + Math.pow(r - arithmeticMean, 2), 0) / returnValues.length)
      recommendations.push(`Volatility: ${volatility.toFixed(2)}%`)
      
      if (volatility > 20) {
        recommendations.push('High volatility - consider risk management strategies')
      } else if (volatility > 10) {
        recommendations.push('Moderate volatility - typical for equity investments')
      } else {
        recommendations.push('Low volatility - typical for bond investments')
      }
    }

    return { averageReturn, methods, recommendations, methodName }
  }, [returns, periods, method])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setReturns('')
    setPeriods('')
    setMethod('arithmetic')
    setShowResults(false)
  }

  const result = showResults ? calculateReturns() : { 
    averageReturn: 0, 
    methods: {
      arithmetic: 0,
      geometric: 0,
      timeWeighted: 0,
      dollarWeighted: 0
    }, 
    recommendations: [],
    methodName: ''
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Average Return Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate different types of average returns</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Returns (comma-separated %)
            </label>
            <input
              type="text"
              value={returns}
              onChange={(e) => setReturns(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="5.2, -3.1, 8.7, 2.4, 6.1"
              aria-label="Returns as comma-separated percentages"
            />
            <p className="text-sm text-gray-500 mt-1">Enter returns as percentages, separated by commas</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Periods
              </label>
              <input
                type="number"
                value={periods}
                onChange={(e) => setPeriods(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Auto-detect"
                aria-label="Number of periods (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Select calculation method"
              >
                <option value="arithmetic">Arithmetic Mean</option>
                <option value="geometric">Geometric Mean</option>
                <option value="timeWeighted">Time-Weighted</option>
                <option value="dollarWeighted">Dollar-Weighted</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Average Return</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {result.averageReturn.toFixed(2)}%
                </div>
                <div className="text-green-700">
                  Using {result.methodName}
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">All Methods Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Arithmetic Mean:</span>
                  <span className="font-semibold text-green-800">{result.methods.arithmetic?.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Geometric Mean:</span>
                  <span className="font-semibold text-green-800">{result.methods.geometric?.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Time-Weighted:</span>
                  <span className="font-semibold text-green-800">{result.methods.timeWeighted?.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Dollar-Weighted:</span>
                  <span className="font-semibold text-green-800">{result.methods.dollarWeighted?.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Analysis & Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-green-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Average Return Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive average return calculator helps investors and financial analysts determine 
              the average performance of investments over time using multiple calculation methods. This 
              essential financial tool provides insights into investment performance, helping you compare 
              different investment strategies and make informed decisions about portfolio management.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Arithmetic Mean:</strong> Simple average of returns</li>
              <li><strong>Geometric Mean:</strong> Compound average return</li>
              <li><strong>Time-Weighted Return:</strong> Performance independent of cash flows</li>
              <li><strong>Dollar-Weighted Return:</strong> Performance considering investment timing</li>
              <li><strong>Method Comparison:</strong> Side-by-side analysis of different approaches</li>
              <li><strong>Performance Analysis:</strong> Investment strategy evaluation</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Methods Explained</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Arithmetic Mean</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Simple average of all returns</li>
                  <li>Formula: Sum of returns ÷ Number of periods</li>
                  <li>Doesn't account for compounding</li>
                  <li>Good for short-term analysis</li>
                  <li>Easier to understand</li>
                  <li>May overstate long-term returns</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Geometric Mean</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Compound average return</li>
                  <li>Accounts for investment growth</li>
                  <li>More accurate for long periods</li>
                  <li>Formula: (Product of (1 + returns))^(1/n) - 1</li>
                  <li>Better for performance comparison</li>
                  <li>Industry standard for mutual funds</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Return Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Time-Weighted Return</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Eliminates cash flow impact</li>
                  <li>Measures pure investment performance</li>
                  <li>Good for fund manager evaluation</li>
                  <li>Not affected by deposit timing</li>
                  <li>Standard for mutual fund reporting</li>
                  <li>Formula: Geometric mean of period returns</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Dollar-Weighted Return</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Considers investment timing</li>
                  <li>Reflects actual investor experience</li>
                  <li>Affected by cash flow timing</li>
                  <li>Good for personal portfolio analysis</li>
                  <li>Also called Internal Rate of Return</li>
                  <li>Formula: Rate that makes NPV zero</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Average Return</h5>
                <p className="text-green-700 text-sm">Selected method result</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Method Comparison</h5>
                <p className="text-blue-700 text-sm">All calculation results</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Analysis</h5>
                <p className="text-purple-700 text-sm">Performance insights</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your investment returns as percentages (e.g., 5.2 for 5.2%), separated by commas. 
              Choose your preferred calculation method, and the calculator will show the average return 
              along with comparisons of all methods.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Use Each Method</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Arithmetic Mean:</strong> Quick estimates, short-term analysis</li>
              <li><strong>Geometric Mean:</strong> Long-term performance, compound growth</li>
              <li><strong>Time-Weighted:</strong> Fund manager evaluation, pure performance</li>
              <li><strong>Dollar-Weighted:</strong> Personal portfolio, actual experience</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Investment Performance Analysis</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>High Volatility Impact:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Arithmetic mean overstates returns</li>
                    <li>Geometric mean shows true performance</li>
                    <li>Volatility reduces compound returns</li>
                    <li>Risk-adjusted returns matter more</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Cash Flow Timing:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Time-weighted ignores cash flows</li>
                    <li>Dollar-weighted considers timing</li>
                    <li>Market timing affects results</li>
                    <li>Dollar-cost averaging impact</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Investment Scenarios</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Lump Sum Investment:</strong> All methods give similar results</li>
              <li><strong>Regular Contributions:</strong> Dollar-weighted shows actual experience</li>
              <li><strong>Market Timing:</strong> Dollar-weighted reflects strategy success</li>
              <li><strong>Fund Comparison:</strong> Time-weighted for fair comparison</li>
              <li><strong>Personal Planning:</strong> Dollar-weighted for realistic expectations</li>
              <li><strong>Performance Reporting:</strong> Geometric mean for accuracy</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Return Calculation Best Practices</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Consistent Periods:</strong> Monthly, quarterly, or annual returns</li>
              <li><strong>Include All Returns:</strong> Don't omit negative periods</li>
              <li><strong>Consider Time Period:</strong> Longer periods need geometric mean</li>
              <li><strong>Account for Fees:</strong> Use net returns after expenses</li>
              <li><strong>Compare Similar Assets:</strong> Same risk level and time period</li>
              <li><strong>Use Multiple Methods:</strong> Get complete performance picture</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Performance Benchmarking</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Market Indices:</strong> S&P 500, Dow Jones, NASDAQ</li>
              <li><strong>Peer Groups:</strong> Similar investment strategies</li>
              <li><strong>Risk-Adjusted Returns:</strong> Sharpe ratio, Sortino ratio</li>
              <li><strong>Absolute Returns:</strong> Target return goals</li>
              <li><strong>Inflation-Adjusted:</strong> Real returns over time</li>
              <li><strong>Tax-Adjusted:</strong> After-tax performance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Calculation Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Using Arithmetic for Long Periods:</strong> Overstates compound returns</li>
              <li><strong>Ignoring Negative Returns:</strong> Can't use geometric mean with negatives</li>
              <li><strong>Mixing Return Types:</strong> Nominal vs. real returns</li>
              <li><strong>Inconsistent Periods:</strong> Monthly vs. annual returns</li>
              <li><strong>Excluding Fees:</strong> Gross vs. net returns</li>
              <li><strong>Survivorship Bias:</strong> Only including successful investments</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                For most investment analysis, use the geometric mean as it provides the most accurate 
                representation of compound growth over time. However, if you're evaluating your personal 
                investment experience (especially with regular contributions), the dollar-weighted return 
                will give you the most realistic picture of your actual performance. Remember that past 
                performance doesn't guarantee future results, and always consider risk alongside returns 
                when making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
