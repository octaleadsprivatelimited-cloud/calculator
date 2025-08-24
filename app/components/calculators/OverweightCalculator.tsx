'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Scale } from 'lucide-react'

export default function OverweightCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [showResults, setShowResults] = useState(false)

  const calculateOverweight = useCallback(() => {
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
        weightExcess: 0,
        weightDeficit: 0,
        bodyFatEstimate: 0
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

    if (bmi < 18.5) {
      category = 'Underweight'
      riskLevel = 'Low Risk'
      recommendations = [
        'Consider healthy weight gain',
        'Focus on nutrient-dense foods',
        'Consult healthcare provider if unintentional'
      ]
    } else if (bmi < 25.0) {
      category = 'Normal Weight'
      riskLevel = 'Low Risk'
      recommendations = [
        'Maintain current weight',
        'Continue healthy lifestyle',
        'Regular exercise and balanced diet'
      ]
    } else if (bmi < 30.0) {
      category = 'Overweight'
      riskLevel = 'Moderate Risk'
      recommendations = [
        'Weight loss recommended',
        'Increase physical activity',
        'Reduce caloric intake',
        'Focus on whole foods'
      ]
    } else if (bmi < 35.0) {
      category = 'Class I Obesity'
      riskLevel = 'High Risk'
      recommendations = [
        'Medical weight loss program recommended',
        'Lifestyle modification essential',
        'Regular health monitoring',
        'Consider specialist consultation'
      ]
    } else if (bmi < 40.0) {
      category = 'Class II Obesity'
      riskLevel = 'Very High Risk'
      recommendations = [
        'Immediate medical intervention needed',
        'Comprehensive weight loss program',
        'Monitor for complications',
        'Specialist care required'
      ]
    } else {
      category = 'Class III Obesity (Morbid)'
      riskLevel = 'Extreme Risk'
      recommendations = [
        'Urgent medical attention required',
        'Consider bariatric surgery evaluation',
        'Intensive medical management',
        'Monitor for life-threatening complications'
      ]
    }

    // Calculate ideal weight range
    const minIdealWeight = 18.5 * heightM * heightM
    const maxIdealWeight = 24.9 * heightM * heightM
    const weightExcess = weightKg > maxIdealWeight ? weightKg - maxIdealWeight : 0
    const weightDeficit = weightKg < minIdealWeight ? minIdealWeight - weightKg : 0

    // Calculate body fat percentage estimate
    let bodyFatEstimate = 0
    if (gender === 'male') {
      bodyFatEstimate = (1.20 * bmi) + (0.23 * a) - 16.2
    } else {
      bodyFatEstimate = (1.20 * bmi) + (0.23 * a) - 5.4
    }
    bodyFatEstimate = Math.max(0, Math.min(100, bodyFatEstimate))

    const details = {
      heightCm,
      heightM,
      weightKg,
      minIdealWeight,
      maxIdealWeight,
      weightExcess,
      weightDeficit,
      bodyFatEstimate
    }

    return { bmi, category, riskLevel, recommendations, details }
  }, [weight, height, age, gender])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setAge('')
    setGender('male')
    setShowResults(false)
  }

  const result = showResults ? calculateOverweight() : { 
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
      weightExcess: 0,
      weightDeficit: 0,
      bodyFatEstimate: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <div className="flex items-center">
          <Scale className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Overweight Calculator</h2>
        </div>
        <p className="text-orange-100 mt-1">Calculate BMI and assess weight-related health risks</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">BMI Results</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {result.bmi.toFixed(1)}
                </div>
                <div className="text-orange-700">
                  {result.category}
                </div>
                <div className="text-orange-600 font-medium">
                  Risk Level: {result.riskLevel}
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Weight Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-orange-700">Current Weight:</span>
                  <span className="font-semibold text-orange-800">{result.details.weightKg?.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Ideal Weight Range:</span>
                  <span className="font-semibold text-orange-800">
                    {result.details.minIdealWeight?.toFixed(1)} - {result.details.maxIdealWeight?.toFixed(1)} kg
                  </span>
                </div>
                {result.details.weightExcess > 0 && (
                  <div className="flex justify-between">
                    <span className="text-orange-700">Weight Excess:</span>
                    <span className="font-semibold text-orange-800">
                      {result.details.weightExcess?.toFixed(1)} kg
                    </span>
                  </div>
                )}
                {result.details.weightDeficit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-orange-700">Weight Deficit:</span>
                    <span className="font-semibold text-orange-800">
                      {result.details.weightDeficit?.toFixed(1)} kg
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-orange-700">Height:</span>
                  <span className="font-semibold text-orange-800">
                    {result.details.heightCm?.toFixed(1)} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Estimated Body Fat:</span>
                  <span className="font-semibold text-orange-800">
                    {result.details.bodyFatEstimate?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-orange-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Health Tips</h3>
              <div className="text-sm text-blue-700">
                • BMI is a screening tool, not a diagnostic measure<br/>
                • Consult healthcare provider for personalized advice<br/>
                • Focus on sustainable lifestyle changes<br/>
                • Regular physical activity and balanced nutrition are key
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
