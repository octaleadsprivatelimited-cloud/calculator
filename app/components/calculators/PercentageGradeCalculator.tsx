'use client'

import React, { useState, useCallback } from 'react'
import { GraduationCap, Calculator as CalculatorIcon, RotateCcw, TrendingUp } from 'lucide-react'
import ResultSharing from '../ResultSharing'

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
      <div className="w-full">
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
            {/* Share Options - Moved to Top */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
              <ResultSharing
                title="Percentage to Grade Conversion Result"
                inputs={[
                  { label: "Percentage Score", value: `${result.percentage}%` },
                  { label: "Grading System", value: currentSystem.name },
                  { label: "Calculation Type", value: "Grade Conversion" }
                ]}
                result={{ 
                  label: "Letter Grade", 
                  value: result.letterGrade,
                  unit: ""
                }}
                calculatorName="Percentage Grade Calculator"
                className="mb-0"
              />
            </div>

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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Percentage to Grade Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive Percentage to Grade Calculator helps students, educators, and academic professionals 
              convert percentage scores to letter grades across various grading systems. This essential tool provides 
              accurate grade conversions, GPA calculations, and supports multiple international grading standards for 
              comprehensive academic assessment.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Letter Grade Conversion:</strong> Percentage to letter grade mapping</li>
              <li><strong>GPA Calculation:</strong> Grade Point Average computation</li>
              <li><strong>Grade Descriptions:</strong> Performance level explanations</li>
              <li><strong>Multiple Systems:</strong> Various grading scale support</li>
              <li><strong>International Standards:</strong> UK, Australian, and other systems</li>
              <li><strong>Academic Assessment:</strong> Performance evaluation tools</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Grading System Types</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Traditional Systems</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Standard A-F:</strong> A (90-100%), B (80-89%), C (70-79%)</li>
                  <li><strong>Plus/Minus:</strong> A+, A, A-, B+, B, B-, C+, C, C-</li>
                  <li><strong>Numerical GPA:</strong> 4.0 scale (A=4.0, B=3.0, C=2.0)</li>
                  <li><strong>Pass/Fail:</strong> Binary grading system</li>
                  <li><strong>Percentage Ranges:</strong> Customizable grade boundaries</li>
                  <li><strong>Descriptive Grades:</strong> Excellent, Good, Satisfactory</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">International Systems</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>UK System:</strong> First, Upper Second, Lower Second, Third</li>
                  <li><strong>Australian:</strong> High Distinction, Distinction, Credit, Pass</li>
                  <li><strong>European:</strong> A (Excellent), B (Very Good), C (Good)</li>
                  <li><strong>Canadian:</strong> A+ to F scale with percentage ranges</li>
                  <li><strong>Asian Systems:</strong> Various regional grading standards</li>
                  <li><strong>Professional:</strong> Industry-specific grading scales</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-1">Letter Grade</h5>
                <p className="text-indigo-700 text-sm">Academic performance indicator</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">GPA Points</h5>
                <p className="text-blue-700 text-sm">Grade point average value</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Description</h5>
                <p className="text-green-700 text-sm">Performance level explanation</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">System Used</h5>
                <p className="text-purple-700 text-sm">Grading scale reference</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your percentage score (0-100) and select your preferred grading system. The calculator will 
              automatically convert your percentage to the corresponding letter grade, provide GPA points, and 
              display a detailed grade scale for reference. Use the quick percentage examples for common scores.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GPA Scale Interpretation</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>4.0 Scale (Standard):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>4.0:</strong> A (90-100%) - Excellent</li>
                    <li><strong>3.0:</strong> B (80-89%) - Good</li>
                    <li><strong>2.0:</strong> C (70-79%) - Satisfactory</li>
                    <li><strong>1.0:</strong> D (60-69%) - Below Average</li>
                    <li><strong>0.0:</strong> F (0-59%) - Failing</li>
                  </ul>
                </div>
                <div>
                  <p><strong>GPA Categories:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>3.5-4.0:</strong> High Honors</li>
                    <li><strong>3.0-3.49:</strong> Honors</li>
                    <li><strong>2.0-2.99:</strong> Satisfactory</li>
                    <li><strong>Below 2.0:</strong> Academic Warning</li>
                    <li><strong>Plus/Minus:</strong> ±0.3 adjustments</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Academic Performance Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Performance Levels</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Outstanding (A):</strong> Exceptional understanding and mastery</li>
                  <li><strong>Above Average (B):</strong> Good comprehension with minor gaps</li>
                  <li><strong>Average (C):</strong> Adequate understanding of core concepts</li>
                  <li><strong>Below Average (D):</strong> Basic understanding with significant gaps</li>
                  <li><strong>Failing (F):</strong> Insufficient understanding of material</li>
                  <li><strong>Incomplete (I):</strong> Work not completed within timeframe</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Academic Implications</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Scholarship Eligibility:</strong> GPA requirements for financial aid</li>
                  <li><strong>Honor Societies:</strong> Academic recognition programs</li>
                  <li><strong>Graduate School:</strong> Admission requirements and competitiveness</li>
                  <li><strong>Academic Probation:</strong> Warning systems for low performance</li>
                  <li><strong>Dean's List:</strong> High achievement recognition</li>
                  <li><strong>Academic Standing:</strong> Overall performance classification</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Grade Conversion Factors</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Percentage Precision:</strong> Rounding rules and grade boundaries</li>
              <li><strong>Curve Adjustments:</strong> Statistical grade modifications</li>
              <li><strong>Weighted Grades:</strong> Different assignment type values</li>
              <li><strong>Extra Credit:</strong> Additional points and bonus opportunities</li>
              <li><strong>Grade Inflation:</strong> Historical grade distribution trends</li>
              <li><strong>Department Standards:</strong> Subject-specific grading criteria</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">International Grade Equivalency</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">UK System</h5>
                <p className="text-blue-700 text-sm">First Class Honours (70%+)</p>
                <p className="text-blue-600 text-xs mt-1">Upper Second (60-69%)</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Australian System</h5>
                <p className="text-green-700 text-sm">High Distinction (85%+)</p>
                <p className="text-green-600 text-xs mt-1">Distinction (75-84%)</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">European System</h5>
                <p className="text-purple-700 text-sm">A (Excellent) 90%+</p>
                <p className="text-purple-600 text-xs mt-1">B (Very Good) 80-89%</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Educational Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Student Assessment:</strong> Performance evaluation and feedback</li>
              <li><strong>Academic Planning:</strong> Course selection and progression</li>
              <li><strong>Scholarship Applications:</strong> Eligibility determination</li>
              <li><strong>Graduate Admissions:</strong> Application competitiveness</li>
              <li><strong>Career Development:</strong> Professional qualification requirements</li>
              <li><strong>Academic Counseling:</strong> Student guidance and support</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Grade Calculation Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Simple Percentage</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Direct Conversion:</strong> Percentage to grade mapping</li>
                  <li><strong>Grade Boundaries:</strong> Clear cutoff points</li>
                  <li><strong>Rounding Rules:</strong> Standard mathematical rounding</li>
                  <li><strong>No Curve:</strong> Raw score conversion</li>
                  <li><strong>Transparency:</strong> Predictable grade outcomes</li>
                  <li><strong>Consistency:</strong> Uniform application across courses</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Curved Grading</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Statistical Adjustment:</strong> Based on class performance</li>
                  <li><strong>Bell Curve:</strong> Normal distribution application</li>
                  <li><strong>Percentile Ranking:</strong> Relative performance positioning</li>
                  <li><strong>Dynamic Boundaries:</strong> Adjustable grade cutoffs</li>
                  <li><strong>Competitive Element:</strong> Peer comparison factor</li>
                  <li><strong>Complex Calculation:</strong> Advanced statistical methods</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Best Practices for Students</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Goal Setting:</strong> Establish target grades early</li>
              <li><strong>Progress Monitoring:</strong> Track performance throughout term</li>
              <li><strong>Study Strategies:</strong> Adapt methods based on performance</li>
              <li><strong>Seek Help Early:</strong> Address issues before they compound</li>
              <li><strong>Understand Weighting:</strong> Know how assignments affect final grade</li>
              <li><strong>Maintain Perspective:</strong> Grades are one measure of learning</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Grading Challenges</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Grade Inflation:</strong> Rising average grades over time</li>
              <li><strong>Subjectivity:</strong> Human judgment in assessment</li>
              <li><strong>Inconsistent Standards:</strong> Varying criteria across instructors</li>
              <li><strong>Cultural Differences:</strong> International grading expectations</li>
              <li><strong>Assessment Methods:</strong> Different evaluation techniques</li>
              <li><strong>Grade Disputes:</strong> Resolution processes and appeals</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that grades are tools for learning, not just measures of performance. Use your grade 
                conversions to identify areas for improvement and set realistic academic goals. Different grading 
                systems exist for different purposes - understand which system applies to your situation and how 
                it affects your academic and career planning. Focus on continuous improvement rather than just 
                achieving specific letter grades.
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
        </footer>
      </div>
    </div>
  )
}
