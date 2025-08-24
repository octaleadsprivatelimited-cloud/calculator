'use client'

import React, { useState, useCallback } from 'react'
import { Clock, Calculator, TrendingUp, Share2, Download, Printer, Calendar } from 'lucide-react'
import ShareModal from '../ShareModal'

interface WorkDay {
  id: string
  date: string
  startTime: string
  endTime: string
  breakTime: string
  totalHours: number
  regularHours: number
  overtimeHours: number
}

interface PaySummary {
  totalHours: number
  regularHours: number
  overtimeHours: number
  regularPay: number
  overtimePay: number
  totalPay: number
}

export default function HoursCalculator() {
  const [workDays, setWorkDays] = useState<WorkDay[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      breakTime: '30',
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0
    }
  ])
  const [hourlyRate, setHourlyRate] = useState('25')
  const [overtimeRate, setOvertimeRate] = useState('37.5')
  const [overtimeThreshold, setOvertimeThreshold] = useState('40')
  const [showShareModal, setShowShareModal] = useState(false)

  const calculateHours = useCallback((day: WorkDay): WorkDay => {
    if (!day.startTime || !day.endTime) return day

    const start = new Date(`2000-01-01T${day.startTime}`)
    const end = new Date(`2000-01-01T${day.endTime}`)
    const breakMinutes = parseInt(day.breakTime) || 0

    let totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60) - breakMinutes
    if (totalMinutes < 0) totalMinutes = 0

    const totalHours = totalMinutes / 60
    const regularHours = Math.min(totalHours, parseFloat(overtimeThreshold))
    const overtimeHours = Math.max(0, totalHours - parseFloat(overtimeThreshold))

    return {
      ...day,
      totalHours: Math.round(totalHours * 100) / 100,
      regularHours: Math.round(regularHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100
    }
  }, [overtimeThreshold])

  const calculatePaySummary = useCallback((): PaySummary => {
    const calculatedDays = workDays.map(day => calculateHours(day))
    
    const totalHours = calculatedDays.reduce((sum, day) => sum + day.totalHours, 0)
    const regularHours = calculatedDays.reduce((sum, day) => sum + day.regularHours, 0)
    const overtimeHours = calculatedDays.reduce((sum, day) => sum + day.overtimeHours, 0)

    const rate = parseFloat(hourlyRate) || 0
    const overtimeRateValue = parseFloat(overtimeRate) || 0

    const regularPay = regularHours * rate
    const overtimePay = overtimeHours * overtimeRateValue
    const totalPay = regularPay + overtimePay

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      regularHours: Math.round(regularHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      regularPay: Math.round(regularPay * 100) / 100,
      overtimePay: Math.round(overtimePay * 100) / 100,
      totalPay: Math.round(totalPay * 100) / 100
    }
  }, [workDays, hourlyRate, overtimeRate, overtimeThreshold])

  const addWorkDay = () => {
    const newDay: WorkDay = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      breakTime: '30',
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0
    }
    setWorkDays([...workDays, newDay])
  }

  const removeWorkDay = (id: string) => {
    if (workDays.length > 1) {
      setWorkDays(workDays.filter(day => day.id !== id))
    }
  }

  const updateWorkDay = (id: string, field: keyof WorkDay, value: string) => {
    setWorkDays(workDays.map(day =>
      day.id === id ? { ...day, [field]: value } : day
    ))
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const summary = calculatePaySummary()
    const data = `Hours Calculator Results\n\nHourly Rate: $${hourlyRate}\nOvertime Rate: $${overtimeRate}\nOvertime Threshold: ${overtimeThreshold} hours\n\nWork Summary:\nTotal Hours: ${summary.totalHours}\nRegular Hours: ${summary.regularHours}\nOvertime Hours: ${summary.overtimeHours}\n\nPay Summary:\nRegular Pay: $${summary.regularPay}\nOvertime Pay: $${summary.overtimePay}\nTotal Pay: $${summary.totalPay}\n\nDaily Breakdown:\n${workDays.map(day => {
      const calculated = calculateHours(day)
      return `${day.date}: ${calculated.totalHours} hours (${calculated.regularHours} regular, ${calculated.overtimeHours} overtime)`
    }).join('\n')}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hours-calculator-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const paySummary = calculatePaySummary()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Clock className="w-16 h-16 mr-4 text-cyan-600" />
            Hours Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate work hours, overtime, and pay. Track daily work schedules and get detailed breakdowns of regular hours, overtime hours, and earnings.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-cyan-600" />
                Pay Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    placeholder="25"
                    step="0.01"
                    min="0"
                    title="Enter your hourly rate"
                    aria-label="Hourly rate in dollars"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overtime Rate ($)
                  </label>
                  <input
                    type="number"
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    placeholder="37.5"
                    step="0.01"
                    min="0"
                    title="Enter your overtime rate (usually 1.5x hourly rate)"
                    aria-label="Overtime rate in dollars"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Usually 1.5x hourly rate
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overtime Threshold (hours)
                  </label>
                  <input
                    type="number"
                    value={overtimeThreshold}
                    onChange={(e) => setOvertimeThreshold(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    placeholder="40"
                    step="0.5"
                    min="0"
                    title="Enter the number of hours before overtime applies"
                    aria-label="Overtime threshold in hours"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Hours worked before overtime applies
                  </p>
                </div>
              </div>
            </div>

            {/* Add Work Day Button */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <button
                onClick={addWorkDay}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                title="Add a new work day"
                aria-label="Add new work day"
              >
                <Calendar className="w-5 h-5" />
                Add Work Day
              </button>
            </div>
          </div>

          {/* Work Days and Results */}
          <div className="lg:col-span-2">
            {/* Work Days */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-cyan-600" />
                Work Schedule
              </h2>
              
              <div className="space-y-4">
                {workDays.map((day, index) => {
                  const calculated = calculateHours(day)
                  return (
                    <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">Day {index + 1}</h3>
                        {workDays.length > 1 && (
                          <button
                            onClick={() => removeWorkDay(day.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove this work day"
                            aria-label="Remove work day"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={day.date}
                            onChange={(e) => updateWorkDay(day.id, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-cyan-500"
                            title="Select work date"
                            aria-label="Work date"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={day.startTime}
                            onChange={(e) => updateWorkDay(day.id, 'startTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-cyan-500"
                            title="Enter start time"
                            aria-label="Work start time"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                          <input
                            type="time"
                            value={day.endTime}
                            onChange={(e) => updateWorkDay(day.id, 'endTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-cyan-500"
                            title="Enter end time"
                            aria-label="Work end time"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Break (min)</label>
                          <input
                            type="number"
                            value={day.breakTime}
                            onChange={(e) => updateWorkDay(day.id, 'breakTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-cyan-500"
                            placeholder="30"
                            min="0"
                            title="Enter break time in minutes"
                            aria-label="Break time in minutes"
                          />
                        </div>
                      </div>
                      
                      {/* Day Summary */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm text-gray-600">Total Hours</div>
                            <div className="font-semibold text-gray-800">{calculated.totalHours}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Regular</div>
                            <div className="font-semibold text-green-600">{calculated.regularHours}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Overtime</div>
                            <div className="font-semibold text-orange-600">{calculated.overtimeHours}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pay Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-cyan-600" />
                Pay Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Hours Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Hours:</span>
                      <span className="font-semibold">{paySummary.totalHours}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Regular Hours:</span>
                      <span>{paySummary.regularHours}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Overtime Hours:</span>
                      <span>{paySummary.overtimeHours}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Pay Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Regular Pay:</span>
                      <span className="font-semibold">${paySummary.regularPay}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Overtime Pay:</span>
                      <span>${paySummary.overtimePay}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-cyan-600">
                      <span>Total Pay:</span>
                      <span>${paySummary.totalPay}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Share hours calculator results"
                aria-label="Share hours calculator results"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Download results as text file"
                aria-label="Download hours calculator results"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Print hours calculator results"
                aria-label="Print hours calculator results"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Back to Calculators */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Back to all calculators"
            aria-label="Back to all calculators"
          >
            <Calculator className="w-5 h-5" />
            Back to All Calculators
          </a>
        </div>
      </div>

      {/* Share Modal */}
              {showShareModal && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            calculation={{
              expression: `${paySummary.totalHours} total hours`,
              result: `$${paySummary.totalPay} total pay`,
              timestamp: new Date()
            }}
          />
        )}
    </div>
  )
}
