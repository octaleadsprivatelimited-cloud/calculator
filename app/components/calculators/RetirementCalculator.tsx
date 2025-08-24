'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, UserCheck } from 'lucide-react'

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState('')
  const [retirementAge, setRetirementAge] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateRetirement = useCallback(() => {
    const current = parseFloat(currentAge) || 0
    const retirement = parseFloat(retirementAge) || 0
    const savings = parseFloat(currentSavings) || 0
    const contribution = parseFloat(monthlyContribution) || 0
    const returnRate = parseFloat(expectedReturn) || 0
    
    if (current === 0 || retirement === 0 || returnRate === 0) return { 
      yearsToRetirement: 0, 
      totalSavings: 0,
      monthlyIncome: 0,
      recommendations: [],
      details: { current: 0, retirement: 0, savings: 0, contribution: 0, returnRate: 0 }
    }

    const yearsToRetirement = retirement - current
    const monthsToRetirement = yearsToRetirement * 12
    const monthlyReturnRate = returnRate / 100 / 12
    
    // Calculate future value of current savings
    const futureValueOfSavings = savings * Math.pow(1 + returnRate / 100, yearsToRetirement)
    
    // Calculate future value of monthly contributions
    const futureValueOfContributions = contribution * 
      (Math.pow(1 + monthlyReturnRate, monthsToRetirement) - 1) / monthlyReturnRate
    
    const totalSavings = futureValueOfSavings + futureValueOfContributions
    const monthlyIncome = totalSavings * 0.04 / 12 // 4% rule

    const recommendations = []
    recommendations.push(`Current age: ${current} years`)
    recommendations.push(`Retirement age: ${retirement} years`)
    recommendations.push(`Years to retirement: ${yearsToRetirement} years`)
    recommendations.push(`Current savings: $${savings.toLocaleString()}`)
    recommendations.push(`Monthly contribution: $${contribution.toFixed(2)}`)
    recommendations.push(`Expected return: ${returnRate.toFixed(2)}%`)
    recommendations.push(`Future value of savings: $${futureValueOfSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}`)
    recommendations.push(`Future value of contributions: $${futureValueOfContributions.toLocaleString(undefined, {maximumFractionDigits: 0})}`)
    recommendations.push(`Total retirement savings: $${totalSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}`)
    recommendations.push(`Estimated monthly income: $${monthlyIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}`)

    if (yearsToRetirement < 10) recommendations.push('Short time to retirement - consider aggressive saving')
    else if (yearsToRetirement < 20) recommendations.push('Moderate time to retirement - balanced approach')
    else recommendations.push('Long time to retirement - compound interest advantage')

    if (monthlyIncome < 2000) recommendations.push('Low monthly income - increase contributions')
    else if (monthlyIncome < 5000) recommendations.push('Moderate monthly income - consider additional savings')
    else recommendations.push('Good monthly income - well on track')

    const details = { current, retirement, savings, contribution, returnRate }

    return { yearsToRetirement, totalSavings, monthlyIncome, recommendations, details }
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setCurrentAge('')
    setRetirementAge('')
    setCurrentSavings('')
    setMonthlyContribution('')
    setExpectedReturn('')
    setShowResults(false)
  }

  const result = showResults ? calculateRetirement() : { yearsToRetirement: 0, totalSavings: 0, monthlyIncome: 0, recommendations: [], details: { current: 0, retirement: 0, savings: 0, contribution: 0, returnRate: 0 } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <UserCheck className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Retirement Calculator</h2>
        </div>
        <p className="text-emerald-100 mt-1">Calculate retirement savings and income</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
              <input type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter age" step="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age</label>
              <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter age" step="1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Savings ($)</label>
              <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter savings" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution ($)</label>
              <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter contribution" step="100" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
            <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter return rate" step="0.1" />
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Retirement Savings</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">${result.totalSavings?.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                <div className="text-emerald-700">Total retirement savings</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Retirement Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-emerald-700">Years to Retirement:</span><span className="font-semibold text-emerald-800">{result.yearsToRetirement} years</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Current Savings:</span><span className="font-semibold text-emerald-800">${result.details.savings?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Monthly Contribution:</span><span className="font-semibold text-emerald-800">${result.details.contribution?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Expected Return:</span><span className="font-semibold text-emerald-800">{result.details.returnRate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Monthly Income:</span><span className="font-semibold text-emerald-800">${result.monthlyIncome?.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">Summary</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-emerald-600 mr-2">•</span>
                      <span className="text-emerald-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
