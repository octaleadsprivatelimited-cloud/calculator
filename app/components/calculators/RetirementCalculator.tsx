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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Retirement Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive retirement calculator helps you plan for your financial future by projecting your retirement 
              savings and monthly income. Whether you're just starting to save or approaching retirement age, this tool 
              provides valuable insights to help you achieve your retirement goals.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Total Retirement Savings:</strong> Projected nest egg at retirement age</li>
              <li><strong>Years to Retirement:</strong> Time remaining until your target retirement</li>
              <li><strong>Monthly Income:</strong> Estimated monthly income during retirement</li>
              <li><strong>Savings Growth:</strong> How your money grows over time</li>
              <li><strong>Personalized Recommendations:</strong> Tips to improve your retirement outlook</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Retirement Planning Components</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Current Financial Status</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Current age and retirement target</li>
                  <li>Existing retirement savings</li>
                  <li>Monthly contribution amount</li>
                  <li>Expected investment returns</li>
                  <li>Risk tolerance assessment</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Future Projections</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Compound growth calculations</li>
                  <li>Inflation considerations</li>
                  <li>Withdrawal rate strategies</li>
                  <li>Life expectancy planning</li>
                  <li>Healthcare cost estimates</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your current age, target retirement age, existing savings, monthly contribution amount, and expected 
              annual return rate. The calculator will project your retirement savings and provide personalized recommendations 
              to help you reach your retirement goals.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 mb-1">Total Savings</h5>
                <p className="text-emerald-700 text-sm">Your projected retirement nest egg</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Monthly Income</h5>
                <p className="text-blue-700 text-sm">Estimated monthly retirement income</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Years to Go</h5>
                <p className="text-purple-700 text-sm">Time remaining until retirement</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Retirement Planning Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Start Early:</strong> Time is your greatest ally in retirement planning</li>
              <li><strong>Increase Contributions:</strong> Boost savings as your income grows</li>
              <li><strong>Diversify Investments:</strong> Spread risk across different asset classes</li>
              <li><strong>Consider Tax Advantages:</strong> Maximize 401(k), IRA, and other tax-deferred accounts</li>
              <li><strong>Plan for Healthcare:</strong> Account for medical expenses in retirement</li>
              <li><strong>Review Regularly:</strong> Adjust your plan as circumstances change</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Retirement Accounts</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>401(k):</strong> Employer-sponsored retirement plan with potential matching</p>
                  <p><strong>Traditional IRA:</strong> Tax-deferred individual retirement account</p>
                  <p><strong>Roth IRA:</strong> Tax-free withdrawals in retirement</p>
                </div>
                <div>
                  <p><strong>SEP IRA:</strong> Simplified employee pension for self-employed</p>
                  <p><strong>403(b):</strong> Retirement plan for non-profit employees</p>
                  <p><strong>Annuities:</strong> Insurance products providing guaranteed income</p>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Retirement Income Sources</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Social Security:</strong> Government retirement benefits</li>
              <li><strong>Personal Savings:</strong> 401(k), IRA, and other investments</li>
              <li><strong>Pension Plans:</strong> Employer-provided retirement income</li>
              <li><strong>Part-time Work:</strong> Continued employment during retirement</li>
              <li><strong>Real Estate:</strong> Rental income or reverse mortgages</li>
              <li><strong>Business Ownership:</strong> Selling or continuing business operations</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                The earlier you start saving for retirement, the more time compound interest has to work in your favor. 
                Even small monthly contributions can grow into substantial sums over decades. Consider increasing your 
                contribution rate by 1% each year to gradually build your retirement savings without feeling the pinch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
