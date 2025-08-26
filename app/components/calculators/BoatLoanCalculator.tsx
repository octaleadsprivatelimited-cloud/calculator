'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Anchor } from 'lucide-react'

export default function BoatLoanCalculator() {
  const [boatPrice, setBoatPrice] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [termType, setTermType] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculateBoatLoan = useCallback(() => {
    const price = parseFloat(boatPrice) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 0
    
    if (price === 0 || rate === 0 || term === 0) return { 
      loanAmount: 0, 
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
      recommendations: [],
      details: { price: 0, down: 0, rate: 0, term: 0, termType: '' }
    }

    const loanAmount = price - down
    const monthlyRate = rate / 100 / 12
    const termMonths = termType === 'years' ? term * 12 : term
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
    
    const totalPayment = monthlyPayment * termMonths
    const totalInterest = totalPayment - loanAmount
    const downPaymentPercent = (down / price) * 100

    const recommendations = []
    recommendations.push(`Boat price: $${price.toLocaleString()}`)
    recommendations.push(`Down payment: $${down.toLocaleString()} (${downPaymentPercent.toFixed(1)}%)`)
    recommendations.push(`Loan amount: $${loanAmount.toLocaleString()}`)
    recommendations.push(`Interest rate: ${rate.toFixed(2)}%`)
    recommendations.push(`Loan term: ${term} ${termType}`)
    recommendations.push(`Monthly payment: $${monthlyPayment.toFixed(2)}`)
    recommendations.push(`Total interest: $${totalInterest.toFixed(2)}`)
    recommendations.push(`Total payment: $${totalPayment.toFixed(2)}`)

    if (rate > 12) recommendations.push('High interest rate - typical for boat loans')
    else if (rate > 8) recommendations.push('Moderate rate - good boat loan terms')
    else recommendations.push('Low rate - excellent financing')

    if (downPaymentPercent < 10) recommendations.push('Low down payment - higher monthly payments')
    else if (downPaymentPercent < 20) recommendations.push('Moderate down payment - balanced approach')
    else recommendations.push('High down payment - lower monthly payments')

    const details = { price, down, rate, term, termType }

    return { loanAmount, monthlyPayment, totalInterest, totalPayment, recommendations, details }
  }, [boatPrice, downPayment, interestRate, loanTerm, termType])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setBoatPrice('')
    setDownPayment('')
    setInterestRate('')
    setLoanTerm('')
    setTermType('years')
    setShowResults(false)
  }

  const result = showResults ? calculateBoatLoan() : { loanAmount: 0, monthlyPayment: 0, totalInterest: 0, totalPayment: 0, recommendations: [], details: { price: 0, down: 0, rate: 0, term: 0, termType: '' } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
        <div className="flex items-center">
          <Anchor className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Boat Loan Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate boat loan payments and costs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Boat Price ($)</label>
              <input type="number" value={boatPrice} onChange={(e) => setBoatPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter price" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter down payment" step="1000" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter rate" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
              <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter term" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term Type</label>
              <select value={termType} onChange={(e) => setTermType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Select term type">
                <option value="years">Years</option>
                <option value="months">Months</option>
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
                <div className="text-3xl font-bold text-blue-600 mb-2">${result.monthlyPayment?.toFixed(2)}</div>
                <div className="text-blue-700">Monthly boat loan payment</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Loan Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-blue-700">Boat Price:</span><span className="font-semibold text-blue-800">${result.details.price?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Down Payment:</span><span className="font-semibold text-blue-800">${result.details.down?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Loan Amount:</span><span className="font-semibold text-blue-800">${result.loanAmount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Interest Rate:</span><span className="font-semibold text-blue-800">{result.details.rate?.toFixed(2)}%</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Loan Term:</span><span className="font-semibold text-blue-800">{result.details.term} {result.details.termType}</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Total Interest:</span><span className="font-semibold text-blue-800">${result.totalInterest?.toFixed(2)}</span></div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-700">Total Payment:</span>
                    <span className="text-blue-800">${result.totalPayment?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Analysis</h3>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Boat Loan Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive boat loan calculator helps you determine monthly payments and total costs for financing 
              your dream boat. Whether you're purchasing a fishing boat, yacht, sailboat, or pontoon, this tool provides 
              essential calculations including monthly payments, total interest, and complete cost breakdowns to help you 
              make informed financing decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Payment:</strong> Regular boat loan payment amount</li>
              <li><strong>Total Interest:</strong> Complete interest cost over loan term</li>
              <li><strong>Total Payment:</strong> Principal plus all interest costs</li>
              <li><strong>Loan Amount:</strong> Amount financed after down payment</li>
              <li><strong>Payment Breakdown:</strong> Detailed cost analysis</li>
              <li><strong>Financing Analysis:</strong> Whether the loan is affordable</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Boat Loan vs. Other Financing</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Boat Loan Characteristics</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Higher interest rates than auto loans</li>
                  <li>Shorter loan terms (5-20 years)</li>
                  <li>Larger down payment requirements</li>
                  <li>Collateral-based lending</li>
                  <li>Seasonal payment options</li>
                  <li>Specialized boat lenders</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Alternative Financing</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Home equity loans</li>
                  <li>Personal loans</li>
                  <li>Credit card financing</li>
                  <li>Dealer financing</li>
                  <li>Manufacturer programs</li>
                  <li>Credit union loans</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Monthly Payment</h5>
                <p className="text-blue-700 text-sm">Regular loan amount</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                <h5 className="font-semibold text-cyan-800 mb-1">Total Interest</h5>
                <p className="text-cyan-700 text-sm">Cost of borrowing</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Total Cost</h5>
                <p className="text-green-700 text-sm">Complete boat cost</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the boat price, down payment, interest rate, and loan term. Choose between years or months, then 
              click calculate to see your monthly payment, total interest costs, and complete financing breakdown.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Boat Types and Financing</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Fishing Boats:</strong> Bass boats, center consoles, aluminum boats</li>
              <li><strong>Pontoon Boats:</strong> Family-friendly, stable platforms</li>
              <li><strong>Sailboats:</strong> Monohulls, catamarans, racing boats</li>
              <li><strong>Yachts:</strong> Luxury vessels, motor yachts, trawlers</li>
              <li><strong>Personal Watercraft:</strong> Jet skis, wave runners</li>
              <li><strong>Commercial Vessels:</strong> Charter boats, fishing charters</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Boat Loan Requirements</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Credit Requirements:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Good to excellent credit (680+)</li>
                    <li>Stable income history</li>
                    <li>Low debt-to-income ratio</li>
                    <li>Down payment (10-20%)</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Documentation Needed:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Proof of income</li>
                    <li>Credit report</li>
                    <li>Boat specifications</li>
                    <li>Insurance information</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Boat Loan Rates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Credit Score:</strong> Better credit means lower rates</li>
              <li><strong>Down Payment:</strong> Larger down payments reduce rates</li>
              <li><strong>Loan Term:</strong> Shorter terms typically have lower rates</li>
              <li><strong>Boat Age:</strong> Newer boats often get better rates</li>
              <li><strong>Boat Type:</strong> Some vessels are considered higher risk</li>
              <li><strong>Lender Type:</strong> Credit unions often offer better rates</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Additional Boat Ownership Costs</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Insurance:</strong> Hull, liability, and personal property coverage</li>
              <li><strong>Storage:</strong> Marina fees, dry storage, or trailer storage</li>
              <li><strong>Maintenance:</strong> Regular service, repairs, and winterization</li>
              <li><strong>Fuel:</strong> Gasoline or diesel costs</li>
              <li><strong>Registration:</strong> Annual state registration fees</li>
              <li><strong>Safety Equipment:</strong> Life jackets, fire extinguishers, flares</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Boat Loan Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Shop Around:</strong> Compare rates from multiple lenders</li>
              <li><strong>Consider Total Cost:</strong> Don't just focus on monthly payment</li>
              <li><strong>Negotiate Price:</strong> Boat prices are often negotiable</li>
              <li><strong>Factor in Operating Costs:</strong> Include all ownership expenses</li>
              <li><strong>Check Boat History:</strong> Verify maintenance and accident history</li>
              <li><strong>Plan for Seasonal Use:</strong> Consider seasonal payment options</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Seasonal Payment Options</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Year-round Payments:</strong> Consistent monthly payments</li>
              <li><strong>Seasonal Payments:</strong> Higher payments during boating season</li>
              <li><strong>Skip-a-Payment:</strong> Skip winter months (adds to loan term)</li>
              <li><strong>Balloon Payments:</strong> Lower payments with large final payment</li>
              <li><strong>Interest-only Periods:</strong> Pay only interest initially</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Consider the total cost of boat ownership, not just the loan payment. A $500 monthly payment might seem 
                affordable, but when you add insurance ($100/month), storage ($200/month), maintenance ($100/month), and 
                fuel ($150/month), your total monthly cost is $1,050. Also, boat loans typically have higher interest 
                rates than auto loans, so shop around and consider using home equity if you have it available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
