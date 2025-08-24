'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, ArrowLeftRight, Ruler, Scale, Thermometer } from 'lucide-react'

interface ConversionResult {
  fromValue: number
  toValue: number
  fromUnit: string
  toUnit: string
  conversionFactor: number
  formula: string
}

interface ConversionCategory {
  name: string
  icon: React.ReactNode
  units: ConversionUnit[]
}

interface ConversionUnit {
  name: string
  symbol: string
  category: string
  toBase: number
  fromBase: number
}

const CONVERSION_CATEGORIES: ConversionCategory[] = [
  {
    name: 'Length',
    icon: <Ruler className="w-5 h-5" />,
    units: [
      { name: 'Meter', symbol: 'm', category: 'length', toBase: 1, fromBase: 1 },
      { name: 'Centimeter', symbol: 'cm', category: 'length', toBase: 0.01, fromBase: 100 },
      { name: 'Kilometer', symbol: 'km', category: 'length', toBase: 1000, fromBase: 0.001 },
      { name: 'Inch', symbol: 'in', category: 'length', toBase: 0.0254, fromBase: 39.3701 },
      { name: 'Foot', symbol: 'ft', category: 'length', toBase: 0.3048, fromBase: 3.28084 },
      { name: 'Yard', symbol: 'yd', category: 'length', toBase: 0.9144, fromBase: 1.09361 },
      { name: 'Mile', symbol: 'mi', category: 'length', toBase: 1609.34, fromBase: 0.000621371 }
    ]
  },
  {
    name: 'Weight',
    icon: <Scale className="w-5 h-5" />,
    units: [
      { name: 'Kilogram', symbol: 'kg', category: 'weight', toBase: 1, fromBase: 1 },
      { name: 'Gram', symbol: 'g', category: 'weight', toBase: 0.001, fromBase: 1000 },
      { name: 'Pound', symbol: 'lb', category: 'weight', toBase: 0.453592, fromBase: 2.20462 },
      { name: 'Ounce', symbol: 'oz', category: 'weight', toBase: 0.0283495, fromBase: 35.274 },
      { name: 'Ton (US)', symbol: 'ton', category: 'weight', toBase: 907.185, fromBase: 0.00110231 },
      { name: 'Ton (Metric)', symbol: 't', category: 'weight', toBase: 1000, fromBase: 0.001 }
    ]
  },
  {
    name: 'Temperature',
    icon: <Thermometer className="w-5 h-5" />,
    units: [
      { name: 'Celsius', symbol: '°C', category: 'temperature', toBase: 1, fromBase: 1 },
      { name: 'Fahrenheit', symbol: '°F', category: 'temperature', toBase: 1, fromBase: 1 },
      { name: 'Kelvin', symbol: 'K', category: 'temperature', toBase: 1, fromBase: 1 }
    ]
  }
]

export default function ConversionCalculator() {
  const [selectedCategory, setSelectedCategory] = useState('Length')
  const [fromValue, setFromValue] = useState('')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [showResults, setShowResults] = useState(false)

  const getCurrentUnits = () => {
    return CONVERSION_CATEGORIES.find(cat => cat.name === selectedCategory)?.units || []
  }

  const convertValue = useCallback((): ConversionResult => {
    const value = parseFloat(fromValue) || 0
    if (value === 0 || !fromUnit || !toUnit) return {
      fromValue: 0,
      toValue: 0,
      fromUnit: '',
      toUnit: '',
      conversionFactor: 0,
      formula: ''
    }

    const units = getCurrentUnits()
    const fromUnitData = units.find(u => u.symbol === fromUnit)
    const toUnitData = units.find(u => u.symbol === toUnit)

    if (!fromUnitData || !toUnitData) return {
      fromValue: 0,
      toValue: 0,
      fromUnit: '',
      toUnit: '',
      conversionFactor: 0,
      formula: ''
    }

    let convertedValue: number
    let conversionFactor: number
    let formula: string

    if (selectedCategory === 'Temperature') {
      // Special handling for temperature conversions
      let celsius: number
      
      // Convert to Celsius first
      if (fromUnit === '°F') {
        celsius = (value - 32) * 5/9
      } else if (fromUnit === 'K') {
        celsius = value - 273.15
      } else {
        celsius = value
      }
      
      // Convert from Celsius to target unit
      if (toUnit === '°F') {
        convertedValue = celsius * 9/5 + 32
        formula = `(°C × 9/5) + 32`
      } else if (toUnit === 'K') {
        convertedValue = celsius + 273.15
        formula = `°C + 273.15`
      } else {
        convertedValue = celsius
        formula = `Direct conversion`
      }
      
      conversionFactor = convertedValue / value
    } else {
      // Standard conversion for length and weight
      const baseValue = value * fromUnitData.toBase
      convertedValue = baseValue * toUnitData.fromBase
      conversionFactor = convertedValue / value
      formula = `${value} × ${fromUnitData.toBase} × ${toUnitData.fromBase}`
    }

    return {
      fromValue: value,
      toValue: convertedValue,
      fromUnit,
      toUnit,
      conversionFactor,
      formula
    }
  }, [fromValue, fromUnit, toUnit, selectedCategory])

  const handleCalculate = () => {
    if (fromValue && fromUnit && toUnit && fromUnit !== toUnit) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setFromValue('')
    setFromUnit('')
    setToUnit('')
    setShowResults(false)
  }

  const handleQuickCategory = (category: ConversionCategory) => {
    setSelectedCategory(category.name)
    setFromUnit('')
    setToUnit('')
    setShowResults(false)
  }

  const handleUnitChange = (unit: string, isFrom: boolean) => {
    if (isFrom) {
      setFromUnit(unit)
      if (toUnit === unit) setToUnit('')
    } else {
      setToUnit(unit)
    }
    setShowResults(false)
  }

  const formatNumber = (num: number, decimals: number = 4) => {
    if (isNaN(num) || !isFinite(num)) return '0.0000'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = convertValue()
    
    const data = `Conversion Calculator Results

Category: ${selectedCategory}
From: ${result.fromValue} ${result.fromUnit}
To: ${result.toValue} ${result.toUnit}

Conversion Details:
- Conversion Factor: ${formatNumber(result.conversionFactor)}
- Formula: ${result.formula}

Unit Information:
- From Unit: ${result.fromUnit}
- To Unit: ${result.toUnit}
- Category: ${selectedCategory}

Result: ${result.fromValue} ${result.fromUnit} = ${formatNumber(result.toValue)} ${result.toUnit}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'conversion-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = convertValue()
      
      navigator.share({
        title: 'Conversion Calculator Results',
        text: `${result.fromValue} ${result.fromUnit} = ${formatNumber(result.toValue)} ${result.toUnit}`,
        url: window.location.href
      })
    } else {
      const result = convertValue()
      const text = `${result.fromValue} ${result.fromUnit} = ${formatNumber(result.toValue)} ${result.toUnit}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? convertValue() : { fromValue: 0, toValue: 0, fromUnit: '', toUnit: '', conversionFactor: 0, formula: '' }
  const currentUnits = getCurrentUnits()

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Conversion Calculator</h1>
            <p className="text-indigo-100 text-lg">
              Convert between different units of measurement. Supports length, weight, 
              temperature, and more with accurate conversion formulas.
            </p>
          </div>
          <div className="hidden md:block">
            <ArrowLeftRight className="w-16 h-16 text-indigo-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Conversion Categories */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Conversion Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CONVERSION_CATEGORIES.map((category, index) => (
              <button
                key={index}
                onClick={() => handleQuickCategory(category)}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  selectedCategory === category.name
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {category.icon}
                  <span className="font-semibold">{category.name}</span>
                </div>
                <div className="text-sm opacity-80">{category.units.length} units available</div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Inputs */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* From Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Value
            </label>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="100"
              step="any"
              aria-label="Value to convert from"
            />
          </div>
          
          {/* From Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Unit
            </label>
            <select
              value={fromUnit}
              onChange={(e) => handleUnitChange(e.target.value, true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Select source unit"
            >
              <option value="">Select unit</option>
              {currentUnits.map(unit => (
                <option key={unit.symbol} value={unit.symbol}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
          
          {/* To Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Unit
            </label>
            <select
              value={toUnit}
              onChange={(e) => handleUnitChange(e.target.value, false)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Select target unit"
            >
              <option value="">Select unit</option>
              {currentUnits.filter(unit => unit.symbol !== fromUnit).map(unit => (
                <option key={unit.symbol} value={unit.symbol}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculate Button */}
        {fromValue && fromUnit && toUnit && fromUnit !== toUnit && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Convert</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Conversion Results */}
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">Conversion Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-indigo-700">{result.fromValue}</div>
                  <div className="text-sm text-gray-600">From Value</div>
                  <div className="text-xs text-indigo-600">{result.fromUnit}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.toValue)}</div>
                  <div className="text-sm text-gray-600">To Value</div>
                  <div className="text-xs text-blue-600">{result.toUnit}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatNumber(result.conversionFactor)}</div>
                  <div className="text-sm text-gray-600">Factor</div>
                  <div className="text-xs text-green-600">Multiplier</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{result.fromUnit} → {result.toUnit}</div>
                  <div className="text-sm text-gray-600">Conversion</div>
                  <div className="text-xs text-purple-600">Direction</div>
                </div>
              </div>
            </div>

            {/* Conversion Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversion Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Formula Used</h4>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <code className="text-sm text-gray-700">{result.formula}</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Category Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-semibold text-indigo-700">{selectedCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Units Available:</span>
                      <span className="font-semibold text-blue-700">{currentUnits.length}</span>
                    </div>
                  </div>
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
            <Info className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Conversion Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This comprehensive conversion calculator handles various units of measurement including length, 
                weight, and temperature. It provides accurate conversions using standard conversion factors 
                and formulas. The calculator is useful for students, professionals, and anyone needing to 
                convert between different measurement systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
