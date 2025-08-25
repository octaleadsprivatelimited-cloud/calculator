'use client'

import React, { useState, useCallback } from 'react'
import { DollarSign, Calculator, TrendingUp, FileText, Share2, Download, Printer } from 'lucide-react'
import PageCalculator from '../PageCalculator'
import ShareModal from '../ShareModal'

interface SalaryBreakdown {
  grossSalary: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  otherDeductions: number
  netSalary: number
  monthlyPay: number
  biweeklyPay: number
  weeklyPay: number
  dailyPay: number
  hourlyRate: number
}

export default function SalaryCalculator() {
  const [grossSalary, setGrossSalary] = useState('75000')
  const [filingStatus, setFilingStatus] = useState('single')
  const [state, setState] = useState('CA')
  const [otherDeductions, setOtherDeductions] = useState('0')
  const [payFrequency, setPayFrequency] = useState('yearly')
  const [hoursPerWeek, setHoursPerWeek] = useState('40')
  const [showShareModal, setShowShareModal] = useState(false)

  const calculateSalary = useCallback((): SalaryBreakdown => {
    const gross = parseFloat(grossSalary) || 0
    const deductions = parseFloat(otherDeductions) || 0
    
    // Federal Tax (simplified calculation)
    let federalTax = 0
    if (gross <= 11600) {
      federalTax = gross * 0.10
    } else if (gross <= 47150) {
      federalTax = 1160 + (gross - 11600) * 0.12
    } else if (gross <= 100525) {
      federalTax = 5428 + (gross - 47150) * 0.22
    } else if (gross <= 191950) {
      federalTax = 16294 + (gross - 100525) * 0.24
    } else if (gross <= 243725) {
      federalTax = 37104 + (gross - 191950) * 0.32
    } else if (gross <= 609350) {
      federalTax = 52832 + (gross - 243725) * 0.35
    } else {
      federalTax = 174238.25 + (gross - 609350) * 0.37
    }

    // State Tax (simplified - using CA as example)
    let stateTax = 0
    if (state === 'CA') {
      if (gross <= 10099) {
        stateTax = gross * 0.01
      } else if (gross <= 23942) {
        stateTax = 100.99 + (gross - 10099) * 0.02
      } else if (gross <= 37788) {
        stateTax = 377.85 + (gross - 23942) * 0.04
      } else if (gross <= 52455) {
        stateTax = 931.69 + (gross - 37788) * 0.06
      } else if (gross <= 66295) {
        stateTax = 1813.87 + (gross - 52455) * 0.08
      } else if (gross <= 338639) {
        stateTax = 2921.95 + (gross - 66295) * 0.093
      } else if (gross <= 406364) {
        stateTax = 28351.84 + (gross - 338639) * 0.103
      } else if (gross <= 677275) {
        stateTax = 35322.75 + (gross - 406364) * 0.113
      } else {
        stateTax = 65967.46 + (gross - 677275) * 0.123
      }
    }

    // Social Security (6.2% up to $168,600 in 2024)
    const socialSecurity = Math.min(gross * 0.062, 168600 * 0.062)
    
    // Medicare (1.45%)
    const medicare = gross * 0.0145

    const totalTaxes = federalTax + stateTax + socialSecurity + medicare
    const netSalary = gross - totalTaxes - deductions

    // Calculate different pay periods
    const monthlyPay = netSalary / 12
    const biweeklyPay = netSalary / 26
    const weeklyPay = netSalary / 52
    const dailyPay = weeklyPay / 5
    const hourlyRate = weeklyPay / (parseFloat(hoursPerWeek) || 40)

    return {
      grossSalary: gross,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      otherDeductions: deductions,
      netSalary,
      monthlyPay,
      biweeklyPay,
      weeklyPay,
      dailyPay,
      hourlyRate
    }
  }, [grossSalary, filingStatus, state, otherDeductions, hoursPerWeek])

  const breakdown = calculateSalary()

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const data = `Salary Breakdown\n\nGross Salary: $${breakdown.grossSalary.toLocaleString()}\nFederal Tax: $${breakdown.federalTax.toLocaleString()}\nState Tax: $${breakdown.stateTax.toLocaleString()}\nSocial Security: $${breakdown.socialSecurity.toLocaleString()}\nMedicare: $${breakdown.medicare.toLocaleString()}\nOther Deductions: $${breakdown.otherDeductions.toLocaleString()}\nNet Salary: $${breakdown.netSalary.toLocaleString()}\n\nMonthly Pay: $${breakdown.monthlyPay.toLocaleString()}\nBiweekly Pay: $${breakdown.biweeklyPay.toLocaleString()}\nWeekly Pay: $${breakdown.weeklyPay.toLocaleString()}\nDaily Pay: $${breakdown.dailyPay.toLocaleString()}\nHourly Rate: $${breakdown.hourlyRate.toFixed(2)}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'salary-breakdown.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <DollarSign className="w-16 h-16 mr-4 text-green-600" />
            Salary Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your take-home pay after taxes and deductions. Get detailed breakdowns of federal and state taxes, Social Security, Medicare, and more.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-green-600" />
                Salary Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gross Annual Salary
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="75000"
                      title="Enter your gross annual salary"
                      aria-label="Gross annual salary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filing Status
                  </label>
                  <select
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    title="Select your tax filing status"
                    aria-label="Tax filing status"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                    <option value="head">Head of Household</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    title="Select your state for state tax calculation"
                    aria-label="State for tax calculation"
                  >
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="IL">Illinois</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Deductions
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={otherDeductions}
                      onChange={(e) => setOtherDeductions(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="0"
                      title="Enter any other deductions (health insurance, retirement, etc.)"
                      aria-label="Other deductions amount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pay Frequency
                  </label>
                  <select
                    value={payFrequency}
                    onChange={(e) => setPayFrequency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    title="Select your pay frequency"
                    aria-label="Pay frequency"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours per Week
                  </label>
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="40"
                    min="1"
                    max="168"
                    title="Enter your typical work hours per week"
                    aria-label="Hours worked per week"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                Salary Breakdown
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tax Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Tax Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Salary:</span>
                      <span className="font-semibold">${breakdown.grossSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Federal Tax:</span>
                      <span>-${breakdown.federalTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>State Tax:</span>
                      <span>-${breakdown.stateTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Social Security:</span>
                      <span>-${breakdown.socialSecurity.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Medicare:</span>
                      <span>-${breakdown.medicare.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Other Deductions:</span>
                      <span>-${breakdown.otherDeductions.toLocaleString()}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-green-600">
                      <span>Net Salary:</span>
                      <span>${breakdown.netSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Pay Periods */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Pay by Period</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly:</span>
                      <span className="font-semibold">${breakdown.monthlyPay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bi-weekly:</span>
                      <span className="font-semibold">${breakdown.biweeklyPay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekly:</span>
                      <span className="font-semibold">${breakdown.weeklyPay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily:</span>
                      <span className="font-semibold">${breakdown.dailyPay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-semibold">${breakdown.hourlyRate.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Share salary breakdown"
                aria-label="Share salary breakdown"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Download salary breakdown as text file"
                aria-label="Download salary breakdown"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Print salary breakdown"
                aria-label="Print salary breakdown"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Comprehensive Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Salary Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive salary calculator helps employees, job seekers, and HR professionals understand 
                the complete picture of compensation by calculating take-home pay after all deductions. It provides 
                detailed breakdowns of federal and state taxes, Social Security, Medicare, and other deductions.
              </p>
              <p className="text-gray-700">
                The calculator converts annual salaries to various pay periods and helps users understand the 
                true value of their compensation package for budgeting and financial planning purposes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Understanding Your Paycheck</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Gross vs. Net Pay</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Gross Salary:</strong> Total compensation before any deductions</li>
                    <li><strong>Net Salary:</strong> Take-home pay after all taxes and deductions</li>
                    <li><strong>Tax Burden:</strong> Total percentage of income going to taxes</li>
                    <li><strong>Effective Tax Rate:</strong> Average tax rate on total income</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Pay Period Conversions</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Monthly:</strong> Net salary ÷ 12 months</li>
                    <li><strong>Bi-weekly:</strong> Net salary ÷ 26 pay periods</li>
                    <li><strong>Weekly:</strong> Net salary ÷ 52 weeks</li>
                    <li><strong>Daily:</strong> Weekly pay ÷ 5 working days</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Federal Tax System</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-2">2024 Federal Tax Brackets</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Single Filer:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>10%: $0 - $11,600</li>
                      <li>12%: $11,601 - $47,150</li>
                      <li>22%: $47,151 - $100,525</li>
                      <li>24%: $100,526 - $191,950</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Higher Brackets:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>32%: $191,951 - $243,725</li>
                      <li>35%: $243,726 - $609,350</li>
                      <li>37%: $609,351+</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700 mt-3 text-sm">
                  <strong>Note:</strong> Tax brackets are progressive, meaning only income within each bracket 
                  is taxed at that rate, not your entire income.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Payroll Deductions Explained</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Mandatory Deductions</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Federal Income Tax:</strong> Progressive tax based on income level</li>
                    <li><strong>State Income Tax:</strong> Varies by state (some states have no income tax)</li>
                    <li><strong>Social Security:</strong> 6.2% up to $168,600 (2024 limit)</li>
                    <li><strong>Medicare:</strong> 1.45% on all earnings (no limit)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Optional Deductions</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>401(k) Contributions:</strong> Pre-tax retirement savings</li>
                    <li><strong>Health Insurance:</strong> Medical, dental, vision coverage</li>
                    <li><strong>Life Insurance:</strong> Employer-provided or voluntary</li>
                    <li><strong>Other Benefits:</strong> Disability, HSA, FSA contributions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">State Tax Variations</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>No State Income Tax:</strong> Alaska, Florida, Nevada, South Dakota, Texas, Washington, Wyoming</li>
                <li><strong>Flat Rate States:</strong> Colorado (4.4%), Illinois (4.95%), Indiana (3.23%)</li>
                <li><strong>Progressive States:</strong> California, New York, Oregon have multiple brackets</li>
                <li><strong>Local Taxes:</strong> Some cities add additional income taxes</li>
                <li><strong>State-Specific Deductions:</strong> Vary significantly between states</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Financial Planning Considerations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Budgeting</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Use net pay for monthly budgeting</li>
                    <li>Account for irregular expenses</li>
                    <li>Plan for tax refunds or payments</li>
                    <li>Consider seasonal variations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Tax Planning</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Adjust withholding as needed</li>
                    <li>Maximize retirement contributions</li>
                    <li>Consider tax-advantaged accounts</li>
                    <li>Plan for major life changes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Salary Negotiation Factors</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Total Compensation:</strong> Look beyond base salary to benefits and perks</li>
                <li><strong>Tax Implications:</strong> Higher salary means higher tax bracket</li>
                <li><strong>Cost of Living:</strong> Consider local tax rates and living expenses</li>
                <li><strong>Benefits Value:</strong> Health insurance, retirement matching, etc.</li>
                <li><strong>Growth Potential:</strong> Future raises and advancement opportunities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Salary Calculator Uses</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Job Seekers</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Compare job offers</li>
                    <li>Negotiate compensation</li>
                    <li>Plan relocation costs</li>
                    <li>Understand tax implications</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Current Employees</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Budget planning</li>
                    <li>Tax preparation</li>
                    <li>Retirement planning</li>
                    <li>Benefits optimization</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Always negotiate based on total compensation, not just base salary</li>
                <li>• Consider the value of benefits - they can add 20-40% to your total compensation</li>
                <li>• Use this calculator to compare job offers in different states with different tax rates</li>
                <li>• Remember that bonuses and overtime are typically taxed at higher rates</li>
                <li>• Plan your withholding to avoid large tax bills or refunds at year-end</li>
                <li>• Factor in cost of living differences when comparing salaries across locations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Calculators */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Back to all calculators"
            aria-label="Back to all calculators"
          >
            <Calculator className="w-5 h-5" />
            Back to All Calculators
          </a>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculation={{
            expression: `$${breakdown.grossSalary.toLocaleString()} gross salary`,
            result: `$${breakdown.netSalary.toLocaleString()} net salary`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}
