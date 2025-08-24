'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Droplets } from 'lucide-react'

export default function FatIntakeCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [goal, setGoal] = useState('maintenance')
  const [showResults, setShowResults] = useState(false)

  const calculateFatIntake = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (w === 0 || h === 0 || a === 0) return { 
      dailyFat: 0, 
      ranges: {
        minimum: 0,
        moderate: 0,
        maximum: 0
      }, 
      recommendations: [],
      breakdown: {
        calories: 0,
        percentage: 0,
        grams: 0
      }
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    // Calculate BMR using Mifflin-St Jeor
    const weightKg = w * 0.453592
    let bmr = 0
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) + 5
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) - 161
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }

    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]

    // Goal adjustments
    let adjustedCalories = tdee
    switch (goal) {
      case 'weight_loss':
        adjustedCalories -= 500
        break
      case 'muscle_gain':
        adjustedCalories += 300
        break
    }

    // Calculate fat needs
    let fatPercentage = 0.25 // Default 25%
    let fatRange = { min: 0, max: 0 }

    switch (goal) {
      case 'keto':
        fatPercentage = 0.7 // 70% for keto
        fatRange = { min: 0.6, max: 0.8 }
        break
      case 'low_fat':
        fatPercentage = 0.15 // 15% for low fat
        fatRange = { min: 0.1, max: 0.2 }
        break
      case 'weight_loss':
        fatPercentage = 0.3 // 30% for weight loss
        fatRange = { min: 0.25, max: 0.35 }
        break
      case 'muscle_gain':
        fatPercentage = 0.25 // 25% for muscle gain
        fatRange = { min: 0.2, max: 0.3 }
        break
      default:
        fatRange = { min: 0.2, max: 0.35 }
    }

    const dailyFat = (adjustedCalories * fatPercentage) / 9 // 9 calories per gram
    const ranges = {
      minimum: (adjustedCalories * fatRange.min) / 9,
      moderate: dailyFat,
      maximum: (adjustedCalories * fatRange.max) / 9
    }

    const breakdown = {
      calories: dailyFat * 9,
      percentage: fatPercentage * 100,
      grams: dailyFat
    }

    // Generate recommendations
    const recommendations = []
    if (goal === 'keto') {
      recommendations.push('High fat intake for ketosis - focus on healthy fats')
      recommendations.push('Include MCT oil, coconut oil, and avocados')
    } else if (goal === 'low_fat') {
      recommendations.push('Low fat diet - choose lean proteins and complex carbs')
      recommendations.push('Limit processed foods and added fats')
    } else if (goal === 'weight_loss') {
      recommendations.push('Moderate fat helps with satiety and hormone production')
      recommendations.push('Focus on omega-3 and monounsaturated fats')
    } else if (goal === 'muscle_gain') {
      recommendations.push('Adequate fat supports hormone production and recovery')
      recommendations.push('Include healthy fats with each meal')
    }

    recommendations.push('Good sources: nuts, seeds, avocados, olive oil, fatty fish')
    recommendations.push('Limit trans fats and excessive saturated fats')

    return { dailyFat, ranges, recommendations, breakdown }
  }, [weight, height, age, gender, activityLevel, goal])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setAge('')
    setGender('male')
    setActivityLevel('moderate')
    setGoal('maintenance')
    setShowResults(false)
  }

  const result = showResults ? calculateFatIntake() : { 
    dailyFat: 0, 
    ranges: {
      minimum: 0,
      moderate: 0,
      maximum: 0
    }, 
    recommendations: [],
    breakdown: {
      calories: 0,
      percentage: 0,
      grams: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
        <div className="flex items-center">
          <Droplets className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Fat Intake Calculator</h2>
        </div>
        <p className="text-yellow-100 mt-1">Calculate your daily fat intake needs</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Select activity level"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Select goal"
              >
                <option value="maintenance">Maintenance</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="keto">Ketogenic</option>
                <option value="low_fat">Low Fat</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Daily Fat Intake</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {result.dailyFat.toFixed(1)}g
                </div>
                <div className="text-yellow-700">
                  {result.breakdown.percentage?.toFixed(0)}% of daily calories
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Fat Intake Ranges</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Minimum:</span>
                  <span className="font-semibold text-yellow-800">{result.ranges.minimum?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Recommended:</span>
                  <span className="font-semibold text-yellow-800">{result.ranges.moderate?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Maximum:</span>
                  <span className="font-semibold text-yellow-800">{result.ranges.maximum?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Calories from Fat:</span>
                  <span className="font-semibold text-yellow-800">{result.breakdown.calories?.toFixed(0)} calories</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span className="text-yellow-700">{rec}</span>
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
