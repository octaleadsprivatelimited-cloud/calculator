'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, RefreshCw } from 'lucide-react'

export default function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState('')
  const [currentRate, setCurrentRate] = useState('')
  const [newRate, setNewRate] = useState('')
  const [remainingTerm, setRemainingTerm] = useState('')
  const [termType, setTermType] = useState('years')
  const [closingCosts, setClosingCosts] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateRefinance = useCallback(() => {
    const balance = parseFloat(currentBalance) || 0
    const oldRate = parseFloat(currentRate) || 0
    const newRateVal = parseFloat(newRate) || 0
    const term = parseFloat(remainingTerm) || 0
    const costs = parseFloat(closingCosts) || 0
    
    if (balance === 0 || oldRate === 0 || newRateVal === 0 || term === 0) return { 
      currentPayment: 0, 
      newPayment: 0,
      monthlySavings: 0,
      breakEvenMonths: 0,
      totalSavings: 0,
      recommendations: [],
      details: { balance: 0, oldRate: 0, newRate: 0, term: 0, termType: '', costs: 0 }
    }

    const termMonths = termType === 'years' ? term * 12 : term
    const oldMonthlyRate = oldRate / 100 / 12
    const newMonthlyRate = newRateVal / 100 / 12
    
    const currentPayment = balance * (oldMonthlyRate * Math.pow(1 + oldMonthlyRate, termMonths)) / 
                          (Math.pow(1 + oldMonthlyRate, termMonths) - 1)
    
    const newPayment = balance * (newMonthlyRate * Math.pow(1 + newMonthlyRate, termMonths)) / 
                      (Math.pow(1 + newMonthlyRate, termMonths) - 1)
    
    const monthlySavings = currentPayment - newPayment
    const breakEvenMonths = costs / monthlySavings
    const totalSavings = monthlySavings * termMonths - costs

    const recommendations = []
    recommendations.push(`Current balance: $${balance.toLocaleString()}`)
    recommendations.push(`Current rate: ${oldRate.toFixed(2)}%`)
    recommendations.push(`New rate: ${newRateVal.toFixed(2)}%`)
    recommendations.push(`Remaining term: ${term} ${termType}`)
    recommendations.push(`Current payment: $${currentPayment.toFixed(2)}`)
    recommendations.push(`New payment: $${newPayment.toFixed(2)}`)
    recommendations.push(`Monthly savings: $${monthlySavings.toFixed(2)}`)
    recommendations.push(`Closing costs: $${costs.toFixed(2)}`)
    recommendations.push(`Break-even: ${breakEvenMonths.toFixed(1)} months`)
    recommendations.push(`Total savings: $${totalSavings.toFixed(2)}`)

    if (newRateVal >= oldRate) recommendations.push('New rate is higher - refinancing not recommended')
    else if (breakEvenMonths > 24) recommendations.push('Long break-even period - consider carefully')
    else if (breakEvenMonths > 12) recommendations.push('Moderate break-even period - good refinance')
    else recommendations.push('Quick break-even - excellent refinance opportunity')

    const details = { balance, oldRate, newRate: newRateVal, term, termType, costs }

    return { currentPayment, newPayment, monthlySavings, breakEvenMonths, totalSavings, recommendations, details }
  }, [currentBalance, currentRate, newRate, remainingTerm, termType, closingCosts])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setCurrentBalance('')
    setCurrentRate('')
    setNewRate('')
    setRemainingTerm('')
    setTermType('years')
    setClosingCosts('')
    setShowResults(false)
  }

  const result = showResults ? calculateRefinance() : { currentPayment: 0, newPayment: 0, monthlySavings: 0, breakEvenMonths: 0, totalSavings: 0, recommendations: [], details: { balance: 0, oldRate: 0, newRate: 0, term: 0, termType: '', costs: 0 } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
        <div className="flex items-center">
          <RefreshCw className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Refinance Calculator</h2>
        </div>
        <p className="text-amber-100 mt-1">Calculate refinancing savings and break-even</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Balance ($)</label>
              <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter balance" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Rate (%)</label>
              <input type="number" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter rate" step="0.1" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Rate (%)</label>
              <input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter new rate" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remaining Term</label>
              <input type="number" value={remainingTerm} onChange={(e) => setRemainingTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter term" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term Type</label>
              <select value={termType} onChange={(e) => setTermType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" aria-label="Select term type">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Closing Costs ($)</label>
            <input type="number" value={closingCosts} onChange={(e) => setClosingCosts(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Enter closing costs" step="100" />
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Monthly Savings</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">${result.monthlySavings?.toFixed(2)}</div>
                <div className="text-amber-700">Monthly payment reduction</div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Refinance Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-amber-700">Current Payment:</span><span className="font-semibold text-amber-800">${result.currentPayment?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-amber-700">New Payment:</span><span className="font-semibold text-amber-800">${result.newPayment?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-amber-700">Monthly Savings:</span><span className="font-semibold text-amber-800">${result.monthlySavings?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-amber-700">Closing Costs:</span><span className="font-semibold text-amber-800">${result.details.costs?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-amber-700">Break-even:</span><span className="font-semibold text-amber-800">{result.breakEvenMonths?.toFixed(1)} months</span></div>
                <div className="border-t border-amber-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-amber-700">Total Savings:</span>
                    <span className="text-amber-800">${result.totalSavings?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">Summary</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span className="text-amber-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Refinance Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive refinance calculator helps you determine whether refinancing your mortgage makes financial 
              sense by calculating monthly savings, break-even time, and total savings over the loan term. Whether you're 
              looking to lower your interest rate, reduce monthly payments, or change loan terms, this tool provides 
              essential analysis to make informed refinancing decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Savings:</strong> Reduction in monthly mortgage payment</li>
              <li><strong>Break-even Time:</strong> Months to recover closing costs</li>
              <li><strong>Total Savings:</strong> Cumulative savings over the loan term</li>
              <li><strong>Payment Comparison:</strong> Current vs. new payment analysis</li>
              <li><strong>Cost Analysis:</strong> Closing costs and fees breakdown</li>
              <li><strong>Refinance Viability:</strong> Whether refinancing makes sense</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Refinancing Scenarios</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Rate Reduction</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Lower interest rates</li>
                  <li>Reduced monthly payments</li>
                  <li>Lower total interest costs</li>
                  <li>Faster equity building</li>
                  <li>Most common refinance reason</li>
                  <li>Requires rate drop of 0.5%+</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Term Changes</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Shorter loan terms</li>
                  <li>Faster debt payoff</li>
                  <li>Higher monthly payments</li>
                  <li>Lower total interest</li>
                  <li>Build equity faster</li>
                  <li>Good for higher income</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <h5 className="font-semibold text-amber-800 mb-1">Monthly Savings</h5>
                <p className="text-amber-700 text-sm">Reduced payment amount</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Break-even</h5>
                <p className="text-orange-700 text-sm">Time to recover costs</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Total Savings</h5>
                <p className="text-green-700 text-sm">Lifetime savings amount</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your current loan balance, current interest rate, new interest rate, remaining loan term, and 
              estimated closing costs. The calculator will compute your monthly savings, break-even time, and total 
              savings to help determine if refinancing is beneficial.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Consider Refinancing</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Interest Rate Drop:</strong> Current rates are 0.5-1% lower than your rate</li>
              <li><strong>Improved Credit:</strong> Better credit score since original loan</li>
              <li><strong>Market Changes:</strong> Significant drop in market rates</li>
              <li><strong>Loan Type Change:</strong> Switch from ARM to fixed-rate</li>
              <li><strong>Cash-out Refinance:</strong> Access home equity for other purposes</li>
              <li><strong>Remove PMI:</strong> Eliminate private mortgage insurance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Refinancing Costs</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Typical Closing Costs:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Application fees: $200-500</li>
                    <li>Appraisal: $300-500</li>
                    <li>Title search: $200-400</li>
                    <li>Attorney fees: $500-1,000</li>
                    <li>Recording fees: $50-200</li>
                    <li>Total: 2-5% of loan amount</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Cost Reduction Strategies:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>No-closing-cost loans</li>
                    <li>Lender credits</li>
                    <li>Negotiate fees</li>
                    <li>Compare multiple lenders</li>
                    <li>Consider online lenders</li>
                    <li>Bundle with other services</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Break-even Analysis</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Break-even Point:</strong> When monthly savings equal closing costs</li>
              <li><strong>Short-term Ownership:</strong> May not benefit from refinancing</li>
              <li><strong>Long-term Ownership:</strong> More likely to benefit from refinancing</li>
              <li><strong>Rate Threshold:</strong> Typically need 0.5-1% rate reduction</li>
              <li><strong>Cost Recovery:</strong> Consider how long you'll keep the property</li>
              <li><strong>Alternative Uses:</strong> Compare with other investment opportunities</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Refinancing Types</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Rate and Term:</strong> Lower rate, same or different term</li>
              <li><strong>Cash-out Refinance:</strong> Borrow against home equity</li>
              <li><strong>Streamline Refinance:</strong> Simplified process for existing loans</li>
              <li><strong>FHA Streamline:</strong> Special program for FHA loans</li>
              <li><strong>VA IRRRL:</strong> Interest Rate Reduction Refinance Loan</li>
              <li><strong>Conventional Refinance:</strong> Standard refinancing process</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors to Consider</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Credit Score:</strong> Better credit means better rates</li>
              <li><strong>Loan-to-Value Ratio:</strong> Lower LTV means better terms</li>
              <li><strong>Employment Stability:</strong> Stable income improves approval chances</li>
              <li><strong>Property Value:</strong> Appreciation affects refinancing options</li>
              <li><strong>Market Conditions:</strong> Interest rate environment matters</li>
              <li><strong>Lender Competition:</strong> Shop around for best rates</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Don't just focus on monthly payment reduction - consider the total cost and long-term benefits. A 
                refinance that saves $100 per month but costs $3,000 in closing costs takes 30 months to break even. 
                If you plan to move within 2-3 years, the refinance may not be worth it. Always calculate the 
                break-even point and consider your long-term plans before refinancing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
