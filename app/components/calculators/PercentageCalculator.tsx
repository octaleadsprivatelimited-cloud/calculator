'use client'

import React, { useState, useCallback } from 'react'
import { Percent, TrendingUp, TrendingDown, Calculator as CalculatorIcon, RotateCcw } from 'lucide-react'

interface PercentageResult {
  result: number
  calculation: string
  explanation: string
}

export default function PercentageCalculator() {
  const [calculationType, setCalculationType] = useState<'basic' | 'change' | 'percentage-of' | 'increase-decrease'>('basic')
  const [value1, setValue1] = useState('100')
  const [value2, setValue2] = useState('25')
  const [result, setResult] = useState<PercentageResult | null>(null)

  const calculatePercentage = useCallback(() => {
    const num1 = parseFloat(value1)
    const num2 = parseFloat(value2)

    if (isNaN(num1) || isNaN(num2)) {
      setResult(null)
      return
    }

    let calculatedResult = 0
    let calculation = ''
    let explanation = ''

    switch (calculationType) {
      case 'basic':
        calculatedResult = (num1 * num2) / 100
        calculation = `${num1} × ${num2}% = ${calculatedResult.toFixed(2)}`
        explanation = `${num2}% of ${num1} equals ${calculatedResult.toFixed(2)}`
        break

      case 'change':
        const change = num2 - num1
        const changePercent = (change / num1) * 100
        calculatedResult = changePercent
        calculation = `Change from ${num1} to ${num2}`
        explanation = `The value changed by ${changePercent.toFixed(2)}% (${change > 0 ? '+' : ''}${change.toFixed(2)})`
        break

      case 'percentage-of':
        calculatedResult = (num1 / num2) * 100
        calculation = `${num1} ÷ ${num2} × 100 = ${calculatedResult.toFixed(2)}%`
        explanation = `${num1} is ${calculatedResult.toFixed(2)}% of ${num2}`
        break

      case 'increase-decrease':
        const increase = num1 * (1 + num2 / 100)
        calculatedResult = increase
        calculation = `${num1} + ${num2}% = ${increase.toFixed(2)}`
        explanation = `Increasing ${num1} by ${num2}% gives ${increase.toFixed(2)}`
        break
    }

    setResult({
      result: calculatedResult,
      calculation,
      explanation
    })
  }, [calculationType, value1, value2])

  const clearAll = useCallback(() => {
    setValue1('100')
    setValue2('25')
    setResult(null)
  }, [])

  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) {
      return num.toString()
    }
    return num.toFixed(2)
  }

  const getCalculationTypeDescription = (type: string): string => {
    switch (type) {
      case 'basic':
        return 'Calculate what percentage of a number is'
      case 'change':
        return 'Calculate percentage change between two values'
      case 'percentage-of':
        return 'Calculate what percentage one number is of another'
      case 'increase-decrease':
        return 'Increase or decrease a number by a percentage'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Percent className="w-12 h-12 mr-3 text-purple-600" />
            Percentage Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate percentages, percentage changes, and more with ease
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-purple-600" />
              Calculation Type
            </h2>

            <div className="space-y-4">
              {/* Calculation Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What do you want to calculate?
                </label>
                <select
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  aria-label="Calculation type selection"
                  title="Select calculation type"
                >
                  <option value="basic">What is X% of Y?</option>
                  <option value="change">Percentage change from X to Y</option>
                  <option value="percentage-of">X is what % of Y?</option>
                  <option value="increase-decrease">Increase/decrease X by Y%</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {getCalculationTypeDescription(calculationType)}
                </p>
              </div>

              {/* First Value Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {calculationType === 'basic' ? 'Number' : 
                   calculationType === 'change' ? 'Original Value' :
                   calculationType === 'percentage-of' ? 'First Number' : 'Number'}
                </label>
                <input
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="100"
                  step="any"
                />
              </div>

              {/* Second Value Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {calculationType === 'basic' ? 'Percentage' : 
                   calculationType === 'change' ? 'New Value' :
                   calculationType === 'percentage-of' ? 'Second Number' : 'Percentage'}
                </label>
                <input
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="25"
                  step="any"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={calculatePercentage}
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Calculate
                </button>
                <button
                  onClick={clearAll}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Clear all values"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Main Result */}
            {result && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                  Result
                </h2>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {formatNumber(result.result)}
                    {calculationType === 'basic' || calculationType === 'increase-decrease' ? '' : '%'}
                  </div>
                  <p className="text-gray-600">{result.explanation}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Calculation</h3>
                  <p className="font-mono text-gray-700">{result.calculation}</p>
                </div>
              </div>
            )}

            {/* Quick Examples */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Examples</h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800">What is 15% of 200?</h3>
                  <p className="text-blue-600 text-sm">200 × 15% = 30</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800">Price increased from $50 to $60</h3>
                  <p className="text-green-600 text-sm">Change = (60-50)/50 × 100 = 20%</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800">25 is what % of 100?</h3>
                  <p className="text-yellow-600 text-sm">25 ÷ 100 × 100 = 25%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800">Increase 80 by 25%</h3>
                  <p className="text-purple-600 text-sm">80 + 25% = 80 × 1.25 = 100</p>
                </div>
              </div>
            </div>

            {/* Percentage Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Percentage Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>To find X% of Y:</strong> Multiply Y by X and divide by 100</p>
                <p>• <strong>To find what % X is of Y:</strong> Divide X by Y and multiply by 100</p>
                <p>• <strong>To increase by X%:</strong> Multiply by (1 + X/100)</p>
                <p>• <strong>To decrease by X%:</strong> Multiply by (1 - X/100)</p>
                <p>• <strong>Percentage change:</strong> (New - Old) ÷ Old × 100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Percentage Values */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Common Percentage Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90, 100].map(percent => (
              <div key={percent} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-lg font-bold text-purple-600">{percent}%</div>
                <div className="text-sm text-gray-600">
                  {percent === 1 ? '1/100' : 
                   percent === 2 ? '1/50' :
                   percent === 5 ? '1/20' :
                   percent === 10 ? '1/10' :
                   percent === 15 ? '3/20' :
                   percent === 20 ? '1/5' :
                   percent === 25 ? '1/4' :
                   percent === 30 ? '3/10' :
                   percent === 40 ? '2/5' :
                   percent === 50 ? '1/2' :
                   percent === 60 ? '3/5' :
                   percent === 75 ? '3/4' :
                   percent === 80 ? '4/5' :
                   percent === 90 ? '9/10' :
                   percent === 100 ? '1' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Percentage Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
