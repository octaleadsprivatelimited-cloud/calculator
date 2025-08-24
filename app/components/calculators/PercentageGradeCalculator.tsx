'use client'

import React, { useState, useCallback } from 'react'
import { GraduationCap, Calculator as CalculatorIcon, RotateCcw, TrendingUp } from 'lucide-react'

interface GradeResult {
  percentage: number
  letterGrade: string
  gpaPoints: number
  gradeDescription: string
  color: string
}

export default function PercentageGradeCalculator() {
  const [percentage, setPercentage] = useState('85')
  const [gradingSystem, setGradingSystem] = useState('standard')

  const gradingSystems = {
    standard: {
      name: 'Standard (A-F)',
      grades: [
        { min: 93, max: 100, letter: 'A', gpa: 4.0, description: 'Excellent', color: 'text-green-600' },
        { min: 90, max: 92, letter: 'A-', gpa: 3.7, description: 'Excellent', color: 'text-green-600' },
        { min: 87, max: 89, letter: 'B+', gpa: 3.3, description: 'Good', color: 'text-blue-600' },
        { min: 83, max: 86, letter: 'B', gpa: 3.0, description: 'Good', color: 'text-blue-600' },
        { min: 80, max: 82, letter: 'B-', gpa: 2.7, description: 'Good', color: 'text-blue-600' },
        { min: 77, max: 79, letter: 'C+', gpa: 2.3, description: 'Average', color: 'text-yellow-600' },
        { min: 73, max: 76, letter: 'C', gpa: 2.0, description: 'Average', color: 'text-yellow-600' },
        { min: 70, max: 72, letter: 'C-', gpa: 1.7, description: 'Average', color: 'text-yellow-600' },
        { min: 67, max: 69, letter: 'D+', gpa: 1.3, description: 'Below Average', color: 'text-orange-600' },
        { min: 63, max: 66, letter: 'D', gpa: 1.0, description: 'Below Average', color: 'text-orange-600' },
        { min: 60, max: 62, letter: 'D-', gpa: 0.7, description: 'Below Average', color: 'text-orange-600' },
        { min: 0, max: 59, letter: 'F', gpa: 0.0, description: 'Failing', color: 'text-red-600' }
      ]
    },
    plusMinus: {
      name: 'Plus/Minus System',
      grades: [
        { min: 97, max: 100, letter: 'A+', gpa: 4.0, description: 'Outstanding', color: 'text-green-600' },
        { min: 93, max: 96, letter: 'A', gpa: 4.0, description: 'Excellent', color: 'text-green-600' },
        { min: 90, max: 92, letter: 'A-', gpa: 3.7, description: 'Excellent', color: 'text-green-600' },
        { min: 87, max: 89, letter: 'B+', gpa: 3.3, description: 'Good', color: 'text-blue-600' },
        { min: 83, max: 86, letter: 'B', gpa: 3.0, description: 'Good', color: 'text-blue-600' },
        { min: 80, max: 82, letter: 'B-', gpa: 2.7, description: 'Good', color: 'text-blue-600' },
        { min: 77, max: 79, letter: 'C+', gpa: 2.3, description: 'Average', color: 'text-yellow-600' },
        { min: 73, max: 76, letter: 'C', gpa: 2.0, description: 'Average', color: 'text-yellow-600' },
        { min: 70, max: 72, letter: 'C-', gpa: 1.7, description: 'Average', color: 'text-yellow-600' },
        { min: 67, max: 69, letter: 'D+', gpa: 1.3, description: 'Below Average', color: 'text-orange-600' },
        { min: 63, max: 66, letter: 'D', gpa: 1.0, description: 'Below Average', color: 'text-orange-600' },
        { min: 60, max: 62, letter: 'D-', gpa: 0.7, description: 'Below Average', color: 'text-orange-600' },
        { min: 0, max: 59, letter: 'F', gpa: 0.0, description: 'Failing', color: 'text-red-600' }
      ]
    },
    international: {
      name: 'International (UK/Australia)',
      grades: [
        { min: 80, max: 100, letter: 'A', gpa: 4.0, description: 'First Class', color: 'text-green-600' },
        { min: 70, max: 79, letter: 'B', gpa: 3.0, description: 'Upper Second', color: 'text-blue-600' },
        { min: 60, max: 69, letter: 'C', gpa: 2.0, description: 'Lower Second', color: 'text-yellow-600' },
        { min: 50, max: 59, letter: 'D', gpa: 1.0, description: 'Third Class', color: 'text-orange-600' },
        { min: 0, max: 49, letter: 'F', gpa: 0.0, description: 'Fail', color: 'text-red-600' }
      ]
    },
    passFail: {
      name: 'Pass/Fail System',
      grades: [
        { min: 60, max: 100, letter: 'P', gpa: 0.0, description: 'Pass', color: 'text-green-600' },
        { min: 0, max: 59, letter: 'F', gpa: 0.0, description: 'Fail', color: 'text-red-600' }
      ]
    }
  }

  const calculateGrade = useCallback((): GradeResult => {
    const percentageNum = parseFloat(percentage)
    if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
      return {
        percentage: 0,
        letterGrade: 'Invalid',
        gpaPoints: 0,
        gradeDescription: 'Please enter a valid percentage (0-100)',
        color: 'text-gray-600'
      }
    }

    const currentSystem = gradingSystems[gradingSystem as keyof typeof gradingSystems]
    const grade = currentSystem.grades.find(g => percentageNum >= g.min && percentageNum <= g.max)

    if (!grade) {
      return {
        percentage: percentageNum,
        letterGrade: 'Unknown',
        gpaPoints: 0,
        gradeDescription: 'Grade not found for this percentage',
        color: 'text-gray-600'
      }
    }

    return {
      percentage: percentageNum,
      letterGrade: grade.letter,
      gpaPoints: grade.gpa,
      gradeDescription: grade.description,
      color: grade.color
    }
  }, [percentage, gradingSystem])

  const getGPAInterpretation = (gpa: number): string => {
    if (gpa >= 3.7) return 'Excellent academic performance'
    if (gpa >= 3.0) return 'Good academic performance'
    if (gpa >= 2.0) return 'Average academic performance'
    if (gpa >= 1.0) return 'Below average academic performance'
    return 'Academic performance needs improvement'
  }

  const reset = () => {
    setPercentage('85')
    setGradingSystem('standard')
  }

  const result = calculateGrade()
  const currentSystem = gradingSystems[gradingSystem as keyof typeof gradingSystems]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <GraduationCap className="w-12 h-12 mr-3 text-indigo-600" />
            Percentage to Grade Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Convert percentage scores to letter grades and GPA points
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-indigo-600" />
              Grade Calculation
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Percentage Score
                </label>
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="85"
                  min="0"
                  max="100"
                  step="0.1"
                  title="Enter percentage score (0-100)"
                  aria-label="Percentage score"
                />
                <p className="text-sm text-gray-500 mt-1">Enter a value between 0 and 100</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grading System
                </label>
                <select
                  value={gradingSystem}
                  onChange={(e) => setGradingSystem(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  aria-label="Grading system selection"
                  title="Select grading system"
                >
                  {Object.entries(gradingSystems).map(([key, system]) => (
                    <option key={key} value={key}>
                      {system.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Quick Percentage Examples</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPercentage('95')}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  >
                    95% - Excellent
                  </button>
                  <button
                    onClick={() => setPercentage('85')}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  >
                    85% - Good
                  </button>
                  <button
                    onClick={() => setPercentage('75')}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  >
                    75% - Average
                  </button>
                  <button
                    onClick={() => setPercentage('65')}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  >
                    65% - Below Average
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={reset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
                Grade Results
              </h2>
              
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 ${result.color}`}>
                  {result.letterGrade}
                </div>
                <p className="text-gray-600 text-lg">{result.gradeDescription}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Percentage</span>
                  <span className="font-semibold">{result.percentage}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Letter Grade</span>
                  <span className={`font-semibold ${result.color}`}>
                    {result.letterGrade}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">GPA Points</span>
                  <span className="font-semibold text-blue-600">
                    {result.gpaPoints}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Grading System</span>
                  <span className="font-semibold text-purple-600">
                    {currentSystem.name}
                  </span>
                </div>
                {result.gpaPoints > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">GPA Interpretation</span>
                    <span className="font-semibold text-green-600 text-sm">
                      {getGPAInterpretation(result.gpaPoints)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Grade Scale</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentSystem.grades.map((grade, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${grade.color}`}>
                        {grade.letter}
                      </span>
                      <span className="text-sm text-gray-600">
                        {grade.min}-{grade.max}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">{grade.description}</span>
                      {grade.gpa > 0 && (
                        <div className="text-xs text-blue-600">GPA: {grade.gpa}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Grade Information</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Letter Grades:</strong> Standard academic performance indicators</p>
                <p>• <strong>GPA Points:</strong> Grade Point Average scale (0.0-4.0)</p>
                <p>• <strong>Grading Systems:</strong> Different institutions use various scales</p>
                <p>• <strong>Pass/Fail:</strong> Simple binary grading for certain courses</p>
                <p>• <strong>International:</strong> UK/Australia style grading systems</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Percentage to Grade Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
