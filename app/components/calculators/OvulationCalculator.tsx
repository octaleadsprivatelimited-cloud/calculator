'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Calendar } from 'lucide-react'

export default function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [showResults, setShowResults] = useState(false)

  const calculateOvulation = useCallback(() => {
    if (!lastPeriod) return { 
      ovulationDate: '', 
      fertileWindow: { start: '', end: '' }, 
      nextPeriod: '',
      recommendations: []
    }

    const lastPeriodDate = new Date(lastPeriod)
    const cycle = parseInt(cycleLength) || 28

    // Calculate ovulation date (typically 14 days before next period)
    const ovulationDate = new Date(lastPeriodDate)
    ovulationDate.setDate(lastPeriodDate.getDate() + cycle - 14)

    // Calculate fertile window (5 days before ovulation + day of ovulation)
    const fertileStart = new Date(ovulationDate)
    fertileStart.setDate(ovulationDate.getDate() - 5)

    const fertileEnd = new Date(ovulationDate)
    fertileEnd.setDate(ovulationDate.getDate() + 1)

    // Calculate next period
    const nextPeriod = new Date(lastPeriodDate)
    nextPeriod.setDate(lastPeriodDate.getDate() + cycle)

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
    recommendations.push('Track your basal body temperature for more accuracy')
    recommendations.push('Monitor cervical mucus changes')
    recommendations.push('Use ovulation predictor kits for confirmation')
    recommendations.push('Have intercourse every 1-2 days during fertile window')

    return { 
      ovulationDate: formatDate(ovulationDate), 
      fertileWindow: { 
        start: formatDate(fertileStart), 
        end: formatDate(fertileEnd) 
      }, 
      nextPeriod: formatDate(nextPeriod),
      recommendations
    }
  }, [lastPeriod, cycleLength])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLastPeriod('')
    setCycleLength('28')
    setShowResults(false)
  }

  const result = showResults ? calculateOvulation() : { 
    ovulationDate: '', 
    fertileWindow: { start: '', end: '' }, 
    nextPeriod: '',
    recommendations: []
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Ovulation Calculator</h2>
        </div>
        <p className="text-pink-100 mt-1">Calculate your ovulation date and fertile window</p>
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
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Ovulation Date</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600 mb-2">
                  {result.ovulationDate}
                </div>
                <div className="text-pink-700">
                  Most fertile day of your cycle
                </div>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-pink-800 mb-3">Fertile Window</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-pink-700">Start:</span>
                  <span className="font-semibold text-pink-800">{result.fertileWindow.start}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-700">End:</span>
                  <span className="font-semibold text-pink-800">{result.fertileWindow.end}</span>
                </div>
                <div className="text-center mt-3 text-sm text-pink-600">
                  Best time for conception
                </div>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Next Period</h3>
              <div className="text-center">
                <div className="text-xl font-semibold text-pink-600">
                  {result.nextPeriod}
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="text-lg font-semibold text-pink-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span className="text-pink-700">{rec}</span>
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

