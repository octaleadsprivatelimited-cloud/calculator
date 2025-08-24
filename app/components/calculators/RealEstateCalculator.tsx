'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Home } from 'lucide-react'

export default function RealEstateCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [propertyTax, setPropertyTax] = useState('')
  const [insurance, setInsurance] = useState('')
  const [hoa, setHoa] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateRealEstate = useCallback(() => {
    const price = parseFloat(purchasePrice) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 30
    const tax = parseFloat(propertyTax) || 0
    const ins = parseFloat(insurance) || 0
    const hoaFee = parseFloat(hoa) || 0
    
    if (price === 0 || down === 0 || rate === 0) return { 
      monthlyPayment: 0, 
      breakdown: {
        principal: 0,
        tax: 0,
        insurance: 0,
        hoa: 0,
        total: 0
      },
      totalCost: 0,
      recommendations: [],
      details: {
        purchasePrice: 0,
        downPayment: 0,
        loanAmount: 0,
        interestRate: 0,
        loanTerm: 0,
        monthlyTax: 0,
        monthlyInsurance: 0,
        hoaFee: 0,
        equityBuildUp: 0
      }
    }

    const loanAmount = price - down
    const monthlyRate = rate / 100 / 12
    const termMonths = term * 12

    // Calculate mortgage payment
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)

    // Calculate monthly costs
    const monthlyTax = tax / 12
    const monthlyInsurance = ins / 12
    const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance + hoaFee

    // Calculate total costs
    const totalInterest = (monthlyPayment * termMonths) - loanAmount
    const totalCost = totalMonthlyPayment * termMonths + down

    // Calculate equity build-up
    const equityBuildUp = down + (price * 0.02 * term) // Approximate appreciation

    const breakdown = {
      principal: monthlyPayment,
      tax: monthlyTax,
      insurance: monthlyInsurance,
      hoa: hoaFee,
      total: totalMonthlyPayment
    }

    // Generate recommendations
    const recommendations = []
    const downPaymentPercent = (down / price) * 100
    
    if (downPaymentPercent < 20) {
      recommendations.push('Down payment below 20% - PMI required')
      recommendations.push('Consider increasing down payment to avoid PMI')
    } else {
      recommendations.push('Down payment 20%+ - no PMI required')
      recommendations.push('Good equity position')
    }

    if (totalMonthlyPayment > price * 0.01) {
      recommendations.push('Monthly payment is high relative to property value')
      recommendations.push('Ensure sufficient income to cover payments')
    } else {
      recommendations.push('Monthly payment is reasonable')
    }

    recommendations.push(`Total monthly payment: $${totalMonthlyPayment.toFixed(2)}`)
    recommendations.push(`Total interest paid: $${totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0})}`)

    const details = {
      purchasePrice: price,
      downPayment: down,
      loanAmount: loanAmount,
      interestRate: rate,
      loanTerm: term,
      monthlyTax: tax,
      monthlyInsurance: ins,
      hoaFee: hoaFee,
      equityBuildUp: equityBuildUp
    }

    return { 
      monthlyPayment: totalMonthlyPayment, 
      breakdown, 
      totalCost, 
      recommendations, 
      details 
    }
  }, [purchasePrice, downPayment, interestRate, loanTerm, propertyTax, insurance, hoa])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setPurchasePrice('')
    setDownPayment('')
    setInterestRate('')
    setLoanTerm('30')
    setPropertyTax('')
    setInsurance('')
    setHoa('')
    setShowResults(false)
  }

  const result = showResults ? calculateRealEstate() : { 
    monthlyPayment: 0, 
    breakdown: {
      principal: 0,
      tax: 0,
      insurance: 0,
      hoa: 0,
      total: 0
    }, 
    totalCost: 0,
    recommendations: [],
    details: {
      purchasePrice: 0,
      downPayment: 0,
      loanAmount: 0,
      interestRate: 0,
      loanTerm: 0,
      monthlyTax: 0,
      monthlyInsurance: 0,
      hoaFee: 0,
      equityBuildUp: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <Home className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Real Estate Calculator</h2>
        </div>
        <p className="text-emerald-100 mt-1">Calculate total homeownership costs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Price ($)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter price"
                step="1000"
                aria-label="Purchase price in dollars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down Payment ($)
              </label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter down payment"
                step="1000"
                aria-label="Down payment in dollars"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter rate"
                step="0.1"
                aria-label="Annual interest rate percentage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term (years)
              </label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Select loan term"
              >
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Property Tax ($)
              </label>
              <input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter tax"
                step="100"
                aria-label="Annual property tax in dollars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Insurance ($)
              </label>
              <input
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter insurance"
                step="100"
                aria-label="Annual insurance in dollars"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly HOA ($)
              </label>
              <input
                type="number"
                value={hoa}
                onChange={(e) => setHoa(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter HOA"
                step="50"
                aria-label="Monthly HOA fee in dollars"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Calculator className="h-5 w-5 inline mr-2" />
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <RotateCcw className="h-5 w-5 inline mr-2" />
              Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Total Monthly Payment</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  ${result.monthlyPayment.toFixed(2)}
                </div>
                <div className="text-emerald-700">
                  Including all costs
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Monthly Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Principal & Interest:</span>
                  <span className="font-semibold text-emerald-800">${result.breakdown.principal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Property Tax:</span>
                  <span className="font-semibold text-emerald-800">${result.breakdown.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Insurance:</span>
                  <span className="font-semibold text-emerald-800">${result.breakdown.insurance?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">HOA:</span>
                  <span className="font-semibold text-emerald-800">${result.breakdown.hoa?.toFixed(2)}</span>
                </div>
                <div className="border-t border-emerald-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-emerald-700">Total:</span>
                    <span className="text-emerald-800">${result.breakdown.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Property Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Purchase Price:</span>
                  <span className="font-semibold text-emerald-800">${result.details.purchasePrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Down Payment:</span>
                  <span className="font-semibold text-emerald-800">${result.details.downPayment?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Loan Amount:</span>
                  <span className="font-semibold text-emerald-800">${result.details.loanAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Interest Rate:</span>
                  <span className="font-semibold text-emerald-800">{result.details.interestRate?.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Loan Term:</span>
                  <span className="font-semibold text-emerald-800">{result.details.loanTerm} years</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">Recommendations</h3>
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
