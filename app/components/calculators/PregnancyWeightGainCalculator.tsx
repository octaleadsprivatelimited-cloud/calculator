'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Scale } from 'lucide-react'

export default function PregnancyWeightGainCalculator() {
  const [prePregnancyWeight, setPrePregnancyWeight] = useState('')
  const [height, setHeight] = useState('')
  const [currentWeek, setCurrentWeek] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateWeightGain = useCallback(() => {
    const preWeight = parseFloat(prePregnancyWeight) || 0
    const h = parseFloat(height) || 0
    const week = parseFloat(currentWeek) || 0
    if (preWeight === 0 || h === 0) return { 
      bmi: 0, 
      category: '', 
      recommendations: {
        first: { total: 0, weekly: 0, notes: '' },
        second: { total: 0, weekly: 0, notes: '' },
        third: { total: 0, weekly: 0, notes: '' }
      }, 
      weeklyGain: 0,
      totalGain: 0,
      currentExpectedGain: 0
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    // Calculate pre-pregnancy BMI
    const heightM = heightCm / 100
    const bmi = preWeight / (heightM * heightM)

    // Determine BMI category and weight gain recommendations
    let category = ''
    let totalGain = 0
    let weeklyGain = 0

    if (bmi < 18.5) {
      category = 'Underweight'
      totalGain = 28 // 28-40 lbs
      weeklyGain = 1.0
    } else if (bmi < 25) {
      category = 'Normal Weight'
      totalGain = 25 // 25-35 lbs
      weeklyGain = 0.8
    } else if (bmi < 30) {
      category = 'Overweight'
      totalGain = 15 // 15-25 lbs
      weeklyGain = 0.6
    } else {
      category = 'Obese'
      totalGain = 11 // 11-20 lbs
      weeklyGain = 0.4
    }

    // Calculate trimester-specific recommendations
    const recommendations = {
      first: {
        total: totalGain * 0.1, // 10% of total in first trimester
        weekly: 0.5,
        notes: 'Minimal weight gain, focus on nutrition'
      },
      second: {
        total: totalGain * 0.4, // 40% of total in second trimester
        weekly: weeklyGain,
        notes: 'Steady weight gain, baby growing rapidly'
      },
      third: {
        total: totalGain * 0.5, // 50% of total in third trimester
        weekly: weeklyGain,
        notes: 'Maximum weight gain, baby gaining weight'
      }
    }

    // Calculate current expected weight gain
    let currentExpectedGain = 0
    if (week <= 13) {
      currentExpectedGain = recommendations.first.weekly * week
    } else if (week <= 27) {
      currentExpectedGain = recommendations.first.total + (recommendations.second.weekly * (week - 13))
    } else {
      currentExpectedGain = recommendations.first.total + recommendations.second.total + (recommendations.third.weekly * (week - 27))
    }

    return { 
      bmi, 
      category, 
      recommendations, 
      weeklyGain,
      totalGain,
      currentExpectedGain
    }
  }, [prePregnancyWeight, height, currentWeek])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setPrePregnancyWeight('')
    setHeight('')
    setCurrentWeek('')
    setShowResults(false)
  }

  const result = showResults ? calculateWeightGain() : { 
    bmi: 0, 
    category: '', 
    recommendations: {
      first: { total: 0, weekly: 0, notes: '' },
      second: { total: 0, weekly: 0, notes: '' },
      third: { total: 0, weekly: 0, notes: '' }
    }, 
    weeklyGain: 0,
    totalGain: 0,
    currentExpectedGain: 0
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Scale className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Pregnancy Weight Gain Calculator</h2>
        </div>
        <p className="text-purple-100 mt-1">Calculate recommended weight gain during pregnancy</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pre-Pregnancy Weight (lbs)
              </label>
              <input
                type="number"
                value={prePregnancyWeight}
                onChange={(e) => setPrePregnancyWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter weight"
                aria-label="Pre-pregnancy weight in pounds"
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
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Pregnancy Week
            </label>
            <input
              type="number"
              value={currentWeek}
              onChange={(e) => setCurrentWeek(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter week"
              min="1"
              max="42"
              aria-label="Current pregnancy week"
            />
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
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Your Profile</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-700">Pre-Pregnancy BMI:</span>
                  <span className="font-semibold text-purple-800">{result.bmi.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">BMI Category:</span>
                  <span className="font-semibold text-purple-800">{result.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Total Recommended Gain:</span>
                  <span className="font-semibold text-purple-800">{result.totalGain} lbs</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Trimester Breakdown</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-300 pl-3">
                  <h4 className="font-medium text-purple-700">First Trimester (Weeks 1-13)</h4>
                  <div className="text-sm text-purple-600">
                    Total: {result.recommendations.first?.total.toFixed(1)} lbs | Weekly: {result.recommendations.first?.weekly.toFixed(1)} lbs
                  </div>
                  <div className="text-xs text-purple-500 mt-1">{result.recommendations.first?.notes}</div>
                </div>
                <div className="border-l-4 border-purple-400 pl-3">
                  <h4 className="font-medium text-purple-700">Second Trimester (Weeks 14-27)</h4>
                  <div className="text-sm text-purple-600">
                    Total: {result.recommendations.second?.total.toFixed(1)} lbs | Weekly: {result.recommendations.second?.weekly.toFixed(1)} lbs
                  </div>
                  <div className="text-xs text-purple-500 mt-1">{result.recommendations.second?.notes}</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <h4 className="font-medium text-purple-700">Third Trimester (Weeks 28-40)</h4>
                  <div className="text-sm text-purple-600">
                    Total: {result.recommendations.third?.total.toFixed(1)} lbs | Weekly: {result.recommendations.third?.weekly.toFixed(1)} lbs
                  </div>
                  <div className="text-xs text-purple-500 mt-1">{result.recommendations.third?.notes}</div>
                </div>
              </div>
            </div>

            {parseFloat(currentWeek) > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Current Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Expected Weight Gain:</span>
                    <span className="font-semibold text-purple-800">{result.currentExpectedGain.toFixed(1)} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Remaining to Gain:</span>
                    <span className="font-semibold text-purple-800">
                      {Math.max(0, (result.totalGain - result.currentExpectedGain)).toFixed(1)} lbs
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
