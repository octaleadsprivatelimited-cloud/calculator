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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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

      {/* Calculator Description Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About Grade Calculator</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Our comprehensive grade calculator helps students determine what score they need on their final 
            exam to achieve their desired overall grade. This essential academic tool provides strategic 
            planning for exam preparation, helping you set realistic goals and focus your study efforts 
            effectively to reach your target grade.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Required Final Exam Score:</strong> Grade needed to achieve target</li>
            <li><strong>Goal Feasibility:</strong> Whether your target grade is achievable</li>
            <li><strong>Grade Weight Analysis:</strong> Impact of final exam on overall grade</li>
            <li><strong>Study Planning:</strong> Strategic preparation guidance</li>
            <li><strong>Performance Assessment:</strong> Current academic standing</li>
            <li><strong>Goal Setting:</strong> Realistic academic target determination</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Grade Calculation Methods</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Weighted Grade System</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Final exam has specific weight</li>
                <li>Current grade has remaining weight</li>
                <li>Formula: (Desired - Current × Current Weight) ÷ Final Weight</li>
                <li>Most common in higher education</li>
                <li>Allows strategic exam planning</li>
                <li>Provides clear study targets</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Alternative Systems</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Point-based grading</li>
                <li>Curved grading systems</li>
                <li>Pass/fail systems</li>
                <li>Letter grade conversions</li>
                <li>GPA calculations</li>
                <li>Class rank systems</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-1">Required Score</h5>
              <p className="text-green-700 text-sm">Grade needed on final</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-1">Goal Feasibility</h5>
              <p className="text-blue-700 text-sm">Whether target is achievable</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-1">Study Focus</h5>
              <p className="text-purple-700 text-sm">Preparation guidance</p>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
          <p className="text-gray-700 mb-4">
            Enter your current grade percentage, the weight of your final exam, and your desired final grade. 
            The calculator will show you exactly what score you need on the final exam to reach your goal.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Final Exam Weights</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>High School:</strong> 10-20% of final grade</li>
            <li><strong>College Courses:</strong> 20-40% of final grade</li>
            <li><strong>Graduate Programs:</strong> 30-50% of final grade</li>
            <li><strong>Professional Exams:</strong> 100% of certification</li>
            <li><strong>Online Courses:</strong> 15-25% of final grade</li>
            <li><strong>Lab Courses:</strong> 25-35% of final grade</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Grade Planning Strategies</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Conservative Approach:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Set realistic grade targets</li>
                  <li>Plan for unexpected challenges</li>
                  <li>Focus on consistent performance</li>
                  <li>Build buffer for emergencies</li>
                </ul>
              </div>
              <div>
                <p><strong>Aggressive Approach:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Set ambitious grade targets</li>
                  <li>Requires intensive study</li>
                  <li>Higher risk, higher reward</li>
                  <li>Need strong preparation</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Study Planning Based on Results</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>High Required Score (80%+):</strong> Intensive study, consider tutoring</li>
            <li><strong>Moderate Required Score (60-79%):</strong> Regular study sessions, practice tests</li>
            <li><strong>Low Required Score (40-59%):</strong> Light review, focus on key concepts</li>
            <li><strong>Very Low Required Score (Below 40%):</strong> Minimal effort, focus on other courses</li>
            <li><strong>Unachievable Score (Above 100%):</strong> Adjust goals or improve current performance</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Academic Success Tips</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Start Early:</strong> Begin studying well before the exam</li>
            <li><strong>Understand Weighting:</strong> Know how each component affects your grade</li>
            <li><strong>Track Progress:</strong> Monitor your performance throughout the course</li>
            <li><strong>Seek Help:</strong> Use office hours, tutoring, and study groups</li>
            <li><strong>Practice Tests:</strong> Simulate exam conditions</li>
            <li><strong>Time Management:</strong> Balance study time across all subjects</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Grading Systems</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Percentage System:</strong> 0-100% scale (most common)</li>
            <li><strong>Letter Grades:</strong> A, B, C, D, F with plus/minus variations</li>
            <li><strong>4.0 GPA Scale:</strong> A=4.0, B=3.0, C=2.0, D=1.0, F=0.0</li>
            <li><strong>Pass/Fail:</strong> Binary grading system</li>
            <li><strong>Numeric Scales:</strong> 1-10 or other custom scales</li>
            <li><strong>Curved Grading:</strong> Relative performance-based grading</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Use This Calculator</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Course Planning:</strong> Set realistic grade targets early</li>
            <li><strong>Study Planning:</strong> Determine required effort for final exam</li>
            <li><strong>Goal Setting:</strong> Establish achievable academic objectives</li>
            <li><strong>Time Management:</strong> Allocate study time appropriately</li>
            <li><strong>Stress Reduction:</strong> Understand what's needed to succeed</li>
            <li><strong>Academic Advising:</strong> Plan course loads and schedules</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Grade Improvement Strategies</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Attend All Classes:</strong> Don't miss important information</li>
            <li><strong>Take Good Notes:</strong> Develop effective note-taking skills</li>
            <li><strong>Participate Actively:</strong> Engage in class discussions</li>
            <li><strong>Complete All Assignments:</strong> Don't miss easy points</li>
            <li><strong>Study Regularly:</strong> Avoid last-minute cramming</li>
            <li><strong>Seek Feedback:</strong> Learn from mistakes and improve</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
            <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
            <p className="text-gray-700 text-sm">
              Use this calculator early in the semester to set realistic goals and plan your study strategy. 
              If you need a very high score on the final exam, consider whether your goal is realistic or if 
              you should focus on improving your current performance first. Remember that consistent effort 
              throughout the semester is usually more effective than trying to make up for poor performance 
              with a single exam. Also, don't forget that many courses offer extra credit opportunities, 
              participation points, or other ways to improve your grade beyond just the final exam.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
