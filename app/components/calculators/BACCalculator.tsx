'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Wine } from 'lucide-react'

export default function BACCalculator() {
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('male')
  const [drinks, setDrinks] = useState('')
  const [drinkType, setDrinkType] = useState('beer')
  const [drinkSize, setDrinkSize] = useState('12oz')
  const [timeElapsed, setTimeElapsed] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateBAC = useCallback(() => {
    const w = parseFloat(weight) || 0
    const d = parseFloat(drinks) || 0
    const t = parseFloat(timeElapsed) || 0
    if (w === 0 || d === 0) return { 
      bac: 0, 
      effects: '', 
      recommendations: [],
      details: {
        totalAlcohol: 0,
        originalBAC: 0,
        metabolizedBAC: 0,
        distributionRatio: 0,
        metabolismRate: 0
      },
      timeToZero: 0
    }

    const weightLbs = w
    const weightGrams = weightLbs * 453.592

    // Alcohol content by drink type and size
    const alcoholContent = {
      beer: { '12oz': 0.05, '16oz': 0.05, '22oz': 0.05 },
      wine: { '5oz': 0.12, '6oz': 0.12, '8oz': 0.12 },
      liquor: { '1.5oz': 0.40, '2oz': 0.40, '3oz': 0.40 },
      mixed: { '8oz': 0.15, '10oz': 0.15, '12oz': 0.15 }
    }

    const selectedDrink = alcoholContent[drinkType as keyof typeof alcoholContent]
    const selectedSize = selectedDrink[drinkSize as keyof typeof selectedDrink] || 0.05

    // Calculate total alcohol consumed
    const totalAlcohol = d * selectedSize * parseFloat(drinkSize.replace(/\D/g, '')) * 0.0295735 // Convert to liters

    // Widmark formula for BAC calculation
    const r = gender === 'male' ? 0.68 : 0.55 // Distribution ratio
    const bac = ((totalAlcohol * 100) / (weightGrams * r)) * 100

    // Subtract time elapsed (body metabolizes ~0.015% per hour)
    const metabolizedBAC = Math.max(0, bac - (t * 0.015))

    // Determine effects
    let effects = ''
    if (metabolizedBAC < 0.02) {
      effects = 'No effects - safe to drive'
    } else if (metabolizedBAC < 0.04) {
      effects = 'Slight euphoria, relaxation'
    } else if (metabolizedBAC < 0.06) {
      effects = 'Feeling of well-being, lowered inhibitions'
    } else if (metabolizedBAC < 0.08) {
      effects = 'Legally impaired - do not drive'
    } else if (metabolizedBAC < 0.10) {
      effects = 'Clear deterioration of reaction time and control'
    } else if (metabolizedBAC < 0.15) {
      effects = 'Major impairment of motor control and judgment'
    } else {
      effects = 'Severe intoxication - medical attention may be needed'
    }

    // Calculate time to reach zero BAC
    const timeToZero = metabolizedBAC / 0.015

    // Generate recommendations
    const recommendations = []
    if (metabolizedBAC >= 0.08) {
      recommendations.push('DO NOT DRIVE - You are legally impaired')
      recommendations.push('Wait at least 1 hour per drink before driving')
      recommendations.push('Consider calling a ride service or taxi')
    } else if (metabolizedBAC >= 0.04) {
      recommendations.push('Exercise caution - effects may be present')
      recommendations.push('Wait before driving or operating machinery')
      recommendations.push('Consider alternative transportation')
    } else {
      recommendations.push('Safe to drive, but always drink responsibly')
      recommendations.push('Monitor your consumption')
    }

    recommendations.push('Never drink and drive')
    recommendations.push('Plan ahead for safe transportation')

    const details = {
      totalAlcohol: totalAlcohol,
      originalBAC: bac,
      metabolizedBAC: metabolizedBAC,
      distributionRatio: r,
      metabolismRate: 0.015
    }

    return { bac: metabolizedBAC, effects, recommendations, details, timeToZero }
  }, [weight, gender, drinks, drinkType, drinkSize, timeElapsed])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setGender('male')
    setDrinks('')
    setDrinkType('beer')
    setDrinkSize('12oz')
    setTimeElapsed('')
    setShowResults(false)
  }

  const result = showResults ? calculateBAC() : { 
    bac: 0, 
    effects: '', 
    recommendations: [],
    details: {
      totalAlcohol: 0,
      originalBAC: 0,
      metabolizedBAC: 0,
      distributionRatio: 0,
      metabolismRate: 0
    },
    timeToZero: 0
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
        <div className="flex items-center">
          <Wine className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Blood Alcohol Content Calculator</h2>
        </div>
        <p className="text-amber-100 mt-1">Calculate your estimated BAC and understand the effects</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter weight"
                aria-label="Weight in pounds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Drinks
              </label>
              <input
                type="number"
                value={drinks}
                onChange={(e) => setDrinks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter drinks"
                aria-label="Number of drinks consumed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drink Type
              </label>
              <select
                value={drinkType}
                onChange={(e) => setDrinkType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Select drink type"
              >
                <option value="beer">Beer</option>
                <option value="wine">Wine</option>
                <option value="liquor">Liquor</option>
                <option value="mixed">Mixed Drink</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drink Size
              </label>
              <select
                value={drinkSize}
                onChange={(e) => setDrinkSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Select drink size"
              >
                <option value="12oz">12 oz (Beer)</option>
                <option value="16oz">16 oz (Tall Beer)</option>
                <option value="22oz">22 oz (Bomber)</option>
                <option value="5oz">5 oz (Wine)</option>
                <option value="6oz">6 oz (Wine)</option>
                <option value="8oz">8 oz (Wine)</option>
                <option value="1.5oz">1.5 oz (Shot)</option>
                <option value="2oz">2 oz (Double)</option>
                <option value="3oz">3 oz (Triple)</option>
                <option value="8oz">8 oz (Mixed)</option>
                <option value="10oz">10 oz (Mixed)</option>
                <option value="12oz">12 oz (Mixed)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Elapsed (hours)
              </label>
              <input
                type="number"
                value={timeElapsed}
                onChange={(e) => setTimeElapsed(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter hours"
                step="0.5"
                aria-label="Time elapsed since first drink in hours"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Blood Alcohol Content</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {result.bac.toFixed(3)}%
                </div>
                <div className="text-amber-700">
                  {result.effects}
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Calculation Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-700">Original BAC:</span>
                  <span className="font-semibold text-amber-800">{result.details.originalBAC?.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Metabolized BAC:</span>
                  <span className="font-semibold text-amber-800">{result.details.metabolizedBAC?.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Time to Zero:</span>
                  <span className="font-semibold text-amber-800">{result.timeToZero?.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Distribution Ratio:</span>
                  <span className="font-semibold text-amber-800">{result.details.distributionRatio}</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">Recommendations</h3>
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

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Important Disclaimer</h3>
              <div className="text-sm text-red-700">
                This calculator provides estimates only and should not be used to determine if you are safe to drive. 
                Many factors affect actual BAC including food, medications, tolerance, and individual metabolism. 
                When in doubt, don't drive. Always plan for a designated driver or alternative transportation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
