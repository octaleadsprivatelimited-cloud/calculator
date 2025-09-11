'use client'

import React, { useState, useCallback } from 'react'
import { Shuffle, Calculator as CalculatorIcon, RotateCcw, Dice1 } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface RandomResult {
  numbers: number[]
  count: number
  min: number
  max: number
  sum: number
  average: number
}

export default function RandomNumberGenerator() {
  const [minValue, setMinValue] = useState('1')
  const [maxValue, setMaxValue] = useState('100')
  const [count, setCount] = useState('10')
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [result, setResult] = useState<RandomResult | null>(null)
  const [generatedHistory, setGeneratedHistory] = useState<RandomResult[]>([])

  const generateRandomNumbers = useCallback(() => {
    const min = parseInt(minValue)
    const max = parseInt(maxValue)
    const numCount = parseInt(count)

    if (isNaN(min) || isNaN(max) || isNaN(numCount)) {
      alert('Please enter valid numbers')
      return
    }

    if (min >= max) {
      alert('Minimum value must be less than maximum value')
      return
    }

    if (numCount <= 0) {
      alert('Count must be a positive number')
      return
    }

    if (!allowDuplicates && (max - min + 1) < numCount) {
      alert('Cannot generate unique numbers: range is too small for count')
      return
    }

    let numbers: number[]
    
    if (allowDuplicates) {
      // Generate with duplicates allowed
      numbers = Array.from({ length: numCount }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
      )
    } else {
      // Generate unique numbers
      const range = max - min + 1
      const availableNumbers = Array.from({ length: range }, (_, i) => min + i)
      
      numbers = []
      for (let i = 0; i < numCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length)
        numbers.push(availableNumbers[randomIndex])
        availableNumbers.splice(randomIndex, 1)
      }
    }

    const sum = numbers.reduce((acc, val) => acc + val, 0)
    const average = sum / numbers.length

    const newResult: RandomResult = {
      numbers,
      count: numCount,
      min,
      max,
      sum,
      average: Math.round(average * 100) / 100
    }

    setResult(newResult)
    setGeneratedHistory(prev => [newResult, ...prev.slice(0, 4)]) // Keep last 5 results
  }, [minValue, maxValue, count, allowDuplicates])

  const clearHistory = () => {
    setGeneratedHistory([])
    setResult(null)
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-4">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Shuffle className="w-12 h-12 mr-3 text-violet-600" />
            Random Number Generator
          </h1>
          <p className="text-xl text-gray-600">
            Generate random numbers with various options and statistics
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-violet-600" />
              Generator Settings
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Value
                  </label>
                  <input
                    type="number"
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Value
                  </label>
                  <input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Values
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  placeholder="10"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowDuplicates"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                />
                <label htmlFor="allowDuplicates" className="ml-2 text-sm text-gray-700">
                  Allow duplicate numbers
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={generateRandomNumbers}
                  className="flex-1 bg-violet-600 text-white py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors font-medium"
                >
                  Generate Numbers
                </button>
                <button
                  onClick={clearHistory}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Clear history"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="font-semibold text-violet-800 mb-2">Quick Presets</h3>
              <div className="space-y-2 text-sm text-violet-600">
                <p>• <strong>Dice Roll:</strong> Min: 1, Max: 6, Count: 1</p>
                <p>• <strong>Lottery:</strong> Min: 1, Max: 49, Count: 6</p>
                <p>• <strong>Password:</strong> Min: 0, Max: 9, Count: 4</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {result && (
              <>
                {/* Share Options - Moved to Top */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
                  <ResultSharing
                    title="Random Number Generation Result"
                    inputs={[
                      { label: "Range", value: `${result.min} to ${result.max}` },
                      { label: "Count", value: `${result.count} numbers` },
                      { label: "Duplicates", value: allowDuplicates ? "Allowed" : "Not Allowed" },
                      { label: "Generation Type", value: "Random Number Generation" }
                    ]}
                    result={{ 
                      label: "Generated Numbers", 
                      value: result.numbers.slice(0, 5).join(', ') + (result.numbers.length > 5 ? '...' : ''),
                      unit: ""
                    }}
                    calculatorName="Random Number Generator"
                    className="mb-0"
                  />
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Dice1 className="w-6 h-6 mr-2 text-violet-600" />
                    Generated Numbers
                  </h2>
                  
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-violet-600 mb-2">
                      {result.numbers.join(', ')}
                    </div>
                    <p className="text-gray-600">
                      {result.count} random numbers from {result.min} to {result.max}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Sum</span>
                      <span className="font-semibold text-green-600">{formatNumber(result.sum)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Average</span>
                      <span className="font-semibold text-blue-600">{result.average}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Range</span>
                      <span className="font-semibold text-orange-600">{result.max - result.min + 1}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Duplicates</span>
                      <span className="font-semibold text-purple-600">
                        {allowDuplicates ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Number Analysis</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Smallest</span>
                      <span className="font-semibold text-red-600">{Math.min(...result.numbers)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Largest</span>
                      <span className="font-semibold text-green-600">{Math.max(...result.numbers)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Even Numbers</span>
                      <span className="font-semibold text-blue-600">
                        {result.numbers.filter(n => n % 2 === 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Odd Numbers</span>
                      <span className="font-semibold text-purple-600">
                        {result.numbers.filter(n => n % 2 === 1).length}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {generatedHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Generation History</h2>
                
                <div className="space-y-3">
                  {generatedHistory.map((history, index) => (
                    <div key={index} className="p-3 bg-violet-50 rounded-lg border border-violet-200">
                      <div className="text-sm text-violet-600 mb-1">
                        Set {index + 1}: {history.numbers.slice(0, 5).join(', ')}
                        {history.numbers.length > 5 && '...'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Sum: {history.sum} | Avg: {history.average}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Random Number Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>True randomness</strong> means each number has equal probability</p>
                <p>• <strong>No duplicates</strong> ensures unique values in your range</p>
                <p>• <strong>Large ranges</strong> provide more variety in results</p>
                <p>• <strong>Multiple generations</strong> help verify randomness</p>
              </div>
            </div>
          </div>
        </div>


        <footer className="text-center mt-12 text-gray-500">
        </footer>
      </div>
    </div>
  )
}
