'use client'
import React, { useState } from 'react'
import { Calculator, RotateCcw } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function ExampleCalculator() {
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [operation, setOperation] = useState('+')
  const [showResult, setShowResult] = useState(false)

  const calculateResult = () => {
    const num1 = parseFloat(input1) || 0
    const num2 = parseFloat(input2) || 0
    let result = 0

    switch (operation) {
      case '+':
        result = num1 + num2
        break
      case '-':
        result = num1 - num2
        break
      case '×':
        result = num1 * num2
        break
      case '÷':
        result = num2 !== 0 ? num1 / num2 : 0
        break
      default:
        result = num1 + num2
    }

    return result
  }

  const handleCalculate = () => {
    if (input1 && input2) {
      setShowResult(true)
    }
  }

  const handleReset = () => {
    setInput1('')
    setInput2('')
    setOperation('+')
    setShowResult(false)
  }

  const result = showResult ? calculateResult() : 0

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Calculator className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Example Calculator</h2>
        </div>
        <p className="text-purple-100 mt-1">Simple calculator with sharing functionality</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Number
              </label>
              <input
                type="number"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter first number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                aria-label="Select operation"
                title="Select operation"
              >
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="×">×</option>
                <option value="÷">÷</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Number
              </label>
              <input
                type="number"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter second number"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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

        {showResult && (
          <>
            {/* Share Options - Moved to Top */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <ResultSharing
                title="Calculator Result"
                inputs={[
                  { label: "First Number", value: input1 },
                  { label: "Operation", value: operation },
                  { label: "Second Number", value: input2 }
                ]}
                result={{ 
                  label: "Result", 
                  value: result.toString(),
                  unit: ""
                }}
                calculatorName="Example Calculator"
                className="mb-0"
              />
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Result</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-900 mb-2">
                  {input1} {operation} {input2} = {result}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
