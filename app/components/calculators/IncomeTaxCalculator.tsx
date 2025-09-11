'use client'

import React, { useState, useCallback } from 'react'
import { DollarSign, Calculator as CalculatorIcon, RotateCcw, Receipt, TrendingDown } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface TaxResult {
  grossIncome: number
  taxableIncome: number
  federalTax: number
  stateTax: number
  socialSecurityTax: number
  medicareTax: number
  totalTax: number
  netIncome: number
  effectiveTaxRate: number
  marginalTaxRate: number
}

export default function IncomeTaxCalculator() {
  const [filingStatus, setFilingStatus] = useState('single')
  const [grossIncome, setGrossIncome] = useState('75000')
  const [deductions, setDeductions] = useState('12950')
  const [state, setState] = useState('CA')
  const [stateTaxRate, setStateTaxRate] = useState('7.25')
  const [additionalDeductions, setAdditionalDeductions] = useState('0')

  const federalTaxBrackets = {
    single: [
      { rate: 0.10, max: 11000 },
      { rate: 0.12, max: 44725 },
      { rate: 0.22, max: 95375 },
      { rate: 0.24, max: 182100 },
      { rate: 0.32, max: 231250 },
      { rate: 0.35, max: 578125 },
      { rate: 0.37, max: Infinity }
    ],
    married: [
      { rate: 0.10, max: 22000 },
      { rate: 0.12, max: 89450 },
      { rate: 0.22, max: 190750 },
      { rate: 0.24, max: 364200 },
      { rate: 0.32, max: 462500 },
      { rate: 0.35, max: 693750 },
      { rate: 0.37, max: Infinity }
    ],
    headOfHousehold: [
      { rate: 0.10, max: 15700 },
      { rate: 0.12, max: 59850 },
      { rate: 0.22, max: 95350 },
      { rate: 0.24, max: 182100 },
      { rate: 0.32, max: 231250 },
      { rate: 0.35, max: 578100 },
      { rate: 0.37, max: Infinity }
    ]
  }

  const calculateTax = useCallback((): TaxResult => {
    const income = parseFloat(grossIncome)
    const standardDeduction = parseFloat(deductions)
    const additional = parseFloat(additionalDeductions)
    const stateRate = parseFloat(stateTaxRate) / 100

    const totalDeductions = standardDeduction + additional
    const taxableIncome = Math.max(0, income - totalDeductions)

    // Calculate federal tax
    let federalTax = 0
    let remainingIncome = taxableIncome
    let marginalRate = 0

    const brackets = federalTaxBrackets[filingStatus as keyof typeof federalTaxBrackets]
    for (const bracket of brackets) {
      if (remainingIncome > 0) {
        const taxableInBracket = Math.min(remainingIncome, bracket.max - (bracket.max === Infinity ? 0 : bracket.max))
        federalTax += taxableInBracket * bracket.rate
        remainingIncome -= taxableInBracket
        marginalRate = bracket.rate
      }
    }

    // Calculate other taxes
    const socialSecurityTax = Math.min(income * 0.062, 160200 * 0.062) // 6.2% up to $160,200
    const medicareTax = income * 0.0145 // 1.45%
    const stateTax = taxableIncome * stateRate

    const totalTax = federalTax + stateTax + socialSecurityTax + medicareTax
    const netIncome = income - totalTax
    const effectiveTaxRate = (totalTax / income) * 100

    return {
      grossIncome: income,
      taxableIncome: Math.round(taxableIncome),
      federalTax: Math.round(federalTax),
      stateTax: Math.round(stateTax),
      socialSecurityTax: Math.round(socialSecurityTax),
      medicareTax: Math.round(medicareTax),
      totalTax: Math.round(totalTax),
      netIncome: Math.round(netIncome),
      effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
      marginalTaxRate: marginalRate * 100
    }
  }, [filingStatus, grossIncome, deductions, stateTaxRate, additionalDeductions])

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

  const result = calculateTax()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Receipt className="w-12 h-12 mr-3 text-red-600" />
            Income Tax Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate your federal and state income tax liability
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-red-600" />
              Tax Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filing Status
                </label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  aria-label="Filing status"
                  title="Select filing status"
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="headOfHousehold">Head of Household</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gross Annual Income
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    placeholder="75000"
                    title="Enter your gross annual income"
                    aria-label="Gross annual income"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard Deduction
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    placeholder="12950"
                    title="Enter standard deduction amount"
                    aria-label="Standard deduction amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Deductions
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={additionalDeductions}
                    onChange={(e) => setAdditionalDeductions(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    placeholder="0"
                    title="Enter additional deductions"
                    aria-label="Additional deductions amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  aria-label="State selection"
                  title="Select your state"
                >
                  <option value="CA">California (7.25%)</option>
                  <option value="NY">New York (6.85%)</option>
                  <option value="TX">Texas (0%)</option>
                  <option value="FL">Florida (0%)</option>
                  <option value="IL">Illinois (4.95%)</option>
                  <option value="PA">Pennsylvania (3.07%)</option>
                  <option value="OH">Ohio (3.99%)</option>
                  <option value="GA">Georgia (5.75%)</option>
                  <option value="NC">North Carolina (4.75%)</option>
                  <option value="MI">Michigan (4.25%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom State Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={stateTaxRate}
                  onChange={(e) => setStateTaxRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="7.25"
                  title="Enter custom state tax rate percentage"
                  aria-label="Custom state tax rate percentage"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setFilingStatus('single')
                    setGrossIncome('75000')
                    setDeductions('12950')
                    setState('CA')
                    setStateTaxRate('7.25')
                    setAdditionalDeductions('0')
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
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <ResultSharing
                title="Income Tax Calculation Result"
                inputs={[
                  { label: "Filing Status", value: filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1) },
                  { label: "Gross Income", value: formatCurrency(result.grossIncome) },
                  { label: "State", value: state }
                ]}
                result={{ 
                  label: "Total Taxes Owed", 
                  value: formatCurrency(result.totalTax),
                  unit: ""
                }}
                calculatorName="Income Tax Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingDown className="w-6 h-6 mr-2 text-red-600" />
                Tax Summary
              </h2>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {formatCurrency(result.totalTax)}
                </div>
                <p className="text-gray-600">total taxes owed</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Gross Income</span>
                  <span className="font-semibold">{formatCurrency(result.grossIncome)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Taxable Income</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(result.taxableIncome)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Net Income</span>
                  <span className="font-semibold text-green-600">{formatCurrency(result.netIncome)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Effective Tax Rate</span>
                  <span className="font-semibold text-orange-600">{formatPercent(result.effectiveTaxRate)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tax Breakdown</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Federal Income Tax</span>
                  <span className="font-semibold text-red-600">{formatCurrency(result.federalTax)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">State Income Tax</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(result.stateTax)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Social Security Tax</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(result.socialSecurityTax)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Medicare Tax</span>
                  <span className="font-semibold text-green-600">{formatCurrency(result.medicareTax)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Marginal Tax Rate</span>
                  <span className="font-semibold text-orange-600">{formatPercent(result.marginalTaxRate)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tax Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Maximize deductions:</strong> Use itemized deductions if they exceed standard</p>
                <p>• <strong>Retirement accounts:</strong> 401k and IRA contributions reduce taxable income</p>
                <p>• <strong>Tax credits:</strong> Look for available tax credits to reduce liability</p>
                <p>• <strong>State taxes:</strong> Consider state tax rates when choosing residence</p>
                <p>• <strong>Professional help:</strong> Complex situations may require tax professional</p>
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
