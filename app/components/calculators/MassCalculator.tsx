'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Scale, Zap } from 'lucide-react'

interface MassResult {
  grams: number
  kilograms: number
  pounds: number
  ounces: number
  milligrams: number
  tons: number
}

const MASS_UNITS = {
  g: { name: 'Grams (g)', factor: 1 },
  kg: { name: 'Kilograms (kg)', factor: 1000 },
  lb: { name: 'Pounds (lb)', factor: 453.592 },
  oz: { name: 'Ounces (oz)', factor: 28.3495 },
  mg: { name: 'Milligrams (mg)', factor: 0.001 },
  t: { name: 'Metric Tons (t)', factor: 1000000 }
}

const COMMON_MASSES = [
  { name: 'Paper Clip', mass: 1.5, unit: 'g' },
  { name: 'US Penny', mass: 2.5, unit: 'g' },
  { name: 'Apple', mass: 150, unit: 'g' },
  { name: 'Baseball', mass: 145, unit: 'g' },
  { name: 'Human Brain', mass: 1.4, unit: 'kg' },
  { name: 'Gallon of Water', mass: 3.785, unit: 'kg' },
  { name: 'Adult Human', mass: 70, unit: 'kg' },
  { name: 'Small Car', mass: 1000, unit: 'kg' }
]

export default function MassCalculator() {
  const [inputValue, setInputValue] = useState('')
  const [fromUnit, setFromUnit] = useState('g')
  const [showResults, setShowResults] = useState(false)

  const convertMass = useCallback((value: number, fromUnit: string): MassResult => {
    const grams = value * MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].factor
    
    return {
      grams,
      kilograms: grams / 1000,
      pounds: grams / 453.592,
      ounces: grams / 28.3495,
      milligrams: grams * 1000,
      tons: grams / 1000000
    }
  }, [])

  const handleCalculate = () => {
    if (inputValue && parseFloat(inputValue) > 0) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setInputValue('')
    setFromUnit('g')
    setShowResults(false)
  }

  const handleCommonMass = (mass: number, unit: string) => {
    setInputValue(mass.toString())
    setFromUnit(unit)
    setShowResults(true)
  }

  const formatNumber = (num: number, decimals: number = 3) => {
    if (isNaN(num) || !isFinite(num)) return '0.000'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = convertMass(parseFloat(inputValue), fromUnit)
    
    const data = `Mass Calculator Results

Input: ${inputValue} ${MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].name}

Converted Masses:
- Grams: ${formatNumber(result.grams)} g
- Kilograms: ${formatNumber(result.kilograms)} kg
- Pounds: ${formatNumber(result.pounds)} lb
- Ounces: ${formatNumber(result.ounces)} oz
- Milligrams: ${formatNumber(result.milligrams)} mg
- Metric Tons: ${formatNumber(result.tons)} t`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mass-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = convertMass(parseFloat(inputValue), fromUnit)
      
      navigator.share({
        title: 'Mass Calculator Results',
        text: `${inputValue} ${MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].name} = ${formatNumber(result.kilograms)} kg, ${formatNumber(result.pounds)} lb`,
        url: window.location.href
      })
    } else {
      const text = `Mass: ${inputValue} ${MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].name}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? convertMass(parseFloat(inputValue), fromUnit) : { grams: 0, kilograms: 0, pounds: 0, ounces: 0, milligrams: 0, tons: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mass Calculator</h1>
            <p className="text-orange-100 text-lg">
              Convert between mass units including grams, kilograms, pounds, ounces, and more. 
              Perfect for cooking, science experiments, and weight conversions.
            </p>
          </div>
          <div className="hidden md:block">
            <Scale className="w-16 h-16 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Mass Input */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Convert Mass</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mass Value
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="100"
                  min="0"
                  step="0.001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Unit
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Select mass unit"
                >
                  {Object.entries(MASS_UNITS).map(([key, unit]) => (
                    <option key={key} value={key}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Common Masses */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Masses</h3>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_MASSES.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleCommonMass(item.mass, item.unit)}
                  className="text-left p-2 bg-white rounded border hover:bg-orange-50 transition-colors text-sm"
                >
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-gray-600">{item.mass} {item.unit}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            disabled={!inputValue || parseFloat(inputValue) <= 0}
            className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 ${
              !inputValue || parseFloat(inputValue) <= 0
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Convert Mass</span>
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Mass Conversions */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">Mass Conversions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.grams)}</div>
                  <div className="text-sm text-gray-600">Grams (g)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.kilograms)}</div>
                  <div className="text-sm text-gray-600">Kilograms (kg)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.pounds)}</div>
                  <div className="text-sm text-gray-600">Pounds (lb)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.ounces)}</div>
                  <div className="text-sm text-gray-600">Ounces (oz)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.milligrams)}</div>
                  <div className="text-sm text-gray-600">Milligrams (mg)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.tons)}</div>
                  <div className="text-sm text-gray-600">Metric Tons (t)</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={shareResults}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={printResults}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Mass Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator converts between different mass units commonly used in everyday life. 
                Mass is a measure of the amount of matter in an object, different from weight which 
                depends on gravity. Use it for cooking recipes, science experiments, or understanding 
                weight measurements from different countries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
