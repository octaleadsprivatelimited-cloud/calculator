'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Scale } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function BMICalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('lbs')
  const [heightUnit, setHeightUnit] = useState('ft')
  const [showResults, setShowResults] = useState(false)

  const calculateBMI = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    if (w === 0 || h === 0) return { bmi: 0, category: '', healthRisk: '', idealWeight: { min: 0, max: 0 } }

    let weightKg = w
    let heightM = h

    // Convert weight to kg
    if (weightUnit === 'lbs') {
      weightKg = w * 0.453592
    }

    // Convert height to meters
    if (heightUnit === 'ft') {
      heightM = h * 0.3048
    } else if (heightUnit === 'in') {
      heightM = h * 0.0254
    } else if (heightUnit === 'cm') {
      heightM = h / 100
    }

    const bmi = weightKg / (heightM * heightM)

    let category = ''
    let healthRisk = ''

    if (bmi < 18.5) {
      category = 'Underweight'
      healthRisk = 'Low (but may indicate malnutrition)'
    } else if (bmi < 25) {
      category = 'Normal weight'
      healthRisk = 'Low'
    } else if (bmi < 30) {
      category = 'Overweight'
      healthRisk = 'Moderate'
    } else if (bmi < 35) {
      category = 'Obese Class I'
      healthRisk = 'High'
    } else if (bmi < 40) {
      category = 'Obese Class II'
      healthRisk = 'Very High'
    } else {
      category = 'Obese Class III'
      healthRisk = 'Extremely High'
    }

    // Calculate ideal weight range
    const idealMin = 18.5 * heightM * heightM
    const idealMax = 24.9 * heightM * heightM

    let idealWeight = { min: idealMin, max: idealMax }
    if (weightUnit === 'lbs') {
      idealWeight = { min: idealMin * 2.20462, max: idealMax * 2.20462 }
    }

    return { bmi, category, healthRisk, idealWeight }
  }, [weight, height, weightUnit, heightUnit])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setWeightUnit('lbs')
    setHeightUnit('ft')
    setShowResults(false)
  }

  const result = showResults ? calculateBMI() : { bmi: 0, category: '', healthRisk: '', idealWeight: { min: 0, max: 0 } }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
        <div className="flex items-center">
          <Scale className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">BMI Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate your Body Mass Index and health status</p>
      </div>

      <div className="p-6">
        {/* Share Options - Moved to Top */}
        {showResults && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <ResultSharing
              title="BMI Calculator Result"
              inputs={[
                { label: "Weight", value: `${weight} ${weightUnit}` },
                { label: "Height", value: `${height} ${heightUnit}` }
              ]}
              result={{ 
                label: "BMI", 
                value: result.bmi.toFixed(1),
                unit: ""
              }}
              calculatorName="BMI Calculator"
              className="mb-0"
            />
          </div>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter weight"
                  aria-label="Weight value"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Weight unit"
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter height"
                  aria-label="Height value"
                />
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value)}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Height unit"
                >
                  <option value="ft">ft</option>
                  <option value="in">in</option>
                  <option value="cm">cm</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">BMI:</span>
                <span className="font-semibold text-blue-800">{result.bmi.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Category:</span>
                <span className="font-semibold text-blue-800">{result.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Health Risk:</span>
                <span className="font-semibold text-blue-800">{result.healthRisk}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Ideal Weight Range:</span>
                  <span className="font-semibold text-blue-800">
                    {result.idealWeight.min.toFixed(1)} - {result.idealWeight.max.toFixed(1)} {weightUnit}
                  </span>
                </div>
              </div>
            </div>
            

          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About BMI Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our free BMI calculator helps you determine your Body Mass Index (BMI) and understand what it means for your health. 
              BMI is a simple measure that uses your height and weight to work out if your weight is healthy.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What is BMI?</h4>
            <p className="text-gray-700 mb-4">
              Body Mass Index (BMI) is a number calculated from your weight and height. It provides a reliable indicator 
              of body fatness for most people and is used to screen for weight categories that may lead to health problems.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">BMI Categories</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Underweight:</strong> BMI less than 18.5</li>
              <li><strong>Normal weight:</strong> BMI 18.5 to 24.9</li>
              <li><strong>Overweight:</strong> BMI 25 to 29.9</li>
              <li><strong>Obese Class I:</strong> BMI 30 to 34.9</li>
              <li><strong>Obese Class II:</strong> BMI 35 to 39.9</li>
              <li><strong>Obese Class III:</strong> BMI 40 or greater</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Features</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Multiple unit support (lbs/kg, ft/in/cm)</li>
              <li>Instant BMI calculation and categorization</li>
              <li>Health risk assessment</li>
              <li>Ideal weight range calculation</li>
              <li>Mobile-friendly design</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Important Note</h4>
            <p className="text-gray-700">
              While BMI is a useful screening tool, it doesn't measure body fat directly or account for factors like muscle mass, 
              bone density, age, sex, and ethnicity. For a complete health assessment, consult with a healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
