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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Select start date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Select start time"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Select end date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Select end time"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate Duration
          </button>
        </div>

        {showResults && duration && (
          <>
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-6 rounded-lg border border-indigo-200 mb-4">
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

            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 text-center">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">Duration Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{duration.days}</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{duration.hours}</div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{duration.minutes}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{duration.seconds}</div>
                  <div className="text-sm text-gray-600">Seconds</div>
                </div>
              </div>
              <div className="mt-4">
                <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                  Reset
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Comprehensive Description Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">About Time Duration Calculator</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
            <p className="text-gray-700 mb-3">
              This comprehensive time duration calculator helps you determine the exact time span between 
              two specific dates and times. It's designed for professionals, project managers, and anyone 
              who needs to calculate precise time intervals for planning, billing, or analysis purposes.
            </p>
            <p className="text-gray-700">
              The calculator handles complex scenarios including cross-month and cross-year durations, 
              providing results in multiple time units for maximum flexibility.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Duration Calculation Methods</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Mathematical Approach</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Millisecond Conversion:</strong> Convert dates to milliseconds</li>
                  <li><strong>Difference Calculation:</strong> End time - Start time</li>
                  <li><strong>Unit Breakdown:</strong> Convert total to days, hours, minutes, seconds</li>
                  <li><strong>Precision:</strong> Accurate to the second</li>
                  <li><strong>Handles:</strong> Leap years, daylight saving time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Time Unit Hierarchy</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>1 second = 1,000 milliseconds</strong></li>
                  <li><strong>1 minute = 60 seconds</strong></li>
                  <li><strong>1 hour = 60 minutes</strong></li>
                  <li><strong>1 day = 24 hours</strong></li>
                  <li><strong>1 week = 7 days</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Practical Applications</h3>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-gray-800 mb-2">Common Use Cases</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Project Management:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Task duration tracking</li>
                    <li>Project timeline planning</li>
                    <li>Deadline calculations</li>
                    <li>Resource allocation</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Business Operations:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Service delivery times</li>
                    <li>Customer response times</li>
                    <li>Processing time analysis</li>
                    <li>Performance metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Time Duration Scenarios</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Same Day Calculations</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Work Hours:</strong> Start time to end time</li>
                  <li><strong>Meeting Duration:</strong> Meeting start to end</li>
                  <li><strong>Break Time:</strong> Break start to end</li>
                  <li><strong>Travel Time:</strong> Departure to arrival</li>
                  <li><strong>Processing Time:</strong> Task start to completion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Cross-Day Calculations</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Overnight Shifts:</strong> Evening to morning</li>
                  <li><strong>Project Duration:</strong> Start date to end date</li>
                  <li><strong>Vacation Time:</strong> Leave start to return</li>
                  <li><strong>Contract Periods:</strong> Agreement start to end</li>
                  <li><strong>Event Planning:</strong> Preparation to completion</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Special Considerations</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Leap Years:</strong> February 29th affects year calculations</li>
              <li><strong>Daylight Saving Time:</strong> Clock changes can affect duration</li>
              <li><strong>Time Zones:</strong> Different zones may affect interpretation</li>
              <li><strong>Business Days:</strong> Excluding weekends and holidays</li>
              <li><strong>Working Hours:</strong> Only counting business hours</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Duration Interpretation</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Short Durations</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Seconds:</strong> Quick tasks, responses</li>
                  <li><strong>Minutes:</strong> Short meetings, breaks</li>
                  <li><strong>Hours:</strong> Work sessions, appointments</li>
                  <li><strong>Half-days:</strong> Partial work periods</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Long Durations</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Days:</strong> Project phases, vacations</li>
                  <li><strong>Weeks:</strong> Sprint cycles, training</li>
                  <li><strong>Months:</strong> Quarter planning, seasons</li>
                  <li><strong>Years:</strong> Long-term projects, contracts</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Professional Applications</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Human Resources:</strong> Calculate employee work hours, leave time, and tenure</li>
              <li><strong>Finance:</strong> Determine interest periods, investment holding times, and payment terms</li>
              <li><strong>Healthcare:</strong> Track treatment duration, medication schedules, and recovery periods</li>
              <li><strong>Legal:</strong> Calculate statute of limitations, contract periods, and filing deadlines</li>
              <li><strong>Education:</strong> Plan academic terms, course durations, and study periods</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Always specify both date and time for maximum accuracy in duration calculations</li>
              <li>• Consider time zones when calculating durations across different locations</li>
              <li>• Use this calculator to verify time calculations in project management software</li>
              <li>• Remember that business days exclude weekends and holidays</li>
              <li>• Factor in daylight saving time changes for long-duration calculations</li>
              <li>• Use duration calculations for better project planning and resource allocation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
