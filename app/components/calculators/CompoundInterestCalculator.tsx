'use client'

import React, { useState, useCallback } from 'react'
import { TrendingUp, DollarSign, Calculator as CalculatorIcon, RotateCcw, BarChart3 } from 'lucide-react'

interface CompoundResult {
  finalAmount: number
  totalContributions: number
  totalInterest: number
  principal: number
  years: number
  annualRate: number
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [annualRate, setAnnualRate] = useState('5')
  const [years, setYears] = useState('10')
  const [compoundFrequency, setCompoundFrequency] = useState('12')
  const [additionalContribution, setAdditionalContribution] = useState('100')
  const [contributionFrequency, setContributionFrequency] = useState('monthly')
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false)

  const calculateCompoundInterest = useCallback((): CompoundResult => {
    const p = parseFloat(principal)
    const r = parseFloat(annualRate) / 100
    const t = parseFloat(years)
    const n = parseFloat(compoundFrequency)
    const pmt = parseFloat(additionalContribution)

    // Compound interest formula: A = P(1 + r/n)^(nt)
    const compoundAmount = p * Math.pow(1 + r/n, n * t)
    
    // Future value of annuity (additional contributions)
    let annuityAmount = 0
    if (pmt > 0) {
      const paymentsPerYear = contributionFrequency === 'monthly' ? 12 : 
                             contributionFrequency === 'quarterly' ? 4 : 1
      const totalPayments = paymentsPerYear * t
      const periodRate = r / paymentsPerYear
      
      if (periodRate > 0) {
        annuityAmount = pmt * ((Math.pow(1 + periodRate, totalPayments) - 1) / periodRate)
      } else {
        annuityAmount = pmt * totalPayments
      }
    }

    const finalAmount = compoundAmount + annuityAmount
    const totalContributions = p + (pmt * (contributionFrequency === 'monthly' ? 12 : 
                                           contributionFrequency === 'quarterly' ? 4 : 1) * t)
    const totalInterest = finalAmount - totalContributions

    return {
      finalAmount: Math.round(finalAmount * 100) / 100,
      totalContributions: Math.round(totalContributions * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      principal: p,
      years: t,
      annualRate: parseFloat(annualRate)
    }
  }, [principal, annualRate, years, compoundFrequency, additionalContribution, contributionFrequency])

  const calculateYearlyBreakdown = useCallback(() => {
    const p = parseFloat(principal)
    const r = parseFloat(annualRate) / 100
    const t = parseFloat(years)
    const n = parseFloat(compoundFrequency)
    const pmt = parseFloat(additionalContribution)
    const paymentsPerYear = contributionFrequency === 'monthly' ? 12 : 
                           contributionFrequency === 'quarterly' ? 4 : 1

    const breakdown = []
    let currentBalance = p
    
    for (let year = 1; year <= Math.min(t, 20); year++) {
      // Compound existing balance
      const compoundGrowth = currentBalance * Math.pow(1 + r/n, n) - currentBalance
      
      // Add contributions for the year
      const yearlyContributions = pmt * paymentsPerYear
      
      // Interest on contributions (average half year)
      const contributionInterest = yearlyContributions * (r / 2)
      
      currentBalance = currentBalance + compoundGrowth + yearlyContributions + contributionInterest
      
      breakdown.push({
        year,
        balance: Math.round(currentBalance),
        contributions: yearlyContributions,
        interestEarned: Math.round(compoundGrowth + contributionInterest),
        totalContributed: p + (yearlyContributions * year)
      })
    }

    return breakdown
  }, [principal, annualRate, years, compoundFrequency, additionalContribution, contributionFrequency])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const result = calculateCompoundInterest()
  const yearlyBreakdown = calculateYearlyBreakdown()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <p className="text-xl text-gray-600">
            Calculate the power of compound interest and investment growth over time
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-blue-600" />
              Investment Parameters
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Principal
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compounding Frequency
                </label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  aria-label="Compounding frequency"
                  title="Select compounding frequency"
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                  <option value="365">Daily</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Contribution
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={additionalContribution}
                    onChange={(e) => setAdditionalContribution(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contribution Frequency
                </label>
                <select
                  value={contributionFrequency}
                  onChange={(e) => setContributionFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  aria-label="Contribution frequency"
                  title="Select contribution frequency"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {showYearlyBreakdown ? 'Hide' : 'Show'} Yearly Breakdown
                </button>
                <button
                  onClick={() => {
                    setPrincipal('10000')
                    setAnnualRate('5')
                    setYears('10')
                    setCompoundFrequency('12')
                    setAdditionalContribution('100')
                    setContributionFrequency('monthly')
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
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                Final Amount
              </h2>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600">
                  {formatCurrency(result.finalAmount)}
                </div>
                <p className="text-gray-600">after {result.years} years</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Initial Principal</span>
                  <span className="font-semibold">{formatCurrency(result.principal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Contributions</span>
                  <span className="font-semibold text-green-600">{formatCurrency(result.totalContributions)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Interest Earned</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(result.totalInterest)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Annual Rate</span>
                  <span className="font-semibold">{result.annualRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Growth Breakdown</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Growth</span>
                  <span className="font-semibold text-green-600">
                    {(((result.finalAmount - result.principal) / result.principal) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Interest vs Principal</span>
                  <span className="font-semibold text-purple-600">
                    {((result.totalInterest / result.totalContributions) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Compounding</span>
                  <span className="font-semibold capitalize">
                    {compoundFrequency === '1' ? 'Annually' :
                     compoundFrequency === '2' ? 'Semi-annually' :
                     compoundFrequency === '4' ? 'Quarterly' :
                     compoundFrequency === '12' ? 'Monthly' : 'Daily'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Compound Interest Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Start early:</strong> Time is the most powerful factor</p>
                <p>• <strong>Regular contributions:</strong> Consistent investing builds wealth</p>
                <p>• <strong>Higher frequency:</strong> More compounding = more growth</p>
                <p>• <strong>Be patient:</strong> Compound interest accelerates over time</p>
              </div>
            </div>
          </div>
        </div>

        {showYearlyBreakdown && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Yearly Growth Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2">Year</th>
                    <th className="text-right py-3 px-2">Balance</th>
                    <th className="text-right py-3 px-2">Contributions</th>
                    <th className="text-right py-3 px-2">Interest</th>
                    <th className="text-right py-3 px-2">Total Contributed</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2">{row.year}</td>
                      <td className="text-right py-2 px-2">{formatCurrency(row.balance)}</td>
                      <td className="text-right py-2 px-2">{formatCurrency(row.contributions)}</td>
                      <td className="text-right py-2 px-2 text-blue-600">{formatCurrency(row.interestEarned)}</td>
                      <td className="text-right py-2 px-2">{formatCurrency(row.totalContributed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">About Compound Interest Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-6 text-lg">
              Our advanced compound interest calculator helps you understand the power of compound growth on your investments 
              and savings. This essential tool demonstrates how time, regular contributions, and compounding frequency can 
              dramatically increase your wealth over the long term.
            </p>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-4">What is Compound Interest?</h4>
            <p className="text-gray-700 mb-4">
              Compound interest is when your investment earns interest not only on the initial principal but also on the 
              accumulated interest from previous periods. This creates exponential growth, often called "interest on interest," 
              making it one of the most powerful wealth-building tools available.
            </p>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-4">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Final Amount:</strong> Total value after compound growth</li>
              <li><strong>Total Interest:</strong> Interest earned over the entire period</li>
              <li><strong>Growth Percentage:</strong> Total percentage increase</li>
              <li><strong>Yearly Breakdown:</strong> Year-by-year growth progression</li>
              <li><strong>Contribution Impact:</strong> Effect of regular additional investments</li>
            </ul>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Compounding Frequencies Explained</h4>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Standard Frequencies</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                  <li><strong>Annually:</strong> Interest compounded once per year</li>
                  <li><strong>Semi-annually:</strong> Interest compounded twice per year</li>
                  <li><strong>Quarterly:</strong> Interest compounded four times per year</li>
                  <li><strong>Monthly:</strong> Interest compounded twelve times per year</li>
                  <li><strong>Daily:</strong> Interest compounded 365 times per year</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Impact on Growth</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                  <li>Higher frequency = more growth</li>
                  <li>Daily compounding maximizes returns</li>
                  <li>Difference becomes significant over time</li>
                  <li>Important for long-term investments</li>
                  <li>Affects retirement planning significantly</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Key Factors Affecting Growth</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2">Time</h5>
                <p className="text-blue-700 text-sm">The longer you invest, the more compound interest works in your favor</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">Rate</h5>
                <p className="text-green-700 text-sm">Higher interest rates accelerate growth exponentially</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">Contributions</h5>
                <p className="text-purple-700 text-sm">Regular additional investments compound over time</p>
              </div>
            </div>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Common Applications</h4>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Personal Finance</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Savings accounts and CDs</li>
                  <li>Retirement planning (401k, IRA)</li>
                  <li>Education savings (529 plans)</li>
                  <li>Emergency fund growth</li>
                  <li>Long-term goal planning</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">Investment Planning</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Stock market investments</li>
                  <li>Bond ladder strategies</li>
                  <li>Dividend reinvestment</li>
                  <li>Real estate appreciation</li>
                  <li>Business investment returns</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-4">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your initial investment amount, annual interest rate, time period, and compounding frequency. 
              Add optional regular contributions to see how consistent investing accelerates your wealth building. 
              The calculator provides detailed breakdowns and yearly projections to help you visualize your financial future.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-3">Pro Tips for Maximum Growth</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                <li><strong>Start Early:</strong> Even small amounts grow significantly over decades</li>
                <li><strong>Stay Consistent:</strong> Regular contributions create a snowball effect</li>
                <li><strong>Reinvest Dividends:</strong> Let your earnings compound automatically</li>
                <li><strong>Choose Higher Frequencies:</strong> Daily compounding beats annual</li>
                <li><strong>Be Patient:</strong> Compound interest accelerates dramatically over time</li>
              </ul>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Compound Interest Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
