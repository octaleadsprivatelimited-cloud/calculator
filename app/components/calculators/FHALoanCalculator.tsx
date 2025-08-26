'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Home } from 'lucide-react'

export default function FHALoanCalculator() {
  const [homePrice, setHomePrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [showResults, setShowResults] = useState(false)

  const calculateFHA = useCallback(() => {
    const price = parseFloat(homePrice) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 30
    
    if (price === 0 || rate === 0) return { 
      loanAmount: 0, 
      monthlyPayment: 0,
      pmi: 0,
      totalPayment: 0,
      recommendations: [],
      details: { price: 0, down: 0, rate: 0, term: 0 }
    }

    const loanAmount = price - down
    const monthlyRate = rate / 100 / 12
    const termMonths = term * 12

    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
    
    const downPaymentPercent = (down / price) * 100
    const pmi = downPaymentPercent < 20 ? loanAmount * 0.0085 / 12 : 0
    const totalMonthly = monthlyPayment + pmi
    const totalPayment = totalMonthly * termMonths

    const recommendations = []
    recommendations.push(`Home price: $${price.toLocaleString()}`)
    recommendations.push(`Down payment: $${down.toLocaleString()} (${downPaymentPercent.toFixed(1)}%)`)
    recommendations.push(`Loan amount: $${loanAmount.toLocaleString()}`)
    recommendations.push(`Monthly payment: $${monthlyPayment.toFixed(2)}`)
    if (pmi > 0) recommendations.push(`PMI: $${pmi.toFixed(2)}/month`)
    recommendations.push(`Total monthly: $${totalMonthly.toFixed(2)}`)

    if (downPaymentPercent < 3.5) recommendations.push('Minimum 3.5% down required for FHA')
    else if (downPaymentPercent < 10) recommendations.push('Low down payment - PMI required')
    else if (downPaymentPercent < 20) recommendations.push('Moderate down payment - PMI applies')
    else recommendations.push('20%+ down payment - no PMI required')

    const details = { price, down, rate, term }

    return { loanAmount, monthlyPayment, pmi, totalPayment, recommendations, details }
  }, [homePrice, downPayment, interestRate, loanTerm])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setHomePrice('')
    setDownPayment('')
    setInterestRate('')
    setLoanTerm('30')
    setShowResults(false)
  }

  const result = showResults ? calculateFHA() : { loanAmount: 0, monthlyPayment: 0, pmi: 0, totalPayment: 0, recommendations: [], details: { price: 0, down: 0, rate: 0, term: 0 } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
        <div className="flex items-center">
          <Home className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">FHA Loan Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate FHA loan payments with PMI</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Price ($)</label>
              <input type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter price" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter down payment" step="1000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter rate" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
              <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Select loan term">
                <option value="15">15 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Monthly Payment</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">${(result.monthlyPayment + result.pmi).toFixed(2)}</div>
                <div className="text-blue-700">Including PMI if applicable</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Loan Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-blue-700">Principal & Interest:</span><span className="font-semibold text-blue-800">${result.monthlyPayment?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">PMI:</span><span className="font-semibold text-blue-800">${result.pmi?.toFixed(2)}</span></div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-700">Total Monthly:</span>
                    <span className="text-blue-800">${(result.monthlyPayment + result.pmi).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Summary</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About FHA Loan Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive FHA loan calculator helps first-time homebuyers and those with limited down payment 
              funds understand the costs of FHA-insured mortgages. This tool calculates monthly payments including 
              Private Mortgage Insurance (PMI), helping you determine if an FHA loan is the right choice for your 
              home purchase and budget.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Payment:</strong> Principal and interest payment</li>
              <li><strong>PMI Costs:</strong> Private Mortgage Insurance premiums</li>
              <li><strong>Total Monthly Payment:</strong> Complete monthly housing cost</li>
              <li><strong>Loan Amount:</strong> Amount financed after down payment</li>
              <li><strong>Down Payment Analysis:</strong> Impact on PMI and payments</li>
              <li><strong>FHA Loan Viability:</strong> Whether FHA financing makes sense</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">FHA Loans vs. Conventional Mortgages</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">FHA Loan Advantages</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Lower down payment (3.5% minimum)</li>
                  <li>More flexible credit requirements</li>
                  <li>Lower credit score minimums</li>
                  <li>Assumable loans</li>
                  <li>Streamline refinancing options</li>
                  <li>Government backing reduces lender risk</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">FHA Loan Considerations</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>PMI required for entire loan term</li>
                  <li>Higher interest rates than conventional</li>
                  <li>Upfront mortgage insurance premium</li>
                  <li>Property must meet FHA standards</li>
                  <li>Loan limits vary by location</li>
                  <li>Owner-occupancy requirement</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Principal & Interest</h5>
                <p className="text-blue-700 text-sm">Base loan payment</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-1">PMI</h5>
                <p className="text-indigo-700 text-sm">Insurance premium</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Total Payment</h5>
                <p className="text-green-700 text-sm">Complete monthly cost</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the home price, down payment amount, interest rate, and loan term. The calculator will show 
              your monthly principal and interest payment, PMI costs, and total monthly payment to help evaluate 
              FHA loan affordability.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">FHA Loan Requirements</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Credit Score:</strong> Minimum 580 for 3.5% down, 500-579 for 10% down</li>
              <li><strong>Down Payment:</strong> 3.5% minimum for qualified borrowers</li>
              <li><strong>Debt-to-Income Ratio:</strong> Typically 43% maximum, up to 50% with compensating factors</li>
              <li><strong>Property Standards:</strong> Must meet FHA minimum property standards</li>
              <li><strong>Occupancy:</strong> Must be primary residence</li>
              <li><strong>Loan Limits:</strong> Vary by county and property type</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">FHA Mortgage Insurance</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Upfront MIP:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>1.75% of base loan amount</li>
                    <li>Added to loan balance</li>
                    <li>Can be financed or paid upfront</li>
                    <li>Required for all FHA loans</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Annual MIP:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>0.45% to 1.05% annually</li>
                    <li>Divided into monthly payments</li>
                    <li>Required for entire loan term</li>
                    <li>Rate depends on loan amount and term</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">FHA Loan Types</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>FHA 203(b):</strong> Standard FHA home purchase loan</li>
              <li><strong>FHA 203(k):</strong> Purchase and renovation financing</li>
              <li><strong>FHA Streamline Refinance:</strong> Simplified refinancing for existing FHA loans</li>
              <li><strong>FHA Cash-Out Refinance:</strong> Refinance with cash back</li>
              <li><strong>FHA Reverse Mortgage:</strong> Home Equity Conversion Mortgage (HECM)</li>
              <li><strong>FHA Energy Efficient Mortgage:</strong> Energy improvement financing</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When FHA Loans Make Sense</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>First-Time Buyers:</strong> Limited down payment funds</li>
              <li><strong>Lower Credit Scores:</strong> Below conventional loan requirements</li>
              <li><strong>Limited Savings:</strong> Can't afford 20% down payment</li>
              <li><strong>Previous Bankruptcy:</strong> FHA allows shorter waiting periods</li>
              <li><strong>Foreclosure Recovery:</strong> Shorter waiting period than conventional</li>
              <li><strong>Investment Properties:</strong> Multi-unit properties (owner-occupied)</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">FHA Loan Costs to Consider</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Upfront MIP:</strong> 1.75% of loan amount</li>
              <li><strong>Annual MIP:</strong> 0.45% to 1.05% of loan balance</li>
              <li><strong>Higher Interest Rates:</strong> Typically 0.25% to 0.5% higher</li>
              <li><strong>Appraisal Fees:</strong> FHA appraisal requirements</li>
              <li><strong>Closing Costs:</strong> Standard mortgage closing costs</li>
              <li><strong>Property Repairs:</strong> Required repairs to meet FHA standards</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">FHA Loan Application Process</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Pre-approval:</strong> Get pre-approved before house hunting</li>
              <li><strong>Property Selection:</strong> Choose FHA-eligible property</li>
              <li><strong>FHA Appraisal:</strong> Property must meet FHA standards</li>
              <li><strong>Underwriting:</strong> Lender reviews application and documents</li>
              <li><strong>Conditional Approval:</strong> Subject to property and documentation review</li>
              <li><strong>Closing:</strong> Final loan approval and property transfer</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">FHA Loan Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Improve Credit First:</strong> Better credit means lower MIP rates</li>
              <li><strong>Save for Larger Down Payment:</strong> Reduces MIP costs</li>
              <li><strong>Shop Multiple Lenders:</strong> Compare FHA loan offers</li>
              <li><strong>Consider Property Condition:</strong> Avoid properties needing major repairs</li>
              <li><strong>Plan for MIP:</strong> Factor in insurance costs long-term</li>
              <li><strong>Refinance Later:</strong> Consider refinancing to conventional when possible</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                FHA loans are excellent for first-time buyers and those with limited down payment funds, but 
                remember that MIP (Mortgage Insurance Premium) adds significant cost over the life of the loan. 
                Consider saving for a larger down payment to reduce MIP costs, or plan to refinance to a 
                conventional loan once you have 20% equity to eliminate PMI entirely. Also, FHA loans have 
                property standards that must be met, so ensure your chosen property is in good condition to 
                avoid costly repairs or loan denial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
