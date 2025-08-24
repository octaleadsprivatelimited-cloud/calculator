'use client'
import React, { useState } from 'react'
import { Calculator, Calendar, Target } from 'lucide-react'

export default function DayCounterCalculator() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateDays = () => {
    if (!startDate || !endDate) return null
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setShowResults(false)
  }

  const days = showResults ? calculateDays() : null

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Day Counter Calculator</h1>
            <p className="text-green-100 text-lg">Count the number of days between two dates</p>
          </div>
          <Calendar className="w-16 h-16 text-green-200" />
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Select start date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Select end date"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Count Days
          </button>
        </div>

        {showResults && days !== null && (
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Day Count Results</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {days} {days === 1 ? 'day' : 'days'}
            </div>
            <div className="mt-4">
              <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
