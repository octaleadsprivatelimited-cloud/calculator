'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Flame } from 'lucide-react'

export default function CalorieCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [goal, setGoal] = useState('maintenance')
  const [showResults, setShowResults] = useState(false)

  const calculateCalories = useCallback(() => {
    const a = parseFloat(age) || 0
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    if (a === 0 || w === 0 || h === 0) return { 
      bmr: 0, 
      tdee: 0, 
      goals: {
        extreme_loss: 0,
        weight_loss: 0,
        mild_loss: 0,
        maintenance: 0,
        mild_gain: 0,
        weight_gain: 0,
        extreme_gain: 0
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

    // Calculate goals based on objective
    const goals = {
      extreme_loss: tdee - 1000,    // 2 lbs/week loss
      weight_loss: tdee - 500,      // 1 lb/week loss
      mild_loss: tdee - 250,        // 0.5 lb/week loss
      maintenance: tdee,             // Weight maintenance
      mild_gain: tdee + 250,        // 0.5 lb/week gain
      weight_gain: tdee + 500,      // 1 lb/week gain
      extreme_gain: tdee + 1000     // 2 lbs/week gain
    }

    return { bmr, tdee, goals }
  }, [age, gender, weight, height, activityLevel, goal])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setGender('male')
    setWeight('')
    setHeight('')
    setActivityLevel('moderate')
    setGoal('maintenance')
    setShowResults(false)
  }

  const result = showResults ? calculateCalories() : { 
    bmr: 0, 
    tdee: 0, 
    goals: {
      extreme_loss: 0,
      weight_loss: 0,
      mild_loss: 0,
      maintenance: 0,
      mild_gain: 0,
      weight_gain: 0,
      extreme_gain: 0
    } 
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <div className="flex items-center">
          <Flame className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Calorie Calculator</h2>
        </div>
        <p className="text-orange-100 mt-1">Calculate your daily calorie needs</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-orange-700">BMR (Basal Metabolic Rate):</span>
                  <span className="font-semibold text-orange-800">{result.bmr.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">TDEE (Total Daily Energy Expenditure):</span>
                  <span className="font-semibold text-orange-800">{result.tdee.toFixed(0)} calories</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Daily Calorie Goals</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-orange-700">Extreme Weight Loss (2 lbs/week):</span>
                  <span className="font-semibold text-orange-800">{result.goals.extreme_loss.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Weight Loss (1 lb/week):</span>
                  <span className="font-semibold text-orange-800">{result.goals.weight_loss.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Mild Weight Loss (0.5 lb/week):</span>
                  <span className="font-semibold text-orange-800">{result.goals.mild_loss.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Maintenance:</span>
                  <span className="font-semibold text-orange-800">{result.goals.maintenance.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Mild Weight Gain (0.5 lb/week):</span>
                  <span className="font-semibold text-orange-800">{result.goals.mild_gain.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Weight Gain (1 lb/week):</span>
                  <span className="font-semibold text-orange-800">{result.goals.weight_gain.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Extreme Weight Gain (2 lbs/week):</span>
                  <span className="font-semibold text-orange-800">{result.goals.extreme_gain.toFixed(0)} calories</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Calorie Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive calorie calculator helps you determine your daily calorie needs for various weight goals. 
              Whether you want to lose weight, maintain your current weight, or gain weight, this tool provides accurate 
              calorie targets based on your individual characteristics and activity level.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>BMR (Basal Metabolic Rate):</strong> Calories needed at complete rest</li>
              <li><strong>TDEE (Total Daily Energy Expenditure):</strong> Total calories including activity</li>
              <li><strong>Weight Loss Goals:</strong> Calorie deficits for different loss rates</li>
              <li><strong>Weight Gain Goals:</strong> Calorie surpluses for different gain rates</li>
              <li><strong>Maintenance:</strong> Calories to maintain current weight</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Weight Loss Strategies</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Safe Weight Loss</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>0.5 lb/week: 250 calorie deficit</li>
                  <li>1 lb/week: 500 calorie deficit</li>
                  <li>2 lb/week: 1000 calorie deficit</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Weight Gain</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>0.5 lb/week: 250 calorie surplus</li>
                  <li>1 lb/week: 500 calorie surplus</li>
                  <li>2 lb/week: 1000 calorie surplus</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Activity Level Multipliers</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Sedentary:</strong> 1.2 (little or no exercise, desk job)</li>
              <li><strong>Light:</strong> 1.375 (light exercise 1-3 days/week)</li>
              <li><strong>Moderate:</strong> 1.55 (moderate exercise 3-5 days/week)</li>
              <li><strong>Active:</strong> 1.725 (hard exercise 6-7 days/week)</li>
              <li><strong>Very Active:</strong> 1.9 (very hard exercise, physical job)</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your age, gender, weight, height, and select your activity level. The calculator will compute your 
              BMR and TDEE, then provide calorie targets for different weight goals. Choose the goal that fits your 
              timeline and lifestyle preferences.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Important Considerations</h4>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-4">
              <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm">
                <li>Never eat below your BMR for extended periods</li>
                <li>Gradual weight loss is more sustainable</li>
                <li>Focus on nutrient-dense foods, not just calories</li>
                <li>Combine diet with exercise for best results</li>
                <li>Consult healthcare professionals for medical advice</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Start with a moderate calorie deficit (250-500 calories) for sustainable weight loss. Track your progress 
                and adjust your calorie intake based on your results. Remember, consistency is more important than perfection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
