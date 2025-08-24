'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, DollarSign } from 'lucide-react'

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
      breakdown: {}
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
    recommendations.push(`Gross pay: $${gross.toFixed(2)}`)
    recommendations.push(`Total deductions: $${totalDeductions.toFixed(2)}`)
    recommendations.push(`Take-home pay: $${takeHome.toFixed(2)}`)
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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Gross Pay ($)</label>
            <input type="number" value={grossPay} onChange={(e) => setGrossPay(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter gross pay" step="0.01" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Federal Tax ($)</label>
              <input type="number" value={federalTax} onChange={(e) => setFederalTax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter federal tax" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State Tax ($)</label>
              <input type="number" value={stateTax} onChange={(e) => setStateTax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter state tax" step="0.01" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Security ($)</label>
              <input type="number" value={socialSecurity} onChange={(e) => setSocialSecurity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter SS tax" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicare ($)</label>
              <input type="number" value={medicare} onChange={(e) => setMedicare(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter Medicare" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other ($)</label>
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
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Take-Home Pay</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">${result.takeHome.toFixed(2)}</div>
                <div className="text-green-700">{result.netPercentage.toFixed(1)}% of gross pay</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Paycheck Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-green-700">Gross Pay:</span><span className="font-semibold text-green-800">${result.breakdown.gross?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Federal Tax:</span><span className="font-semibold text-green-800">${result.breakdown.federal?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">State Tax:</span><span className="font-semibold text-green-800">${result.breakdown.state?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Social Security:</span><span className="font-semibold text-green-800">${result.breakdown.socialSecurity?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Medicare:</span><span className="font-semibold text-green-800">${result.breakdown.medicare?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Other:</span><span className="font-semibold text-green-800">${result.breakdown.other?.toFixed(2)}</span></div>
                <div className="border-t border-green-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-green-700">Total Deductions:</span>
                    <span className="text-green-800">${result.breakdown.totalDeductions?.toFixed(2)}</span>
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
      </div>
    </div>
  )
}
