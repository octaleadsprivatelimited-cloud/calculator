'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Heart } from 'lucide-react'

export default function PregnancyCalculator() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [showResults, setShowResults] = useState(false)

  const calculatePregnancy = useCallback(() => {
    if (!lastPeriod) return { dueDate: '', currentWeek: 0, trimester: '', milestones: [] }

    const lastPeriodDate = new Date(lastPeriod)
    const cycle = parseInt(cycleLength) || 28

    // Due date calculation (LMP + 280 days)
    const dueDate = new Date(lastPeriodDate)
    dueDate.setDate(lastPeriodDate.getDate() + 280)

    // Current week calculation
    const today = new Date()
    const daysSinceLMP = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24))
    const currentWeek = Math.floor(daysSinceLMP / 7)

    // Trimester calculation
    let trimester = ''
    if (currentWeek < 13) trimester = 'First Trimester'
    else if (currentWeek < 27) trimester = 'Second Trimester'
    else trimester = 'Third Trimester'

    // Key milestones
    const milestones = []
    if (currentWeek >= 4) milestones.push('Missed period, pregnancy test positive')
    if (currentWeek >= 6) milestones.push('Heartbeat begins, major organs form')
    if (currentWeek >= 8) milestones.push('All major organs developed')
    if (currentWeek >= 12) milestones.push('End of first trimester, reduced miscarriage risk')
    if (currentWeek >= 16) milestones.push('Gender can be determined via ultrasound')
    if (currentWeek >= 20) milestones.push('Anatomy scan, halfway point')
    if (currentWeek >= 24) milestones.push('Viability milestone reached')
    if (currentWeek >= 28) milestones.push('Third trimester begins')
    if (currentWeek >= 32) milestones.push('Rapid brain development')
    if (currentWeek >= 36) milestones.push('Baby is considered full-term soon')
    if (currentWeek >= 37) milestones.push('Full-term pregnancy')
    if (currentWeek >= 40) milestones.push('Due date reached')

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }

    return { 
      dueDate: formatDate(dueDate), 
      currentWeek: Math.max(0, currentWeek), 
      trimester, 
      milestones: milestones.slice(-5) // Show last 5 relevant milestones
    }
  }, [lastPeriod, cycleLength])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLastPeriod('')
    setCycleLength('28')
    setShowResults(false)
  }

  const result = showResults ? calculatePregnancy() : { dueDate: '', currentWeek: 0, trimester: '', milestones: [] }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Pregnancy Calculator</h2>
        </div>
        <p className="text-pink-100 mt-1">Calculate your due date and pregnancy progress</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Day of Last Period
            </label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="First day of last period"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Cycle Length (days)
            </label>
            <input
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="28"
              min="21"
              max="35"
              aria-label="Average cycle length in days"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Pregnancy Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-pink-700">Current Week:</span>
                  <span className="font-semibold text-pink-800">Week {result.currentWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-700">Trimester:</span>
                  <span className="font-semibold text-pink-800">{result.trimester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-700">Due Date:</span>
                  <span className="font-semibold text-pink-800">{result.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-pink-800 mb-3">Recent Milestones</h3>
              <div className="space-y-2">
                {result.milestones.length > 0 ? (
                  result.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span className="text-pink-700">{milestone}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-pink-600">Enter your last period date to see milestones</p>
                )}
              </div>
            </div>

            {result.currentWeek > 0 && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="text-lg font-semibold text-pink-800 mb-3">Progress Bar</h3>
                <div className="w-full bg-pink-200 rounded-full h-3">
                  <div 
                    className="bg-pink-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (result.currentWeek / 40) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2 text-sm text-pink-600">
                  {result.currentWeek} of 40 weeks completed
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
