'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Activity } from 'lucide-react'

export default function GFRCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [creatinine, setCreatinine] = useState('')
  const [race, setRace] = useState('other')
  const [showResults, setShowResults] = useState(false)

  const calculateGFR = useCallback(() => {
    const a = parseFloat(age) || 0
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const cr = parseFloat(creatinine) || 0
    if (a === 0 || w === 0 || h === 0 || cr === 0) return { 
      gfr: 0, 
      stage: '', 
      interpretation: '',
      recommendations: [],
      details: {
        cockcroftGault: 0,
        mdrd: 0,
        ckdEpi: 0,
        bsa: 0
      }
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const weightKg = w * 0.453592
    const heightM = heightCm / 100

    // Calculate BSA using DuBois formula
    const bsa = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725)

    // Cockcroft-Gault formula
    let cgGFR = 0
    if (gender === 'male') {
      cgGFR = ((140 - a) * weightKg) / (72 * cr)
    } else {
      cgGFR = ((140 - a) * weightKg) / (72 * cr) * 0.85
    }

    // MDRD formula
    let mdrdGFR = 175 * Math.pow(cr, -1.154) * Math.pow(a, -0.203)
    if (gender === 'female') mdrdGFR *= 0.742
    if (race === 'black') mdrdGFR *= 1.212

    // CKD-EPI formula
    let ckdEpiGFR = 0
    if (gender === 'male') {
      if (cr <= 0.9) {
        ckdEpiGFR = 141 * Math.pow(cr / 0.9, -0.411) * Math.pow(0.993, a)
      } else {
        ckdEpiGFR = 141 * Math.pow(cr / 0.9, -1.209) * Math.pow(0.993, a)
      }
    } else {
      if (cr <= 0.7) {
        ckdEpiGFR = 141 * Math.pow(cr / 0.7, -0.329) * Math.pow(0.993, a) * 0.993
      } else {
        ckdEpiGFR = 141 * Math.pow(cr / 0.7, -1.209) * Math.pow(0.993, a) * 0.993
      }
    }

    // Use CKD-EPI as primary result
    const gfr = ckdEpiGFR

    // Determine CKD stage
    let stage = ''
    let interpretation = ''
    if (gfr >= 90) {
      stage = 'Stage 1'
      interpretation = 'Normal or increased GFR with kidney damage'
    } else if (gfr >= 60) {
      stage = 'Stage 2'
      interpretation = 'Mildly decreased GFR with kidney damage'
    } else if (gfr >= 45) {
      stage = 'Stage 3a'
      interpretation = 'Moderately decreased GFR'
    } else if (gfr >= 30) {
      stage = 'Stage 3b'
      interpretation = 'Moderately decreased GFR'
    } else if (gfr >= 15) {
      stage = 'Stage 4'
      interpretation = 'Severely decreased GFR'
    } else {
      stage = 'Stage 5'
      interpretation = 'Kidney failure'
    }

    // Generate recommendations
    const recommendations = []
    if (gfr >= 60) {
      recommendations.push('Monitor kidney function regularly')
      recommendations.push('Maintain healthy lifestyle habits')
    } else if (gfr >= 30) {
      recommendations.push('Consult nephrologist for specialized care')
      recommendations.push('Monitor blood pressure and diabetes control')
      recommendations.push('Consider dietary modifications')
    } else {
      recommendations.push('Immediate medical attention required')
      recommendations.push('Prepare for potential dialysis or transplant')
      recommendations.push('Strict dietary and medication management')
    }

    recommendations.push('Avoid NSAIDs and nephrotoxic medications')
    recommendations.push('Control blood pressure and blood sugar')

    const details = {
      cockcroftGault: cgGFR,
      mdrd: mdrdGFR,
      ckdEpi: ckdEpiGFR,
      bsa: bsa
    }

    return { gfr, stage, interpretation, recommendations, details }
  }, [age, gender, weight, height, creatinine, race])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setGender('male')
    setWeight('')
    setHeight('')
    setCreatinine('')
    setRace('other')
    setShowResults(false)
  }

  const result = showResults ? calculateGFR() : { 
    gfr: 0, 
    stage: '', 
    interpretation: '',
    recommendations: [],
    details: {
      cockcroftGault: 0,
      mdrd: 0,
      ckdEpi: 0,
      bsa: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">GFR Calculator</h2>
        </div>
        <p className="text-teal-100 mt-1">Calculate Glomerular Filtration Rate using multiple formulas</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creatinine (mg/dL)
              </label>
              <input
                type="number"
                value={creatinine}
                onChange={(e) => setCreatinine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter creatinine"
                step="0.01"
                aria-label="Serum creatinine in mg/dL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Race
              </label>
              <select
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Select race"
              >
                <option value="other">Other</option>
                <option value="black">Black/African American</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-2">GFR Result</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {result.gfr.toFixed(1)} mL/min/1.73m²
                </div>
                <div className="text-teal-700">
                  {result.stage} - {result.interpretation}
                </div>
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-3">All Formulas Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-teal-700">Cockcroft-Gault:</span>
                  <span className="font-semibold text-teal-800">{result.details.cockcroftGault?.toFixed(1)} mL/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">MDRD:</span>
                  <span className="font-semibold text-teal-800">{result.details.mdrd?.toFixed(1)} mL/min/1.73m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">CKD-EPI (Primary):</span>
                  <span className="font-semibold text-teal-800">{result.details.ckdEpi?.toFixed(1)} mL/min/1.73m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">Body Surface Area:</span>
                  <span className="font-semibold text-teal-800">{result.details.bsa?.toFixed(2)} m²</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="text-lg font-semibold text-teal-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-teal-600 mr-2">•</span>
                      <span className="text-teal-700">{rec}</span>
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
