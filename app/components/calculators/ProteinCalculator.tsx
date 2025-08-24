'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Beef } from 'lucide-react'

export default function ProteinCalculator() {
  const [weight, setWeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [goal, setGoal] = useState('maintenance')
  const [showResults, setShowResults] = useState(false)

  const calculateProtein = useCallback(() => {
    const w = parseFloat(weight) || 0
    if (w === 0) return { 
      dailyProtein: 0, 
      ranges: {
        minimum: 0,
        moderate: 0,
        high: 0,
        very_high: 0
      }, 
      recommendations: [],
      mealBreakdown: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snacks: 0
      }
    }

    const weightKg = w * 0.453592

    // Protein needs based on activity level and goal
    let proteinPerKg = 1.6 // Default moderate activity

    switch (activityLevel) {
      case 'sedentary':
        proteinPerKg = 1.2
        break
      case 'light':
        proteinPerKg = 1.4
        break
      case 'moderate':
        proteinPerKg = 1.6
        break
      case 'active':
        proteinPerKg = 1.8
        break
      case 'very_active':
        proteinPerKg = 2.0
        break
    }

    // Adjust for goals
    switch (goal) {
      case 'weight_loss':
        proteinPerKg += 0.2
        break
      case 'muscle_gain':
        proteinPerKg += 0.4
        break
      case 'endurance':
        proteinPerKg += 0.1
        break
    }

    const dailyProtein = weightKg * proteinPerKg

    // Calculate ranges for different goals
    const ranges = {
      minimum: weightKg * 1.2,
      moderate: weightKg * 1.6,
      high: weightKg * 2.0,
      very_high: weightKg * 2.4
    }

    // Meal breakdown
    const mealBreakdown = {
      breakfast: dailyProtein * 0.25,
      lunch: dailyProtein * 0.3,
      dinner: dailyProtein * 0.3,
      snacks: dailyProtein * 0.15
    }

    // Generate recommendations
    const recommendations = []
    recommendations.push(`Your daily protein need: ${dailyProtein.toFixed(1)}g`)
    
    if (goal === 'weight_loss') {
      recommendations.push('Higher protein helps preserve muscle during weight loss')
      recommendations.push('Aim for protein with every meal')
    } else if (goal === 'muscle_gain') {
      recommendations.push('Distribute protein evenly throughout the day')
      recommendations.push('Include protein within 2 hours after workouts')
    } else if (goal === 'endurance') {
      recommendations.push('Moderate protein supports endurance training')
      recommendations.push('Focus on quality protein sources')
    }

    recommendations.push('Good sources: lean meats, fish, eggs, dairy, legumes')
    recommendations.push('Consider protein timing around workouts')

    return { dailyProtein, ranges, recommendations, mealBreakdown }
  }, [weight, activityLevel, goal])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setActivityLevel('moderate')
    setGoal('maintenance')
    setShowResults(false)
  }

  const result = showResults ? calculateProtein() : { 
    dailyProtein: 0, 
    ranges: {
      minimum: 0,
      moderate: 0,
      high: 0,
      very_high: 0
    }, 
    recommendations: [],
    mealBreakdown: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
        <div className="flex items-center">
          <Beef className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Protein Calculator</h2>
        </div>
        <p className="text-amber-100 mt-1">Calculate your daily protein needs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter weight"
              aria-label="Weight in pounds"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Select goal"
              >
                <option value="maintenance">Maintenance</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Daily Protein Need</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {result.dailyProtein.toFixed(1)}g
                </div>
                <div className="text-amber-700">
                  Based on {activityLevel} activity and {goal} goal
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Protein Ranges (g/day)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-700">Minimum:</span>
                  <span className="font-semibold text-amber-800">{result.ranges.minimum?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Moderate:</span>
                  <span className="font-semibold text-amber-800">{result.ranges.moderate?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">High:</span>
                  <span className="font-semibold text-amber-800">{result.ranges.high?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Very High:</span>
                  <span className="font-semibold text-amber-800">{result.ranges.very_high?.toFixed(1)}g</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Meal Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-700">Breakfast:</span>
                  <span className="font-semibold text-amber-800">{result.mealBreakdown.breakfast?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Lunch:</span>
                  <span className="font-semibold text-amber-800">{result.mealBreakdown.lunch?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Dinner:</span>
                  <span className="font-semibold text-amber-800">{result.mealBreakdown.dinner?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Snacks:</span>
                  <span className="font-semibold text-amber-800">{result.mealBreakdown.snacks?.toFixed(1)}g</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span className="text-amber-700">{rec}</span>
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
