'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Scale, Info } from 'lucide-react'
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
      healthRisk = 'Low'
    } else if (bmi < 25) {
      category = 'Normal'
      healthRisk = 'Low'
    } else if (bmi < 30) {
      category = 'Overweight'
      healthRisk = 'Moderate'
    } else {
      category = 'Obese'
      healthRisk = 'High'
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
    <div className="w-full bg-white rounded-3xl shadow-google border border-google-border overflow-hidden">
      {/* Title Bar */}
      <div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-google-blueLight rounded-xl">
            <Scale className="w-5 h-5 text-google-blue" />
          </div>
          <div>
            <h1 className="text-xl font-medium text-google-text">BMI Calculator</h1>
            <p className="text-google-gray text-xs">Calculate your Body Mass Index</p>
          </div>
        </div>
        <Info className="w-5 h-5 text-google-gray opacity-50 cursor-help" />
      </div>

      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Inputs Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-google-text px-1">Weight</label>
                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)} 
                      className="w-full px-4 py-3 bg-google-lightGray border-none rounded-2xl focus:ring-2 focus:ring-google-blue transition-all outline-none text-google-text placeholder-google-gray/50" 
                      placeholder="0"
                    />
                  </div>
                  <select 
                    value={weightUnit} 
                    onChange={(e) => setWeightUnit(e.target.value)} 
                    className="w-24 px-4 py-3 bg-google-lightGray border-none rounded-2xl focus:ring-2 focus:ring-google-blue transition-all outline-none text-google-text appearance-none cursor-pointer text-center"
                    aria-label="Weight unit"
                  >
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-google-text px-1">Height</label>
                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <input 
                      type="number" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)} 
                      className="w-full px-4 py-3 bg-google-lightGray border-none rounded-2xl focus:ring-2 focus:ring-google-blue transition-all outline-none text-google-text placeholder-google-gray/50" 
                      placeholder="0"
                    />
                  </div>
                  <select 
                    value={heightUnit} 
                    onChange={(e) => setHeightUnit(e.target.value)} 
                    className="w-24 px-4 py-3 bg-google-lightGray border-none rounded-2xl focus:ring-2 focus:ring-google-blue transition-all outline-none text-google-text appearance-none cursor-pointer text-center"
                    aria-label="Height unit"
                  >
                    <option value="ft">ft</option>
                    <option value="in">in</option>
                    <option value="cm">cm</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={handleCalculate} 
                className="flex-1 bg-google-blue hover:bg-google-blueHover text-white font-medium py-3.5 px-6 rounded-full transition-all flex items-center justify-center shadow-sm"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate BMI
              </button>
              <button 
                onClick={handleReset} 
                className="bg-google-lightGray hover:bg-google-border text-google-text font-medium py-3.5 px-6 rounded-full transition-all flex items-center justify-center"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="flex flex-col">
            {!showResults ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-google-bg rounded-3xl border border-dashed border-google-border">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  <Scale className="w-8 h-8 text-google-gray opacity-20" />
                </div>
                <h3 className="text-google-text font-medium mb-1">Enter your metrics</h3>
                <p className="text-google-gray text-sm text-center">Calculate your BMI to understand your body weight status and health category.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-4">
                {/* Primary Result */}
                <div className="p-6 bg-google-blueLight rounded-3xl border border-google-blue/10 relative overflow-hidden group text-center">
                  <h3 className="text-google-blue font-medium mb-1 text-sm uppercase tracking-wider">Your BMI</h3>
                  <div className="text-5xl font-light text-google-blue tracking-tight mb-2">
                    {result.bmi.toFixed(1)}
                  </div>
                  <div className="inline-flex px-4 py-1.5 bg-white rounded-full text-google-blue font-medium text-sm shadow-sm border border-google-blue/10">
                    {result.category}
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-4 bg-white border border-google-border rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-google-gray text-xs">Ideal weight for your height</span>
                    <Info className="w-3 h-3 text-google-gray opacity-30" />
                  </div>
                  <div className="text-lg font-medium text-google-text">
                    {result.idealWeight.min.toFixed(1)} - {result.idealWeight.max.toFixed(1)} {weightUnit}
                  </div>
                </div>

                {/* Share/Actions */}
                <div className="mt-2">
                  <ResultSharing
                    title="BMI Health Result"
                    inputs={[
                      { label: "Weight", value: `${weight}${weightUnit}` },
                      { label: "Height", value: `${height}${heightUnit}` }
                    ]}
                    result={{ 
                      label: "BMI Score", 
                      value: result.bmi.toFixed(1),
                      unit: ""
                    }}
                    calculatorName="BMI Calculator"
                    className="p-0 border-none shadow-none bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
