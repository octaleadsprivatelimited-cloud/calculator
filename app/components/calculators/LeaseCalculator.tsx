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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Lease Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive lease calculator helps you determine monthly lease payments and total costs for vehicle 
              leasing. Whether you're considering leasing a car, truck, or other vehicle, this tool provides essential 
              calculations including depreciation, interest costs, and total lease expenses to help you make informed 
              leasing decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Monthly Payment:</strong> Regular lease payment amount</li>
              <li><strong>Total Cost:</strong> Complete cost of leasing over the term</li>
              <li><strong>Depreciation:</strong> Vehicle value loss during lease period</li>
              <li><strong>Interest Costs:</strong> Money factor and financing charges</li>
              <li><strong>Lease Analysis:</strong> Cost breakdown and comparison</li>
              <li><strong>Payment Factors:</strong> How different terms affect payments</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Lease vs. Purchase Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Leasing Advantages</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Lower monthly payments</li>
                  <li>Newer vehicles every few years</li>
                  <li>Warranty coverage throughout lease</li>
                  <li>No depreciation concerns</li>
                  <li>Lower down payment requirements</li>
                  <li>Tax benefits for business use</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Leasing Disadvantages</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>No equity building</li>
                  <li>Mileage restrictions</li>
                  <li>Wear and tear charges</li>
                  <li>Early termination fees</li>
                  <li>Higher long-term costs</li>
                  <li>Limited customization options</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <h5 className="font-semibold text-slate-800 mb-1">Monthly Payment</h5>
                <p className="text-slate-700 text-sm">Regular lease amount</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Depreciation</h5>
                <p className="text-blue-700 text-sm">Value loss during lease</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Total Cost</h5>
                <p className="text-green-700 text-sm">Complete lease expense</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the vehicle price, down payment, residual value, interest rate, and lease term. The calculator 
              will compute your monthly payment, depreciation, and total lease costs to help evaluate the leasing option.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Lease Terms</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Capitalized Cost:</strong> Negotiated price of the vehicle</li>
              <li><strong>Residual Value:</strong> Estimated value at lease end</li>
              <li><strong>Money Factor:</strong> Interest rate expressed as decimal</li>
              <li><strong>Lease Term:</strong> Duration of the lease agreement</li>
              <li><strong>Mileage Allowance:</strong> Annual miles included in lease</li>
              <li><strong>Acquisition Fee:</strong> One-time fee to start lease</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Lease Payment Components</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Depreciation Cost:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Vehicle price minus residual</li>
                    <li>Divided by lease term</li>
                    <li>Largest component of payment</li>
                    <li>Affected by vehicle type</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Interest Cost:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Based on money factor</li>
                    <li>Applied to average balance</li>
                    <li>Higher with longer terms</li>
                    <li>Affected by credit score</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Lease Payments</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Vehicle Price:</strong> Higher prices mean higher payments</li>
              <li><strong>Residual Value:</strong> Higher residuals reduce payments</li>
              <li><strong>Interest Rate:</strong> Lower rates reduce monthly costs</li>
              <li><strong>Lease Term:</strong> Longer terms typically mean lower payments</li>
              <li><strong>Down Payment:</strong> Larger down payments reduce monthly amounts</li>
              <li><strong>Vehicle Type:</strong> Luxury vehicles have higher depreciation</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Lease Negotiation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Negotiate Price:</strong> Focus on capitalized cost, not monthly payment</li>
              <li><strong>Research Residuals:</strong> Compare residual values across lenders</li>
              <li><strong>Shop Money Factors:</strong> Compare interest rates from multiple sources</li>
            <li><strong>Consider Mileage:</strong> Choose appropriate annual mileage allowance</li>
              <li><strong>Review Fees:</strong> Negotiate or eliminate unnecessary charges</li>
              <li><strong>Compare Options:</strong> Evaluate lease vs. purchase carefully</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Lease Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Focusing Only on Payment:</strong> Consider total cost, not just monthly amount</li>
              <li><strong>Ignoring Mileage Limits:</strong> Excess mileage charges can be expensive</li>
              <li><strong>Overlooking Wear and Tear:</strong> Damage beyond normal wear may cost extra</li>
              <li><strong>Not Reading Fine Print:</strong> Understand all terms and conditions</li>
              <li><strong>Ignoring Early Termination:</strong> Breaking lease early can be costly</li>
              <li><strong>Forgetting Insurance:</strong> Gap insurance may be required</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-slate-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Always negotiate the capitalized cost (vehicle price) first, then focus on the money factor (interest rate). 
                A lower capitalized cost will reduce your monthly payment more than negotiating the interest rate alone. 
                Also, consider your driving habits - if you drive more than 12,000-15,000 miles per year, leasing may not 
                be the best option due to excess mileage charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
