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
      </div>
    </div>
  )
}
