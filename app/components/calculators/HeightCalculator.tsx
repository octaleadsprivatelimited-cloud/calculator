'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, User, Ruler } from 'lucide-react'

export default function HeightCalculator() {
  const [inputHeight, setInputHeight] = useState('')
  const [inputUnit, setInputUnit] = useState('feet')
  const [showResults, setShowResults] = useState(false)

  const calculateHeight = useCallback(() => {
    const height = parseFloat(inputHeight) || 0

    if (height === 0) return {
      feet: 0,
      inches: 0,
      centimeters: 0,
      meters: 0,
      comparison: ''
    }

    let feet = 0
    let inches = 0
    let centimeters = 0
    let meters = 0

    // Convert from input unit to all other units
    if (inputUnit === 'feet') {
      feet = Math.floor(height)
      inches = Math.round((height - feet) * 12)
      centimeters = height * 30.48
      meters = height * 0.3048
    } else if (inputUnit === 'inches') {
      feet = Math.floor(height / 12)
      inches = height % 12
      centimeters = height * 2.54
      meters = height * 0.0254
    } else if (inputUnit === 'centimeters') {
      feet = Math.floor(height / 30.48)
      inches = Math.round((height / 2.54) % 12)
      centimeters = height
      meters = height / 100
    } else if (inputUnit === 'meters') {
      feet = Math.floor(height / 0.3048)
      inches = Math.round((height / 0.0254) % 12)
      centimeters = height * 100
      meters = height
    }

    // Determine height category
    let comparison = ''
    if (centimeters >= 200) comparison = 'Very Tall - Above 6\'7"'
    else if (centimeters >= 190) comparison = 'Tall - 6\'3" to 6\'7"'
    else if (centimeters >= 180) comparison = 'Above Average - 5\'11" to 6\'3"'
    else if (centimeters >= 170) comparison = 'Average - 5\'7" to 5\'11"'
    else if (centimeters >= 160) comparison = 'Below Average - 5\'3" to 5\'7"'
    else if (centimeters >= 150) comparison = 'Short - 5\'0" to 5\'3"'
    else comparison = 'Very Short - Below 5\'0"'

    return {
      feet,
      inches,
      centimeters,
      meters,
      comparison
    }
  }, [inputHeight, inputUnit])

  const handleCalculate = () => {
    if (inputHeight) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setInputHeight('')
    setInputUnit('feet')
    setShowResults(false)
  }

  const result = showResults ? calculateHeight() : { feet: 0, inches: 0, centimeters: 0, meters: 0, comparison: '' }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Height Calculator</h1>
            <p className="text-teal-100 text-lg">
              Convert height between feet, inches, centimeters, and meters.
            </p>
          </div>
          <div className="hidden md:block">
            <User className="w-16 h-16 text-teal-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height Value
              </label>
              <input
                type="number"
                value={inputHeight}
                onChange={(e) => setInputHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                placeholder="5.9"
                min="0"
                max="1000"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Unit
              </label>
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Select height unit"
              >
                <option value="feet">Feet (decimal)</option>
                <option value="inches">Inches</option>
                <option value="centimeters">Centimeters</option>
                <option value="meters">Meters</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Height Categories</h3>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-800">Very Short</div>
                <div className="text-sm text-gray-600">Below 5 feet</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-800">Short</div>
                <div className="text-sm text-gray-600">5 feet to 5'3"</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-800">Average</div>
                <div className="text-sm text-gray-600">5'7" to 5'11"</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-800">Tall</div>
                <div className="text-sm text-gray-600">6'3" to 6'7"</div>
              </div>
            </div>
          </div>
        </div>

        {inputHeight && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Calculate Height
            </button>
          </div>
        )}

        {showResults && (
          <div className="space-y-6">
            <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">Height Conversion Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-teal-700">{result.feet}'{result.inches}"</div>
                  <div className="text-sm text-gray-600">Feet & Inches</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{result.centimeters.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Centimeters</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.meters.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Meters</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{result.comparison}</div>
                  <div className="text-sm text-gray-600">Category</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


