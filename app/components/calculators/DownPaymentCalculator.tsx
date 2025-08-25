'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, DollarSign } from 'lucide-react'

export default function DownPaymentCalculator() {
  const [homePrice, setHomePrice] = useState('')
  const [downPaymentPercent, setDownPaymentPercent] = useState('20')
  const [showResults, setShowResults] = useState(false)

  const calculateDownPayment = useCallback(() => {
    const price = parseFloat(homePrice) || 0
    const percent = parseFloat(downPaymentPercent) || 20
    
    if (price === 0) return { 
      downPayment: 0, 
      loanAmount: 0,
      pmiRequired: false,
      recommendations: [],
      details: { price: 0, percent: 0 }
    }

    const downPayment = price * (percent / 100)
    const loanAmount = price - downPayment
    const pmiRequired = percent < 20

    const recommendations = []
    recommendations.push(`Home price: $${price.toLocaleString()}`)
    recommendations.push(`Down payment: $${downPayment.toLocaleString()} (${percent}%)`)
    recommendations.push(`Loan amount: $${loanAmount.toLocaleString()}`)
    
    if (pmiRequired) {
      recommendations.push('PMI required - down payment below 20%')
      recommendations.push('Consider increasing down payment to avoid PMI')
    } else {
      recommendations.push('No PMI required - down payment 20% or higher')
      recommendations.push('Good equity position')
    }

    if (percent < 5) recommendations.push('Very low down payment - may not qualify')
    else if (percent < 10) recommendations.push('Low down payment - FHA loans available')
    else if (percent < 20) recommendations.push('Moderate down payment - conventional loans')
    else recommendations.push('High down payment - excellent loan terms')

    const details = { price, percent }

    return { downPayment, loanAmount, pmiRequired, recommendations, details }
  }, [homePrice, downPaymentPercent])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setHomePrice('')
    setDownPaymentPercent('20')
    setShowResults(false)
  }

  const result = showResults ? calculateDownPayment() : { downPayment: 0, loanAmount: 0, pmiRequired: false, recommendations: [], details: { price: 0, percent: 0 } }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Down Payment Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate down payment and loan amounts</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Price ($)</label>
              <input type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter price" step="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment (%)</label>
              <select value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Select down payment percentage">
                <option value="3.5">3.5% (FHA)</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
                <option value="30">30%</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={handleCalculate} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <Calculator className="h-5 w-5 inline mr-2" />Calculate
            </button>
            <button onClick={handleReset} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <RotateCcw className="h-5 w-5 inline mr-2" />Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Down Payment Required</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">${result.downPayment?.toLocaleString()}</div>
                <div className="text-green-700">{result.details.percent}% of home price</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Loan Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-green-700">Home Price:</span><span className="font-semibold text-green-800">${result.details.price?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Down Payment:</span><span className="font-semibold text-green-800">${result.downPayment?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-green-700">Loan Amount:</span><span className="font-semibold text-green-800">${result.loanAmount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-green-700">PMI Required:</span><span className="font-semibold text-green-800">{result.pmiRequired ? 'Yes' : 'No'}</span></div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Analysis</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-green-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Down Payment Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive down payment calculator helps homebuyers understand the financial 
              requirements for purchasing a home. This essential tool calculates down payment amounts, 
              loan sizes, and PMI requirements, providing crucial insights for mortgage planning and 
              home affordability assessment.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Down Payment Amount:</strong> Cash required for home purchase</li>
              <li><strong>Loan Amount:</strong> Mortgage financing needed</li>
              <li><strong>PMI Requirements:</strong> Private Mortgage Insurance needs</li>
              <li><strong>Equity Position:</strong> Initial ownership percentage</li>
              <li><strong>Affordability Analysis:</strong> Home buying feasibility</li>
              <li><strong>Loan Recommendations:</strong> Best financing options</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Down Payment Options</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Low Down Payment</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>3.5% (FHA):</strong> Government-backed loans</li>
                  <li><strong>5%:</strong> Conventional loan minimum</li>
                  <li><strong>10%:</strong> Moderate conventional option</li>
                  <li><strong>15%:</strong> Reduced PMI option</li>
                  <li><strong>Benefits:</strong> Lower upfront costs</li>
                  <li><strong>Considerations:</strong> Higher monthly payments</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">High Down Payment</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>20%:</strong> No PMI required</li>
                  <li><strong>25%:</strong> Better interest rates</li>
                  <li><strong>30%:</strong> Excellent loan terms</li>
                  <li><strong>Benefits:</strong> Lower rates, no PMI</li>
                  <li><strong>Considerations:</strong> Higher upfront costs</li>
                  <li><strong>Equity:</strong> Immediate ownership stake</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Down Payment</h5>
                <p className="text-green-700 text-sm">Cash required</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Loan Amount</h5>
                <p className="text-blue-700 text-sm">Mortgage needed</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">PMI Status</h5>
                <p className="text-purple-700 text-sm">Insurance required</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Equity</h5>
                <p className="text-orange-700 text-sm">Ownership percentage</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the home price and select your desired down payment percentage. The calculator will 
              automatically compute the down payment amount, loan amount, and determine if PMI is required. 
              Use the analysis section to understand the implications of your down payment choice.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Down Payment Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>What It Is:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Initial cash investment</li>
                    <li>Percentage of home price</li>
                    <li>Reduces loan amount</li>
                    <li>Establishes equity</li>
                    <li>Affects loan terms</li>
                    <li>Determines PMI needs</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Why It Matters:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Lower monthly payments</li>
                    <li>Better interest rates</li>
                    <li>No PMI requirement</li>
                    <li>Immediate equity</li>
                    <li>Loan approval likelihood</li>
                    <li>Financial flexibility</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">PMI Requirements</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">PMI Required (Below 20%)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Cost:</strong> 0.5% to 1.5% of loan annually</li>
                  <li><strong>Duration:</strong> Until 20% equity reached</li>
                  <li><strong>Purpose:</strong> Protects lender from default</li>
                  <li><strong>Impact:</strong> Increases monthly payment</li>
                  <li><strong>Options:</strong> Monthly or upfront payment</li>
                  <li><strong>Elimination:</strong> Refinance or pay down loan</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">No PMI (20% or Higher)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Savings:</strong> No additional insurance cost</li>
                  <li><strong>Equity:</strong> Immediate 20% ownership</li>
                  <li><strong>Flexibility:</strong> Better refinancing options</li>
                  <li><strong>Security:</strong> Reduced foreclosure risk</li>
                  <li><strong>Investment:</strong> Higher upfront capital</li>
                  <li><strong>Benefits:</strong> Lower total loan cost</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Loan Type Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>FHA Loans:</strong> 3.5% minimum, government backing, higher fees</li>
              <li><strong>Conventional Loans:</strong> 5% minimum, private lenders, better rates</li>
              <li><strong>VA Loans:</strong> 0% down for veterans, government guarantee</li>
              <li><strong>USDA Loans:</strong> 0% down for rural areas, income limits</li>
              <li><strong>Jumbo Loans:</strong> Higher amounts, stricter requirements</li>
              <li><strong>Portfolio Loans:</strong> Non-conforming, flexible terms</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Down Payment Sources</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Personal Savings</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Cash Savings:</strong> Emergency fund allocation</li>
                  <li><strong>Investment Accounts:</strong> Stocks, bonds, mutual funds</li>
                  <li><strong>Retirement Accounts:</strong> 401(k) loans (cautious use)</li>
                  <li><strong>CDs and Bonds:</strong> Matured investments</li>
                  <li><strong>Business Profits:</strong> Self-employed income</li>
                  <li><strong>Inheritance:</strong> Family wealth transfer</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Alternative Sources</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Gift Funds:</strong> Family member contributions</li>
                  <li><strong>Down Payment Assistance:</strong> Government programs</li>
                  <li><strong>Seller Concessions:</strong> Closing cost credits</li>
                  <li><strong>401(k) Withdrawals:</strong> Early distribution (taxes apply)</li>
                  <li><strong>Home Sale Proceeds:</strong> Equity from previous home</li>
                  <li><strong>Loan Programs:</strong> Special financing options</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Down Payment Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Save Aggressively:</strong> Set aside 20% of income monthly</li>
              <li><strong>Reduce Expenses:</strong> Cut unnecessary spending</li>
              <li><strong>Increase Income:</strong> Side hustles, overtime, promotions</li>
              <li><strong>Invest Wisely:</strong> Grow savings through investments</li>
              <li><strong>Time the Market:</strong> Buy when prices are favorable</li>
              <li><strong>Consider Location:</strong> Lower-cost areas for first home</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Down Payment Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Include Closing Costs:</strong> 2-5% of home price additional</li>
              <li><strong>Emergency Fund:</strong> Maintain 3-6 months expenses</li>
              <li><strong>Moving Costs:</strong> Budget for relocation expenses</li>
              <li><strong>Furniture and Repairs:</strong> Post-purchase expenses</li>
              <li><strong>Property Taxes:</strong> Escrow account requirements</li>
              <li><strong>Insurance Costs:</strong> Homeowners and flood insurance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Down Payment Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Underestimating Costs:</strong> Not including all expenses</li>
              <li><strong>Draining Savings:</strong> Leaving no emergency fund</li>
              <li><strong>Ignoring PMI:</strong> Not considering insurance costs</li>
              <li><strong>Rushing Purchase:</strong> Buying before ready financially</li>
              <li><strong>Ignoring Market:</strong> Not timing purchase appropriately</li>
              <li><strong>Overextending:</strong> Buying more house than affordable</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Down Payment Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Piggyback Loans:</strong> 80-10-10 financing structure</li>
              <li><strong>Down Payment Assistance:</strong> Government and nonprofit programs</li>
              <li><strong>Gift Letter Requirements:</strong> Documentation for gift funds</li>
              <li><strong>Seasoning Requirements:</strong> How long funds must be in account</li>
              <li><strong>Source of Funds:</strong> Lender verification requirements</li>
              <li><strong>Reserve Requirements:</strong> Additional savings requirements</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When planning your down payment, aim for 20% to avoid PMI and secure better loan terms. 
                However, don't wait indefinitely if you can afford a home with a smaller down payment - 
                the cost of PMI may be less than continued rent payments. Consider your overall financial 
                picture, including emergency savings, retirement contributions, and other financial goals. 
                Use this calculator to understand the trade-offs between different down payment amounts 
                and choose the option that best fits your financial situation and homeownership timeline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
