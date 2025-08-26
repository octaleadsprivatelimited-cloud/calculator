'use client'

import React, { useState, useCallback } from 'react'
import { Scale, Calculator, TrendingUp, Share2, Download, Printer, RotateCcw } from 'lucide-react'
import ShareModal from '../ShareModal'
import ResultSharing from '../ResultSharing'

const weightUnits = [
  { name: 'Grams', symbol: 'g', toGrams: 1 },
  { name: 'Kilograms', symbol: 'kg', toGrams: 1000 },
  { name: 'Pounds', symbol: 'lb', toGrams: 453.59237 },
  { name: 'Ounces', symbol: 'oz', toGrams: 28.349523125 },
  { name: 'Milligrams', symbol: 'mg', toGrams: 0.001 },
  { name: 'Metric Tons', symbol: 't', toGrams: 1000000 },
  { name: 'Tons (US)', symbol: 'US ton', toGrams: 907184.74 },
  { name: 'Stones', symbol: 'st', toGrams: 6350.29318 }
]

export default function WeightConverter() {
  const [inputValue, setInputValue] = useState('1000')
  const [fromUnit, setFromUnit] = useState('g')
  const [toUnit, setToUnit] = useState('lb')
  const [showShareModal, setShowShareModal] = useState(false)

  const convertWeight = useCallback((value: number, from: string, to: string): number => {
    const fromUnitData = weightUnits.find(unit => unit.symbol === from)
    const toUnitData = weightUnits.find(unit => unit.symbol === to)
    
    if (!fromUnitData || !toUnitData) return 0
    
    const grams = value * fromUnitData.toGrams
    return grams / toUnitData.toGrams
  }, [])

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  const handleReset = () => {
    setInputValue('1000')
    setFromUnit('g')
    setToUnit('lb')
  }

  const handleShare = () => setShowShareModal(true)
  const handlePrint = () => window.print()
  const handleDownload = () => {
    const result = convertWeight(parseFloat(inputValue) || 0, fromUnit, toUnit)
    const data = `Weight Converter: ${inputValue} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'weight-converter-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const result = convertWeight(parseFloat(inputValue) || 0, fromUnit, toUnit)
  const fromUnitData = weightUnits.find(unit => unit.symbol === fromUnit)
  const toUnitData = weightUnits.find(unit => unit.symbol === toUnit)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="w-full px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Scale className="w-16 h-16 mr-4 text-orange-600" />
            Weight Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert between metric, imperial, and other weight units. Get accurate conversions for any weight measurement.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-orange-600" />
                Convert Weight
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight Value</label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    placeholder="1000"
                    step="any"
                    min="0"
                    title="Enter the weight value to convert"
                    aria-label="Weight value to convert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Unit</label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    title="Select the unit to convert from"
                    aria-label="Unit to convert from"
                  >
                    {weightUnits.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSwap}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Swap from and to units"
                    aria-label="Swap from and to units"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Unit</label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    title="Select the unit to convert to"
                    aria-label="Unit to convert to"
                  >
                    {weightUnits.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Reset to default values"
                aria-label="Reset to default values"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Share Options - Moved to Top */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <ResultSharing
                  title="Weight Conversion Result"
                  inputs={[
                    { label: "Input Value", value: `${inputValue} ${fromUnitData?.symbol}` },
                    { label: "From Unit", value: `${fromUnitData?.name} (${fromUnit})` },
                    { label: "To Unit", value: `${toUnitData?.name} (${toUnit})` }
                  ]}
                  result={{ 
                    label: "Converted Value", 
                    value: result.toFixed(4),
                    unit: toUnitData?.symbol || ""
                  }}
                  calculatorName="Weight Converter"
                  className="mb-0"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-orange-600" />
                  Conversion Result
                </h2>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-4">
                    {inputValue} {fromUnitData?.symbol} = {result.toFixed(4)} {toUnitData?.symbol}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-sm text-orange-600 mb-1">From Unit</div>
                      <div className="text-lg font-semibold text-orange-800">
                        {fromUnitData?.name} ({fromUnit})
                      </div>
                      <div className="text-sm text-orange-600">
                        1 {fromUnit} = {fromUnitData?.toGrams} grams
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="text-sm text-amber-600 mb-1">To Unit</div>
                      <div className="text-lg font-semibold text-amber-800">
                        {toUnitData?.name} ({toUnit})
                      </div>
                      <div className="text-sm text-amber-600">
                        1 {toUnit} = {toUnitData?.toGrams} grams
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share weight conversion results"
                  aria-label="Share weight conversion results"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download results as text file"
                  aria-label="Download weight conversion results"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Print weight conversion results"
                  aria-label="Print weight conversion results"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Back to all calculators"
            aria-label="Back to all calculators"
          >
            <Calculator className="w-5 h-5" />
            Back to All Calculators
          </a>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculation={{
            expression: `${inputValue} ${fromUnitData?.symbol}`,
            result: `${result.toFixed(4)} ${toUnitData?.symbol}`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}
