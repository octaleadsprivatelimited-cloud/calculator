'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Dumbbell } from 'lucide-react'

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [formula, setFormula] = useState('brzycki')
  const [showResults, setShowResults] = useState(false)

  const calculateOneRepMax = useCallback(() => {
    const w = parseFloat(weight) || 0
    const r = parseFloat(reps) || 0
    if (w === 0 || r === 0) return { 
      oneRepMax: 0, 
      percentages: {}, 
      recommendations: [],
      formulaName: ''
    }

    let oneRepMax = 0
    let formulaName = ''

    // Different 1RM formulas
    switch (formula) {
      case 'brzycki':
        oneRepMax = w / (1.0278 - 0.0278 * r)
        formulaName = 'Brzycki Formula'
        break
      case 'epley':
        oneRepMax = w * (1 + r / 30)
        formulaName = 'Epley Formula'
        break
      case 'lombardi':
        oneRepMax = w * Math.pow(r, 0.1)
        formulaName = 'Lombardi Formula'
        break
      case 'mayhew':
        oneRepMax = w / (0.522 + 0.419 * Math.exp(-0.055 * r))
        formulaName = 'Mayhew Formula'
        break
      case 'oconnor':
        oneRepMax = w * (1 + r * 0.025)
        formulaName = 'O\'Connor Formula'
        break
      default:
        oneRepMax = w / (1.0278 - 0.0278 * r)
        formulaName = 'Brzycki Formula'
    }

    // Calculate percentages of 1RM
    const percentages = {
      '100%': oneRepMax,
      '95%': oneRepMax * 0.95,
      '90%': oneRepMax * 0.90,
      '85%': oneRepMax * 0.85,
      '80%': oneRepMax * 0.80,
      '75%': oneRepMax * 0.75,
      '70%': oneRepMax * 0.70,
      '65%': oneRepMax * 0.65,
      '60%': oneRepMax * 0.60
    }

    // Generate recommendations
    const recommendations = []
    if (oneRepMax > 0) {
      recommendations.push(`Your 1RM is approximately ${oneRepMax.toFixed(0)} lbs`)
      
      if (r <= 3) {
        recommendations.push('Low rep ranges are excellent for strength building')
        recommendations.push('Consider working at 85-95% of your 1RM')
      } else if (r <= 8) {
        recommendations.push('Moderate rep ranges are great for hypertrophy')
        recommendations.push('Work at 70-85% of your 1RM for muscle growth')
      } else {
        recommendations.push('Higher rep ranges build muscular endurance')
        recommendations.push('Work at 60-75% of your 1RM for endurance')
      }
      
      recommendations.push('Test your 1RM every 4-6 weeks to track progress')
    }

    return { oneRepMax, percentages, recommendations, formulaName }
  }, [weight, reps, formula])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setReps('')
    setFormula('brzycki')
    setShowResults(false)
  }

  const result = showResults ? calculateOneRepMax() : { 
    oneRepMax: 0, 
    percentages: {}, 
    recommendations: [],
    formulaName: ''
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center">
          <Dumbbell className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">One Rep Max Calculator</h2>
        </div>
        <p className="text-purple-100 mt-1">Calculate your one rep maximum using multiple formulas</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight Lifted (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter weight"
                aria-label="Weight lifted in pounds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reps Performed
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter reps"
                min="1"
                max="20"
                aria-label="Number of reps performed"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              aria-label="Select calculation formula"
            >
              <option value="brzycki">Brzycki (Most Popular)</option>
              <option value="epley">Epley</option>
              <option value="lombardi">Lombardi</option>
              <option value="mayhew">Mayhew</option>
              <option value="oconnor">O'Connor</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Your One Rep Max</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {result.oneRepMax.toFixed(0)} lbs
                </div>
                <div className="text-purple-700">
                  Using {result.formulaName}
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Training Percentages</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(result.percentages).map(([percentage, weight]) => (
                  <div key={percentage} className="flex justify-between">
                    <span className="text-purple-700">{percentage}:</span>
                    <span className="font-semibold text-purple-800">{weight.toFixed(0)} lbs</span>
                  </div>
                ))}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span className="text-purple-700">{rec}</span>
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
