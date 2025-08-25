'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Clock, Calendar, TrendingUp } from 'lucide-react'

interface TimeEntry {
  startTime: string
  endTime: string
  breakTime: number
  hours: number
  minutes: number
  totalMinutes: number
}

export default function HoursCalculator() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [breakTime, setBreakTime] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateHours = useCallback(() => {
    if (!startTime || !endTime) return null

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    
    // Handle overnight shifts
    if (end < start) {
      end.setDate(end.getDate() + 1)
    }
    
    const diffMs = end.getTime() - start.getTime()
    const totalMinutes = Math.floor(diffMs / (1000 * 60))
    const breakMinutes = parseFloat(breakTime) || 0
    const netMinutes = totalMinutes - breakMinutes
    
    const hours = Math.floor(netMinutes / 60)
    const minutes = netMinutes % 60
    
    return {
      hours,
      minutes,
      totalMinutes: netMinutes,
      totalHours: netMinutes / 60
    }
  }, [startTime, endTime, breakTime])

  const addTimeEntry = () => {
    const result = calculateHours()
    if (!result) return

    const newEntry: TimeEntry = {
      startTime,
      endTime,
      breakTime: parseFloat(breakTime) || 0,
      hours: result.hours,
      minutes: result.minutes,
      totalMinutes: result.totalMinutes
    }

    setTimeEntries([...timeEntries, newEntry])
    setStartTime('')
    setEndTime('')
    setBreakTime('')
    setShowResults(true)
  }

  const removeEntry = (index: number) => {
    setTimeEntries(timeEntries.filter((_, i) => i !== index))
  }

  const handleReset = () => {
    setTimeEntries([])
    setStartTime('')
    setEndTime('')
    setBreakTime('')
    setShowResults(false)
  }

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.totalMinutes, 0) / 60
  const totalHoursFormatted = Math.floor(totalHours)
  const totalMinutesFormatted = Math.round((totalHours - totalHoursFormatted) * 60)

  const result = calculateHours()

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Hours Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate work hours, time tracking, and schedules</p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Start time"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="End time"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Break Time (minutes)</label>
            <input
              type="number"
              value={breakTime}
              onChange={(e) => setBreakTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              step="5"
              aria-label="Break time in minutes"
            />
          </div>
        </div>

        <div className="flex space-x-3 mb-6">
          <button
            onClick={addTimeEntry}
            disabled={!startTime || !endTime}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Calculator className="h-5 w-5 inline mr-2" />Add Entry
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <RotateCcw className="h-5 w-5 inline mr-2" />Reset All
          </button>
        </div>

        {result && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Current Calculation</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.hours}h {result.minutes}m</div>
                <div className="text-blue-700">Net Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(result.totalHours * 100) / 100}</div>
                <div className="text-blue-700">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.totalMinutes}</div>
                <div className="text-blue-700">Total Minutes</div>
              </div>
            </div>
          </div>
        )}

        {timeEntries.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Entries</h3>
            <div className="space-y-3">
              {timeEntries.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div><span className="font-medium">Start:</span> {entry.startTime}</div>
                      <div><span className="font-medium">End:</span> {entry.endTime}</div>
                      <div><span className="font-medium">Break:</span> {entry.breakTime}m</div>
                      <div><span className="font-medium">Total:</span> {entry.hours}h {entry.minutes}m</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeEntry(index)}
                    className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showResults && timeEntries.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Summary</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {totalHoursFormatted}h {totalMinutesFormatted}m
                </div>
                <div className="text-green-700">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {timeEntries.length}
                </div>
                <div className="text-green-700">Time Entries</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Hours Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive Hours Calculator helps you track work hours, calculate time differences, 
              and manage multiple time entries for accurate timekeeping and payroll calculations. This 
              essential tool provides precise time calculations, break time management, and comprehensive 
              time tracking for personal and professional use.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Time Differences:</strong> Hours and minutes between start and end times</li>
              <li><strong>Break Deductions:</strong> Subtract break time from total hours</li>
              <li><strong>Multiple Entries:</strong> Track multiple time periods</li>
              <li><strong>Total Hours:</strong> Sum of all time entries</li>
              <li><strong>Overnight Shifts:</strong> Handle shifts spanning midnight</li>
              <li><strong>Time Formatting:</strong> Display in hours and minutes</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Net Time</h5>
                <p className="text-blue-700 text-sm">Time minus breaks</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Total Hours</h5>
                <p className="text-green-700 text-sm">Sum of all entries</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Break Time</h5>
                <p className="text-purple-700 text-sm">Deductions applied</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Entries</h5>
                <p className="text-orange-700 text-sm">Number of time periods</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your start time, end time, and any break time taken. Click "Add Entry" to add the 
              time period to your list. You can add multiple entries to track different work periods. 
              The calculator automatically handles overnight shifts and provides a summary of total hours worked.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Use Cases</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Work Time Tracking:</strong> Calculate daily and weekly work hours</li>
              <li><strong>Payroll Calculations:</strong> Determine hours for payment processing</li>
              <li><strong>Project Time Management:</strong> Track time spent on specific tasks</li>
              <li><strong>Freelance Billing:</strong> Calculate billable hours for clients</li>
              <li><strong>Overtime Calculations:</strong> Track hours beyond standard workday</li>
              <li><strong>Break Time Management:</strong> Ensure proper break time deductions</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Time Calculation Features</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Overnight Shift Support</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Automatically handles shifts past midnight</li>
                  <li>Calculates correct duration for night work</li>
                  <li>Supports 24-hour time format</li>
                  <li>Accurate for rotating shift schedules</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Break Time Management</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Subtract lunch breaks and rest periods</li>
                  <li>Account for multiple break periods</li>
                  <li>Maintain accurate work time records</li>
                  <li>Comply with labor law requirements</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Professional Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Human Resources:</strong> Employee time tracking and payroll</li>
              <li><strong>Project Management:</strong> Task time allocation and tracking</li>
              <li><strong>Consulting:</strong> Billable hours calculation</li>
              <li><strong>Healthcare:</strong> Medical staff scheduling and time tracking</li>
              <li><strong>Education:</strong> Teacher and student time management</li>
              <li><strong>Retail:</strong> Employee shift scheduling and tracking</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Time Management Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Consistent Tracking:</strong> Record time entries regularly</li>
              <li><strong>Break Documentation:</strong> Note all break periods taken</li>
              <li><strong>Category Organization:</strong> Group similar time entries</li>
              <li><strong>Regular Reviews:</strong> Analyze time patterns weekly</li>
              <li><strong>Goal Setting:</strong> Set time targets for productivity</li>
              <li><strong>Efficiency Analysis:</strong> Identify time optimization opportunities</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                For accurate time tracking, record your start and end times as they happen rather than 
                estimating later. This ensures precise calculations and helps identify patterns in your 
                work schedule. Regular time tracking can reveal productivity insights and help optimize 
                your daily routine for better work-life balance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
