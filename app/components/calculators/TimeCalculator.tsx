'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Clock } from 'lucide-react'

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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 text-white">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate Time
          </button>
        </div>

        {showResults && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Time Conversion Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-700">{result.formatted}</div>
                  <div className="text-sm text-gray-600">Time Format</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{result.totalSeconds.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Seconds</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.totalMinutes.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Minutes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{result.totalHours.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Conversions</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700 mb-2">
                  {result.days.toFixed(2)} days
                </div>
                <div className="text-sm text-gray-600">Total Days</div>
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

      {/* Comprehensive Description Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">About Time Calculator</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
            <p className="text-gray-700 mb-3">
              This comprehensive time calculator helps you convert between different time units including 
              hours, minutes, seconds, and days. It's designed for professionals, students, and anyone 
              who needs to work with time measurements in various contexts.
            </p>
            <p className="text-gray-700">
              The calculator provides instant conversions and helps you understand the relationships 
              between different time units for better time management and planning.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Time Unit Relationships</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Basic Conversions</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>1 minute = 60 seconds</strong></li>
                  <li><strong>1 hour = 60 minutes = 3,600 seconds</strong></li>
                  <li><strong>1 day = 24 hours = 1,440 minutes = 86,400 seconds</strong></li>
                  <li><strong>1 week = 7 days = 168 hours</strong></li>
                  <li><strong>1 month ≈ 30.44 days (average)</strong></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Decimal Time</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>0.5 hours = 30 minutes</strong></li>
                  <li><strong>0.25 hours = 15 minutes</strong></li>
                  <li><strong>0.1 hours = 6 minutes</strong></li>
                  <li><strong>0.01 hours = 0.6 minutes = 36 seconds</strong></li>
                  <li><strong>Decimal format useful for calculations</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Practical Applications</h3>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-2">Common Use Cases</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Work & Productivity:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Time tracking and billing</li>
                    <li>Project duration estimates</li>
                    <li>Meeting scheduling</li>
                    <li>Break time calculations</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Travel & Transportation:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Journey time planning</li>
                    <li>Flight duration calculations</li>
                    <li>Commute time estimates</li>
                    <li>Time zone conversions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Time Measurement Systems</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">International System (SI)</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Base Unit:</strong> Second (s)</li>
                  <li><strong>Definition:</strong> Based on atomic clock</li>
                  <li><strong>Precision:</strong> Extremely accurate</li>
                  <li><strong>Use:</strong> Scientific and technical</li>
                  <li><strong>Standards:</strong> International agreement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Traditional Units</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Hours:</strong> 24-hour day division</li>
                  <li><strong>Minutes:</strong> 60-minute hour division</li>
                  <li><strong>Seconds:</strong> 60-second minute division</li>
                  <li><strong>Days:</strong> Earth rotation period</li>
                  <li><strong>Weeks:</strong> 7-day cycle</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Time Calculation Methods</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Addition:</strong> Add time units together for total duration</li>
              <li><strong>Subtraction:</strong> Calculate time differences between events</li>
              <li><strong>Multiplication:</strong> Scale time by factors (e.g., 2.5 hours)</li>
              <li><strong>Division:</strong> Split time into equal parts</li>
              <li><strong>Conversion:</strong> Express same duration in different units</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Time Management Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Planning & Scheduling</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Break large tasks into time blocks</li>
                  <li>Use time estimates for planning</li>
                  <li>Account for breaks and transitions</li>
                  <li>Buffer time for unexpected delays</li>
                  <li>Track actual vs. estimated time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Efficiency Strategies</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Time blocking for focused work</li>
                  <li>Pomodoro technique (25-min sessions)</li>
                  <li>Batch similar tasks together</li>
                  <li>Eliminate time-wasting activities</li>
                  <li>Use time tracking tools</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Professional Applications</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Project Management:</strong> Estimate task durations and project timelines</li>
              <li><strong>Human Resources:</strong> Calculate work hours, overtime, and leave time</li>
              <li><strong>Finance:</strong> Time-based calculations for interest and investments</li>
              <li><strong>Healthcare:</strong> Medication timing and treatment schedules</li>
              <li><strong>Education:</strong> Class scheduling and study time allocation</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Use decimal hours for easier calculations in spreadsheets and software</li>
              <li>• Always round up time estimates to account for unexpected delays</li>
              <li>• Break down complex time calculations into smaller, manageable steps</li>
              <li>• Consider time zones when planning international activities</li>
              <li>• Use this calculator to verify time calculations in other applications</li>
              <li>• Remember that time perception varies - actual time may feel different</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
