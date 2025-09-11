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
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Income Tax Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive income tax calculator helps individuals and families understand their tax 
              obligations at both federal and state levels. This essential financial planning tool provides 
              accurate tax calculations, effective tax rates, and detailed breakdowns for informed financial 
              decision-making and tax planning.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Federal Income Tax:</strong> Progressive tax based on income brackets</li>
              <li><strong>State Income Tax:</strong> State-specific tax calculations</li>
              <li><strong>Social Security Tax:</strong> 6.2% on wages up to annual limit</li>
              <li><strong>Medicare Tax:</strong> 1.45% on all wages (no limit)</li>
              <li><strong>Effective Tax Rate:</strong> Average tax rate on total income</li>
              <li><strong>Marginal Tax Rate:</strong> Tax rate on next dollar earned</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tax Calculation Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Federal Tax Calculation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Progressive System:</strong> Higher rates on higher income</li>
                  <li><strong>Tax Brackets:</strong> 10%, 12%, 22%, 24%, 32%, 35%, 37%</li>
                  <li><strong>Standard Deduction:</strong> $12,950 (single), $25,900 (married)</li>
                  <li><strong>Itemized Deductions:</strong> Alternative to standard deduction</li>
                  <li><strong>Tax Credits:</strong> Reduce tax liability dollar-for-dollar</li>
                  <li><strong>Alternative Minimum Tax:</strong> Parallel tax system</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">State Tax Variations</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>No State Tax:</strong> Texas, Florida, Nevada, Washington</li>
                  <li><strong>Flat Rate:</strong> Pennsylvania (3.07%), Illinois (4.95%)</li>
                  <li><strong>Progressive Rates:</strong> California, New York, Oregon</li>
                  <li><strong>Local Taxes:</strong> City and county additional taxes</li>
                  <li><strong>Deduction Limits:</strong> State-specific deduction rules</li>
                  <li><strong>Tax Credits:</strong> State-specific credit programs</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-1">Total Tax</h5>
                <p className="text-red-700 text-sm">Complete tax obligation</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Taxable Income</h5>
                <p className="text-blue-700 text-sm">Income subject to tax</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Net Income</h5>
                <p className="text-green-700 text-sm">Take-home pay</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Effective Rate</h5>
                <p className="text-orange-700 text-sm">Average tax rate</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your filing status, gross annual income, deductions, state of residence, and any 
              additional deductions. The calculator automatically computes federal and state taxes, 
              provides effective and marginal tax rates, and shows your net income after all taxes.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tax Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>What is Taxable Income:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Gross income minus deductions</li>
                    <li>Basis for tax calculations</li>
                    <li>Determines tax bracket</li>
                    <li>Affects tax credits</li>
                    <li>Varies by filing status</li>
                    <li>Subject to annual changes</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Why Tax Planning Matters:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Minimize tax liability</li>
                    <li>Maximize take-home pay</li>
                    <li>Plan for major purchases</li>
                    <li>Retirement planning</li>
                    <li>Investment decisions</li>
                    <li>Financial security</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Filing Status Options</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Single Filers</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Standard Deduction:</strong> $12,950 (2023)</li>
                  <li><strong>Tax Brackets:</strong> Lower thresholds</li>
                  <li><strong>Eligibility:</strong> Unmarried individuals</li>
                  <li><strong>Benefits:</strong> Simpler filing</li>
                  <li><strong>Limitations:</strong> Fewer tax breaks</li>
                  <li><strong>Best For:</strong> Single individuals</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Married Filers</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Standard Deduction:</strong> $25,900 (2023)</li>
                  <li><strong>Tax Brackets:</strong> Higher thresholds</li>
                  <li><strong>Options:</strong> Joint or separate filing</li>
                  <li><strong>Benefits:</strong> Higher deduction limits</li>
                  <li><strong>Considerations:</strong> Combined income</li>
                  <li><strong>Best For:</strong> Married couples</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Deduction Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Standard Deduction:</strong> Automatic deduction for all taxpayers</li>
              <li><strong>Itemized Deductions:</strong> Specific expenses that reduce taxable income</li>
              <li><strong>Above-the-Line:</strong> Deductions taken before AGI calculation</li>
              <li><strong>Below-the-Line:</strong> Deductions taken after AGI calculation</li>
              <li><strong>Phase-out Limits:</strong> High-income deduction restrictions</li>
              <li><strong>Alternative Minimum Tax:</strong> Parallel tax system considerations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Deductions</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Itemized Deductions</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>State and Local Taxes:</strong> SALT deduction (capped)</li>
                  <li><strong>Mortgage Interest:</strong> Home loan interest payments</li>
                  <li><strong>Charitable Contributions:</strong> Donations to qualified organizations</li>
                  <li><strong>Medical Expenses:</strong> Costs exceeding 7.5% of AGI</li>
                  <li><strong>Casualty Losses:</strong> Disaster-related property losses</li>
                  <li><strong>Job Expenses:</strong> Unreimbursed work costs</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Above-the-Line Deductions</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Retirement Contributions:</strong> 401k, IRA, HSA contributions</li>
                  <li><strong>Student Loan Interest:</strong> Up to $2,500 annually</li>
                  <li><strong>Health Insurance:</strong> Self-employed health premiums</li>
                  <li><strong>Alimony Payments:</strong> Divorce settlement payments</li>
                  <li><strong>Moving Expenses:</strong> Job-related relocation costs</li>
                  <li><strong>Educator Expenses:</strong> Teacher classroom supplies</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tax Rate Understanding</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Marginal Tax Rate:</strong> Tax rate on the next dollar earned</li>
              <li><strong>Effective Tax Rate:</strong> Average tax rate on total income</li>
              <li><strong>Progressive System:</strong> Higher rates apply to higher income levels</li>
              <li><strong>Tax Bracket Confusion:</strong> Only income in each bracket is taxed at that rate</li>
              <li><strong>State Tax Impact:</strong> Additional tax burden varies by state</li>
              <li><strong>Combined Tax Rate:</strong> Federal + state + local taxes</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tax Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Accurate Income:</strong> Include all sources of income</li>
              <li><strong>Maximize Deductions:</strong> Choose standard or itemized wisely</li>
              <li><strong>Consider State Taxes:</strong> Factor in state tax burden</li>
              <li><strong>Plan for Changes:</strong> Tax laws change annually</li>
              <li><strong>Consult Professionals:</strong> Complex situations need expert help</li>
              <li><strong>Keep Records:</strong> Maintain documentation for deductions</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Tax Calculation Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ignoring State Taxes:</strong> Only calculating federal taxes</li>
              <li><strong>Wrong Filing Status:</strong> Incorrect marital status selection</li>
              <li><strong>Missing Deductions:</strong> Not claiming available deductions</li>
              <li><strong>Income Underreporting:</strong> Missing sources of income</li>
              <li><strong>Deduction Overclaiming:</strong> Claiming ineligible expenses</li>
              <li><strong>Tax Bracket Confusion:</strong> Thinking all income is taxed at highest rate</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Tax Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Alternative Minimum Tax:</strong> Parallel tax system for high earners</li>
              <li><strong>Capital Gains Tax:</strong> Different rates for investment income</li>
              <li><strong>Estate Tax:</strong> Tax on large inheritances</li>
              <li><strong>Gift Tax:</strong> Tax on large gifts</li>
              <li><strong>Tax Loss Harvesting:</strong> Strategic investment losses</li>
              <li><strong>Tax-Efficient Investing:</strong> Minimizing tax impact on returns</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that tax laws change frequently, so always verify current rates and deduction 
                amounts. Consider consulting with a tax professional for complex situations, especially 
                if you have multiple income sources, significant deductions, or business income. Plan 
                your taxes throughout the year, not just at filing time, by adjusting withholdings, 
                making estimated payments, and maximizing retirement contributions. Keep detailed records 
                of all income and expenses to support your tax return and maximize your legitimate deductions.
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
