'use client'

import React, { useState, useCallback } from 'react'
import { TrendingUp, DollarSign, Calendar, Calculator as CalculatorIcon, RotateCcw, BarChart3 } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface InvestmentResult {
  futureValue: number
  totalContribution: number
  totalInterest: number
  annualReturn: number
  years: number
  monthlyContribution: number
}

export default function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('10000')
  const [monthlyContribution, setMonthlyContribution] = useState('500')
  const [annualReturn, setAnnualReturn] = useState('8')
  const [years, setYears] = useState('20')
  const [contributionFrequency, setContributionFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly')
  const [showProjection, setShowProjection] = useState(false)

  const calculateInvestment = useCallback((): InvestmentResult => {
    const initial = parseFloat(initialInvestment)
    const monthly = parseFloat(monthlyContribution)
    const rate = parseFloat(annualReturn) / 100
    const time = parseFloat(years)

    let contributionAmount = monthly
    let contributionFreq = 12 // monthly

    if (contributionFrequency === 'quarterly') {
      contributionAmount = monthly * 3
      contributionFreq = 4
    } else if (contributionFrequency === 'annually') {
      contributionAmount = monthly * 12
      contributionFreq = 1
    }

    // Future value formula: FV = P(1+r)^n + PMT * ((1+r)^n - 1) / r
    const futureValue = initial * Math.pow(1 + rate, time) + 
                       contributionAmount * ((Math.pow(1 + rate, time) - 1) / rate)

    const totalContribution = initial + (contributionAmount * contributionFreq * time)
    const totalInterest = futureValue - totalContribution

    return {
      futureValue,
      totalContribution,
      totalInterest,
      annualReturn: rate * 100,
      years: time,
      monthlyContribution: monthly
    }
  }, [initialInvestment, monthlyContribution, annualReturn, years, contributionFrequency])

  const calculateYearlyProjection = useCallback(() => {
    const result = calculateInvestment()
    const initial = parseFloat(initialInvestment)
    const monthly = parseFloat(monthlyContribution)
    const rate = parseFloat(annualReturn) / 100
    const time = parseFloat(years)

    const projection = []
    let currentValue = initial

    for (let year = 1; year <= Math.min(time, 30); year++) {
      const yearlyContribution = monthly * 12
      const interestEarned = currentValue * rate
      currentValue = currentValue + yearlyContribution + interestEarned

      projection.push({
        year,
        balance: currentValue,
        contribution: yearlyContribution,
        interest: interestEarned,
        totalContribution: initial + (yearlyContribution * year)
      })
    }

    return projection
  }, [calculateInvestment, initialInvestment, monthlyContribution, annualReturn, years])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (rate: number): string => {
    return `${rate.toFixed(2)}%`
  }

  const result = calculateInvestment()
  const projection = calculateYearlyProjection()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <TrendingUp className="w-12 h-12 mr-3 text-emerald-600" />
            Investment Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate investment returns, compound interest, and future value
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-emerald-600" />
              Investment Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Investment
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Contribution
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Return Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Period (Years)
                </label>
                <select
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  aria-label="Investment period selection"
                  title="Select investment period in years"
                >
                  <option value="5">5 Years</option>
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                  <option value="25">25 Years</option>
                  <option value="30">30 Years</option>
                  <option value="40">40 Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contribution Frequency
                </label>
                <select
                  value={contributionFrequency}
                  onChange={(e) => setContributionFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  aria-label="Contribution frequency selection"
                  title="Select contribution frequency"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowProjection(!showProjection)}
                  className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  {showProjection ? 'Hide' : 'Show'} Yearly Projection
                </button>
                <button
                  onClick={() => {
                    setInitialInvestment('10000')
                    setMonthlyContribution('500')
                    setAnnualReturn('8')
                    setYears('20')
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
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-emerald-200">
              <ResultSharing
                title="Investment Calculation Result"
                inputs={[
                  { label: "Initial Investment", value: formatCurrency(parseFloat(initialInvestment)) },
                  { label: "Monthly Contribution", value: formatCurrency(result.monthlyContribution) },
                  { label: "Annual Return", value: formatPercent(result.annualReturn) }
                ]}
                result={{ 
                  label: "Future Value", 
                  value: formatCurrency(result.futureValue),
                  unit: ""
                }}
                calculatorName="Investment Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-emerald-600" />
                Future Value
              </h2>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-emerald-600">
                  {formatCurrency(result.futureValue)}
                </div>
                <p className="text-gray-600">after {result.years} years</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Initial Investment</span>
                  <span className="font-semibold">{formatCurrency(parseFloat(initialInvestment))}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Contributions</span>
                  <span className="font-semibold">{formatCurrency(result.totalContribution - parseFloat(initialInvestment))}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Interest Earned</span>
                  <span className="font-semibold text-emerald-600">{formatCurrency(result.totalInterest)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Investment</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(result.totalContribution)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Investment Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Annual Return</span>
                  <span className="font-semibold">{formatPercent(result.annualReturn)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Investment Period</span>
                  <span className="font-semibold">{result.years} years</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Monthly Contribution</span>
                  <span className="font-semibold">{formatCurrency(result.monthlyContribution)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Contribution Frequency</span>
                  <span className="font-semibold capitalize">{contributionFrequency}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Investment Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Start early</strong> to benefit from compound interest</p>
                <p>• <strong>Consistent contributions</strong> build wealth over time</p>
                <p>• <strong>Diversify</strong> your investment portfolio</p>
                <p>• <strong>Consider inflation</strong> when planning returns</p>
              </div>
            </div>
          </div>
        </div>

        {showProjection && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Yearly Projection</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2">Year</th>
                    <th className="text-right py-3 px-2">Balance</th>
                    <th className="text-right py-3 px-2">Contribution</th>
                    <th className="text-right py-3 px-2">Interest</th>
                    <th className="text-right py-3 px-2">Total Contributed</th>
                  </tr>
                </thead>
                <tbody>
                  {projection.map((row) => (
                    <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2">{row.year}</td>
                      <td className="text-right py-2 px-2">{formatCurrency(row.balance)}</td>
                      <td className="text-right py-2 px-2">{formatCurrency(row.contribution)}</td>
                      <td className="text-right py-2 px-2 text-emerald-600">{formatCurrency(row.interest)}</td>
                      <td className="text-right py-2 px-2">{formatCurrency(row.totalContribution)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Investment Calculator</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-6 text-lg">
              Our comprehensive investment calculator helps you plan your financial future by projecting the growth 
              of your investments over time. Whether you're saving for retirement, planning for major purchases, 
              or building wealth, this tool provides accurate projections based on compound interest principles.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What It Calculates</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Future Value:</strong> Total investment worth after specified period</li>
                  <li><strong>Compound Interest:</strong> Interest earned on interest over time</li>
                  <li><strong>Total Contributions:</strong> Sum of all money invested</li>
                  <li><strong>Interest Growth:</strong> How much your money grows through compounding</li>
                  <li><strong>Yearly Projections:</strong> Year-by-year breakdown of growth</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Investment Strategies</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Dollar-Cost Averaging:</strong> Regular contributions regardless of market conditions</li>
                  <li><strong>Compound Growth:</strong> Reinvesting earnings for exponential growth</li>
                  <li><strong>Long-term Planning:</strong> Time horizon impact on investment success</li>
                  <li><strong>Risk Management:</strong> Understanding return rate assumptions</li>
                  <li><strong>Portfolio Diversification:</strong> Spreading investments across assets</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Factors</h3>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">Initial Investment</h4>
                <p className="text-emerald-700 text-sm">Starting amount to invest</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Regular Contributions</h4>
                <p className="text-blue-700 text-sm">Ongoing investment amounts</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Return Rate</h4>
                <p className="text-purple-700 text-sm">Expected annual growth percentage</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Time Horizon</h4>
                <p className="text-orange-700 text-sm">Length of investment period</p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Use</h3>
            <p className="text-gray-700 mb-4">
              Enter your initial investment amount, monthly/quarterly/annual contributions, expected annual return rate, 
              and investment period. The calculator will show you the future value, total contributions, interest earned, 
              and provide a detailed yearly projection to help you visualize your investment growth.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tip</h4>
              <p className="text-gray-700 text-sm">
                Start investing early and contribute regularly. Even small amounts can grow significantly over time 
                thanks to compound interest. A $500 monthly contribution at 8% annual return can grow to over $1.4 million in 30 years!
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
