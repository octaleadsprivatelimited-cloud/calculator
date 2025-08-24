'use client'

import React, { useState, useCallback } from 'react'
import { DollarSign, Calculator as CalculatorIcon, RotateCcw, TrendingUp } from 'lucide-react'

interface SimpleInterestResult {
  principal: number
  rate: number
  time: number
  interest: number
  totalAmount: number
  timeUnit: string
}

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('1000')
  const [rate, setRate] = useState('5')
  const [time, setTime] = useState('1')
  const [timeUnit, setTimeUnit] = useState<'years' | 'months' | 'days'>('years')

  const calculateSimpleInterest = useCallback((): SimpleInterestResult => {
    const principalNum = parseFloat(principal) || 0
    const rateNum = parseFloat(rate) || 0
    const timeNum = parseFloat(time) || 0

    // Convert rate to decimal
    const rateDecimal = rateNum / 100

    // Convert time to years
    let timeInYears = timeNum
    if (timeUnit === 'months') {
      timeInYears = timeNum / 12
    } else if (timeUnit === 'days') {
      timeInYears = timeNum / 365
    }

    // Calculate simple interest: I = P × r × t
    const interest = principalNum * rateDecimal * timeInYears
    const totalAmount = principalNum + interest

    return {
      principal: principalNum,
      rate: rateNum,
      time: timeNum,
      interest: Math.round(interest * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      timeUnit
    }
  }, [principal, rate, time, timeUnit])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPercentage = (rate: number): string => {
    return `${rate}%`
  }

  const reset = () => {
    setPrincipal('1000')
    setRate('5')
    setTime('1')
    setTimeUnit('years')
  }

  const result = calculateSimpleInterest()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <DollarSign className="w-12 h-12 mr-3 text-green-600" />
            Simple Interest Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate simple interest on loans or investments
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-green-600" />
              Investment Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principal Amount
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  placeholder="1000"
                  step="any"
                  min="0"
                  title="Enter principal amount"
                  aria-label="Principal amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  placeholder="5"
                  step="any"
                  min="0"
                  max="100"
                  title="Enter annual interest rate"
                  aria-label="Annual interest rate"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period
                  </label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="1"
                    step="any"
                    min="0"
                    title="Enter time period"
                    aria-label="Time period"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Unit
                  </label>
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value as 'years' | 'months' | 'days')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    title="Select time unit"
                    aria-label="Time unit"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Quick Examples</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setPrincipal('10000')
                      setRate('4.5')
                      setTime('5')
                      setTimeUnit('years')
                    }}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                    title="Set example: $10,000 at 4.5% for 5 years"
                    aria-label="Set example: $10,000 at 4.5% for 5 years"
                  >
                    $10,000 at 4.5% for 5 years
                  </button>
                  <button
                    onClick={() => {
                      setPrincipal('5000')
                      setRate('6')
                      setTime('18')
                      setTimeUnit('months')
                    }}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                    title="Set example: $5,000 at 6% for 18 months"
                    aria-label="Set example: $5,000 at 6% for 18 months"
                  >
                    $5,000 at 6% for 18 months
                  </button>
                  <button
                    onClick={() => {
                      setPrincipal('2500')
                      setRate('3.25')
                      setTime('90')
                      setTimeUnit('days')
                    }}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                    title="Set example: $2,500 at 3.25% for 90 days"
                    aria-label="Set example: $2,500 at 3.25% for 90 days"
                  >
                    $2,500 at 3.25% for 90 days
                  </button>
                  <button
                    onClick={() => {
                      setPrincipal('15000')
                      setRate('7.5')
                      setTime('3')
                      setTimeUnit('years')
                    }}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                    title="Set example: $15,000 at 7.5% for 3 years"
                    aria-label="Set example: $15,000 at 7.5% for 3 years"
                  >
                    $15,000 at 7.5% for 3 years
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={reset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Reset to defaults"
                  aria-label="Reset to defaults"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                Interest Results
              </h2>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {formatCurrency(result.interest)}
                </div>
                <p className="text-gray-600">total interest earned</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Principal Amount</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(result.principal)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-semibold text-green-600">
                    {formatPercentage(result.rate)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Time Period</span>
                  <span className="font-semibold text-purple-600">
                    {result.time} {result.timeUnit}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Interest Earned</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(result.interest)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(result.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Simple Interest Formula</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Simple Interest = Principal × Rate × Time</strong></p>
                <p>• <strong>Principal:</strong> Initial amount invested or borrowed</p>
                <p>• <strong>Rate:</strong> Annual interest rate (as a percentage)</p>
                <p>• <strong>Time:</strong> Time period in years, months, or days</p>
                <p>• <strong>Interest:</strong> Amount earned or paid in interest</p>
                <p>• <strong>Total Amount:</strong> Principal + Interest</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Interest Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Simple Interest:</strong> Interest calculated only on principal amount</p>
                <p>• <strong>Time Conversion:</strong> Automatically converts months/days to years</p>
                <p>• <strong>Rate:</strong> Always enter as annual percentage rate</p>
                <p>• <strong>Comparison:</strong> Use to compare different investment options</p>
                <p>• <strong>Planning:</strong> Calculate future value of investments</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Simple Interest Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
