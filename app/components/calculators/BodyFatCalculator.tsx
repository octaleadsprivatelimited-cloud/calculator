'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, User } from 'lucide-react'

export default function BodyFatCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [hip, setHip] = useState('')
  const [method, setMethod] = useState('navy')
  const [showResults, setShowResults] = useState(false)

  const calculateBodyFat = useCallback(() => {
    const a = parseFloat(age) || 0
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const waist_cm = parseFloat(waist) || 0
    const neck_cm = parseFloat(neck) || 0
    const hip_cm = parseFloat(hip) || 0

    if (w === 0 || h === 0) return { bodyFat: 0, category: '', leanMass: 0, fatMass: 0 }

    let bodyFat = 0
    let methodName = ''

    if (method === 'navy' && waist_cm > 0 && neck_cm > 0) {
      // US Navy method
      if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist_cm - neck_cm) + 0.15456 * Math.log10(h)) - 450
      } else {
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist_cm + hip_cm - neck_cm) + 0.22100 * Math.log10(h)) - 450
      }
      methodName = 'US Navy Method'
    } else if (method === 'bmi' && h > 0) {
      // BMI-based estimation
      const heightM = h < 10 ? h * 0.3048 : h / 100
      const weightKg = w * 0.453592
      const bmi = weightKg / (heightM * heightM)
      
      if (gender === 'male') {
        bodyFat = (1.20 * bmi) + (0.23 * a) - 16.2
      } else {
        bodyFat = (1.20 * bmi) + (0.23 * a) - 5.4
      }
      methodName = 'BMI-Based Estimation'
    } else if (method === 'skinfold' && waist_cm > 0) {
      // Simplified skinfold method
      if (gender === 'male') {
        bodyFat = 0.39287 * waist_cm - 0.00105 * waist_cm * waist_cm + 0.15772 * a - 5.18845
      } else {
        bodyFat = 0.29669 * waist_cm - 0.00043 * waist_cm * waist_cm + 0.02963 * a + 1.4072
      }
      methodName = 'Simplified Skinfold Method'
    }

    bodyFat = Math.max(0, Math.min(100, bodyFat))

    let category = ''
    if (gender === 'male') {
      if (bodyFat < 6) category = 'Essential Fat'
      else if (bodyFat < 14) category = 'Athletes'
      else if (bodyFat < 18) category = 'Fitness'
      else if (bodyFat < 25) category = 'Average'
      else if (bodyFat < 32) category = 'Above Average'
      else category = 'Obese'
    } else {
      if (bodyFat < 14) category = 'Essential Fat'
      else if (bodyFat < 21) category = 'Athletes'
      else if (bodyFat < 25) category = 'Fitness'
      else if (bodyFat < 32) category = 'Average'
      else if (bodyFat < 38) category = 'Above Average'
      else category = 'Obese'
    }

    const fatMass = (w * bodyFat) / 100
    const leanMass = w - fatMass

    return { bodyFat, category, leanMass, fatMass, method: methodName }
  }, [age, gender, weight, height, waist, neck, hip, method])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setGender('male')
    setWeight('')
    setHeight('')
    setWaist('')
    setNeck('')
    setHip('')
    setMethod('navy')
    setShowResults(false)
  }

  const result = showResults ? calculateBodyFat() : { bodyFat: 0, category: '', leanMass: 0, fatMass: 0, method: '' }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <User className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Body Fat Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate your body fat percentage using multiple methods</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Age"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Weight"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waist (cm)
              </label>
              <input
                type="number"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Waist"
                aria-label="Waist circumference in cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neck (cm)
              </label>
              <input
                type="number"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Neck"
                aria-label="Neck circumference in cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hip (cm)
              </label>
              <input
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Hip"
                aria-label="Hip circumference in cm"
              />
            </div>
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
              <option value="navy">US Navy Method (Most Accurate)</option>
              <option value="bmi">BMI-Based Estimation</option>
              <option value="skinfold">Simplified Skinfold Method</option>
            </select>
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
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Body Fat %:</span>
                <span className="font-semibold text-green-800">{result.bodyFat.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Category:</span>
                <span className="font-semibold text-green-800">{result.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Fat Mass:</span>
                <span className="font-semibold text-green-800">{result.fatMass.toFixed(1)} lbs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Lean Mass:</span>
                <span className="font-semibold text-green-800">{result.leanMass.toFixed(1)} lbs</span>
              </div>
              <div className="border-t border-green-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Method Used:</span>
                  <span className="font-semibold text-green-800">{result.method}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
