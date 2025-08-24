'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Calendar } from 'lucide-react'

export default function PeriodCalculator() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [showResults, setShowResults] = useState(false)

  const calculatePeriod = useCallback(() => {
        if (!lastPeriod) return { 
      nextPeriod: '', 
      futurePeriods: [], 
      cycleInfo: {
        daysSinceLast: 0,
        daysUntilNext: 0,
        cycleLength: 28,
        isLate: false,
        isDueSoon: false
      },
      recommendations: []
    }

    const lastPeriodDate = new Date(lastPeriod)
    const cycle = parseInt(cycleLength) || 28

    // Calculate next period
    const nextPeriod = new Date(lastPeriodDate)
    nextPeriod.setDate(lastPeriodDate.getDate() + cycle)

    // Calculate future periods (next 6 months)
    const futurePeriods = []
    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(lastPeriodDate)
      futureDate.setDate(lastPeriodDate.getDate() + (cycle * i))
      futurePeriods.push(futureDate)
    }

    // Calculate cycle statistics
    const today = new Date()
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysUntilNextPeriod = Math.floor((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    const cycleInfo = {
      daysSinceLast: daysSinceLastPeriod,
      daysUntilNext: daysUntilNextPeriod,
      cycleLength: cycle,
      isLate: daysSinceLastPeriod > cycle,
      isDueSoon: daysUntilNextPeriod <= 7
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Generate recommendations
    const recommendations = []
    if (cycleInfo.isLate) {
      recommendations.push('Your period is late - consider taking a pregnancy test')
      recommendations.push('Stress, illness, or medication can affect cycle timing')
    } else if (cycleInfo.isDueSoon) {
      recommendations.push('Your period is due soon - prepare accordingly')
      recommendations.push('Track symptoms and flow for better cycle understanding')
    } else {
      recommendations.push('Your cycle appears to be on track')
      recommendations.push('Continue tracking for pattern recognition')
    }

    recommendations.push('Track symptoms, flow, and cycle length for better health insights')
    recommendations.push('Consult healthcare provider if cycles are consistently irregular')

    return { 
      nextPeriod: formatDate(nextPeriod), 
      futurePeriods: futurePeriods.map(formatDate), 
      cycleInfo,
      recommendations
    }
  }, [lastPeriod, cycleLength])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLastPeriod('')
    setCycleLength('28')
    setShowResults(false)
  }

  const result = showResults ? calculatePeriod() : { 
    nextPeriod: '', 
    futurePeriods: [], 
    cycleInfo: {
      daysSinceLast: 0,
      daysUntilNext: 0,
      cycleLength: 28,
      isLate: false,
      isDueSoon: false
    },
    recommendations: []
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Period Calculator</h2>
        </div>
        <p className="text-rose-100 mt-1">Calculate your next period and track your cycle</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="28"
              min="21"
              max="35"
              aria-label="Average cycle length in days"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-2">Next Period</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-600 mb-2">
                  {result.nextPeriod}
                </div>
                <div className="text-rose-700">
                  {result.cycleInfo.daysUntilNext > 0 
                    ? `${result.cycleInfo.daysUntilNext} days away`
                    : 'Due today or overdue'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-3">Cycle Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-rose-700">Days since last period:</span>
                  <span className="font-semibold text-rose-800">{result.cycleInfo.daysSinceLast}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-700">Days until next period:</span>
                  <span className="font-semibold text-rose-800">{result.cycleInfo.daysUntilNext}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-700">Cycle length:</span>
                  <span className="font-semibold text-rose-800">{result.cycleInfo.cycleLength} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-700">Status:</span>
                  <span className={`font-semibold ${result.cycleInfo.isLate ? 'text-red-600' : result.cycleInfo.isDueSoon ? 'text-orange-600' : 'text-green-600'}`}>
                    {result.cycleInfo.isLate ? 'Late' : result.cycleInfo.isDueSoon ? 'Due Soon' : 'On Track'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-3">Future Periods (6 months)</h3>
              <div className="space-y-2">
                {result.futurePeriods.map((date, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-rose-700">Month {index + 1}:</span>
                    <span className="font-semibold text-rose-800">{date}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <h3 className="text-lg font-semibold text-rose-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-rose-600 mr-2">•</span>
                      <span className="text-rose-700">{rec}</span>
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
