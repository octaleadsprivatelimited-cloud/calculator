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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
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
      </div>
    </div>
  )
}
