'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, TrendingUp } from 'lucide-react'

export default function IRRCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('')
  const [cashFlows, setCashFlows] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateIRR = useCallback(() => {
    const initial = parseFloat(initialInvestment) || 0
    const flows = cashFlows.split(',').map(f => parseFloat(f.trim()) || 0).filter(f => f !== 0)
    
    if (initial === 0 || flows.length === 0) return { 
      irr: 0, 
      npv: 0,
      recommendations: [],
      details: { initial: 0, flows: [] }
    }

    // Simple IRR approximation using trial and error
    let irr = 0.1 // Start with 10%
    let npv = 0
    let iterations = 0
    const maxIterations = 1000
    const tolerance = 0.0001

    while (iterations < maxIterations) {
      npv = -initial
      for (let i = 0; i < flows.length; i++) {
        npv += flows[i] / Math.pow(1 + irr, i + 1)
      }
      
      if (Math.abs(npv) < tolerance) break
      
      // Adjust IRR based on NPV
      if (npv > 0) {
        irr += 0.001
      } else {
        irr -= 0.001
      }
      
      iterations++
    }

    const recommendations = []
    recommendations.push(`Initial investment: $${initial.toLocaleString()}`)
    recommendations.push(`Cash flows: ${flows.map(f => `$${f.toLocaleString()}`).join(', ')}`)
    recommendations.push(`IRR: ${(irr * 100).toFixed(2)}%`)
    recommendations.push(`NPV: $${npv.toFixed(2)}`)

    if (irr > 0.15) recommendations.push('Excellent IRR - highly profitable investment')
    else if (irr > 0.10) recommendations.push('Good IRR - solid investment')
    else if (irr > 0.05) recommendations.push('Moderate IRR - acceptable returns')
    else if (irr > 0) recommendations.push('Low IRR - minimal returns')
    else recommendations.push('Negative IRR - not recommended')

    const details = { initial, flows }

    return { irr: irr * 100, npv, recommendations, details }
  }, [initialInvestment, cashFlows])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setInitialInvestment('')
    setCashFlows('')
    setShowResults(false)
  }

  const result = showResults ? calculateIRR() : { irr: 0, npv: 0, recommendations: [], details: { initial: 0, flows: [] } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">IRR Calculator</h2>
        </div>
        <p className="text-violet-100 mt-1">Calculate Internal Rate of Return</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment ($)</label>
            <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter investment amount" step="1000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cash Flows ($)</label>
            <input type="text" value={cashFlows} onChange={(e) => setCashFlows(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Enter cash flows separated by commas" />
            <p className="text-sm text-gray-500 mt-1">Enter positive cash flows separated by commas (e.g., 1000, 1500, 2000)</p>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="text-lg font-semibold text-violet-800 mb-2">Internal Rate of Return</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 mb-2">{result.irr?.toFixed(2)}%</div>
                <div className="text-violet-700">Annual return rate</div>
              </div>
            </div>

            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="text-lg font-semibold text-violet-800 mb-3">Investment Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-violet-700">Initial Investment:</span><span className="font-semibold text-violet-800">${result.details.initial?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-violet-700">Cash Flows:</span><span className="font-semibold text-violet-800">{result.details.flows?.map(f => `$${f.toLocaleString()}`).join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-violet-700">IRR:</span><span className="font-semibold text-violet-800">{result.irr?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-violet-700">NPV:</span><span className="font-semibold text-violet-800">${result.npv?.toFixed(2)}</span></div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                <h3 className="text-lg font-semibold text-violet-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-violet-600 mr-2">•</span>
                      <span className="text-violet-700">{rec}</span>
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
