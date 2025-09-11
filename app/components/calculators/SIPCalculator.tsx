'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react'

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000)
  const [annualReturn, setAnnualReturn] = useState<number>(12)
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(10)
  const [results, setResults] = useState<{
    totalInvestment: number
    totalReturns: number
    finalAmount: number
    breakdown: Array<{
      year: number
      investment: number
      returns: number
      total: number
    }>
  } | null>(null)

  const calculateSIP = useCallback(() => {
    const monthlyRate = annualReturn / 100 / 12
    const totalMonths = investmentPeriod * 12
    const totalInvestment = monthlyInvestment * totalMonths
    
    // Calculate future value using SIP formula
    const futureValue = monthlyInvestment * 
      (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate))
    
    const totalReturns = futureValue - totalInvestment

    // Yearly breakdown
    const breakdown = []
    let runningTotal = 0
    let runningInvestment = 0

    for (let year = 1; year <= investmentPeriod; year++) {
      const yearInvestment = monthlyInvestment * 12
      runningInvestment += yearInvestment
      
      // Calculate returns for this year
      const yearStartMonths = (year - 1) * 12
      const yearEndMonths = year * 12
      const yearStartValue = monthlyInvestment * 
        (((Math.pow(1 + monthlyRate, yearStartMonths) - 1) / monthlyRate) * (1 + monthlyRate))
      const yearEndValue = monthlyInvestment * 
        (((Math.pow(1 + monthlyRate, yearEndMonths) - 1) / monthlyRate) * (1 + monthlyRate))
      
      const yearReturns = yearEndValue - yearStartValue - yearInvestment
      runningTotal = yearEndValue

      breakdown.push({
        year,
        investment: runningInvestment,
        returns: yearReturns,
        total: runningTotal
      })
    }

    setResults({
      totalInvestment,
      totalReturns,
      finalAmount: futureValue,
      breakdown
    })
  }, [monthlyInvestment, annualReturn, investmentPeriod])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SIP Calculator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your returns on Systematic Investment Plan (SIP) investments with compound interest
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-2 text-blue-600" />
              SIP Details
            </h2>

            <div className="space-y-6">
              {/* Monthly Investment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Investment Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter monthly investment"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Minimum: ₹500</p>
              </div>

              {/* Expected Annual Return */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Annual Return (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Expected return percentage"
                    step="0.1"
                    min="1"
                    max="30"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Typical range: 8-15%</p>
              </div>

              {/* Investment Period */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Investment Period (Years)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Investment duration"
                    min="1"
                    max="50"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Minimum: 1 year</p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateSIP}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Calculate SIP Returns
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              SIP Results
            </h2>

            {results ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Total Investment</p>
                        <p className="text-2xl font-bold text-blue-900">{formatCurrency(results.totalInvestment)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Total Returns</p>
                        <p className="text-2xl font-bold text-green-900">{formatCurrency(results.totalReturns)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">Final Amount</p>
                        <p className="text-2xl font-bold text-purple-900">{formatCurrency(results.finalAmount)}</p>
                      </div>
                      <Calculator className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Insights</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Return on Investment:</span>
                      <span className="font-semibold text-green-600">
                        {((results.totalReturns / results.totalInvestment) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Investment:</span>
                      <span className="font-semibold">{formatCurrency(monthlyInvestment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment Period:</span>
                      <span className="font-semibold">{investmentPeriod} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Return:</span>
                      <span className="font-semibold">{annualReturn}% p.a.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Enter your SIP details and click calculate to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Yearly Breakdown Table */}
        {results && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Yearly Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Cumulative Investment</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Returns</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {results.breakdown.map((row) => (
                    <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{row.year}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(row.investment)}</td>
                      <td className="py-3 px-4 text-right text-green-600 font-medium">{formatCurrency(row.returns)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(row.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SIP Information */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">About SIP Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">What is SIP?</h4>
              <p className="mb-3">
                Systematic Investment Plan (SIP) is an investment method where you invest a fixed amount regularly 
                in mutual funds, typically monthly. It helps in building wealth through the power of compounding.
              </p>
              <h4 className="font-semibold text-gray-800 mb-2">Key Benefits:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Disciplined investing approach</li>
                <li>Rupee cost averaging</li>
                <li>Power of compounding</li>
                <li>Flexible investment amounts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">How to Use:</h4>
              <ol className="list-decimal list-inside space-y-1 mb-3">
                <li>Enter your monthly investment amount</li>
                <li>Set expected annual return rate</li>
                <li>Choose investment period in years</li>
                <li>Click calculate to see projected returns</li>
              </ol>
              <h4 className="font-semibold text-gray-800 mb-2">Important Notes:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Returns are not guaranteed</li>
                <li>Past performance doesn't indicate future results</li>
                <li>Consider inflation in your calculations</li>
                <li>Consult a financial advisor for investment decisions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
