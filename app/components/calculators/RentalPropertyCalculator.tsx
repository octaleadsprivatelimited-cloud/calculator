'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Home } from 'lucide-react'

export default function RentalPropertyCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [propertyTax, setPropertyTax] = useState('')
  const [insurance, setInsurance] = useState('')
  const [maintenance, setMaintenance] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateRentalProperty = useCallback(() => {
    const price = parseFloat(purchasePrice) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 30
    const rent = parseFloat(monthlyRent) || 0
    const tax = parseFloat(propertyTax) || 0
    const ins = parseFloat(insurance) || 0
    const maint = parseFloat(maintenance) || 0
    
    if (price === 0 || rate === 0 || rent === 0) return { 
      monthlyPayment: 0, 
      monthlyExpenses: 0,
      monthlyCashFlow: 0,
      annualROI: 0,
      capRate: 0,
      recommendations: [],
      details: { price: 0, down: 0, rate: 0, term: 0, rent: 0, tax: 0, insurance: 0, maintenance: 0 }
    }

    const loanAmount = price - down
    const monthlyRate = rate / 100 / 12
    const termMonths = term * 12
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
    
    const monthlyExpenses = monthlyPayment + (tax / 12) + (ins / 12) + maint
    const monthlyCashFlow = rent - monthlyExpenses
    const annualCashFlow = monthlyCashFlow * 12
    const annualROI = (annualCashFlow / down) * 100
    const capRate = (annualCashFlow / price) * 100

    const recommendations = []
    recommendations.push(`Purchase price: $${price.toLocaleString()}`)
    recommendations.push(`Down payment: $${down.toLocaleString()}`)
    recommendations.push(`Loan amount: $${loanAmount.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Loan term: ${term} years`)
    recommendations.push(`Monthly rent: $${rent.toFixed(2)}`)
    recommendations.push(`Monthly mortgage: $${monthlyPayment.toFixed(2)}`)
    recommendations.push(`Monthly expenses: $${monthlyExpenses.toFixed(2)}`)
    recommendations.push(`Monthly cash flow: $${monthlyCashFlow.toFixed(2)}`)
    recommendations.push(`Annual ROI: ${annualROI.toFixed(2)}%`)
    recommendations.push(`Cap rate: ${capRate.toFixed(2)}%`)

    if (monthlyCashFlow > 0) {
      if (annualROI > 10) recommendations.push('Excellent ROI - highly profitable investment')
      else if (annualROI > 6) recommendations.push('Good ROI - solid investment')
      else if (annualROI > 3) recommendations.push('Moderate ROI - acceptable returns')
      else recommendations.push('Low ROI - consider alternatives')
    } else {
      recommendations.push('Negative cash flow - not recommended')
    }

    if (capRate > 8) recommendations.push('High cap rate - excellent property value')
    else if (capRate > 5) recommendations.push('Good cap rate - solid property')
    else recommendations.push('Low cap rate - overpriced property')

    const details = { price, down, rate, term, rent, tax, insurance: ins, maintenance: maint }

    return { monthlyPayment, monthlyExpenses, monthlyCashFlow, annualROI, capRate, recommendations, details }
  }, [purchasePrice, downPayment, interestRate, loanTerm, monthlyRent, propertyTax, insurance, maintenance])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setPurchasePrice('')
    setDownPayment('')
    setInterestRate('')
    setLoanTerm('30')
    setMonthlyRent('')
    setPropertyTax('')
    setInsurance('')
    setMaintenance('')
    setShowResults(false)
  }

  const result = showResults ? calculateRentalProperty() : { monthlyPayment: 0, monthlyExpenses: 0, monthlyCashFlow: 0, annualROI: 0, capRate: 0, recommendations: [], details: { price: 0, down: 0, rate: 0, term: 0, rent: 0, tax: 0, insurance: 0, maintenance: 0 } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <Home className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Rental Property Calculator</h2>
        </div>
        <p className="text-emerald-100 mt-1">Calculate rental property returns and cash flow</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price ($)</label>
              <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter price" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter down payment" step="1000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter rate" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (Years)</label>
              <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Select loan term">
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent ($)</label>
              <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter rent" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Tax ($/year)</label>
              <input type="number" value={propertyTax} onChange={(e) => setPropertyTax(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter tax" step="100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insurance ($/year)</label>
              <input type="number" value={insurance} onChange={(e) => setInsurance(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter insurance" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance ($/month)</label>
              <input type="number" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Enter maintenance" step="50" />
            </div>
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
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Monthly Cash Flow</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">${result.monthlyCashFlow?.toFixed(2)}</div>
                <div className="text-emerald-700">Monthly profit/loss</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Investment Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-emerald-700">Monthly Rent:</span><span className="font-semibold text-emerald-800">${result.details.rent?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Monthly Expenses:</span><span className="font-semibold text-emerald-800">${result.monthlyExpenses?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Monthly Cash Flow:</span><span className="font-semibold text-emerald-800">${result.monthlyCashFlow?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Annual ROI:</span><span className="font-semibold text-emerald-800">{result.annualROI?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-emerald-700">Cap Rate:</span><span className="font-semibold text-emerald-800">{result.capRate?.toFixed(2)}%</span></div>
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
      </div>
    </div>
  )
}
