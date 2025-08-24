'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Dumbbell } from 'lucide-react'

export default function LeanBodyMassCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [bodyFat, setBodyFat] = useState('')
  const [method, setMethod] = useState('boer')
  const [showResults, setShowResults] = useState(false)

  const calculateLeanMass = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    const bf = parseFloat(bodyFat) || 0
    if (w === 0 || h === 0) return { 
      leanMass: 0, 
      fatMass: 0, 
      methods: {}, 
      recommendations: [] 
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const weightKg = w * 0.453592
    const heightM = heightCm / 100

    // Calculate using different methods
    const methods = {
      boer: 0,
      james: 0,
      hume: 0,
      bodyFat: 0
    }

    // Boer formula
    if (gender === 'male') {
      methods.boer = (0.407 * weightKg) + (0.267 * heightCm) - 19.2
    } else {
      methods.boer = (0.252 * weightKg) + (0.473 * heightCm) - 48.3
    }

    // James formula
    if (gender === 'male') {
      if (heightCm <= 110) {
        methods.james = 0.5 * weightKg
      } else if (heightCm <= 140) {
        methods.james = 0.5 * weightKg + 0.1 * (heightCm - 110)
      } else {
        methods.james = 0.5 * weightKg + 0.1 * 30 + 0.1 * (heightCm - 140)
      }
    } else {
      if (heightCm <= 110) {
        methods.james = 0.5 * weightKg
      } else if (heightCm <= 140) {
        methods.james = 0.5 * weightKg + 0.1 * (heightCm - 110)
      } else {
        methods.james = 0.5 * weightKg + 0.1 * 30 + 0.1 * (heightCm - 140)
      }
    }

    // Hume formula
    if (gender === 'male') {
      methods.hume = (0.32810 * weightKg) + (0.33929 * heightCm) - 29.5336
    } else {
      methods.hume = (0.29569 * weightKg) + (0.41813 * heightCm) - 43.2933
    }

    // Body fat percentage method
    if (bf > 0) {
      methods.bodyFat = weightKg * (1 - bf / 100)
    }

    // Use selected method or average of available methods
    let leanMass = 0
    let methodName = ''
    
    if (method === 'boer') {
      leanMass = methods.boer
      methodName = 'Boer Formula'
    } else if (method === 'james') {
      leanMass = methods.james
      methodName = 'James Formula'
    } else if (method === 'hume') {
      leanMass = methods.hume
      methodName = 'Hume Formula'
    } else if (method === 'bodyFat' && bf > 0) {
      leanMass = methods.bodyFat
      methodName = 'Body Fat Percentage'
    } else {
      // Use average of available methods
      const availableMethods = Object.values(methods).filter(v => v > 0)
      leanMass = availableMethods.reduce((a, b) => a + b, 0) / availableMethods.length
      methodName = 'Average of Available Methods'
    }

    const fatMass = weightKg - leanMass

    // Generate recommendations
    const recommendations = []
    if (leanMass > 0) {
      const leanMassLbs = leanMass * 2.20462
      if (leanMassLbs < 100) {
        recommendations.push('Consider strength training to build lean mass')
        recommendations.push('Ensure adequate protein intake (1.6-2.2g per kg body weight)')
      } else if (leanMassLbs < 150) {
        recommendations.push('Maintain current lean mass with regular exercise')
        recommendations.push('Focus on compound movements and progressive overload')
      } else {
        recommendations.push('Excellent lean mass! Maintain with consistent training')
        recommendations.push('Consider periodization for continued progress')
      }
    }

    return { leanMass, fatMass, methods, recommendations, methodName }
  }, [weight, height, age, gender, bodyFat, method])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setAge('')
    setGender('male')
    setBodyFat('')
    setMethod('boer')
    setShowResults(false)
  }

  const result = showResults ? calculateLeanMass() : { 
    leanMass: 0, 
    fatMass: 0, 
    methods: {}, 
    recommendations: [],
    methodName: ''
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center">
          <Dumbbell className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Lean Body Mass Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate your lean body mass using multiple formulas</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter weight"
                aria-label="Weight in pounds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (ft or cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter age"
                aria-label="Age in years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Fat % (Optional)
              </label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter body fat %"
                min="0"
                max="100"
                aria-label="Body fat percentage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Select calculation method"
              >
                <option value="boer">Boer Formula</option>
                <option value="james">James Formula</option>
                <option value="hume">Hume Formula</option>
                <option value="bodyFat">Body Fat %</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Lean Body Mass:</span>
                  <span className="font-semibold text-blue-800">
                    {result.leanMass.toFixed(1)} kg ({(result.leanMass * 2.20462).toFixed(1)} lbs)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Fat Mass:</span>
                  <span className="font-semibold text-blue-800">
                    {result.fatMass.toFixed(1)} kg ({(result.fatMass * 2.20462).toFixed(1)} lbs)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Method Used:</span>
                  <span className="font-semibold text-blue-800">{result.methodName}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">All Methods Comparison</h3>
              <div className="space-y-2">
                {Object.entries(result.methods).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-blue-700 capitalize">{key}:</span>
                    <span className="font-semibold text-blue-800">
                      {value > 0 ? `${value.toFixed(1)} kg` : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-700">{rec}</span>
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
