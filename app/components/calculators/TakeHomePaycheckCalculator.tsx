'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, DollarSign } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function TakeHomePaycheckCalculator() {
  const [grossPay, setGrossPay] = useState('')
  const [federalTax, setFederalTax] = useState('')
  const [stateTax, setStateTax] = useState('')
  const [socialSecurity, setSocialSecurity] = useState('')
  const [medicare, setMedicare] = useState('')
  const [otherDeductions, setOtherDeductions] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateTakeHome = useCallback(() => {
    const gross = parseFloat(grossPay) || 0
    const federal = parseFloat(federalTax) || 0
    const state = parseFloat(stateTax) || 0
    const ss = parseFloat(socialSecurity) || 0
    const medicareTax = parseFloat(medicare) || 0
    const other = parseFloat(otherDeductions) || 0
    
    if (gross === 0) return { 
      takeHome: 0, 
      totalDeductions: 0,
      netPercentage: 0,
      recommendations: [],
      breakdown: {
        gross: 0,
        federal: 0,
        state: 0,
        socialSecurity: 0,
        medicare: 0,
        other: 0,
        totalDeductions: 0,
        takeHome: 0
      }
    }

    const totalDeductions = federal + state + ss + medicareTax + other
    const takeHome = gross - totalDeductions
    const netPercentage = (takeHome / gross) * 100

    const breakdown = {
      gross: gross,
      federal: federal,
      state: state,
      socialSecurity: ss,
      medicare: medicareTax,
      other: other,
      totalDeductions: totalDeductions,
      takeHome: takeHome
    }

    const recommendations = []
    recommendations.push(`Gross pay: ${gross.toFixed(2)}`)
    recommendations.push(`Total deductions: ${totalDeductions.toFixed(2)}`)
    recommendations.push(`Take-home pay: ${takeHome.toFixed(2)}`)
    recommendations.push(`Net percentage: ${netPercentage.toFixed(1)}%`)

    if (netPercentage < 60) {
      recommendations.push('High tax burden - consider tax optimization strategies')
    } else if (netPercentage < 75) {
      recommendations.push('Moderate tax burden - typical for most employees')
    } else {
      recommendations.push('Low tax burden - good take-home percentage')
    }

    return { takeHome, totalDeductions, netPercentage, recommendations, breakdown }
  }, [grossPay, federalTax, stateTax, socialSecurity, medicare, otherDeductions])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setGrossPay('')
    setFederalTax('')
    setStateTax('')
    setSocialSecurity('')
    setMedicare('')
    setOtherDeductions('')
    setShowResults(false)
  }

  const result = showResults ? calculateTakeHome() : { 
    takeHome: 0, 
    totalDeductions: 0,
    netPercentage: 0,
    recommendations: [],
    breakdown: {
      gross: 0,
      federal: 0,
      state: 0,
      socialSecurity: 0,
      medicare: 0,
      other: 0,
      totalDeductions: 0,
      takeHome: 0
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Take-Home Paycheck Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate your net take-home pay after deductions</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gross Pay</label>
            <input type="number" value={grossPay} onChange={(e) => setGrossPay(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter gross pay" step="0.01" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Federal Tax</label>
              <input type="number" value={federalTax} onChange={(e) => setFederalTax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter federal tax" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State Tax</label>
              <input type="number" value={stateTax} onChange={(e) => setStateTax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter state tax" step="0.01" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Security</label>
              <input type="number" value={socialSecurity} onChange={(e) => setSocialSecurity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter SS tax" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicare</label>
              <input type="number" value={medicare} onChange={(e) => setMedicare(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter Medicare" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other</label>
              <input type="number" value={otherDeductions} onChange={(e) => setOtherDeductions(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter other" step="0.01" />
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <ResultSharing
                title="Take-Home Paycheck Calculation Result"
                inputs={[
                  { label: "Gross Pay", value: `${result.breakdown.gross?.toFixed(2)}` },
                  { label: "Total Deductions", value: `${result.breakdown.totalDeductions?.toFixed(2)}` },
                  { label: "Calculation Type", value: "Paycheck Analysis" }
                ]}
                result={{ 
                  label: "Take-Home Pay", 
                  value: `${result.takeHome.toFixed(2)}`,
                  unit: ""
                }}
                calculatorName="Take-Home Paycheck Calculator"
                className="mb-0"
              />
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Take-Home Pay</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{result.takeHome.toFixed(2)}</div>
                <div className="text-green-700">{result.netPercentage.toFixed(1)}% of gross pay</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Paycheck Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-green-700">Gross Pay:</span><span className="font-semibold text-green-800">{result.breakdown.gross?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Federal Tax:</span><span className="font-semibold text-green-800">{result.breakdown.federal?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">State Tax:</span><span className="font-semibold text-green-800">{result.breakdown.state?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Social Security:</span><span className="font-semibold text-green-800">{result.breakdown.socialSecurity?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Medicare:</span><span className="font-semibold text-green-800">{result.breakdown.medicare?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Other:</span><span className="font-semibold text-green-800">{result.breakdown.other?.toFixed(2)}</span></div>
                <div className="border-t border-green-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-green-700">Total Deductions:</span>
                    <span className="text-green-800">{result.breakdown.totalDeductions?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Summary</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-green-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Take-Home Paycheck Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive take-home paycheck calculator helps you understand exactly how much money you'll 
              receive after all deductions. Whether you're negotiating a new salary, planning your budget, or 
              comparing job offers, this tool provides accurate net pay calculations and detailed breakdowns.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Net Take-Home Pay:</strong> Your actual paycheck amount after all deductions</li>
              <li><strong>Total Deductions:</strong> Sum of all taxes and other withholdings</li>
              <li><strong>Net Percentage:</strong> What percentage of gross pay you actually receive</li>
              <li><strong>Detailed Breakdown:</strong> Itemized list of all deductions</li>
              <li><strong>Tax Impact Analysis:</strong> How different factors affect your take-home pay</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Deductions Explained</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Federal Taxes</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Income tax based on your tax bracket</li>
                  <li>Withholding allowances and exemptions</li>
                  <li>Additional withholding for bonuses</li>
                  <li>Tax credits and deductions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">State & Local Taxes</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>State income tax rates vary by location</li>
                  <li>Local city or county taxes</li>
                  <li>State-specific deductions</li>
                  <li>Residency requirements</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Take-Home Pay</h5>
                <p className="text-green-700 text-sm">Your actual paycheck amount</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Net Percentage</h5>
                <p className="text-blue-700 text-sm">% of gross pay you keep</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Total Deductions</h5>
                <p className="text-purple-700 text-sm">Sum of all withholdings</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your gross pay and all applicable deductions. The calculator will compute your net take-home pay, 
              show the percentage of gross pay you actually receive, and provide a detailed breakdown of all deductions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Take-Home Pay</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Filing Status:</strong> Single, married, head of household</li>
              <li><strong>Dependents:</strong> Number of qualifying children</li>
              <li><strong>Additional Income:</strong> Bonuses, overtime, side jobs</li>
              <li><strong>Pre-tax Benefits:</strong> 401(k), health insurance, FSA</li>
              <li><strong>State Residency:</strong> Different tax rates by location</li>
              <li><strong>Pay Frequency:</strong> Weekly, bi-weekly, monthly</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Pre-Tax vs. Post-Tax Deductions</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Pre-Tax (Better):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>401(k) contributions</li>
                    <li>Health insurance premiums</li>
                    <li>Flexible spending accounts</li>
                    <li>Commuter benefits</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Post-Tax:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Roth 401(k) contributions</li>
                    <li>Life insurance premiums</li>
                    <li>Union dues</li>
                    <li>Garnishments</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Maximize your take-home pay by taking advantage of pre-tax benefits like 401(k) contributions and 
                flexible spending accounts. These reduce your taxable income, potentially putting you in a lower 
                tax bracket and increasing your net pay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
