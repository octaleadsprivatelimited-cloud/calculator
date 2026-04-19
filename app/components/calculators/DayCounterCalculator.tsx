'use client'
import React, { useState } from 'react'
import { Calculator, Calendar, Target } from 'lucide-react'
import ResultSharing from '../ResultSharing'

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
    <div className="w-full google-card overflow-hidden">
      <div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white"><div className="flex items-center space-x-3"><div className="p-2 bg-google-blueLight rounded-3xl"><Calculator className="w-5 h-5 text-google-blue" /></div><div><h1 className="text-xl font-medium text-google-text">Calculator</h1><p className="text-google-gray text-xs">Professional calculation tool</p></div></div>
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
              className="google-input"
              title="Select start date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="google-input"
              title="Select end date"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="google-button-primary text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200"
          >
            Count Days
          </button>
        </div>

        {showResults && days !== null && (
          <>
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-6 rounded-2xl border border-green-200 mb-4">
              <ResultSharing
                title="Day Count Calculation Result"
                inputs={[
                  { label: "Start Date", value: startDate },
                  { label: "End Date", value: endDate },
                  { label: "Calculation Type", value: "Day Count" }
                ]}
                result={{ 
                  label: "Total Days", 
                  value: `${days} ${days === 1 ? 'day' : 'days'}`,
                  unit: ""
                }}
                calculatorName="Day Counter Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Day Count Results</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {days} {days === 1 ? 'day' : 'days'}
            </div>
            <div className="mt-4">
              <button onClick={handleReset} className="google-button-primary text-white px-4 py-2 rounded-2xl">
                Reset
              </button>
            </div>
          </div>
          </>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 google-result-card">
          <h3 className="text-xl font-semibold text-google-text mb-4">About Day Counter Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our simple and efficient day counter calculator helps you quickly determine the number of 
              days between two dates. This essential tool provides accurate day counting for planning, 
              scheduling, and tracking time periods, making it perfect for personal and professional use.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}





