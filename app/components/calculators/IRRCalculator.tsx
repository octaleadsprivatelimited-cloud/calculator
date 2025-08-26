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
                <div className="text-3xl font-bold text-violet-600 mb-2">{result.irr.toFixed(2)}%</div>
                <div className="text-violet-700">Annual return rate</div>
              </div>
            </div>

            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="text-lg font-semibold text-violet-800 mb-3">Investment Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-violet-700">Initial Investment:</span><span className="font-semibold text-violet-800">${result.details.initial.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-violet-700">Cash Flows:</span><span className="font-semibold text-violet-800">{result.details.flows.map(f => `$${f.toLocaleString()}`).join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-violet-700">IRR:</span><span className="font-semibold text-violet-800">{result.irr.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-violet-700">NPV:</span><span className="font-semibold text-violet-800">${result.npv.toFixed(2)}</span></div>
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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About IRR Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our advanced IRR (Internal Rate of Return) calculator helps you evaluate investment profitability by calculating 
              the annualized return rate that makes the net present value of all cash flows equal to zero. This essential 
              tool is used by investors, financial analysts, and business professionals to compare investment opportunities 
              and make informed financial decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Internal Rate of Return:</strong> Annualized return rate in percentage</li>
              <li><strong>Net Present Value (NPV):</strong> Present value of all cash flows</li>
              <li><strong>Investment Analysis:</strong> Comprehensive profitability assessment</li>
              <li><strong>Cash Flow Evaluation:</strong> Analysis of income and expenses over time</li>
              <li><strong>Return Comparison:</strong> Benchmark against other investment options</li>
              <li><strong>Risk Assessment:</strong> Understanding investment performance metrics</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding IRR</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">What is IRR?</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Annualized return rate</li>
                  <li>Makes NPV equal to zero</li>
                  <li>Accounts for time value of money</li>
                  <li>Measures investment efficiency</li>
                  <li>Standardized comparison metric</li>
                  <li>Used in capital budgeting</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">IRR Interpretation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>IRR &gt; Cost of Capital: Profitable</li>
                  <li>IRR = Cost of Capital: Break-even</li>
                  <li>IRR &lt; Cost of Capital: Unprofitable</li>
                  <li>Higher IRR = Better investment</li>
                  <li>Compare with hurdle rates</li>
                  <li>Consider risk factors</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-violet-50 p-3 rounded-lg border border-violet-200">
                <h5 className="font-semibold text-violet-800 mb-1">IRR Percentage</h5>
                <p className="text-violet-700 text-sm">Annual return rate</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">NPV Value</h5>
                <p className="text-purple-700 text-sm">Present value of cash flows</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Investment Analysis</h5>
                <p className="text-green-700 text-sm">Profitability assessment</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your initial investment amount and expected cash flows (positive values for income, separated by commas). 
              The calculator will compute the IRR and NPV, providing a comprehensive analysis of your investment's profitability.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Real Estate Investment:</strong> Evaluate property purchase and rental income</li>
              <li><strong>Business Projects:</strong> Assess new ventures and expansions</li>
              <li><strong>Equipment Purchases:</strong> Analyze machinery and technology investments</li>
              <li><strong>Stock Investments:</strong> Evaluate dividend-paying securities</li>
              <li><strong>Bond Analysis:</strong> Assess fixed-income investments</li>
              <li><strong>Capital Budgeting:</strong> Compare multiple investment options</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">IRR vs. Other Metrics</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>IRR Advantages:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Accounts for time value of money</li>
                    <li>Expressed as percentage</li>
                    <li>Easy to compare investments</li>
                    <li>Considers all cash flows</li>
                  </ul>
                </div>
                <div>
                  <p><strong>IRR Limitations:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>May have multiple solutions</li>
                    <li>Assumes reinvestment at IRR</li>
                    <li>Doesn't show absolute returns</li>
                    <li>Can be misleading for non-standard flows</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">IRR Benchmarks</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Excellent IRR:</strong> 15%+ - Highly profitable investments</li>
              <li><strong>Good IRR:</strong> 10-15% - Solid investment returns</li>
              <li><strong>Moderate IRR:</strong> 5-10% - Acceptable returns</li>
              <li><strong>Low IRR:</strong> 0-5% - Minimal returns</li>
              <li><strong>Negative IRR:</strong> Below 0% - Loss-making investments</li>
              <li><strong>Hurdle Rate:</strong> Minimum acceptable IRR for your risk profile</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Investment Decision Framework</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Compare IRR:</strong> Higher IRR generally indicates better investment</li>
              <li><strong>Consider Risk:</strong> Higher returns often come with higher risk</li>
              <li><strong>Assess Liquidity:</strong> Consider how quickly you can exit the investment</li>
              <li><strong>Evaluate Cash Flows:</strong> Ensure realistic income projections</li>
              <li><strong>Review Assumptions:</strong> Verify all input parameters are accurate</li>
              <li><strong>Diversify Portfolio:</strong> Don't put all funds in one investment type</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-violet-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                While IRR is a powerful metric, it should not be used in isolation. Always consider other factors such as 
                risk, liquidity, market conditions, and your overall investment strategy. A high IRR investment with high 
                risk may not be suitable for conservative investors, while a lower IRR investment with stable returns 
                might be perfect for long-term wealth building.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
