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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Real Estate Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive real estate calculator helps you understand the true cost of homeownership by calculating 
              total monthly payments including mortgage, taxes, insurance, and HOA fees. Whether you're buying your 
              first home, investing in real estate, or refinancing, this tool provides accurate cost projections 
              to help you make informed decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Total Monthly Payment:</strong> Complete cost of homeownership each month</li>
              <li><strong>Principal & Interest:</strong> Core mortgage payment amount</li>
              <li><strong>Property Taxes:</strong> Annual tax burden divided monthly</li>
              <li><strong>Insurance Costs:</strong> Homeowners and mortgage insurance</li>
              <li><strong>HOA Fees:</strong> Monthly association or maintenance costs</li>
              <li><strong>Cost Breakdown:</strong> Detailed analysis of all expenses</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Components of Homeownership Costs</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Mortgage Costs</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Principal reduction</li>
                  <li>Interest payments</li>
                  <li>Private mortgage insurance (PMI)</li>
                  <li>Escrow account funding</li>
                  <li>Loan origination fees</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Additional Expenses</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Property taxes</li>
                  <li>Homeowners insurance</li>
                  <li>HOA or condo fees</li>
                  <li>Maintenance costs</li>
                  <li>Utility expenses</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 mb-1">Total Payment</h5>
                <p className="text-emerald-700 text-sm">Complete monthly cost</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Principal & Interest</h5>
                <p className="text-blue-700 text-sm">Core mortgage payment</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Additional Costs</h5>
                <p className="text-purple-700 text-sm">Taxes, insurance, HOA</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the purchase price, down payment, interest rate, loan term, and additional monthly costs. 
              The calculator will compute your total monthly payment and provide a detailed breakdown of all 
              homeownership expenses.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Factors Affecting Costs</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Down Payment:</strong> Larger down payments reduce monthly costs</li>
              <li><strong>Interest Rate:</strong> Lower rates significantly reduce payments</li>
              <li><strong>Loan Term:</strong> Shorter terms mean higher monthly payments but less total interest</li>
              <li><strong>Property Taxes:</strong> Vary by location and property value</li>
              <li><strong>Insurance Costs:</strong> Depend on coverage levels and property type</li>
              <li><strong>HOA Fees:</strong> Can vary widely by community and amenities</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Real Estate Investment Considerations</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Cash Flow Analysis:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Rental income potential</li>
                    <li>Monthly expense coverage</li>
                    <li>Profit margin calculations</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Long-term Benefits:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Property appreciation</li>
                    <li>Tax deductions</li>
                    <li>Equity building</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Mistakes to Avoid</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Underestimating Costs:</strong> Don't forget maintenance and unexpected expenses</li>
              <li><strong>Ignoring Tax Implications:</strong> Property taxes can increase over time</li>
              <li><strong>Overlooking HOA Fees:</strong> These can be substantial and may increase</li>
              <li><strong>Not Planning for Rate Changes:</strong> Consider future interest rate scenarios</li>
              <li><strong>Forgetting Insurance:</strong> Adequate coverage is essential</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Aim to keep your total housing costs (including mortgage, taxes, insurance, and HOA) below 28% 
                of your gross monthly income. This ensures you have enough money for other expenses and savings. 
                Always factor in potential rate increases and property tax hikes when planning your budget.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
