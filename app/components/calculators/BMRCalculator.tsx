'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Zap } from 'lucide-react'

export default function BMRCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [formula, setFormula] = useState('mifflin')
  const [showResults, setShowResults] = useState(false)

  const calculateBMR = useCallback(() => {
    const a = parseFloat(age) || 0
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    if (a === 0 || w === 0 || h === 0) return { bmr: 0, formula: '', tdee: { sedentary: 0, light: 0, moderate: 0, active: 0, very_active: 0 } }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    // Convert weight to kg
    const weightKg = w * 0.453592

    let bmr = 0
    let formulaName = ''

    switch (formula) {
      case 'mifflin':
        if (gender === 'male') {
          bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) + 5
        } else {
          bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) - 161
        }
        formulaName = 'Mifflin-St Jeor Equation'
        break
      case 'harris':
        if (gender === 'male') {
          bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * a)
        } else {
          bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * a)
        }
        formulaName = 'Harris-Benedict Equation'
        break
      case 'katch':
        bmr = 370 + (21.6 * weightKg * (1 - 0.15))
        formulaName = 'Katch-McArdle Equation'
        break
      case 'cunningham':
        bmr = 500 + (22 * weightKg)
        formulaName = 'Cunningham Equation'
        break
      default:
        if (gender === 'male') {
          bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) + 5
        } else {
          bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) - 161
        }
        formulaName = 'Mifflin-St Jeor Equation'
    }

    // Calculate TDEE for different activity levels
    const tdee = {
      sedentary: bmr * 1.2,      // Little or no exercise
      light: bmr * 1.375,        // Light exercise 1-3 days/week
      moderate: bmr * 1.55,      // Moderate exercise 3-5 days/week
      active: bmr * 1.725,       // Hard exercise 6-7 days/week
      very_active: bmr * 1.9     // Very hard exercise, physical job
    }

    return { bmr, formula: formulaName, tdee }
  }, [age, gender, weight, height, formula])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setGender('male')
    setWeight('')
    setHeight('')
    setFormula('mifflin')
    setShowResults(false)
  }

  const result = showResults ? calculateBMR() : { bmr: 0, formula: '', tdee: { sedentary: 0, light: 0, moderate: 0, active: 0, very_active: 0 } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
        <div className="flex items-center">
          <Zap className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">BMR Calculator</h2>
        </div>
        <p className="text-purple-100 mt-1">Calculate your Basal Metabolic Rate</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formula
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Select formula"
            >
              <option value="mifflin">Mifflin-St Jeor (Most Accurate)</option>
              <option value="harris">Harris-Benedict</option>
              <option value="katch">Katch-McArdle</option>
              <option value="cunningham">Cunningham</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-700">BMR:</span>
                  <span className="font-semibold text-purple-800">{result.bmr.toFixed(0)} calories/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Formula Used:</span>
                  <span className="font-semibold text-purple-800">{result.formula}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Daily Calorie Needs (TDEE)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-700">Sedentary:</span>
                  <span className="font-semibold text-purple-800">{result.tdee.sedentary.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Light Activity:</span>
                  <span className="font-semibold text-purple-800">{result.tdee.light.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Moderate Activity:</span>
                  <span className="font-semibold text-purple-800">{result.tdee.moderate.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Active:</span>
                  <span className="font-semibold text-purple-800">{result.tdee.active.toFixed(0)} calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Very Active:</span>
                  <span className="font-semibold text-purple-800">{result.tdee.very_active.toFixed(0)} calories</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About BMR Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our Basal Metabolic Rate (BMR) calculator helps you determine the number of calories your body needs 
              at rest to maintain basic life functions. This fundamental measurement is essential for weight management, 
              nutrition planning, and understanding your body's energy requirements.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What is BMR?</h4>
            <p className="text-gray-700 mb-4">
              BMR represents the minimum number of calories your body needs to perform essential functions like breathing, 
              circulation, cell production, nutrient processing, protein synthesis, and ion transport. It accounts for 
              approximately 60-75% of your total daily calorie expenditure.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Available Formulas</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Mifflin-St Jeor</h5>
                <p className="text-gray-700 text-sm">Most accurate for most people, accounts for age, gender, weight, and height</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Harris-Benedict</h5>
                <p className="text-gray-700 text-sm">Classic formula, slightly less accurate but widely used</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Katch-McArdle</h5>
                <p className="text-gray-700 text-sm">Best for those who know their body fat percentage</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cunningham</h5>
                <p className="text-gray-700 text-sm">Ideal for athletes and very active individuals</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting BMR</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Age:</strong> BMR decreases with age due to muscle loss</li>
              <li><strong>Gender:</strong> Men typically have higher BMR due to more muscle mass</li>
              <li><strong>Body Composition:</strong> Muscle tissue burns more calories than fat</li>
              <li><strong>Body Size:</strong> Larger bodies require more energy</li>
              <li><strong>Hormones:</strong> Thyroid function significantly impacts BMR</li>
              <li><strong>Genetics:</strong> Some people naturally have faster or slower metabolisms</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your age, gender, weight, height, and select the formula that best fits your situation. 
              The calculator will compute your BMR and provide TDEE estimates for different activity levels, 
              helping you set appropriate calorie goals.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">BMR vs TDEE</h4>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
              <p className="text-purple-700 text-sm">
                <strong>BMR:</strong> Calories needed at complete rest<br/>
                <strong>TDEE:</strong> Total calories including activity (BMR × Activity Multiplier)
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Use the Mifflin-St Jeor formula for the most accurate results. Your BMR is your metabolic baseline - 
                never eat below this number for extended periods as it can slow your metabolism and cause health issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
