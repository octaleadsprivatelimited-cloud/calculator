'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Target } from 'lucide-react'

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('')
  const [bodyFrame, setBodyFrame] = useState('medium')
  const [showResults, setShowResults] = useState(false)

  const calculateIdealWeight = useCallback(() => {
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (h === 0) return { 
      formulas: {
        devine: { male: 0, female: 0 },
        robinson: { male: 0, female: 0 },
        miller: { male: 0, female: 0 },
        hamwi: { male: 0, female: 0 },
        peterson: { male: 0, female: 0 }
      }, 
      bmiRange: { min: 0, max: 0 }, 
      recommendations: [] 
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const heightInches = heightCm / 2.54

    // Calculate using different formulas
    const formulas = {
      devine: {
        male: 50 + 2.3 * (heightInches - 60),
        female: 45.5 + 2.3 * (heightInches - 60)
      },
      robinson: {
        male: 52 + 1.9 * (heightInches - 60),
        female: 49 + 1.7 * (heightInches - 60)
      },
      miller: {
        male: 56.2 + 1.41 * (heightInches - 60),
        female: 53.1 + 1.36 * (heightInches - 60)
      },
      hamwi: {
        male: 106 + 6 * (heightInches - 60),
        female: 100 + 5 * (heightInches - 60)
      },
      peterson: {
        male: 52 + 1.9 * (heightInches - 60),
        female: 49 + 1.7 * (heightInches - 60)
      }
    }

    // Adjust for body frame
    const frameMultipliers = {
      small: 0.9,
      medium: 1.0,
      large: 1.1
    }

    const multiplier = frameMultipliers[bodyFrame as keyof typeof frameMultipliers]

    // Calculate BMI range (18.5 - 24.9)
    const heightM = heightCm / 100
    const bmiRange = {
      min: 18.5 * heightM * heightM,
      max: 24.9 * heightM * heightM
    }

    // Generate recommendations
    const recommendations = []
    const currentIdeal = formulas.devine[gender as keyof typeof formulas.devine] * multiplier
    
    if (a < 18) {
      recommendations.push('Focus on healthy growth and development')
    } else if (a < 65) {
      recommendations.push('Maintain healthy lifestyle with regular exercise')
      recommendations.push('Aim for balanced nutrition and adequate protein')
    } else {
      recommendations.push('Consider slightly higher weight for better health outcomes')
      recommendations.push('Focus on strength training and mobility')
    }

    // Apply frame adjustment to all formulas
    Object.keys(formulas).forEach(key => {
      formulas[key as keyof typeof formulas] = {
        male: formulas[key as keyof typeof formulas].male * multiplier,
        female: formulas[key as keyof typeof formulas].female * multiplier
      }
    })

    return { formulas, bmiRange, recommendations }
  }, [height, gender, age, bodyFrame])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setHeight('')
    setGender('male')
    setAge('')
    setBodyFrame('medium')
    setShowResults(false)
  }

  const result = showResults ? calculateIdealWeight() : { 
    formulas: {
      devine: { male: 0, female: 0 },
      robinson: { male: 0, female: 0 },
      miller: { male: 0, female: 0 },
      hamwi: { male: 0, female: 0 },
      peterson: { male: 0, female: 0 }
    }, 
    bmiRange: { min: 0, max: 0 }, 
    recommendations: [] 
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <Target className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Ideal Weight Calculator</h2>
        </div>
        <p className="text-emerald-100 mt-1">Calculate your ideal weight using multiple formulas</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (ft or cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter age"
                aria-label="Age in years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Frame
              </label>
              <select
                value={bodyFrame}
                onChange={(e) => setBodyFrame(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Select body frame"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Ideal Weight Results (lbs)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Devine Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.devine?.[gender as keyof typeof result.formulas.devine]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Robinson Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.robinson?.[gender as keyof typeof result.formulas.robinson]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Miller Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.miller?.[gender as keyof typeof result.formulas.miller]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Hamwi Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.hamwi?.[gender as keyof typeof result.formulas.hamwi]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Peterson Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.peterson?.[gender as keyof typeof result.formulas.peterson]?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Healthy BMI Range</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Minimum Weight:</span>
                  <span className="font-semibold text-emerald-800">
                    {(result.bmiRange.min * 2.20462).toFixed(1)} lbs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Maximum Weight:</span>
                  <span className="font-semibold text-emerald-800">
                    {(result.bmiRange.max * 2.20462).toFixed(1)} lbs
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Recommendations</h3>
              <div className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span className="text-emerald-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
