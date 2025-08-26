'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Clock } from 'lucide-react'

export default function PaybackPeriodCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('')
  const [annualCashFlow, setAnnualCashFlow] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculatePaybackPeriod = useCallback(() => {
    const investment = parseFloat(initialInvestment) || 0
    const cashFlow = parseFloat(annualCashFlow) || 0
    
    if (investment === 0 || cashFlow === 0) return { 
      paybackPeriod: 0, 
      monthlyPayback: 0,
      recommendations: [],
      details: { investment: 0, cashFlow: 0 }
    }

    const paybackPeriod = investment / cashFlow
    const monthlyPayback = investment / (cashFlow / 12)

    const recommendations = []
    recommendations.push(`Initial investment: $${investment.toLocaleString()}`)
    recommendations.push(`Annual cash flow: $${cashFlow.toLocaleString()}`)
    recommendations.push(`Payback period: ${paybackPeriod.toFixed(2)} years`)
    recommendations.push(`Payback period: ${monthlyPayback.toFixed(1)} months`)

    if (paybackPeriod < 2) recommendations.push('Very fast payback - excellent investment')
    else if (paybackPeriod < 5) recommendations.push('Fast payback - good investment')
    else if (paybackPeriod < 10) recommendations.push('Moderate payback - acceptable investment')
    else if (paybackPeriod < 20) recommendations.push('Slow payback - consider carefully')
    else recommendations.push('Very slow payback - not recommended')

    const details = { investment, cashFlow }

    return { paybackPeriod, monthlyPayback, recommendations, details }
  }, [initialInvestment, annualCashFlow])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setInitialInvestment('')
    setAnnualCashFlow('')
    setShowResults(false)
  }

  const result = showResults ? calculatePaybackPeriod() : { paybackPeriod: 0, monthlyPayback: 0, recommendations: [], details: { investment: 0, cashFlow: 0 } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Payback Period Calculator</h2>
        </div>
        <p className="text-rose-100 mt-1">Calculate investment payback period</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment ($)</label>
              <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Enter investment" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Cash Flow ($)</label>
              <input type="number" value={annualCashFlow} onChange={(e) => setAnnualCashFlow(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Enter cash flow" step="100" />
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-2">Payback Period</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600 mb-2">{result.paybackPeriod?.toFixed(2)} years</div>
                <div className="text-rose-700">Time to recover investment</div>
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-3">Investment Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-rose-700">Initial Investment:</span><span className="font-semibold text-rose-800">${result.details.investment?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-rose-700">Annual Cash Flow:</span><span className="font-semibold text-rose-800">${result.details.cashFlow?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-rose-700">Payback Period:</span><span className="font-semibold text-rose-800">{result.paybackPeriod?.toFixed(2)} years</span></div>
                <div className="flex justify-between"><span className="text-rose-700">Payback Period:</span><span className="font-semibold text-rose-800">{result.monthlyPayback?.toFixed(1)} months</span></div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <h3 className="text-lg font-semibold text-rose-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-rose-600 mr-2">•</span>
                      <span className="text-rose-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Payback Period Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our payback period calculator helps you determine how long it will take to recover your initial investment 
              through annual cash flows. This essential metric is used by investors, business owners, and financial 
              analysts to evaluate investment opportunities and assess the risk and liquidity of various projects.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Payback Period:</strong> Time required to recover initial investment</li>
              <li><strong>Annual Recovery Rate:</strong> How quickly investment generates returns</li>
              <li><strong>Investment Analysis:</strong> Risk and liquidity assessment</li>
              <li><strong>Cash Flow Evaluation:</strong> Understanding income generation</li>
              <li><strong>Comparison Metrics:</strong> Benchmark against other investments</li>
              <li><strong>Risk Assessment:</strong> Understanding investment timeline</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Payback Period</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">What is Payback Period?</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Time to recover initial investment</li>
                  <li>Simple and intuitive metric</li>
                  <li>Measures investment liquidity</li>
                  <li>Lower risk indicator</li>
                  <li>Easy to calculate and understand</li>
                  <li>Common in business decisions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Payback Period Categories</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Very Fast: &lt; 2 years</li>
                  <li>Fast: 2-5 years</li>
                  <li>Moderate: 5-10 years</li>
                  <li>Slow: 10-20 years</li>
                  <li>Very Slow: &gt; 20 years</li>
                  <li>Risk increases with longer periods</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                <h5 className="font-semibold text-rose-800 mb-1">Payback Period</h5>
                <p className="text-rose-700 text-sm">Years to recover investment</p>
              </div>
              <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-1">Monthly Breakdown</h5>
                <p className="text-pink-700 text-sm">Months to recover investment</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Investment Analysis</h5>
                <p className="text-green-700 text-sm">Risk and return assessment</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your initial investment amount and expected annual cash flow. The calculator will compute the payback 
              period in both years and months, providing an analysis of your investment's risk profile.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Business Investments:</strong> Equipment purchases and facility expansions</li>
              <li><strong>Real Estate:</strong> Property investments and rental income analysis</li>
              <li><strong>Technology Projects:</strong> Software development and system upgrades</li>
              <li><strong>Manufacturing:</strong> Production line improvements and automation</li>
              <li><strong>Energy Projects:</strong> Solar panels and energy efficiency upgrades</li>
              <li><strong>Marketing Campaigns:</strong> Advertising and promotional investments</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Payback Period vs. Other Metrics</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Payback Period Advantages:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Simple to calculate</li>
                    <li>Easy to understand</li>
                    <li>Measures liquidity risk</li>
                    <li>Good for small projects</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Payback Period Limitations:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Ignores time value of money</li>
                    <li>Doesn't consider total returns</li>
                    <li>May favor short-term projects</li>
                    <li>Limited long-term perspective</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Investment Decision Framework</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Risk Tolerance:</strong> Shorter payback periods indicate lower risk</li>
              <li><strong>Liquidity Needs:</strong> Consider how quickly you need returns</li>
              <li><strong>Market Conditions:</strong> Economic factors affect cash flow projections</li>
              <li><strong>Competition Analysis:</strong> Compare with industry benchmarks</li>
              <li><strong>Alternative Investments:</strong> Evaluate other opportunities</li>
              <li><strong>Long-term Strategy:</strong> Consider overall investment portfolio</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Payback Period</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Initial Investment:</strong> Larger investments require longer recovery</li>
              <li><strong>Cash Flow Generation:</strong> Higher income speeds up recovery</li>
              <li><strong>Market Conditions:</strong> Economic factors impact revenue</li>
              <li><strong>Operating Costs:</strong> Expenses reduce net cash flow</li>
              <li><strong>Competition:</strong> Market dynamics affect pricing</li>
              <li><strong>Technology Changes:</strong> Innovation may shorten useful life</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Best Practices</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Conservative Estimates:</strong> Use realistic cash flow projections</li>
              <li><strong>Scenario Analysis:</strong> Consider best, worst, and likely cases</li>
              <li><strong>Regular Review:</strong> Monitor actual vs. projected performance</li>
              <li><strong>Risk Assessment:</strong> Evaluate factors that could extend payback</li>
              <li><strong>Exit Strategy:</strong> Plan for early exit if needed</li>
              <li><strong>Diversification:</strong> Don't rely on single investment</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-rose-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                While payback period is a useful metric for assessing investment risk and liquidity, it should be used 
                alongside other financial metrics like IRR, NPV, and ROI for a comprehensive investment analysis. 
                Shorter payback periods generally indicate lower risk, but don't forget to consider the total return 
                potential and long-term value of your investment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
