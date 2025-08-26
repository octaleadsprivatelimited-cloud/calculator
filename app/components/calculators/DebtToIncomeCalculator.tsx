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
      details: {
      monthlyIncome: 0,
      monthlyDebt: 0,
      annualIncome: 0,
      annualDebt: 0
    }
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

  const result = showResults ? calculateDTI() || { 
    dti: 0, 
    category: '', 
    recommendations: [],
    details: {
      monthlyIncome: 0,
      monthlyDebt: 0,
      annualIncome: 0,
      annualDebt: 0
    }
  } : { 
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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Debt-to-Income Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our free debt-to-income (DTI) calculator helps you assess your financial health by measuring the ratio 
              between your monthly debt payments and monthly income. This crucial metric is used by lenders to evaluate 
              loan applications and determine your borrowing capacity.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What is DTI Ratio?</h4>
            <p className="text-gray-700 mb-4">
              The debt-to-income ratio is a percentage that shows how much of your monthly income goes toward debt payments. 
              It's calculated by dividing your total monthly debt payments by your gross monthly income, then multiplying by 100.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">DTI Categories</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Excellent (0-20%):</strong> Very low debt burden, excellent borrowing capacity</li>
              <li><strong>Good (21-35%):</strong> Manageable debt, good for most loan types</li>
              <li><strong>Fair (36-43%):</strong> Higher debt burden, may face loan restrictions</li>
              <li><strong>Poor (44-50%):</strong> High debt burden, limited borrowing options</li>
              <li><strong>Very Poor (50%+):</strong> Excessive debt, likely to be denied loans</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What Counts as Debt?</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Credit card payments</li>
              <li>Student loans</li>
              <li>Auto loans</li>
              <li>Personal loans</li>
              <li>Mortgage payments</li>
              <li>Other installment loans</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your monthly income and total monthly debt payments. The calculator will automatically compute your DTI ratio, 
              categorize your financial health, and provide personalized recommendations for improvement.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Why DTI Matters</h4>
            <p className="text-gray-700">
              Lenders use DTI to assess your ability to take on additional debt. A lower DTI ratio typically means better loan terms, 
              lower interest rates, and higher loan amounts. Monitoring your DTI helps you make informed financial decisions 
              and maintain healthy borrowing capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
