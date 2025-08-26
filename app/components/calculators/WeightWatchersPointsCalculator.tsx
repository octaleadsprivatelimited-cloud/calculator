'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Target } from 'lucide-react'

export default function WeightWatchersPointsCalculator() {
  const [calories, setCalories] = useState('')
  const [saturatedFat, setSaturatedFat] = useState('')
  const [sugar, setSugar] = useState('')
  const [protein, setProtein] = useState('')
  const [fiber, setFiber] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculatePoints = useCallback(() => {
    const cals = parseFloat(calories) || 0
    const satFat = parseFloat(saturatedFat) || 0
    const sug = parseFloat(sugar) || 0
    const prot = parseFloat(protein) || 0
    const fib = parseFloat(fiber) || 0
    
        if (cals === 0) return { 
      points: 0, 
      breakdown: {
        calories: 0,
        saturatedFat: 0,
        sugar: 0,
        protein: 0,
        fiber: 0,
        total: 0
      }, 
      recommendations: [],
      dailyAllowance: 0
    }

    // Weight Watchers SmartPoints formula (simplified)
    // Points = (calories/50) + (saturated fat/12) + (sugar/10) - (protein/10) - (fiber/5)
    let points = (cals / 50) + (satFat / 12) + (sug / 10) - (prot / 10) - (fib / 5)
    
    // Minimum points is 0
    points = Math.max(0, points)

    // Calculate breakdown
    const breakdown = {
      calories: cals / 50,
      saturatedFat: satFat / 12,
      sugar: sug / 10,
      protein: prot / 10,
      fiber: fib / 5,
      total: points
    }

    // Determine daily allowance based on typical ranges
    let dailyAllowance = 23 // Default for average person
    if (points > 15) {
      dailyAllowance = 30
    } else if (points > 10) {
      dailyAllowance = 25
    } else if (points > 5) {
      dailyAllowance = 20
    } else {
      dailyAllowance = 15
    }

    // Generate recommendations
    const recommendations = []
    if (points <= dailyAllowance * 0.5) {
      recommendations.push('Low points food - great choice for weight loss')
      recommendations.push('Consider adding more protein for satiety')
    } else if (points <= dailyAllowance * 0.8) {
      recommendations.push('Moderate points - fits well in daily budget')
      recommendations.push('Good balance of nutrients')
    } else if (points <= dailyAllowance) {
      recommendations.push('Higher points - plan your remaining meals carefully')
      recommendations.push('Consider portion control')
    } else {
      recommendations.push('High points - may exceed daily allowance')
      recommendations.push('Consider smaller portions or alternatives')
    }

    recommendations.push('Focus on whole foods with protein and fiber')
    recommendations.push('Track your daily points to stay within budget')

    return { points, breakdown, recommendations, dailyAllowance }
  }, [calories, saturatedFat, sugar, protein, fiber])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setCalories('')
    setSaturatedFat('')
    setSugar('')
    setProtein('')
    setFiber('')
    setShowResults(false)
  }

  const result = showResults ? calculatePoints() : { 
    points: 0, 
    breakdown: {
      calories: 0,
      saturatedFat: 0,
      sugar: 0,
      protein: 0,
      fiber: 0,
      total: 0
    }, 
    recommendations: [],
    dailyAllowance: 0
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
        <div className="flex items-center">
          <Target className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Weight Watchers Points Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate SmartPoints for your food items</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter calories"
                aria-label="Calories per serving"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saturated Fat (g)
              </label>
              <input
                type="number"
                value={saturatedFat}
                onChange={(e) => setSaturatedFat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter saturated fat"
                step="0.1"
                aria-label="Saturated fat in grams"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sugar (g)
              </label>
              <input
                type="number"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sugar"
                step="0.1"
                aria-label="Sugar in grams"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protein (g)
              </label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter protein"
                step="0.1"
                aria-label="Protein in grams"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiber (g)
            </label>
            <input
              type="number"
              value={fiber}
              onChange={(e) => setFiber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter fiber"
              step="0.1"
              aria-label="Fiber in grams"
            />
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
              <h3 className="text-lg font-semibold text-blue-800 mb-2">SmartPoints Result</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {result.points.toFixed(1)} Points
                </div>
                <div className="text-blue-700">
                  Daily Allowance: {result.dailyAllowance} points
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Points Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Calories:</span>
                  <span className="font-semibold text-blue-800">+{result.breakdown.calories?.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Saturated Fat:</span>
                  <span className="font-semibold text-blue-800">+{result.breakdown.saturatedFat?.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Sugar:</span>
                  <span className="font-semibold text-blue-800">+{result.breakdown.sugar?.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Protein:</span>
                  <span className="font-semibold text-blue-800">-{result.breakdown.protein?.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Fiber:</span>
                  <span className="font-semibold text-blue-800">-{result.breakdown.fiber?.toFixed(1)}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-700">Total Points:</span>
                    <span className="text-blue-800">{result.breakdown.total?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">💡 Tips</h3>
              <div className="text-sm text-green-700">
                • Protein and fiber reduce points, making them great choices<br/>
                • Saturated fat and sugar increase points significantly<br/>
                • Focus on whole foods with high protein and fiber content<br/>
                • Track your daily points to stay within your budget
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
