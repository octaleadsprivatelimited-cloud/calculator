'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, PieChart } from 'lucide-react'

export default function MacroCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [goal, setGoal] = useState('maintenance')
  const [showResults, setShowResults] = useState(false)

  const calculateMacros = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (w === 0 || h === 0 || a === 0) return { 
      calories: 0, 
      protein: 0, 
      carbs: 0, 
      fat: 0, 
      breakdown: {
        proteinPercent: 0,
        carbsPercent: 0,
        fatPercent: 0
      } 
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    // Convert weight to kg
    const weightKg = w * 0.453592

    // Calculate BMR using Mifflin-St Jeor
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

    let tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]

    // Adjust calories based on goal
    switch (goal) {
      case 'weight_loss':
        tdee -= 500 // 500 calorie deficit
        break
      case 'muscle_gain':
        tdee += 300 // 300 calorie surplus
        break
    }

    // Calculate macros
    let protein = 0
    let carbs = 0
    let fat = 0

    if (goal === 'keto') {
      // Ketogenic diet: 70% fat, 25% protein, 5% carbs
      fat = (tdee * 0.7) / 9
      protein = (tdee * 0.25) / 4
      carbs = (tdee * 0.05) / 4
    } else if (goal === 'low_carb') {
      // Low carb: 40% fat, 35% protein, 25% carbs
      fat = (tdee * 0.4) / 9
      protein = (tdee * 0.35) / 4
      carbs = (tdee * 0.25) / 4
    } else {
      // Standard: 25% protein, 45% carbs, 30% fat
      protein = (tdee * 0.25) / 4
      carbs = (tdee * 0.45) / 4
      fat = (tdee * 0.3) / 9
    }

    const breakdown = {
      proteinPercent: ((protein * 4) / tdee) * 100,
      carbsPercent: ((carbs * 4) / tdee) * 100,
      fatPercent: ((fat * 9) / tdee) * 100
    }

    return { calories: tdee, protein, carbs, fat, breakdown }
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

  const result = showResults ? calculateMacros() : { 
    calories: 0, 
    protein: 0, 
    carbs: 0, 
    fat: 0, 
    breakdown: {
      proteinPercent: 0,
      carbsPercent: 0,
      fatPercent: 0
    } 
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <PieChart className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Macro Calculator</h2>
        </div>
        <p className="text-indigo-100 mt-1">Calculate your macronutrient needs</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Height"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Daily Calories</h3>
              <div className="text-2xl font-bold text-indigo-600">{result.calories.toFixed(0)} calories</div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Macronutrients</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-700">Protein:</span>
                  <div className="text-right">
                    <div className="font-semibold text-indigo-800">{result.protein.toFixed(1)}g</div>
                    <div className="text-sm text-indigo-600">{result.breakdown.proteinPercent.toFixed(0)}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-700">Carbohydrates:</span>
                  <div className="text-right">
                    <div className="font-semibold text-indigo-800">{result.carbs.toFixed(1)}g</div>
                    <div className="text-sm text-indigo-600">{result.breakdown.carbsPercent.toFixed(0)}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-700">Fat:</span>
                  <div className="text-right">
                    <div className="font-semibold text-indigo-800">{result.fat.toFixed(1)}g</div>
                    <div className="text-sm text-indigo-600">{result.breakdown.fatPercent.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
