'use client'
import React, { useState } from 'react'
import { Calculator, Clock, Calendar } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function TimeDurationCalculator() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateDuration = () => {
    if (!startDate || !endDate || !startTime || !endTime) return null
    
    const start = new Date(`${startDate}T${startTime}`)
    const end = new Date(`${endDate}T${endTime}`)
    
    const diffMs = end.getTime() - start.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000)
    
    return { days: diffDays, hours: diffHours, minutes: diffMinutes, seconds: diffSeconds, totalMs: diffMs }
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setStartTime('')
    setEndTime('')
    setShowResults(false)
  }

  const duration = showResults ? calculateDuration() : null

  return (
    <div className="w-full google-card overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Time Duration Calculator</h1>
            <p className="text-indigo-100 text-lg">Calculate the duration between two dates and times</p>
          </div>
          <Clock className="w-16 h-16 text-indigo-200" />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="google-input"
              title="Select start time"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="google-input"
              title="Select end time"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="google-button-primary text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200"
          >
            Calculate Duration
          </button>
        </div>

        {showResults && duration && (
          <>
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-6 rounded-2xl border border-indigo-200 mb-4">
              <ResultSharing
                title="Time Duration Calculation Result"
                inputs={[
                  { label: "Start Date & Time", value: `${startDate} ${startTime}` },
                  { label: "End Date & Time", value: `${endDate} ${endTime}` },
                  { label: "Calculation Type", value: "Duration" }
                ]}
                result={{ 
                  label: "Total Duration", 
                  value: `${duration.days}d ${duration.hours}h ${duration.minutes}m ${duration.seconds}s`,
                  unit: ""
                }}
                calculatorName="Time Duration Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200 text-center">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Duration Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{duration.days}</div>
                  <div className="text-sm text-google-gray">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{duration.hours}</div>
                  <div className="text-sm text-google-gray">Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{duration.minutes}</div>
                  <div className="text-sm text-google-gray">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{duration.seconds}</div>
                  <div className="text-sm text-google-gray">Seconds</div>
                </div>
              </div>
              <div className="mt-4">
                <button onClick={handleReset} className="google-button-primary text-white px-4 py-2 rounded-2xl">
                  Reset
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Calculator Description Section */}
      <div className="mt-8 p-6 google-result-card">
        <h3 className="text-xl font-semibold text-google-text mb-4">About Time Duration Calculator</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Our time duration calculator helps you determine the exact time span between two specific dates 
            and times. It's designed for professionals, project managers, and anyone who needs to calculate 
            precise time intervals for planning, billing, or analysis purposes.
          </p>
        </div>
      </div>
    </div>
  )
}




