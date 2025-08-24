'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, AlertTriangle } from 'lucide-react'

export default function AnorexicBMICalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('female')
  const [showResults, setShowResults] = useState(false)

  const calculateAnorexicBMI = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (w === 0 || h === 0) return { 
      bmi: 0, 
      category: '', 
      riskLevel: '',
      recommendations: [],
      details: {
        heightCm: 0,
        heightM: 0,
        weightKg: 0,
        minIdealWeight: 0,
        maxIdealWeight: 0,
        weightDeficit: 0
      }
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const weightKg = w * 0.453592
    const heightM = heightCm / 100

    // Calculate BMI
    const bmi = weightKg / (heightM * heightM)

    // Determine category and risk level
    let category = ''
    let riskLevel = ''
    let recommendations = []

    if (bmi < 16.0) {
      category = 'Severe Underweight'
      riskLevel = 'Extreme Risk'
      recommendations = [
        'Immediate medical attention required',
        'Hospitalization may be necessary',
        'Severe malnutrition risk',
        'Life-threatening complications possible'
      ]
    } else if (bmi < 17.0) {
      category = 'Moderate Underweight'
      riskLevel = 'High Risk'
      recommendations = [
        'Urgent medical evaluation needed',
        'Nutritional intervention required',
        'Monitor vital signs closely',
        'Consider inpatient treatment'
      ]
    } else if (bmi < 18.5) {
      category = 'Mild Underweight'
      riskLevel = 'Moderate Risk'
      recommendations = [
        'Medical evaluation recommended',
        'Nutritional counseling needed',
        'Regular weight monitoring',
        'Address underlying causes'
      ]
    } else if (bmi < 25.0) {
      category = 'Normal Weight'
      riskLevel = 'Low Risk'
      recommendations = [
        'Maintain healthy weight',
        'Balanced nutrition',
        'Regular exercise',
        'Annual health checkups'
      ]
    } else if (bmi < 30.0) {
      category = 'Overweight'
      riskLevel = 'Moderate Risk'
      recommendations = [
        'Weight management consultation',
        'Increase physical activity',
        'Balanced diet',
        'Regular health monitoring'
      ]
    } else {
      category = 'Obese'
      riskLevel = 'High Risk'
      recommendations = [
        'Medical weight loss program',
        'Lifestyle modification',
        'Regular health monitoring',
        'Consider specialist consultation'
      ]
    }

    // Calculate ideal weight range
    const minIdealWeight = 18.5 * heightM * heightM
    const maxIdealWeight = 24.9 * heightM * heightM
    const weightDeficit = minIdealWeight - weightKg

    const details = {
      heightCm,
      heightM,
      weightKg,
      minIdealWeight,
      maxIdealWeight,
      weightDeficit
    }

    return { bmi, category, riskLevel, recommendations, details }
  }, [weight, height, age, gender])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setAge('')
    setGender('female')
    setShowResults(false)
  }

  const result = showResults ? calculateAnorexicBMI() : { 
    bmi: 0, 
    category: '', 
    riskLevel: '',
    recommendations: [],
    details: {
      heightCm: 0,
      heightM: 0,
      weightKg: 0,
      minIdealWeight: 0,
      maxIdealWeight: 0,
      weightDeficit: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <AlertTriangle className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Anorexic BMI Calculator</h2>
        </div>
        <p className="text-red-100 mt-1">Calculate BMI and assess underweight risk levels</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Select gender"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">BMI Results</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {result.bmi.toFixed(1)}
                </div>
                <div className="text-red-700">
                  {result.category}
                </div>
                <div className="text-red-600 font-medium">
                  Risk Level: {result.riskLevel}
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Weight Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-700">Current Weight:</span>
                  <span className="font-semibold text-red-800">{result.details.weightKg?.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Ideal Weight Range:</span>
                  <span className="font-semibold text-red-800">
                    {result.details.minIdealWeight?.toFixed(1)} - {result.details.maxIdealWeight?.toFixed(1)} kg
                  </span>
                </div>
                {result.details.weightDeficit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-red-700">Weight Deficit:</span>
                    <span className="font-semibold text-red-800">
                      {result.details.weightDeficit?.toFixed(1)} kg
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-red-700">Height:</span>
                  <span className="font-semibold text-red-800">
                    {result.details.heightCm?.toFixed(1)} cm
                  </span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-red-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Important Notice</h3>
              <div className="text-sm text-yellow-700">
                This calculator is for educational purposes only. If you or someone you know is struggling with 
                eating disorders or extreme weight loss, please seek professional medical help immediately. 
                Eating disorders are serious mental health conditions that require specialized treatment.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
