'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, PieChart } from 'lucide-react'

export default function BudgetCalculator() {
  const [income, setIncome] = useState('')
  const [housing, setHousing] = useState('')
  const [transportation, setTransportation] = useState('')
  const [food, setFood] = useState('')
  const [utilities, setUtilities] = useState('')
  const [entertainment, setEntertainment] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateBudget = useCallback(() => {
    const inc = parseFloat(income) || 0
    const house = parseFloat(housing) || 0
    const trans = parseFloat(transportation) || 0
    const fd = parseFloat(food) || 0
    const util = parseFloat(utilities) || 0
    const ent = parseFloat(entertainment) || 0
    
    if (inc === 0) return { totalExpenses: 0, remaining: 0, percentages: { housing: 0, transportation: 0, food: 0, utilities: 0, entertainment: 0 }, recommendations: [] }

    const totalExpenses = house + trans + fd + util + ent
    const remaining = inc - totalExpenses
    const percentages = {
      housing: (house / inc) * 100,
      transportation: (trans / inc) * 100,
      food: (fd / inc) * 100,
      utilities: (util / inc) * 100,
      entertainment: (ent / inc) * 100
    }

    const recommendations = []
    if (percentages.housing > 30) recommendations.push('Housing costs too high - aim for 30% or less')
    if (percentages.transportation > 15) recommendations.push('Transportation costs high - consider alternatives')
    if (percentages.food > 15) recommendations.push('Food budget high - meal planning can help')
    if (remaining < 0) recommendations.push('Expenses exceed income - immediate budget review needed')
    else if (remaining < inc * 0.2) recommendations.push('Low savings - aim for 20% of income')
    else recommendations.push('Good budget balance - consider increasing savings')

    return { totalExpenses, remaining, percentages, recommendations }
  }, [income, housing, transportation, food, utilities, entertainment])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setIncome('')
    setHousing('')
    setTransportation('')
    setFood('')
    setUtilities('')
    setEntertainment('')
    setShowResults(false)
  }

  const result = showResults ? calculateBudget() : { totalExpenses: 0, remaining: 0, percentages: { housing: 0, transportation: 0, food: 0, utilities: 0, entertainment: 0 }, recommendations: [] }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
        <div className="flex items-center">
          <PieChart className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Budget Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">50/30/20 budget rule calculator</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income ($)</label>
            <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter income" step="100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Housing ($)</label>
              <input type="number" value={housing} onChange={(e) => setHousing(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Rent/mortgage" step="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transportation ($)</label>
              <input type="number" value={transportation} onChange={(e) => setTransportation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Car/gas/transit" step="50" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food ($)</label>
              <input type="number" value={food} onChange={(e) => setFood(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Groceries" step="50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Utilities ($)</label>
              <input type="number" value={utilities} onChange={(e) => setUtilities(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Electric/water" step="50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entertainment ($)</label>
              <input type="number" value={entertainment} onChange={(e) => setEntertainment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Fun money" step="50" />
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
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Budget Summary</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">${result.remaining.toFixed(2)}</div>
                <div className="text-blue-700">Remaining after expenses</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Expense Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-blue-700">Housing:</span><span className="font-semibold text-blue-800">{result.percentages.housing?.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Transportation:</span><span className="font-semibold text-blue-800">{result.percentages.transportation?.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Food:</span><span className="font-semibold text-blue-800">{result.percentages.food?.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Utilities:</span><span className="font-semibold text-blue-800">{result.percentages.utilities?.toFixed(1)}%</span></div>
                <div className="flex justify-between"><span className="text-blue-700">Entertainment:</span><span className="font-semibold text-blue-800">{result.percentages.entertainment?.toFixed(1)}%</span></div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-700">Total Expenses:</span>
                    <span className="text-blue-800">${result.totalExpenses?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h3>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Budget Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive budget calculator helps you create and maintain a balanced monthly budget using 
              the proven 50/30/20 rule. This tool analyzes your income and expenses to provide personalized 
              budgeting recommendations, helping you achieve financial stability, reduce debt, and build savings 
              for your future goals.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Expense Percentages:</strong> How much of your income goes to each category</li>
              <li><strong>Budget Balance:</strong> Remaining income after all expenses</li>
              <li><strong>50/30/20 Analysis:</strong> Comparison with recommended budget ratios</li>
              <li><strong>Expense Breakdown:</strong> Detailed analysis of spending patterns</li>
              <li><strong>Budget Recommendations:</strong> Personalized suggestions for improvement</li>
              <li><strong>Financial Health Assessment:</strong> Overall budget evaluation</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">The 50/30/20 Budget Rule</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">50% - Needs</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Housing (rent/mortgage)</li>
                  <li>Transportation</li>
                  <li>Food and groceries</li>
                  <li>Utilities and insurance</li>
                  <li>Basic clothing</li>
                  <li>Minimum debt payments</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">30% - Wants</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Entertainment</li>
                  <li>Dining out</li>
                  <li>Hobbies and recreation</li>
                  <li>Non-essential shopping</li>
                  <li>Vacations and travel</li>
                  <li>Luxury items</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">20% - Savings</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Emergency fund</li>
                  <li>Retirement savings</li>
                  <li>Investment accounts</li>
                  <li>Debt repayment</li>
                  <li>Major purchases</li>
                  <li>Financial goals</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Budget Summary</h5>
                <p className="text-blue-700 text-sm">Remaining income</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                <h5 className="font-semibold text-cyan-800 mb-1">Expense Breakdown</h5>
                <p className="text-cyan-700 text-sm">Category percentages</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Recommendations</h5>
                <p className="text-green-700 text-sm">Improvement suggestions</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your monthly income and current expenses for housing, transportation, food, utilities, and 
              entertainment. The calculator will analyze your spending patterns and provide personalized 
              recommendations to help you achieve a balanced budget.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Budget Categories Explained</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Housing:</strong> Rent, mortgage, property taxes, insurance, maintenance</li>
              <li><strong>Transportation:</strong> Car payments, gas, insurance, public transit, maintenance</li>
              <li><strong>Food:</strong> Groceries, household supplies, basic necessities</li>
              <li><strong>Utilities:</strong> Electricity, water, gas, internet, phone, garbage</li>
              <li><strong>Entertainment:</strong> Movies, dining out, hobbies, recreation, non-essential items</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Budgeting Best Practices</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Track Everything:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Record all income sources</li>
                    <li>Log every expense</li>
                    <li>Use budgeting apps</li>
                    <li>Review monthly statements</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Set Priorities:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Pay yourself first</li>
                    <li>Emergency fund priority</li>
                    <li>High-interest debt first</li>
                    <li>Long-term goals planning</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Budgeting Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Unrealistic Expectations:</strong> Setting budgets too low for essential expenses</li>
              <li><strong>Forgetting Irregular Expenses:</strong> Annual costs like insurance and taxes</li>
              <li><strong>No Emergency Fund:</strong> Failing to plan for unexpected expenses</li>
              <li><strong>Ignoring Small Expenses:</strong> Daily coffee, snacks, and impulse purchases</li>
              <li><strong>No Flexibility:</strong> Rigid budgets that don't allow for life changes</li>
              <li><strong>Not Adjusting:</strong> Failing to review and modify budgets regularly</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Budgeting Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Zero-Based Budgeting:</strong> Every dollar has a specific purpose</li>
              <li><strong>Envelope Method:</strong> Physical cash for different categories</li>
              <li><strong>50/30/20 Rule:</strong> Balanced approach to spending and saving</li>
              <li><strong>Pay Yourself First:</strong> Save before spending on wants</li>
              <li><strong>Automated Savings:</strong> Set up automatic transfers</li>
              <li><strong>Regular Reviews:</strong> Monthly budget check-ins</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Saving Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Emergency Fund:</strong> 3-6 months of essential expenses</li>
              <li><strong>Retirement Savings:</strong> 10-15% of income for retirement</li>
              <li><strong>Debt Repayment:</strong> Focus on high-interest debt first</li>
              <li><strong>Investment Accounts:</strong> Long-term wealth building</li>
              <li><strong>Major Purchases:</strong> Save for cars, home improvements</li>
              <li><strong>Financial Goals:</strong> Vacation, education, business startup</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Budgeting Tools and Resources</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Budgeting Apps:</strong> Mint, YNAB, Personal Capital</li>
              <li><strong>Spreadsheets:</strong> Excel, Google Sheets templates</li>
              <li><strong>Banking Tools:</strong> Online banking and mobile apps</li>
              <li><strong>Financial Advisors:</strong> Professional guidance and planning</li>
              <li><strong>Online Resources:</strong> Financial education websites</li>
              <li><strong>Community Support:</strong> Budgeting groups and forums</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Budgeting for Different Life Stages</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Young Adults:</strong> Focus on building emergency fund and reducing debt</li>
              <li><strong>Families:</strong> Include childcare, education, and family activities</li>
              <li><strong>Mid-Career:</strong> Maximize retirement savings and investment contributions</li>
              <li><strong>Pre-Retirement:</strong> Accelerate savings and reduce expenses</li>
              <li><strong>Retirement:</strong> Focus on income generation and healthcare costs</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Start budgeting with your current spending patterns rather than trying to implement the perfect 
                budget immediately. Track your expenses for a month to see where your money actually goes, then 
                gradually adjust your spending to align with the 50/30/20 rule. Remember that budgeting is a 
                process, not a one-time event. Review and adjust your budget monthly, and don't be discouraged 
                by setbacks - every month is a new opportunity to improve your financial habits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
