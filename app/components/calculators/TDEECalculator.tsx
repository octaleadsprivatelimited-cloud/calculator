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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About TDEE Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our Total Daily Energy Expenditure (TDEE) calculator helps you determine how many calories your body needs 
              each day based on your age, gender, weight, height, and activity level. This essential tool is perfect for 
              weight management, fitness planning, and nutritional guidance.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What is TDEE?</h4>
            <p className="text-gray-700 mb-4">
              TDEE represents the total number of calories your body burns in a day, including your basal metabolic rate (BMR) 
              and calories burned through physical activity. It's the foundation for setting calorie goals for weight loss, 
              maintenance, or muscle gain.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Components of TDEE</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>BMR (Basal Metabolic Rate):</strong> Calories burned at rest for basic bodily functions</li>
              <li><strong>Physical Activity:</strong> Calories burned through exercise and daily movement</li>
              <li><strong>Thermic Effect of Food:</strong> Calories burned digesting and processing food</li>
              <li><strong>Non-Exercise Activity Thermogenesis (NEAT):</strong> Calories from daily activities</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Activity Level Guidelines</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Sedentary:</strong> Little or no exercise, desk job</li>
              <li><strong>Light:</strong> Light exercise 1-3 days/week</li>
              <li><strong>Moderate:</strong> Moderate exercise 3-5 days/week</li>
              <li><strong>Active:</strong> Hard exercise 6-7 days/week</li>
              <li><strong>Very Active:</strong> Very hard exercise, physical job</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your age, gender, weight, height, and select your activity level. The calculator will compute your BMR 
              and TDEE, then provide calorie targets for different weight goals including weight loss, maintenance, and weight gain.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calorie Goals Explained</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Weight Loss:</strong> 500 calorie deficit for 1 lb/week loss</li>
              <li><strong>Mild Weight Loss:</strong> 250 calorie deficit for 0.5 lb/week loss</li>
              <li><strong>Maintenance:</strong> Match your TDEE exactly</li>
              <li><strong>Mild Weight Gain:</strong> 250 calorie surplus for 0.5 lb/week gain</li>
              <li><strong>Weight Gain:</strong> 500 calorie surplus for 1 lb/week gain</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Why TDEE Matters</h4>
            <p className="text-gray-700">
              Understanding your TDEE is crucial for effective weight management. Eating below your TDEE leads to weight loss, 
              while eating above it leads to weight gain. This calculator helps you set realistic, sustainable calorie goals 
              based on your individual needs and lifestyle.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
