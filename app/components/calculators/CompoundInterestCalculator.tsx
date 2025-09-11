'use client'

import React, { useState, useCallback } from 'react'
import { TrendingUp, DollarSign, Calculator as CalculatorIcon, RotateCcw, BarChart3 } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface CompoundResult {
  finalAmount: number
  totalContributions: number
  totalInterest: number
  principal: number
  years: number
  annualRate: number
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [years, setYears] = useState('')
  const [compoundFrequency, setCompoundFrequency] = useState('12')
  const [additionalContribution, setAdditionalContribution] = useState('')
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
    return amount.toLocaleString()
  }

  const result = calculateCompoundInterest()
  const yearlyBreakdown = calculateYearlyBreakdown()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-2 sm:p-4">
      <div className="w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg mb-6 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Compound Interest Calculator</h1>
              <p className="text-blue-100 text-sm sm:text-base">Calculate the power of compound interest and investment growth over time</p>
            </div>
          </div>
        </div>

        {/* Share Options - Moved to Top */}
        <div className="mb-4 bg-white rounded-xl shadow-md p-3 sm:p-4 border-2 border-blue-200">
          <ResultSharing
            title="Compound Interest Calculation Result"
            inputs={[
              { label: "Initial Principal", value: formatCurrency(result.principal) },
              { label: "Annual Rate", value: `${result.annualRate.toFixed(2)}%` },
              { label: "Years", value: `${result.years} years` },
              { label: "Additional Contribution", value: formatCurrency(parseFloat(additionalContribution)) },
              { label: "Contribution Frequency", value: contributionFrequency }
            ]}
            result={{ 
              label: "Final Amount", 
              value: formatCurrency(result.finalAmount),
              unit: ""
            }}
            calculatorName="Compound Interest Calculator"
            className="mb-0"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 border-blue-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <CalculatorIcon className="w-5 h-5 mr-2 text-blue-600" />
              Investment Parameters
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Initial Principal
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Compounding Frequency
                </label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
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
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Additional Contribution
                </label>
                <input
                  type="number"
                  value={additionalContribution}
                  onChange={(e) => setAdditionalContribution(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Contribution Frequency
                </label>
                <select
                  value={contributionFrequency}
                  onChange={(e) => setContributionFrequency(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
                  aria-label="Contribution frequency"
                  title="Select contribution frequency"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-2">
                <button
                  onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
                  className="flex-1 bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                >
                  {showYearlyBreakdown ? 'Hide' : 'Show'} Yearly Breakdown
                </button>
                <button
                  onClick={() => {
                    setPrincipal('')
                    setAnnualRate('')
                    setYears('')
                    setCompoundFrequency('12')
                    setAdditionalContribution('')
                    setContributionFrequency('monthly')
                  }}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 border-blue-200">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Final Amount
              </h2>
              
              <div className="text-center mb-4">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {formatCurrency(result.finalAmount)}
                </div>
                <p className="text-gray-600 text-sm sm:text-base">after {result.years} years</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 sm:py-2 border-b border-gray-100 text-sm sm:text-base">
                  <span className="text-gray-600">Initial Principal</span>
                  <span className="font-semibold">{formatCurrency(result.principal)}</span>
                </div>
                <div className="flex justify-between py-1 sm:py-2 border-b border-gray-100 text-sm sm:text-base">
                  <span className="text-gray-600">Total Contributions</span>
                  <span className="font-semibold text-green-600">{formatCurrency(result.totalContributions)}</span>
                </div>
                <div className="flex justify-between py-1 sm:py-2 border-b border-gray-100 text-sm sm:text-base">
                  <span className="text-gray-600">Interest Earned</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(result.totalInterest)}</span>
                </div>
                <div className="flex justify-between py-1 sm:py-2 border-b border-gray-100 text-sm sm:text-base">
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


        <footer className="text-center mt-12 text-gray-500">
        </footer>
      </div>
    </div>
  )
}
