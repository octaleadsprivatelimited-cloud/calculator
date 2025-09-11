'use client'

import React, { useState, useCallback } from 'react'
import { Calendar, Calculator as CalculatorIcon, RotateCcw, Plus, Minus, Clock } from 'lucide-react'
import ResultSharing from '../ResultSharing'

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
      <div className="w-full">
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
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-cyan-200">
              <ResultSharing
                title="Date Calculation Result"
                inputs={[
                  { label: "Start Date", value: startDate },
                  { label: "End Date", value: endDate },
                  { label: "Calculation Type", value: calculationType === 'difference' ? 'Date Difference' : 'Date Operation' }
                ]}
                result={{ 
                  label: calculationType === 'difference' ? "Total Days" : "Result Date", 
                  value: calculationType === 'difference' ? result.difference.totalDays.toString() : formatShortDate(result.resultDate),
                  unit: calculationType === 'difference' ? "days" : ""
                }}
                calculatorName="Date Calculator"
                className="mb-0"
              />
            </div>

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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Date Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive date calculator helps you perform precise date calculations for planning, 
              scheduling, and time management. This essential tool calculates date differences, adds or 
              subtracts time periods, and provides accurate results accounting for leap years, month 
              variations, and calendar complexities.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Date Differences:</strong> Time between two specific dates</li>
              <li><strong>Date Operations:</strong> Add or subtract time periods</li>
              <li><strong>Multiple Units:</strong> Years, months, weeks, and days</li>
              <li><strong>Precise Calculations:</strong> Account for leap years and month lengths</li>
              <li><strong>Calendar Navigation:</strong> Find future or past dates</li>
              <li><strong>Time Planning:</strong> Project planning and scheduling support</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Types</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Date Difference</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Total Days:</strong> Complete days between dates</li>
                <li><strong>Years:</strong> Full years elapsed</li>
                <li><strong>Months:</strong> Remaining months after years</li>
                <li><strong>Days:</strong> Remaining days after months</li>
                <li><strong>Total Weeks:</strong> Complete weeks calculation</li>
                <li><strong>Precise Timing:</strong> Account for leap years</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Date Operations</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Add Time:</strong> Calculate future dates</li>
                <li><strong>Subtract Time:</strong> Calculate past dates</li>
                <li><strong>Flexible Units:</strong> Years, months, weeks, days</li>
                <li><strong>Variable Amounts:</strong> Any number of units</li>
                <li><strong>Calendar Aware:</strong> Handle month variations</li>
                <li><strong>Leap Year Support:</strong> Accurate February calculations</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
              <h5 className="font-semibold text-cyan-800 mb-1">Total Days</h5>
              <p className="text-cyan-700 text-sm">Complete day count</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-1">Years</h5>
              <p className="text-blue-700 text-sm">Full years elapsed</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-1">Months</h5>
              <p className="text-green-700 text-sm">Remaining months</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-1">Days</h5>
              <p className="text-purple-700 text-sm">Remaining days</p>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
          <p className="text-gray-700 mb-4">
            Choose between "Date Difference" to find time between two dates, or "Add/Subtract" to 
            calculate future or past dates. Enter your dates and time periods, and the calculator will 
            provide precise results accounting for calendar complexities like leap years and varying month lengths.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Calendar Complexity Handling</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Leap Years:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Every 4 years (except century years)</li>
                  <li>February 29th added</li>
                  <li>366 days instead of 365</li>
                  <li>Automatic calculation</li>
                  <li>Accurate year counting</li>
                  <li>Calendar rule compliance</li>
                </ul>
              </div>
              <div>
                <p><strong>Month Variations:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>28-31 days per month</li>
                  <li>February special handling</li>
                  <li>Month-end date logic</li>
                  <li>Year boundary crossing</li>
                  <li>Accurate month counting</li>
                  <li>Calendar month rules</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Use Cases</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Personal Planning</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Birthday Planning:</strong> Days until next birthday</li>
                <li><strong>Vacation Countdown:</strong> Time until trip</li>
                <li><strong>Anniversary Tracking:</strong> Years and months married</li>
                <li><strong>Goal Deadlines:</strong> Time remaining for objectives</li>
                <li><strong>Event Planning:</strong> Preparation time available</li>
                <li><strong>Age Calculations:</strong> Precise age in various units</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Professional Applications</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Project Planning:</strong> Timeline calculations</li>
                <li><strong>Deadline Management:</strong> Days remaining for tasks</li>
                <li><strong>Contract Terms:</strong> Duration calculations</li>
                <li><strong>Billing Periods:</strong> Service duration tracking</li>
                <li><strong>Warranty Periods:</strong> Coverage time remaining</li>
                <li><strong>Subscription Renewals:</strong> Next billing dates</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Date Calculation Methods</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Gregorian Calendar:</strong> Standard international calendar system</li>
            <li><strong>Leap Year Rules:</strong> Every 4 years, except century years not divisible by 400</li>
            <li><strong>Month Length Handling:</strong> Account for 28, 29, 30, and 31-day months</li>
            <li><strong>Year Boundary Logic:</strong> Proper handling of year transitions</li>
            <li><strong>Date Validation:</strong> Ensure valid date inputs</li>
            <li><strong>Precision Calculation:</strong> Accurate to the day level</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Time Unit Conversions</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Standard Conversions</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>1 year = 365.25 days (leap year average)</li>
                <li>1 month = 30.44 days (average)</li>
                <li>1 week = 7 days</li>
                <li>1 day = 24 hours</li>
                <li>1 hour = 60 minutes</li>
                <li>1 minute = 60 seconds</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Calendar Variations</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>February: 28/29 days</li>
                <li>April, June, September, November: 30 days</li>
                <li>January, March, May, July, August, October, December: 31 days</li>
                <li>Leap years: 366 days</li>
                <li>Common years: 365 days</li>
                <li>Century rules apply</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Business Calculations</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Business days: Monday-Friday</li>
                <li>Weekend days: Saturday-Sunday</li>
                <li>Holiday considerations</li>
                <li>Working hours per day</li>
                <li>Project milestones</li>
                <li>Deadline tracking</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Date Calculation Tips</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Use Specific Dates:</strong> Avoid ambiguous date formats</li>
            <li><strong>Consider Time Zones:</strong> Account for location differences</li>
            <li><strong>Validate Inputs:</strong> Ensure dates are valid and logical</li>
            <li><strong>Account for Leap Years:</strong> Remember February 29th</li>
            <li><strong>Month End Logic:</strong> Handle month length variations</li>
            <li><strong>Year Boundaries:</strong> Proper year transition handling</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Date Calculation Mistakes</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Ignoring Leap Years:</strong> February calculations can be off by one day</li>
            <li><strong>Month Length Assumptions:</strong> Not all months have 30 days</li>
            <li><strong>Year Boundary Errors:</strong> Incorrect handling of year transitions</li>
            <li><strong>Time Zone Confusion:</strong> Date changes across time zones</li>
            <li><strong>Format Inconsistencies:</strong> Different date format interpretations</li>
            <li><strong>Business Day Assumptions:</strong> Including weekends in business calculations</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Date Concepts</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Julian Day Numbers:</strong> Continuous day counting system</li>
            <li><strong>ISO 8601 Format:</strong> International date standard</li>
            <li><strong>Week Numbers:</strong> ISO week numbering system</li>
            <li><strong>Seasonal Calculations:</strong> Equinox and solstice dates</li>
            <li><strong>Lunar Calendar Integration:</strong> Moon phase calculations</li>
            <li><strong>Historical Date Systems:</strong> Julian to Gregorian conversion</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-cyan-500">
            <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
            <p className="text-gray-700 text-sm">
              When calculating date differences, always consider the context of your calculation. For 
              business applications, you might need to exclude weekends and holidays. For personal 
              planning, remember that months have different lengths and leap years affect February. 
              Use the calculator's precise calculations to avoid common date-related errors, and 
              always verify your results by checking a few known dates to ensure accuracy.
            </p>
          </div>
        </div>
      </div>

        <footer className="text-center mt-12 text-gray-500">
        </footer>
      </div>
    </div>
  )
}
