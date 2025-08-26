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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Rental Property Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive rental property calculator helps you analyze the financial viability of real estate 
              investments by calculating monthly cash flow, annual ROI, and capitalization rates. Whether you're a 
              first-time investor or an experienced landlord, this tool provides essential metrics to evaluate 
              potential rental properties and make informed investment decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Cash Flow:</strong> Net income after all expenses</li>
              <li><strong>Annual ROI:</strong> Return on investment percentage</li>
              <li><strong>Cap Rate:</strong> Net operating income relative to property value</li>
              <li><strong>Monthly Expenses:</strong> Total monthly property costs</li>
              <li><strong>Cash Flow Analysis:</strong> Profitability assessment</li>
              <li><strong>Investment Metrics:</strong> Key performance indicators</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Rental Property Investment Components</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Income Sources</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Monthly rental income</li>
                  <li>Additional fees (pet rent, parking)</li>
                  <li>Laundry or vending income</li>
                  <li>Storage unit rentals</li>
                  <li>Late payment fees</li>
                  <li>Application fees</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Monthly Expenses</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Mortgage payment (P&I)</li>
                  <li>Property taxes</li>
                  <li>Insurance premiums</li>
                  <li>Maintenance costs</li>
                  <li>Property management fees</li>
                  <li>Utilities and HOA fees</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 mb-1">Monthly Cash Flow</h5>
                <p className="text-emerald-700 text-sm">Net monthly profit/loss</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Annual ROI</h5>
                <p className="text-green-700 text-sm">Return on investment</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Cap Rate</h5>
                <p className="text-blue-700 text-sm">Capitalization rate</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the property purchase price, down payment, loan terms, expected monthly rent, and all associated 
              costs. The calculator will compute your monthly cash flow, annual ROI, and cap rate to help evaluate 
              the investment's profitability.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Investment Metrics</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Cash Flow:</strong> Monthly income minus all expenses</li>
              <li><strong>ROI:</strong> Annual return relative to total investment</li>
              <li><strong>Cap Rate:</strong> NOI divided by property value</li>
              <li><strong>Cash-on-Cash Return:</strong> Annual cash flow divided by cash invested</li>
              <li><strong>Break-Even Analysis:</strong> When income equals expenses</li>
              <li><strong>Appreciation Potential:</strong> Long-term property value growth</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Rental Property Types</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Residential Properties:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Single-family homes</li>
                    <li>Multi-family units</li>
                    <li>Condominiums</li>
                    <li>Townhouses</li>
                    <li>Student housing</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Commercial Properties:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Office buildings</li>
                    <li>Retail spaces</li>
                    <li>Industrial properties</li>
                    <li>Mixed-use developments</li>
                    <li>Storage facilities</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Rental Income</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Location:</strong> Desirable neighborhoods command higher rents</li>
              <li><strong>Property Condition:</strong> Well-maintained properties rent for more</li>
              <li><strong>Market Demand:</strong> Supply and demand affect rental rates</li>
              <li><strong>Property Features:</strong> Amenities increase rental value</li>
              <li><strong>Seasonal Factors:</strong> Rental demand varies throughout the year</li>
              <li><strong>Economic Conditions:</strong> Job market affects rental demand</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Risk Management Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Diversification:</strong> Invest in different property types and locations</li>
              <li><strong>Insurance Coverage:</strong> Adequate property and liability insurance</li>
              <li><strong>Emergency Funds:</strong> Maintain reserves for unexpected expenses</li>
              <li><strong>Tenant Screening:</strong> Thorough background and credit checks</li>
              <li><strong>Property Management:</strong> Professional management for multiple properties</li>
              <li><strong>Regular Maintenance:</strong> Preventative maintenance reduces costs</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tax Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Depreciation:</strong> Tax deduction for property wear and tear</li>
              <li><strong>Interest Deductions:</strong> Mortgage interest is typically deductible</li>
              <li><strong>Property Tax Deductions:</strong> Annual property taxes are deductible</li>
              <li><strong>Operating Expenses:</strong> Maintenance and management costs</li>
              <li><strong>1031 Exchanges:</strong> Defer capital gains on property sales</li>
              <li><strong>Passive Loss Rules:</strong> Limitations on rental property losses</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Aim for positive cash flow from day one, but don't overlook long-term appreciation potential. A property 
                with modest monthly cash flow but strong appreciation potential can be an excellent investment. Also, 
                consider the "1% rule" - monthly rent should be at least 1% of the purchase price for a good rental 
                investment, though this varies by market and property type.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
