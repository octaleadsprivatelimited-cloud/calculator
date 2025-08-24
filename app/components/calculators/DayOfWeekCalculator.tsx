'use client'
import React, { useState } from 'react'
import { Calculator, Calendar, Clock } from 'lucide-react'

export default function DayOfWeekCalculator() {
  const [date, setDate] = useState('')
  const [showResults, setShowResults] = useState(false)

  const getDayOfWeek = () => {
    if (!date) return null
    
    const selectedDate = new Date(date)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = days[selectedDate.getDay()]
    const dayNumber = selectedDate.getDay()
    
    return { dayName, dayNumber, fullDate: selectedDate.toDateString() }
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setDate('')
    setShowResults(false)
  }

  const dayInfo = showResults ? getDayOfWeek() : null

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Day of Week Calculator</h1>
            <p className="text-purple-100 text-lg">Find out what day of the week any date falls on</p>
          </div>
          <Calendar className="w-16 h-16 text-purple-200" />
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-xs mx-auto mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Select a date"
          />
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Find Day of Week
          </button>
        </div>

        {showResults && dayInfo && (
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">Day of Week Results</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {dayInfo.dayName}
            </div>
            <div className="text-lg text-gray-600 mb-2">
              {dayInfo.fullDate}
            </div>
            <div className="text-sm text-gray-500">
              Day number: {dayInfo.dayNumber} (0 = Sunday, 6 = Saturday)
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
