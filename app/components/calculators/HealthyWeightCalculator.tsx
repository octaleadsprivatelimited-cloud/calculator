'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Heart } from 'lucide-react'

export default function HealthyWeightCalculator() {
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [bodyFrame, setBodyFrame] = useState('medium')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [showResults, setShowResults] = useState(false)

  const calculateHealthyWeight = useCallback(() => {
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (h === 0) return { 
      ranges: {
        devine: { male: 0, female: 0 },
        robinson: { male: 0, female: 0 },
        miller: { male: 0, female: 0 },
        hamwi: { male: 0, female: 0 },
        peterson: { male: 0, female: 0 }
      }, 
      bmiRange: { min: 0, max: 0 }, 
      recommendations: [],
      healthScore: 0
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const heightM = heightCm / 100
    const heightInches = heightCm / 2.54

    // Calculate using different formulas
    const ranges = {
      devine: { male: 0, female: 0 },
      robinson: { male: 0, female: 0 },
      miller: { male: 0, female: 0 },
      hamwi: { male: 0, female: 0 },
      peterson: { male: 0, female: 0 }
    }

    // Devine formula
    ranges.devine.male = 50 + 2.3 * (heightInches - 60)
    ranges.devine.female = 45.5 + 2.3 * (heightInches - 60)

    // Robinson formula
    ranges.robinson.male = 52 + 1.9 * (heightInches - 60)
    ranges.robinson.female = 49 + 1.7 * (heightInches - 60)

    // Miller formula
    ranges.miller.male = 56.2 + 1.41 * (heightInches - 60)
    ranges.miller.female = 53.1 + 1.36 * (heightInches - 60)

    // Hamwi formula
    ranges.hamwi.male = 106 + 6 * (heightInches - 60)
    ranges.hamwi.female = 100 + 5 * (heightInches - 60)

    // Peterson formula (simplified)
    ranges.peterson.male = 52 + 1.9 * (heightInches - 60)
    ranges.peterson.female = 49 + 1.7 * (heightInches - 60)

    // Apply body frame adjustments
    const frameMultipliers = {
      small: 0.9,
      medium: 1.0,
      large: 1.1
    }

    const multiplier = frameMultipliers[bodyFrame as keyof typeof frameMultipliers]
    Object.keys(ranges).forEach(key => {
      ranges[key as keyof typeof ranges] = {
        male: ranges[key as keyof typeof ranges].male * multiplier,
        female: ranges[key as keyof typeof ranges].female * multiplier
      }
    })

    // Calculate BMI-based healthy range
    const bmiRange = {
      min: 18.5 * heightM * heightM * 2.20462, // Convert to lbs
      max: 24.9 * heightM * heightM * 2.20462
    }

    // Generate health score and recommendations
    let healthScore = 100
    const recommendations = []

    // Age-based adjustments
    if (a < 18) {
      recommendations.push('Focus on healthy growth and development')
      recommendations.push('Consult healthcare provider for age-appropriate guidance')
      healthScore -= 10
    } else if (a < 65) {
      recommendations.push('Maintain healthy lifestyle with regular exercise')
      recommendations.push('Aim for balanced nutrition and adequate protein')
    } else {
      recommendations.push('Consider slightly higher weight for better health outcomes')
      recommendations.push('Focus on strength training and mobility')
      healthScore += 5
    }

    // Activity level recommendations
    if (activityLevel === 'sedentary') {
      recommendations.push('Increase daily activity for better health')
      healthScore -= 15
    } else if (activityLevel === 'very_active') {
      recommendations.push('Excellent activity level! Maintain current routine')
      healthScore += 10
    }

    // Frame-specific advice
    if (bodyFrame === 'small') {
      recommendations.push('Small frame: Focus on lean muscle building')
    } else if (bodyFrame === 'large') {
      recommendations.push('Large frame: Consider higher end of healthy range')
    }

    return { ranges, bmiRange, recommendations, healthScore }
  }, [height, age, gender, bodyFrame, activityLevel])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setHeight('')
    setAge('')
    setGender('male')
    setBodyFrame('medium')
    setActivityLevel('moderate')
    setShowResults(false)
  }

  const result = showResults ? calculateHealthyWeight() : { 
    ranges: {
      devine: { male: 0, female: 0 },
      robinson: { male: 0, female: 0 },
      miller: { male: 0, female: 0 },
      hamwi: { male: 0, female: 0 },
      peterson: { male: 0, female: 0 }
    }, 
    bmiRange: { min: 0, max: 0 }, 
    recommendations: [],
    healthScore: 0
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Healthy Weight Calculator</h2>
        </div>
        <p className="text-emerald-100 mt-1">Calculate your healthy weight range using multiple methods</p>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Select activity level"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
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
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Health Score</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {result.healthScore}/100
                </div>
                <div className="text-emerald-700">
                  {result.healthScore >= 90 ? 'Excellent' : 
                   result.healthScore >= 80 ? 'Good' : 
                   result.healthScore >= 70 ? 'Fair' : 'Needs Improvement'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Healthy Weight Ranges (lbs)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Devine Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.ranges.devine?.[gender as keyof typeof result.ranges.devine]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Robinson Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.ranges.robinson?.[gender as keyof typeof result.ranges.robinson]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Miller Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.ranges.miller?.[gender as keyof typeof result.ranges.miller]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Hamwi Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.ranges.hamwi?.[gender as keyof typeof result.ranges.hamwi]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Peterson Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.ranges.peterson?.[gender as keyof typeof result.ranges.peterson]?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">BMI-Based Healthy Range</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Minimum Weight:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.bmiRange.min.toFixed(1)} lbs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Maximum Weight:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.bmiRange.max.toFixed(1)} lbs
                  </span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}

