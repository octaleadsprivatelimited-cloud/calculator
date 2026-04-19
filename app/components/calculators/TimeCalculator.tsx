'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Clock } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function TimeCalculator() {
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateTime = useCallback(() => {
    const h = parseInt(hours) || 0
    const m = parseInt(minutes) || 0
    const s = parseInt(seconds) || 0

    const totalSeconds = h * 3600 + m * 60 + s
    const totalMinutes = totalSeconds / 60
    const totalHours = totalSeconds / 3600
    const days = totalHours / 24

    return {
      totalSeconds,
      totalMinutes,
      totalHours,
      days,
      formatted: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
  }, [hours, minutes, seconds])

  const handleCalculate = () => {
    if (hours || minutes || seconds) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setHours('')
    setMinutes('')
    setSeconds('')
    setShowResults(false)
  }

  const result = showResults ? calculateTime() : { totalSeconds: 0, totalMinutes: 0, totalHours: 0, days: 0, formatted: '00:00:00' }

  return (
    <div className="w-full google-card overflow-hidden">
      <div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white"><div className="flex items-center space-x-3"><div className="p-2 bg-google-blueLight rounded-3xl"><Calculator className="w-5 h-5 text-google-blue" /></div><div><h1 className="text-xl font-medium text-google-text">Calculator</h1><p className="text-google-gray text-xs">Professional calculation tool</p></div></div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Time Calculator</h1>
            <p className="text-purple-100 text-lg">
              Convert time between hours, minutes, seconds, and days.
            </p>
          </div>
          <div className="hidden md:block">
            <Clock className="w-16 h-16 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="google-input"
              placeholder="0"
              min="0"
              max="999"
              step="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="google-input"
              placeholder="0"
              min="0"
              max="59"
              step="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seconds</label>
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              className="google-input"
              placeholder="0"
              min="0"
              max="59"
              step="1"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="google-button-primary text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200"
          >
            Calculate Time
          </button>
        </div>

        {showResults && (
          <div className="space-y-6">
            {/* Share Options - Moved to Top */}
            <div className="google-result-card">
              <ResultSharing
                title="Time Calculation Result"
                inputs={[
                  { label: "Hours", value: hours || "0" },
                  { label: "Minutes", value: minutes || "0" },
                  { label: "Seconds", value: seconds || "0" },
                  { label: "Calculation Type", value: "Time Conversion" }
                ]}
                result={{ 
                  label: "Total Time", 
                  value: result.formatted,
                  unit: ""
                }}
                calculatorName="Time Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Time Conversion Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-700">{result.formatted}</div>
                  <div className="text-sm text-google-gray">Time Format</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{result.totalSeconds.toLocaleString()}</div>
                  <div className="text-sm text-google-gray">Total Seconds</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.totalMinutes.toFixed(2)}</div>
                  <div className="text-sm text-google-gray">Total Minutes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{result.totalHours.toFixed(2)}</div>
                  <div className="text-sm text-google-gray">Total Hours</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-google-text mb-4">Additional Conversions</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700 mb-2">
                  {result.days.toFixed(2)} days
                </div>
                <div className="text-sm text-google-gray">Total Days</div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="google-button-primary text-white px-4 py-2 rounded-2xl transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Calculator Description Section */}
      <div className="mt-8 p-6 google-result-card">
        <h3 className="text-xl font-semibold text-google-text mb-4">About Time Calculator</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Our time calculator helps you convert between different time units including hours, minutes, 
            seconds, and days. It's designed for professionals, students, and anyone who needs to work 
            with time measurements in various contexts.
          </p>
        </div>
      </div>
    </div>
  )
}






