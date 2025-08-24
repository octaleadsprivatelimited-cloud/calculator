'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Shield } from 'lucide-react'

export default function ArmyBodyFatCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [height, setHeight] = useState('')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [hip, setHip] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateArmyBodyFat = useCallback(() => {
    const a = parseFloat(age) || 0
    const h = parseFloat(height) || 0
    const w = parseFloat(waist) || 0
    const n = parseFloat(neck) || 0
    const hip_cm = parseFloat(hip) || 0

    if (h === 0 || w === 0 || n === 0) return { 
      bodyFat: 0, 
      category: '', 
      standards: {}, 
      measurements: {
        height: 0,
        waist: 0,
        neck: 0,
        hip: 0,
        ageGroup: ''
      } 
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    let bodyFat = 0
    let category = ''

    // US Army body fat calculation
    if (gender === 'male') {
      bodyFat = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(heightCm) + 36.76
    } else {
      if (hip_cm === 0) return { 
        bodyFat: 0, 
        category: '', 
        standards: {}, 
        measurements: {
          height: 0,
          waist: 0,
          neck: 0,
          hip: 0,
          ageGroup: ''
        } 
      }
      bodyFat = 163.205 * Math.log10(w + hip_cm - n) - 97.684 * Math.log10(heightCm) - 78.387
    }

    bodyFat = Math.max(0, Math.min(100, bodyFat))

    // Army standards by age and gender
    const standards = {
      male: {
        '17-20': { max: 20, category: 'Excellent: ≤20%' },
        '21-27': { max: 22, category: 'Good: ≤22%' },
        '28-39': { max: 24, category: 'Fair: ≤24%' },
        '40+': { max: 26, category: 'Acceptable: ≤26%' }
      },
      female: {
        '17-20': { max: 30, category: 'Excellent: ≤30%' },
        '21-27': { max: 32, category: 'Good: ≤32%' },
        '28-39': { max: 34, category: 'Fair: ≤34%' },
        '40+': { max: 36, category: 'Acceptable: ≤36%' }
      }
    }

    // Determine age group
    let ageGroup = ''
    if (a < 21) ageGroup = '17-20'
    else if (a < 28) ageGroup = '21-27'
    else if (a < 40) ageGroup = '28-39'
    else ageGroup = '40+'

    const maxAllowed = standards[gender as keyof typeof standards][ageGroup as keyof typeof standards.male]?.max || 0
    const standardCategory = standards[gender as keyof typeof standards][ageGroup as keyof typeof standards.male]?.category || ''

    // Determine if meets standards
    if (bodyFat <= maxAllowed) {
      category = `PASS - ${standardCategory}`
    } else {
      category = `FAIL - Exceeds ${maxAllowed}% limit`
    }

    const measurements = {
      height: heightCm,
      waist,
      neck,
      hip: hip_cm,
      ageGroup
    }

    return { bodyFat, category, standards: standards[gender as keyof typeof standards], measurements }
  }, [age, gender, height, waist, neck, hip])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setGender('male')
    setHeight('')
    setWaist('')
    setNeck('')
    setHip('')
    setShowResults(false)
  }

  const result = showResults ? calculateArmyBodyFat() : { 
    bodyFat: 0, 
    category: '', 
    standards: {}, 
    measurements: {
      height: 0,
      waist: 0,
      neck: 0,
      hip: 0,
      ageGroup: ''
    } 
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Army Body Fat Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate body fat using US Army standards</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter age"
                min="17"
                max="65"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
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
                Height (ft or cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waist (cm)
              </label>
              <input
                type="number"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter waist"
                aria-label="Waist circumference in cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neck (cm)
              </label>
              <input
                type="number"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter neck"
                aria-label="Neck circumference in cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hip (cm) {gender === 'female' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter hip"
                aria-label="Hip circumference in cm"
              />
              {gender === 'female' && (
                <p className="text-xs text-gray-500 mt-1">Required for female calculations</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Body Fat %:</span>
                  <span className="font-semibold text-green-800">{result.bodyFat.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Status:</span>
                  <span className={`font-semibold ${result.category.includes('PASS') ? 'text-green-600' : 'text-red-600'}`}>
                    {result.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Age Group:</span>
                  <span className="font-semibold text-green-800">{result.measurements.ageGroup}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Army Standards</h3>
              <div className="space-y-2">
                {Object.entries(result.standards).map(([ageRange, standard]) => (
                  <div key={ageRange} className="flex justify-between">
                    <span className="text-green-700">Ages {ageRange}:</span>
                    <span className="font-semibold text-green-800">{standard.max}% max</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Measurements Used</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Height:</span>
                  <span className="font-semibold text-green-800">{result.measurements.height.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Waist:</span>
                  <span className="font-semibold text-green-800">{result.measurements.waist} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Neck:</span>
                  <span className="font-semibold text-green-800">{result.measurements.neck} cm</span>
                </div>
                {gender === 'female' && (
                  <div className="flex justify-between">
                    <span className="text-green-700">Hip:</span>
                    <span className="font-semibold text-green-800">{result.measurements.hip} cm</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
