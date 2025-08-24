'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, FileText } from 'lucide-react'

export default function LeaseCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [residualValue, setResidualValue] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [leaseTerm, setLeaseTerm] = useState('')
  const [termType, setTermType] = useState('months')
  const [showResults, setShowResults] = useState(false)

  const calculateLease = useCallback(() => {
    const price = parseFloat(vehiclePrice) || 0
    const down = parseFloat(downPayment) || 0
    const residual = parseFloat(residualValue) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(leaseTerm) || 0
    
    if (price === 0 || residual === 0 || rate === 0 || term === 0) return { 
      monthlyPayment: 0, 
      totalCost: 0,
      depreciation: 0,
      recommendations: [],
      details: { price: 0, down: 0, residual: 0, rate: 0, term: 0, termType: '' }
    }

    const termMonths = termType === 'years' ? term * 12 : term
    const monthlyRate = rate / 100 / 12
    
    const depreciation = price - residual
    const monthlyDepreciation = depreciation / termMonths
    const monthlyInterest = (price + residual) * monthlyRate
    const monthlyPayment = monthlyDepreciation + monthlyInterest
    
    const totalCost = (monthlyPayment * termMonths) + down
    const downPaymentPercent = (down / price) * 100

    const recommendations = []
    recommendations.push(`Vehicle price: $${price.toLocaleString()}`)
    recommendations.push(`Down payment: $${down.toLocaleString()} (${downPaymentPercent.toFixed(1)}%)`)
    recommendations.push(`Residual value: $${residual.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Lease term: ${term} ${termType}`)
    recommendations.push(`Monthly payment: $${monthlyPayment.toFixed(2)}`)
    recommendations.push(`Total cost: $${totalCost.toFixed(2)}`)

    if (rate > 8) recommendations.push('High interest rate - consider financing instead')
    else if (rate > 5) recommendations.push('Moderate rate - typical lease terms')
    else recommendations.push('Low rate - excellent lease deal')

    if (downPaymentPercent > 20) recommendations.push('High down payment - reduces monthly cost')
    else if (downPaymentPercent > 10) recommendations.push('Moderate down payment - balanced approach')
    else recommendations.push('Low down payment - higher monthly payments')

    const details = { price, down, residual, rate, term, termType }

    return { monthlyPayment, totalCost, depreciation, recommendations, details }
  }, [vehiclePrice, downPayment, residualValue, interestRate, leaseTerm, termType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setVehiclePrice('')
    setDownPayment('')
    setResidualValue('')
    setInterestRate('')
    setLeaseTerm('')
    setTermType('months')
    setShowResults(false)
  }

  const result = showResults ? calculateLease() : { monthlyPayment: 0, totalCost: 0, depreciation: 0, recommendations: [], details: { price: 0, down: 0, residual: 0, rate: 0, term: 0, termType: '' } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-500 to-gray-500 px-6 py-4">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Lease Calculator</h2>
        </div>
        <p className="text-slate-100 mt-1">Calculate vehicle lease payments and costs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Price ($)</label>
              <input type="number" value={vehiclePrice} onChange={(e) => setVehiclePrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="Enter price" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="Enter down payment" step="100" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Residual Value ($)</label>
              <input type="number" value={residualValue} onChange={(e) => setResidualValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="Enter residual" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="Enter rate" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lease Term</label>
              <input type="number" value={leaseTerm} onChange={(e) => setLeaseTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" placeholder="Enter term" step="1" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Term Type</label>
            <select value={termType} onChange={(e) => setTermType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" aria-label="Select term type">
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Monthly Payment</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600 mb-2">${result.monthlyPayment?.toFixed(2)}</div>
                <div className="text-slate-700">Monthly lease payment</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Lease Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-slate-700">Vehicle Price:</span><span className="font-semibold text-slate-800">${result.details.price?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-700">Down Payment:</span><span className="font-semibold text-slate-800">${result.details.down?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-700">Residual Value:</span><span className="font-semibold text-slate-800">${result.details.residual?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-700">Interest Rate:</span><span className="font-semibold text-slate-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-slate-700">Lease Term:</span><span className="font-semibold text-slate-800">{result.details.term} {result.details.termType}</span></div>
                <div className="flex justify-between"><span className="text-slate-700">Depreciation:</span><span className="font-semibold text-slate-800">${result.depreciation?.toLocaleString()}</span></div>
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700">Total Cost:</span>
                    <span className="text-slate-800">${result.totalCost?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span className="text-slate-700">{rec}</span>
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
