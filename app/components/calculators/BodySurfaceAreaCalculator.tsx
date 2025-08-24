'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Ruler } from 'lucide-react'

export default function BodySurfaceAreaCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [formula, setFormula] = useState('dubois')
  const [showResults, setShowResults] = useState(false)

  const calculateBSA = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (w === 0 || h === 0) return { 
      bsa: 0, 
      formulas: {
        dubois: 0,
        mosteller: 0,
        haycock: 0,
        gehan: 0,
        boyd: 0
      }, 
      recommendations: [],
      formulaName: ''
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const weightKg = w * 0.453592
    const heightM = heightCm / 100

    // Calculate BSA using different formulas
    const formulas = {
      dubois: 0,
      mosteller: 0,
      haycock: 0,
      gehan: 0,
      boyd: 0
    }

    // DuBois & DuBois formula (most common)
    formulas.dubois = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725)

    // Mosteller formula
    formulas.mosteller = Math.sqrt((weightKg * heightCm) / 3600)

    // Haycock formula
    formulas.haycock = 0.024265 * Math.pow(weightKg, 0.5378) * Math.pow(heightCm, 0.3964)

    // Gehan & George formula
    formulas.gehan = 0.0235 * Math.pow(weightKg, 0.51456) * Math.pow(heightCm, 0.42246)

    // Boyd formula
    formulas.boyd = 0.0003207 * Math.pow(weightKg, 0.7285 - 0.0188 * Math.log10(weightKg)) * Math.pow(heightCm, 0.3)

    // Use selected formula or average
    let bsa = 0
    let formulaName = ''

    switch (formula) {
      case 'dubois':
        bsa = formulas.dubois
        formulaName = 'DuBois & DuBois (Most Common)'
        break
      case 'mosteller':
        bsa = formulas.mosteller
        formulaName = 'Mosteller'
        break
      case 'haycock':
        bsa = formulas.haycock
        formulaName = 'Haycock'
        break
      case 'gehan':
        bsa = formulas.gehan
        formulaName = 'Gehan & George'
        break
      case 'boyd':
        bsa = formulas.boyd
        formulaName = 'Boyd'
        break
      default:
        bsa = formulas.dubois
        formulaName = 'DuBois & DuBois (Most Common)'
    }

    // Generate recommendations
    const recommendations = []
    if (bsa > 0) {
      recommendations.push(`Your body surface area is approximately ${bsa.toFixed(2)} m²`)
      
      if (bsa < 1.5) {
        recommendations.push('Small body surface area - consider lower medication dosages')
        recommendations.push('May require adjusted nutritional needs')
      } else if (bsa < 2.0) {
        recommendations.push('Average body surface area - standard calculations apply')
        recommendations.push('Normal medication dosing typically appropriate')
      } else {
        recommendations.push('Large body surface area - may require higher medication dosages')
        recommendations.push('Consider increased nutritional requirements')
      }
      
      recommendations.push('BSA is used for medication dosing, chemotherapy, and burn assessment')
      recommendations.push('Consult healthcare provider for medical applications')
    }

    return { bsa, formulas, recommendations, formulaName }
  }, [weight, height, age, gender, formula])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setAge('')
    setGender('male')
    setFormula('dubois')
    setShowResults(false)
  }

  const result = showResults ? calculateBSA() : { 
    bsa: 0, 
    formulas: {
      dubois: 0,
      mosteller: 0,
      haycock: 0,
      gehan: 0,
      boyd: 0
    }, 
    recommendations: [],
    formulaName: ''
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <Ruler className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Body Surface Area Calculator</h2>
        </div>
        <p className="text-violet-100 mt-1">Calculate body surface area using multiple formulas</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter weight"
                aria-label="Weight in pounds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (ft or cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter age"
                aria-label="Age in years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formula
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Select calculation formula"
            >
              <option value="dubois">DuBois & DuBois (Most Common)</option>
              <option value="mosteller">Mosteller</option>
              <option value="haycock">Haycock</option>
              <option value="gehan">Gehan & George</option>
              <option value="boyd">Boyd</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="text-lg font-semibold text-violet-800 mb-2">Body Surface Area</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 mb-2">
                  {result.bsa.toFixed(2)} m²
                </div>
                <div className="text-violet-700">
                  Using {result.formulaName}
                </div>
              </div>
            </div>

            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="text-lg font-semibold text-violet-800 mb-3">All Formulas Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-violet-700">DuBois & DuBois:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.dubois?.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700">Mosteller:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.mosteller?.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700">Haycock:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.haycock?.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700">Gehan & George:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.gehan?.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700">Boyd:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.boyd?.toFixed(2)} m²</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                <h3 className="text-lg font-semibold text-violet-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-violet-600 mr-2">•</span>
                      <span className="text-violet-700">{rec}</span>
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
