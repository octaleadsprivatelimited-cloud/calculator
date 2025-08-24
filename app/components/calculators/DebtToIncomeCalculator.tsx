'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, CreditCard } from 'lucide-react'

export default function DebtToIncomeCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [monthlyDebt, setMonthlyDebt] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateDTI = useCallback(() => {
    const income = parseFloat(monthlyIncome) || 0
    const debt = parseFloat(monthlyDebt) || 0
    
    if (income === 0) return { 
      dti: 0, 
      category: '', 
      recommendations: [],
      details: {}
    }

    const dti = (debt / income) * 100

    let category = ''
    let recommendations = []

    if (dti <= 28) {
      category = 'Excellent'
      recommendations = [
        'Excellent debt-to-income ratio',
        'You qualify for most loans',
        'Consider investing excess income',
        'Maintain current financial habits'
      ]
    } else if (dti <= 36) {
      category = 'Good'
      recommendations = [
        'Good debt-to-income ratio',
        'You likely qualify for most loans',
        'Monitor debt levels carefully',
        'Consider debt reduction strategies'
      ]
    } else if (dti <= 43) {
      category = 'Fair'
      recommendations = [
        'Fair debt-to-income ratio',
        'May qualify for some loans',
        'Focus on debt reduction',
        'Avoid taking on new debt'
      ]
    } else if (dti <= 50) {
      category = 'Poor'
      recommendations = [
        'Poor debt-to-income ratio',
        'May not qualify for new loans',
        'Immediate debt reduction needed',
        'Consider debt consolidation'
      ]
    } else {
      category = 'Very Poor'
      recommendations = [
        'Very poor debt-to-income ratio',
        'Unlikely to qualify for new loans',
        'Immediate financial intervention needed',
        'Consider credit counseling'
      ]
    }

    recommendations.push(`Your DTI ratio is ${dti.toFixed(1)}%`)
    recommendations.push('Lenders prefer DTI ratios below 43%')

    const details = {
      monthlyIncome: income,
      monthlyDebt: debt,
      annualIncome: income * 12,
      annualDebt: debt * 12
    }

    return { dti, category, recommendations, details }
  }, [monthlyIncome, monthlyDebt])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setMonthlyIncome('')
    setMonthlyDebt('')
    setShowResults(false)
  }

  const result = showResults ? calculateDTI() : { 
    dti: 0, 
    category: '', 
    recommendations: [],
    details: {
      monthlyIncome: 0,
      monthlyDebt: 0,
      annualIncome: 0,
      annualDebt: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <CreditCard className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Debt-to-Income Ratio Calculator</h2>
        </div>
        <p className="text-red-100 mt-1">Calculate your debt-to-income ratio for loan qualification</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income ($)
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter monthly income"
                step="100"
                aria-label="Monthly income in dollars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Debt ($)
              </label>
              <input
                type="number"
                value={monthlyDebt}
                onChange={(e) => setMonthlyDebt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter monthly debt"
                step="100"
                aria-label="Monthly debt payments in dollars"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Calculator className="h-5 w-5 inline mr-2" />
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <RotateCcw className="h-5 w-5 inline mr-2" />
              Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">DTI Ratio</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {result.dti.toFixed(1)}%
                </div>
                <div className="text-red-700">
                  Category: {result.category}
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Financial Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-700">Monthly Income:</span>
                  <span className="font-semibold text-red-800">${result.details.monthlyIncome?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Monthly Debt:</span>
                  <span className="font-semibold text-red-800">${result.details.monthlyDebt?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Annual Income:</span>
                  <span className="font-semibold text-red-800">${result.details.annualIncome?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Annual Debt:</span>
                  <span className="font-semibold text-red-800">${result.details.annualDebt?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-red-700">{rec}</span>
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
