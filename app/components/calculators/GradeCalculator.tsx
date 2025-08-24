'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, BookOpen } from 'lucide-react'

export default function GradeCalculator() {
  const [currentGrade, setCurrentGrade] = useState('')
  const [finalWeight, setFinalWeight] = useState('')
  const [desiredGrade, setDesiredGrade] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateGrade = useCallback(() => {
    const current = parseFloat(currentGrade) || 0
    const weight = parseFloat(finalWeight) || 0
    const desired = parseFloat(desiredGrade) || 0

    if (current === 0 || weight === 0 || desired === 0) return { needed: 0, possible: false }

    const currentWeight = 100 - weight
    const currentPoints = (current * currentWeight) / 100
    const neededPoints = desired - currentPoints
    const neededGrade = (neededPoints * 100) / weight

    return { needed: neededGrade, possible: neededGrade <= 100 }
  }, [currentGrade, finalWeight, desiredGrade])

  const handleCalculate = () => {
    if (currentGrade && finalWeight && desiredGrade) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setCurrentGrade('')
    setFinalWeight('')
    setDesiredGrade('')
    setShowResults(false)
  }

  const result = showResults ? calculateGrade() : { needed: 0, possible: false }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Grade Calculator</h1>
            <p className="text-green-100 text-lg">
              Calculate what grade you need on your final to achieve your desired grade.
            </p>
          </div>
          <div className="hidden md:block">
            <BookOpen className="w-16 h-16 text-green-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Grade (%)</label>
            <input
              type="number"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="85"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Final Exam Weight (%)</label>
            <input
              type="number"
              value={finalWeight}
              onChange={(e) => setFinalWeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="30"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Desired Final Grade (%)</label>
            <input
              type="number"
              value={desiredGrade}
              onChange={(e) => setDesiredGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="90"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate Grade Needed
          </button>
        </div>

        {showResults && (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Grade Calculation Results</h3>
              <div className="text-center">
                {result.possible ? (
                  <div>
                    <div className="text-3xl font-bold text-green-700 mb-2">
                      {result.needed.toFixed(1)}%
                    </div>
                    <div className="text-lg text-gray-700">Grade needed on final exam</div>
                    <div className="text-sm text-green-600 mt-2">
                      This is achievable! Study hard and you can reach your goal.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl font-bold text-red-700 mb-2">
                      {result.needed.toFixed(1)}%
                    </div>
                    <div className="text-lg text-gray-700">Grade needed on final exam</div>
                    <div className="text-sm text-red-600 mt-2">
                      This grade is not achievable. Consider adjusting your goal.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
