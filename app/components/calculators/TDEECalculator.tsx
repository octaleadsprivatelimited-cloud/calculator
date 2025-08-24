'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Zap } from 'lucide-react'

export default function TDEECalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [showResults, setShowResults] = useState(false)

  const calculateTDEE = useCallback(() => {
    const a = parseFloat(age) || 0
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    if (a === 0 || w === 0 || h === 0) return { 
      bmr: 0, 
      tdee: 0, 
      goals: {
        weightLoss: 0,
        mildWeightLoss: 0,
        maintenance: 0,
        mildGain: 0,
        weightGain: 0
      }
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    // Convert weight to kg
    const weightKg = w * 0.453592

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 0
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) + 5
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) - 161
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,      // Little or no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Hard exercise 6-7 days/week
      very_active: 1.9     // Very hard exercise, physical job
    }

    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]

    // Calculate goals
    const goals = {
      weightLoss: tdee - 500,      // 500 calorie deficit
      mildWeightLoss: tdee - 250,  // 250 calorie deficit
      maintenance: tdee,            // Maintenance
      mildGain: tdee + 250,        // 250 calorie surplus
      weightGain: tdee + 500       // 500 calorie surplus
    }

    return { bmr, tdee, goals }
  }, [age, gender, weight, height, activityLevel])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setGender('male')
    setWeight('')
    setHeight('')
    setActivityLevel('moderate')
    setShowResults(false)
  }

  const result = showResults ? calculateTDEE() : { 
    bmr: 0, 
    tdee: 0, 
    goals: {
      weightLoss: 0,
      mildWeightLoss: 0,
      maintenance: 0,
      mildGain: 0,
      weightGain: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
        <div className="flex items-center">
          <Zap className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">TDEE Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate your Total Daily Energy Expenditure</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select activity level"
            >
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Light (light exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
              <option value="active">Active (hard exercise 6-7 days/week)</option>
              <option value="very_active">Very Active (very hard exercise, physical job)</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
                  <span className="text-blue-700">BMR (Basal Metabolic Rate):</span>
                  <span className="font-semibold text-blue-800">{result.bmr.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">TDEE (Total Daily Energy Expenditure):</span>
                  <span className="font-semibold text-blue-800">{result.tdee.toFixed(0)} calories</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Daily Calorie Goals</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Weight Loss (1 lb/week):</span>
                  <span className="font-semibold text-blue-800">{result.goals.weightLoss.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Mild Weight Loss (0.5 lb/week):</span>
                  <span className="font-semibold text-blue-800">{result.goals.mildWeightLoss.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Maintenance:</span>
                  <span className="font-semibold text-blue-800">{result.goals.maintenance.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Mild Weight Gain (0.5 lb/week):</span>
                  <span className="font-semibold text-blue-800">{result.goals.mildGain.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Weight Gain (1 lb/week):</span>
                  <span className="font-semibold text-blue-800">{result.goals.weightGain.toFixed(0)} calories</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
