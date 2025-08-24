'use client'

import React, { useState, useCallback } from 'react'
import { Calendar, Calculator as CalculatorIcon, RotateCcw, Plus, Minus, Clock } from 'lucide-react'

interface DateResult {
  startDate: Date
  endDate: Date
  difference: {
    years: number
    months: number
    days: number
    totalDays: number
    totalWeeks: number
    totalMonths: number
  }
  operation: 'add' | 'subtract'
  resultDate: Date
}

export default function DateCalculator() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [operation, setOperation] = useState<'add' | 'subtract'>('add')
  const [amount, setAmount] = useState('30')
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days')
  const [calculationType, setCalculationType] = useState<'difference' | 'operation'>('difference')

  const calculateDateDifference = useCallback((): DateResult => {
    let start = new Date(startDate)
    let end = new Date(endDate)
    
    if (start > end) {
      // Swap dates if start is after end
      [start, end] = [end, start]
    }

    const timeDiff = end.getTime() - start.getTime()
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    
    // Calculate years, months, days
    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months

    return {
      startDate: start,
      endDate: end,
      difference: {
        years,
        months,
        days,
        totalDays,
        totalWeeks,
        totalMonths
      },
      operation: 'add',
      resultDate: new Date()
    }
  }, [startDate, endDate])

  const calculateDateOperation = useCallback((): DateResult => {
    const start = new Date(startDate)
    const amountNum = parseFloat(amount)
    let resultDate = new Date(start)

    if (operation === 'add') {
      if (unit === 'days') {
        resultDate.setDate(start.getDate() + amountNum)
      } else if (unit === 'weeks') {
        resultDate.setDate(start.getDate() + (amountNum * 7))
      } else if (unit === 'months') {
        resultDate.setMonth(start.getMonth() + amountNum)
      } else if (unit === 'years') {
        resultDate.setFullYear(start.getFullYear() + amountNum)
      }
    } else {
      if (unit === 'days') {
        resultDate.setDate(start.getDate() - amountNum)
      } else if (unit === 'weeks') {
        resultDate.setDate(start.getDate() - (amountNum * 7))
      } else if (unit === 'months') {
        resultDate.setMonth(start.getMonth() - amountNum)
      } else if (unit === 'years') {
        resultDate.setFullYear(start.getFullYear() - amountNum)
      }
    }

    return {
      startDate: start,
      endDate: start,
      difference: {
        years: 0,
        months: 0,
        days: 0,
        totalDays: 0,
        totalWeeks: 0,
        totalMonths: 0
      },
      operation,
      resultDate
    }
  }, [startDate, operation, amount, unit])

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatShortDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getQuickDates = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    
    const nextMonth = new Date(today)
    nextMonth.setMonth(today.getMonth() + 1)
    
    const nextYear = new Date(today)
    nextYear.setFullYear(today.getFullYear() + 1)

    return { today, tomorrow, nextWeek, nextMonth, nextYear }
  }

  const quickDates = getQuickDates()

  const result = calculationType === 'difference' ? calculateDateDifference() : calculateDateOperation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Calendar className="w-12 h-12 mr-3 text-cyan-600" />
            Date Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate date differences, add or subtract time periods
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-cyan-600" />
              Date Calculation
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calculation Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalculationType('difference')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      calculationType === 'difference'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Date Difference
                  </button>
                  <button
                    onClick={() => setCalculationType('operation')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      calculationType === 'operation'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Add/Subtract
                  </button>
                </div>
              </div>

              {calculationType === 'difference' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                      title="Select start date"
                      aria-label="Start date"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                      title="Select end date"
                      aria-label="End date"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                      title="Select start date"
                      aria-label="Start date"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operation
                      </label>
                      <div className="flex">
                                             <button
                       onClick={() => setOperation('add')}
                       className={`flex-1 py-2 px-3 rounded-l-lg font-medium transition-colors ${
                         operation === 'add'
                           ? 'bg-green-600 text-white'
                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                       }`}
                       title="Add time period"
                       aria-label="Add time period"
                     >
                       <Plus className="w-4 h-4 mx-auto" />
                     </button>
                     <button
                       onClick={() => setOperation('subtract')}
                       className={`flex-1 py-2 px-3 rounded-r-lg font-medium transition-colors ${
                         operation === 'subtract'
                           ? 'bg-red-600 text-white'
                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                       }`}
                       title="Subtract time period"
                       aria-label="Subtract time period"
                     >
                       <Minus className="w-4 h-4 mx-auto" />
                     </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                      </label>
                                           <input
                       type="number"
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                       placeholder="30"
                       title="Enter amount of time"
                       aria-label="Time amount"
                     />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit
                      </label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as 'days' | 'weeks' | 'months' | 'years')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        aria-label="Time unit"
                        title="Select time unit"
                      >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Quick Date Options</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStartDate(quickDates.today.toISOString().split('T')[0])}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                    title="Set start date to today"
                    aria-label="Set start date to today"
                  >
                    Today: {formatShortDate(quickDates.today)}
                  </button>
                  <button
                    onClick={() => setStartDate(quickDates.tomorrow.toISOString().split('T')[0])}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                    title="Set start date to tomorrow"
                    aria-label="Set start date to tomorrow"
                  >
                    Tomorrow: {formatShortDate(quickDates.tomorrow)}
                  </button>
                  <button
                    onClick={() => setStartDate(quickDates.nextWeek.toISOString().split('T')[0])}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                    title="Set start date to next week"
                    aria-label="Set start date to next week"
                  >
                    Next Week: {formatShortDate(quickDates.nextWeek)}
                  </button>
                  <button
                    onClick={() => setStartDate(quickDates.nextMonth.toISOString().split('T')[0])}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                    title="Set start date to next month"
                    aria-label="Set start date to next month"
                  >
                    Next Month: {formatShortDate(quickDates.nextMonth)}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setStartDate(new Date().toISOString().split('T')[0])
                    setEndDate(new Date().toISOString().split('T')[0])
                    setOperation('add')
                    setAmount('30')
                    setUnit('days')
                    setCalculationType('difference')
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {calculationType === 'difference' ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-cyan-600" />
                  Date Difference
                </h2>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-cyan-600 mb-2">
                    {result.difference.totalDays}
                  </div>
                  <p className="text-gray-600">total days</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-semibold">{formatDate(result.startDate)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">End Date</span>
                    <span className="font-semibold">{formatDate(result.endDate)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Years</span>
                    <span className="font-semibold text-blue-600">{result.difference.years}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Months</span>
                    <span className="font-semibold text-green-600">{result.difference.months}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Days</span>
                    <span className="font-semibold text-purple-600">{result.difference.days}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Weeks</span>
                    <span className="font-semibold text-orange-600">{result.difference.totalWeeks}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-cyan-600" />
                  Date Result
                </h2>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-cyan-600 mb-2">
                    {formatShortDate(result.resultDate)}
                  </div>
                  <p className="text-gray-600">
                    {operation === 'add' ? 'after adding' : 'after subtracting'} {amount} {unit}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-semibold">{formatDate(result.startDate)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Operation</span>
                    <span className={`font-semibold ${
                      operation === 'add' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {operation === 'add' ? 'Add' : 'Subtract'} {amount} {unit}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Result Date</span>
                    <span className="font-semibold text-blue-600">{formatDate(result.resultDate)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Date Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Date Difference:</strong> Calculate time between two dates</p>
                <p>• <strong>Add/Subtract:</strong> Find future or past dates</p>
                <p>• <strong>Leap Years:</strong> Automatically accounted for</p>
                <p>• <strong>Month Variations:</strong> Handles different month lengths</p>
                <p>• <strong>Quick Options:</strong> Use preset dates for convenience</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Date Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
