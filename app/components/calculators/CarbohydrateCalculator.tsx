'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Leaf } from 'lucide-react'

export default function CarbohydrateCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [goal, setGoal] = useState('maintenance')
  const [showResults, setShowResults] = useState(false)

  const calculateCarbs = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (w === 0 || h === 0 || a === 0) return { 
      dailyCarbs: 0, 
      range: { min: 0, max: 0 }, 
      breakdown: { calories: 0, percentage: 0, grams: 0 }, 
      recommendations: [] 
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
      case 'keto':
        adjustedCalories = tdee * 0.8 // Reduce calories for keto
        break
    }

    // Calculate carbohydrate needs
    let carbPercentage = 0.45 // Default 45%
    let carbRange = { min: 0, max: 0 }

    switch (goal) {
      case 'keto':
        carbPercentage = 0.05 // 5% for keto
        carbRange = { min: 20, max: 50 }
        break
      case 'low_carb':
        carbPercentage = 0.25 // 25% for low carb
        carbRange = { min: 50, max: 150 }
        break
      case 'weight_loss':
        carbPercentage = 0.4 // 40% for weight loss
        carbRange = { min: 100, max: 200 }
        break
      case 'muscle_gain':
        carbPercentage = 0.5 // 50% for muscle gain
        carbRange = { min: 150, max: 300 }
        break
      default:
        carbRange = { min: 130, max: 250 }
    }

    const dailyCarbs = (adjustedCalories * carbPercentage) / 4 // 4 calories per gram
    const range = {
      min: Math.max(carbRange.min, dailyCarbs * 0.8),
      max: Math.min(carbRange.max, dailyCarbs * 1.2)
    }

    const breakdown = {
      calories: dailyCarbs * 4,
      percentage: carbPercentage * 100,
      grams: dailyCarbs
    }

    const recommendations = []
    if (goal === 'keto') {
      recommendations.push('Keep carbs under 50g daily for ketosis')
      recommendations.push('Focus on high-fat, moderate-protein foods')
    } else if (goal === 'low_carb') {
      recommendations.push('Aim for 50-150g carbs daily')
      recommendations.push('Choose complex carbs and fiber-rich foods')
    } else if (goal === 'weight_loss') {
      recommendations.push('Time carbs around workouts for better performance')
      recommendations.push('Choose whole grains and vegetables')
    } else if (goal === 'muscle_gain') {
      recommendations.push('Distribute carbs throughout the day')
      recommendations.push('Include carbs in pre and post-workout meals')
    }

    return { dailyCarbs, range, breakdown, recommendations }
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

  const result = showResults ? calculateCarbs() : { 
    dailyCarbs: 0, 
    range: { min: 0, max: 0 }, 
    breakdown: { calories: 0, percentage: 0, grams: 0 }, 
    recommendations: [] 
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
        <div className="flex items-center">
          <Leaf className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Carbohydrate Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate your daily carbohydrate needs</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Select goal"
              >
                <option value="maintenance">Maintenance</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="keto">Ketogenic</option>
                <option value="low_carb">Low Carb</option>
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
              <h3 className="text-lg font-semibold text-green-800 mb-2">Daily Carbohydrate Needs</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {result.dailyCarbs.toFixed(0)}g
                </div>
                <div className="text-green-700">
                  {result.breakdown.percentage?.toFixed(0)}% of daily calories
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Recommended Range</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Minimum:</span>
                  <span className="font-semibold text-green-800">{result.range.min.toFixed(0)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Maximum:</span>
                  <span className="font-semibold text-green-800">{result.range.max.toFixed(0)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Calories from Carbs:</span>
                  <span className="font-semibold text-green-800">{result.breakdown.calories?.toFixed(0)} calories</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Recommendations</h3>
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
