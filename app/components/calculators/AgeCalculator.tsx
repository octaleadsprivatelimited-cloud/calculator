'use client'

import React, { useState, useCallback } from 'react'
import { Calendar, Clock, Calculator as CalculatorIcon, RotateCcw, Gift } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface AgeResult {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  totalWeeks: number
  totalMonths: number
  nextBirthday: Date
  daysUntilBirthday: number
  zodiacSign: string
  birthDayOfWeek: string
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('1990-01-01')
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0])
  const [result, setResult] = useState<AgeResult | null>(null)

  const getZodiacSign = (month: number, day: number): string => {
    const signs = [
      'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
      'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
    ]
    
    const dates = [
      [1, 20], [2, 19], [3, 21], [4, 20], [5, 21], [6, 21],
      [7, 23], [8, 23], [9, 23], [10, 23], [11, 22], [12, 22]
    ]
    
    for (let i = 0; i < 12; i++) {
      if (month === dates[i][0] && day <= dates[i][1]) {
        return signs[i]
      }
    }
    
    return signs[(month % 12)]
  }

  const calculateAge = useCallback(() => {
    if (!birthDate || !targetDate) {
      alert('Please enter both birth date and target date')
      return
    }

    const birth = new Date(birthDate)
    const target = new Date(targetDate)

    if (birth > target) {
      alert('Birth date cannot be in the future')
      return
    }

    // Calculate exact age
    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    // Calculate total time units
    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60
    const totalSeconds = totalMinutes * 60

    // Calculate next birthday
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(target.getFullYear() + 1)
    }

    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

    // Get zodiac sign and day of week
    const zodiacSign = getZodiacSign(birth.getMonth() + 1, birth.getDate())
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const birthDayOfWeek = dayNames[birth.getDay()]

    setResult({
      years,
      months,
      weeks: Math.floor(totalDays % 365 / 7),
      days: totalDays % 7,
      hours: totalHours,
      minutes: totalMinutes,
      seconds: totalSeconds,
      totalDays,
      totalWeeks,
      totalMonths,
      nextBirthday,
      daysUntilBirthday,
      zodiacSign,
      birthDayOfWeek
    })
  }, [birthDate, targetDate])

  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Calendar className="w-12 h-12 mr-3 text-purple-600" />
            Age Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate your exact age in years, months, days, and more
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-purple-600" />
              Date Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  title="Select birth date"
                  aria-label="Birth date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calculate Age As Of
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  title="Select target date for age calculation"
                  aria-label="Target date for age calculation"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={calculateAge}
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  title="Calculate exact age"
                  aria-label="Calculate exact age"
                >
                  Calculate Age
                </button>
                <button
                  onClick={() => {
                    setBirthDate('1990-01-01')
                    setTargetDate(new Date().toISOString().split('T')[0])
                    setResult(null)
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Reset to defaults"
                  aria-label="Reset to defaults"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">Quick Options</h3>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
                  className="block w-full text-left text-purple-600 hover:text-purple-800"
                  title="Set target date to today"
                  aria-label="Set target date to today"
                >
                  • Calculate age as of today
                </button>
                <button
                  onClick={() => {
                    const nextYear = new Date()
                    nextYear.setFullYear(nextYear.getFullYear() + 1)
                    setTargetDate(nextYear.toISOString().split('T')[0])
                  }}
                  className="block w-full text-left text-purple-600 hover:text-purple-800"
                  title="Set target date to next year"
                  aria-label="Set target date to next year"
                >
                  • Calculate age next year
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {result && (
              <>
                {/* Share Options - Moved to Top */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                  <ResultSharing
                    title="Age Calculation Result"
                    inputs={[
                      { label: "Birth Date", value: new Date(birthDate).toLocaleDateString() },
                      { label: "Target Date", value: new Date(targetDate).toLocaleDateString() }
                    ]}
                    result={{ 
                      label: "Age", 
                      value: `${result.years} years, ${result.months} months, ${result.days} days`,
                      unit: ""
                    }}
                    calculatorName="Age Calculator"
                    className="mb-0"
                  />
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-6 h-6 mr-2 text-purple-600" />
                    Exact Age
                  </h2>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {result.years} years
                    </div>
                    <p className="text-gray-600">
                      {result.months} months and {result.days} days
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatNumber(result.totalDays)}</div>
                      <div className="text-sm text-gray-600">Total Days</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatNumber(result.totalWeeks)}</div>
                      <div className="text-sm text-gray-600">Total Weeks</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatNumber(result.totalMonths)}</div>
                      <div className="text-sm text-gray-600">Total Months</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatNumber(result.hours)}</div>
                      <div className="text-sm text-gray-600">Total Hours</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Time Breakdown</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Minutes Lived</span>
                      <span className="font-semibold text-blue-600">{formatNumber(result.minutes)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Seconds Lived</span>
                      <span className="font-semibold text-green-600">{formatNumber(result.seconds)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Days Until Next Birthday</span>
                      <span className="font-semibold text-orange-600">{result.daysUntilBirthday}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Next Birthday</span>
                      <span className="font-semibold text-purple-600">
                        {result.nextBirthday.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Gift className="w-6 h-6 mr-2 text-purple-600" />
                    Birth Information
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Birth Day of Week</span>
                      <span className="font-semibold text-purple-600">{result.birthDayOfWeek}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Zodiac Sign</span>
                      <span className="font-semibold text-pink-600">{result.zodiacSign}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Birth Date</span>
                      <span className="font-semibold">{new Date(birthDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>


              </>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Age Facts</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Life expectancy:</strong> Average is around 75-80 years globally</p>
                <p>• <strong>Age milestones:</strong> 18 (legal adult), 21 (drinking age in US)</p>
                <p>• <strong>Retirement:</strong> Typically 62-67 years depending on country</p>
                <p>• <strong>Generation:</strong> Born every ~20-25 years define generations</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
        </footer>
      </div>
    </div>
  )
}
