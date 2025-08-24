'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, TrendingUp, Globe, Share2, Download, Printer } from 'lucide-react'
import ShareModal from '../ShareModal'

interface AreaUnit {
  name: string
  symbol: string
  toSquareMeters: number
}

const areaUnits: AreaUnit[] = [
  { name: 'Square Meters', symbol: 'm²', toSquareMeters: 1 },
  { name: 'Square Kilometers', symbol: 'km²', toSquareMeters: 1000000 },
  { name: 'Square Centimeters', symbol: 'cm²', toSquareMeters: 0.0001 },
  { name: 'Square Millimeters', symbol: 'mm²', toSquareMeters: 0.000001 },
  { name: 'Square Inches', symbol: 'in²', toSquareMeters: 0.00064516 },
  { name: 'Square Feet', symbol: 'ft²', toSquareMeters: 0.092903 },
  { name: 'Square Yards', symbol: 'yd²', toSquareMeters: 0.836127 },
  { name: 'Square Miles', symbol: 'mi²', toSquareMeters: 2589988.11 },
  { name: 'Acres', symbol: 'ac', toSquareMeters: 4046.86 },
  { name: 'Hectares', symbol: 'ha', toSquareMeters: 10000 }
]

export default function AreaConverter() {
  const [fromUnit, setFromUnit] = useState<string>('m²')
  const [toUnit, setToUnit] = useState<string>('ft²')
  const [inputValue, setInputValue] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const fromUnitData = areaUnits.find(unit => unit.symbol === fromUnit)
  const toUnitData = areaUnits.find(unit => unit.symbol === toUnit)

  const calculateArea = useCallback(() => {
    if (!inputValue || !fromUnitData || !toUnitData) return

    const inputNum = parseFloat(inputValue)
    if (isNaN(inputNum)) return

    // Convert to square meters first, then to target unit
    const inSquareMeters = inputNum * fromUnitData.toSquareMeters
    const converted = inSquareMeters / toUnitData.toSquareMeters

    setResult(converted)
  }, [inputValue, fromUnitData, toUnitData])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (value && fromUnitData && toUnitData) {
      const inputNum = parseFloat(value)
      if (!isNaN(inputNum)) {
        const inSquareMeters = inputNum * fromUnitData.toSquareMeters
        const converted = inSquareMeters / toUnitData.toSquareMeters
        setResult(converted)
      }
    } else {
      setResult(null)
    }
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    if (result !== null) {
      setInputValue(result.toString())
      setResult(parseFloat(inputValue))
    }
  }

  const formatResult = (value: number): string => {
    if (value === 0) return '0'
    if (Math.abs(value) < 0.000001) return value.toExponential(6)
    if (Math.abs(value) < 0.01) return value.toFixed(6)
    if (Math.abs(value) < 1) return value.toFixed(4)
    if (Math.abs(value) < 1000) return value.toFixed(2)
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }

  const quickExamples = [
    { from: '100', fromUnit: 'm²', toUnit: 'ft²', result: '1,076.39' },
    { from: '1', fromUnit: 'ac', toUnit: 'ha', result: '0.40' },
    { from: '500', fromUnit: 'ft²', toUnit: 'm²', result: '46.45' },
    { from: '2', fromUnit: 'km²', toUnit: 'mi²', result: '0.77' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Area Converter</h1>
          <p className="text-lg text-gray-600">Convert between different area units and measurements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Converter */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Area Conversion</h2>
              </div>

              <div className="space-y-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Area
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Enter area value"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                      step="any"
                      min="0"
                    />
                                         <select
                       value={fromUnit}
                       onChange={(e) => setFromUnit(e.target.value)}
                       className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                       title="Select from unit"
                       aria-label="Select from unit"
                     >
                      {areaUnits.map((unit) => (
                        <option key={unit.symbol} value={unit.symbol}>
                          {unit.symbol} - {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapUnits}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    aria-label="Swap units"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Converted Area
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={result !== null ? formatResult(result) : ''}
                      readOnly
                      placeholder="Converted value"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-lg font-mono"
                    />
                                         <select
                       value={toUnit}
                       onChange={(e) => setToUnit(e.target.value)}
                       className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                       title="Select to unit"
                       aria-label="Select to unit"
                     >
                      {areaUnits.map((unit) => (
                        <option key={unit.symbol} value={unit.symbol}>
                          {unit.symbol} - {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Result Display */}
                {result !== null && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 mb-1">Conversion Result</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {inputValue} {fromUnit} = {formatResult(result)} {toUnit}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Examples */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Quick Examples</h3>
              </div>
              <div className="space-y-3">
                {quickExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(example.from)
                      setFromUnit(example.fromUnit)
                      setToUnit(example.toUnit)
                    }}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {example.from} {example.fromUnit} → {example.result} {example.toUnit}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Common Conversions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Conversions</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 1 m² = 10.764 ft²</p>
                <p>• 1 km² = 0.386 mi²</p>
                <p>• 1 ac = 0.405 ha</p>
                <p>• 1 ha = 2.471 ac</p>
                <p>• 1 ft² = 0.093 m²</p>
                <p>• 1 mi² = 2.590 km²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Share2 className="w-5 h-5" />
            Share Result
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            <Printer className="w-5 h-5" />
            Print
          </button>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            calculation={{
              expression: `${inputValue} ${fromUnit}`,
              result: `${formatResult(result || 0)} ${toUnit}`,
              timestamp: new Date()
            }}
          />
        )}
      </div>
    </div>
  )
}
