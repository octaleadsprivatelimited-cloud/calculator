'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Clock, DollarSign, Calendar } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface TimeEntry {
  id: string
  date: string
  startTime: string
  endTime: string
  breakTime: number
  totalHours: number
  regularHours: number
  overtimeHours: number
}

interface PayResult {
  totalHours: number
  regularHours: number
  overtimeHours: number
  regularPay: number
  overtimePay: number
  totalPay: number
  breakTime: number
}

const BREAK_OPTIONS = [
  { value: 0, label: 'No Break' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' }
]

const COMMON_SHIFTS = [
  { name: 'Morning Shift', start: '08:00', end: '16:00', break: 30 },
  { name: 'Afternoon Shift', start: '12:00', end: '20:00', break: 30 },
  { name: 'Night Shift', start: '20:00', end: '04:00', break: 30 },
  { name: 'Part Time', start: '09:00', end: '14:00', break: 15 },
  { name: 'Full Time', start: '09:00', end: '17:00', break: 60 }
]

export default function TimeCardCalculator() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [hourlyRate, setHourlyRate] = useState('')
  const [overtimeRate, setOvertimeRate] = useState('')
  const [overtimeThreshold, setOvertimeThreshold] = useState('40')
  const [showResults, setShowResults] = useState(false)

  const calculateHours = useCallback((startTime: string, endTime: string, breakTime: number): number => {
    if (!startTime || !endTime) return 0
    
    const start = new Date(`2000-01-01T${startTime}`)
    let end = new Date(`2000-01-01T${endTime}`)
    
    // Handle overnight shifts
    if (end < start) {
      end.setDate(end.getDate() + 1)
    }
    
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    
    return Math.max(0, diffHours - (breakTime / 60))
  }, [])

  const addTimeEntry = () => {
    const today = new Date().toISOString().split('T')[0]
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: today,
      startTime: '',
      endTime: '',
      breakTime: 30,
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0
    }
    setTimeEntries([...timeEntries, newEntry])
  }

  const removeTimeEntry = (id: string) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id))
  }

  const updateTimeEntry = (id: string, field: keyof TimeEntry, value: any) => {
    setTimeEntries(timeEntries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value }
        
        if (field === 'startTime' || field === 'endTime' || field === 'breakTime') {
          updatedEntry.totalHours = calculateHours(
            updatedEntry.startTime,
            updatedEntry.endTime,
            updatedEntry.breakTime
          )
        }
        
        return updatedEntry
      }
      return entry
    }))
  }

  const calculatePay = useCallback((): PayResult => {
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0)
    const breakTime = timeEntries.reduce((sum, entry) => sum + entry.breakTime, 0) / 60
    
    const threshold = parseFloat(overtimeThreshold) || 40
    const regularHours = Math.min(totalHours, threshold)
    const overtimeHours = Math.max(0, totalHours - threshold)
    
    const rate = parseFloat(hourlyRate) || 0
    const overtimeRateMultiplier = parseFloat(overtimeRate) || 1.5
    
    const regularPay = regularHours * rate
    const overtimePay = overtimeHours * rate * overtimeRateMultiplier
    const totalPay = regularPay + overtimePay

    return {
      totalHours,
      regularHours,
      overtimeHours,
      regularPay,
      overtimePay,
      totalPay,
      breakTime
    }
  }, [timeEntries, hourlyRate, overtimeRate, overtimeThreshold])

  const handleCalculate = () => {
    if (timeEntries.length > 0 && hourlyRate) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setTimeEntries([])
    setHourlyRate('')
    setOvertimeRate('')
    setOvertimeThreshold('40')
    setShowResults(false)
  }

  const handleQuickShift = (shift: { name: string, start: string, end: string, break: number }) => {
    const today = new Date().toISOString().split('T')[0]
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: today,
      startTime: shift.start,
      endTime: shift.end,
      breakTime: shift.break,
      totalHours: calculateHours(shift.start, shift.end, shift.break),
      regularHours: 0,
      overtimeHours: 0
    }
    setTimeEntries([...timeEntries, newEntry])
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculatePay()
    
    const data = `Time Card Calculator Results

Time Entries:
${timeEntries.map((entry, index) => 
  `${entry.date}: ${formatTime(entry.startTime)} - ${formatTime(entry.endTime)} (${formatNumber(entry.totalHours)} hrs, ${entry.breakTime} min break)`
).join('\n')}

Pay Summary:
- Total Hours: ${formatNumber(result.totalHours)}
- Regular Hours: ${formatNumber(result.regularHours)}
- Overtime Hours: ${formatNumber(result.overtimeHours)}
- Break Time: ${formatNumber(result.breakTime)} hours
- Hourly Rate: $${hourlyRate}
- Regular Pay: $${formatNumber(result.regularPay)}
- Overtime Pay: $${formatNumber(result.overtimePay)}
- Total Pay: $${formatNumber(result.totalPay)}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'time-card-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculatePay()
      
      navigator.share({
        title: 'Time Card Calculator Results',
        text: `Total hours: ${formatNumber(result.totalHours)}, Total pay: $${formatNumber(result.totalPay)}`,
        url: window.location.href
      })
    } else {
      const result = calculatePay()
      const text = `Time Card: ${formatNumber(result.totalHours)} hours, $${formatNumber(result.totalPay)} pay`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculatePay() : { totalHours: 0, regularHours: 0, overtimeHours: 0, regularPay: 0, overtimePay: 0, totalPay: 0, breakTime: 0 }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Time Card Calculator</h1>
            <p className="text-purple-100 text-lg">
              Calculate work hours, overtime, and pay for multiple time entries. 
              Perfect for employees, freelancers, and time tracking.
            </p>
          </div>
          <div className="hidden md:block">
            <Clock className="w-16 h-16 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Shifts */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Shift Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {COMMON_SHIFTS.map((shift, index) => (
              <button
                key={index}
                onClick={() => handleQuickShift(shift)}
                className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-sm text-left"
              >
                <div className="font-medium text-purple-800">{shift.name}</div>
                <div className="text-purple-600">{formatTime(shift.start)} - {formatTime(shift.end)}</div>
                <div className="text-purple-500">{shift.break} min break</div>
              </button>
            ))}
          </div>
        </div>

        {/* Pay Settings */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pay Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="15.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overtime Rate Multiplier
                </label>
                <input
                  type="number"
                  value={overtimeRate}
                  onChange={(e) => setOvertimeRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1.5"
                  min="1"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Default: 1.5x (time and a half)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overtime Threshold (hours)
                </label>
                <input
                  type="number"
                  value={overtimeThreshold}
                  onChange={(e) => setOvertimeThreshold(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="40"
                  min="0"
                  step="0.5"
                />
                <p className="text-xs text-gray-500 mt-1">Default: 40 hours per week</p>
              </div>
            </div>
          </div>

          {/* Add Time Entry */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Time Entry</h3>
            <button
              onClick={addTimeEntry}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Add Entry
            </button>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>• Add multiple time entries</p>
              <p>• Automatic break time deduction</p>
              <p>• Overnight shift support</p>
            </div>
          </div>

          {/* Summary Preview */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Entries:</span>
                <span className="font-semibold">{timeEntries.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Hours:</span>
                <span className="font-semibold">{formatNumber(timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Break Time:</span>
                <span className="font-semibold">{formatNumber(timeEntries.reduce((sum, entry) => sum + entry.breakTime, 0) / 60)} hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Entries List */}
        {timeEntries.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Time Entries ({timeEntries.length})</h3>
            <div className="space-y-4">
              {timeEntries.map((entry, index) => (
                <div key={entry.id} className="bg-white p-4 rounded-lg border">
                  <div className="grid md:grid-cols-6 gap-4 items-center">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={entry.date}
                        onChange={(e) => updateTimeEntry(entry.id, 'date', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        aria-label="Entry date"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={entry.startTime}
                        onChange={(e) => updateTimeEntry(entry.id, 'startTime', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        aria-label="Start time"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Time</label>
                      <input
                        type="time"
                        value={entry.endTime}
                        onChange={(e) => updateTimeEntry(entry.id, 'endTime', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        aria-label="End time"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Break (min)</label>
                      <select
                        value={entry.breakTime}
                        onChange={(e) => updateTimeEntry(entry.id, 'breakTime', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        aria-label="Break time"
                      >
                        {BREAK_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Hours</div>
                      <div className="font-semibold text-purple-700">{formatNumber(entry.totalHours)}</div>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => removeTimeEntry(entry.id)}
                        className="text-red-600 hover:text-red-800 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculate Button */}
        {timeEntries.length > 0 && hourlyRate && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Pay</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <ResultSharing
                title="Time Card Calculation Result"
                inputs={[
                  { label: "Number of Entries", value: `${timeEntries.length} time entries` },
                  { label: "Hourly Rate", value: `$${hourlyRate}/hour` },
                  { label: "Overtime Rate", value: `$${overtimeRate}/hour` },
                  { label: "Overtime Threshold", value: `${overtimeThreshold} hours` }
                ]}
                result={{ 
                  label: "Total Pay", 
                  value: `$${formatNumber(result.totalPay)}`,
                  unit: ""
                }}
                calculatorName="Time Card Calculator"
                className="mb-0"
              />
            </div>

            {/* Pay Results */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Pay Calculation Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatNumber(result.totalHours)}</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatNumber(result.regularHours)}</div>
                  <div className="text-sm text-gray-600">Regular Hours</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatNumber(result.overtimeHours)}</div>
                  <div className="text-sm text-gray-600">Overtime Hours</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">${formatNumber(result.totalPay)}</div>
                  <div className="text-sm text-gray-600">Total Pay</div>
                </div>
              </div>
              
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    ${formatNumber(result.regularPay)}
                  </div>
                  <div className="text-sm text-gray-600">Regular Pay</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">
                    ${formatNumber(result.overtimePay)}
                  </div>
                  <div className="text-sm text-gray-600">Overtime Pay</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={shareResults}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={printResults}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Comprehensive Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Time Card Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive time card calculator helps employees, freelancers, and employers 
                accurately track work hours and calculate pay including overtime. It handles complex 
                scenarios like overnight shifts, multiple break periods, and various overtime rules.
              </p>
              <p className="text-gray-700">
                The calculator automatically processes multiple time entries, applies overtime thresholds, 
                and provides detailed breakdowns of regular hours, overtime hours, and total compensation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Overtime Calculations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Standard Overtime</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>40-Hour Week:</strong> Most common overtime threshold</li>
                    <li><strong>Time-and-a-Half:</strong> 1.5x regular rate for overtime</li>
                    <li><strong>Double Time:</strong> 2x rate for holidays/weekends</li>
                    <li><strong>Daily Overtime:</strong> After 8 hours in a day</li>
                    <li><strong>Weekly Overtime:</strong> After 40 hours in a week</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Overtime Rules</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Federal Law:</strong> FLSA requires 1.5x after 40 hours</li>
                    <li><strong>State Variations:</strong> Some states have stricter rules</li>
                    <li><strong>Industry Standards:</strong> Construction, healthcare may differ</li>
                    <li><strong>Union Contracts:</strong> May have different overtime rates</li>
                    <li><strong>Exempt Employees:</strong> Salaried workers may not qualify</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Break Time Management</h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-gray-800 mb-2">Break Time Guidelines</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Paid vs. Unpaid Breaks:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Short breaks (5-20 min): Usually paid</li>
                      <li>Lunch breaks (30+ min): Usually unpaid</li>
                      <li>Rest periods: May be required by law</li>
                      <li>Meal periods: Often 30-60 minutes</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Break Time Options:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>No break: 0 minutes</li>
                      <li>Short rest: 15 minutes</li>
                      <li>Standard lunch: 30 minutes</li>
                      <li>Extended lunch: 45-60 minutes</li>
                      <li>Split shifts: 90+ minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Shift Types & Scheduling</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Common Shift Patterns</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Morning Shift:</strong> 8 AM - 4 PM (8 hours)</li>
                    <li><strong>Afternoon Shift:</strong> 12 PM - 8 PM (8 hours)</li>
                    <li><strong>Night Shift:</strong> 8 PM - 4 AM (8 hours)</li>
                    <li><strong>Part Time:</strong> 5 hours or less</li>
                    <li><strong>Full Time:</strong> 8+ hours per day</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Special Considerations</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Overnight Shifts:</strong> Cross midnight boundary</li>
                    <li><strong>Split Shifts:</strong> Work periods with breaks</li>
                    <li><strong>Rotating Shifts:</strong> Changing schedules</li>
                    <li><strong>On-Call Time:</strong> May count as work time</li>
                    <li><strong>Travel Time:</strong> Between job sites</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Pay Calculation Methods</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Regular Hours:</strong> Hours worked up to overtime threshold</li>
                <li><strong>Overtime Hours:</strong> Hours worked beyond threshold</li>
                <li><strong>Regular Pay:</strong> Regular hours × hourly rate</li>
                <li><strong>Overtime Pay:</strong> Overtime hours × (hourly rate × 1.5)</li>
                <li><strong>Total Pay:</strong> Regular pay + overtime pay</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Legal & Compliance</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Federal Requirements</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Fair Labor Standards Act (FLSA)</li>
                    <li>Minimum wage requirements</li>
                    <li>Overtime pay regulations</li>
                    <li>Record keeping requirements</li>
                    <li>Child labor restrictions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">State Variations</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Higher minimum wages</li>
                    <li>Stricter overtime rules</li>
                    <li>Required break periods</li>
                    <li>Meal period requirements</li>
                    <li>Additional protections</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Best Practices</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Accurate Time Tracking:</strong> Record actual start/end times</li>
                <li><strong>Break Documentation:</strong> Note all break periods taken</li>
                <li><strong>Overtime Monitoring:</strong> Track hours approaching threshold</li>
                <li><strong>Record Keeping:</strong> Maintain detailed time records</li>
                <li><strong>Regular Reviews:</strong> Check calculations for accuracy</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Always round up to the nearest quarter hour for fair compensation</li>
                <li>• Keep detailed records of all time entries and break periods</li>
                <li>• Understand your state's specific overtime and break time laws</li>
                <li>• Use this calculator to verify pay calculations from your employer</li>
                <li>• Consider using time tracking apps for more accurate records</li>
                <li>• Remember that unpaid breaks don't count toward overtime calculations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
