'use client'

import React, { useState, useCallback } from 'react'
import { Ruler, Calculator, TrendingUp, Share2, Download, Printer, RotateCcw } from 'lucide-react'
import ShareModal from '../ShareModal'

interface LengthUnit {
  name: string
  symbol: string
  toMeters: number
  category: string
}

const lengthUnits: LengthUnit[] = [
  // Metric
  { name: 'Meters', symbol: 'm', toMeters: 1, category: 'Metric' },
  { name: 'Kilometers', symbol: 'km', toMeters: 1000, category: 'Metric' },
  { name: 'Centimeters', symbol: 'cm', toMeters: 0.01, category: 'Metric' },
  { name: 'Millimeters', symbol: 'mm', toMeters: 0.001, category: 'Metric' },
  { name: 'Micrometers', symbol: 'μm', toMeters: 0.000001, category: 'Metric' },
  { name: 'Nanometers', symbol: 'nm', toMeters: 0.000000001, category: 'Metric' },
  
  // Imperial
  { name: 'Inches', symbol: 'in', toMeters: 0.0254, category: 'Imperial' },
  { name: 'Feet', symbol: 'ft', toMeters: 0.3048, category: 'Imperial' },
  { name: 'Yards', symbol: 'yd', toMeters: 0.9144, category: 'Imperial' },
  { name: 'Miles', symbol: 'mi', toMeters: 1609.344, category: 'Imperial' },
  { name: 'Nautical Miles', symbol: 'nmi', toMeters: 1852, category: 'Imperial' },
  
  // Other
  { name: 'Angstroms', symbol: 'Å', toMeters: 0.0000000001, category: 'Scientific' },
  { name: 'Light Years', symbol: 'ly', toMeters: 9460730472580800, category: 'Astronomical' },
  { name: 'Parsecs', symbol: 'pc', toMeters: 30856775814913673, category: 'Astronomical' },
  { name: 'Fathoms', symbol: 'fathom', toMeters: 1.8288, category: 'Maritime' },
  { name: 'Cubits', symbol: 'cubit', toMeters: 0.4572, category: 'Historical' },
  { name: 'Hands', symbol: 'hand', toMeters: 0.1016, category: 'Equestrian' }
]

export default function LengthConverter() {
  const [inputValue, setInputValue] = useState('100')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('ft')
  const [showShareModal, setShowShareModal] = useState(false)

  const convertLength = useCallback((value: number, from: string, to: string): number => {
    const fromUnitData = lengthUnits.find(unit => unit.symbol === from)
    const toUnitData = lengthUnits.find(unit => unit.symbol === to)
    
    if (!fromUnitData || !toUnitData) return 0
    
    // Convert to meters first, then to target unit
    const meters = value * fromUnitData.toMeters
    return meters / toUnitData.toMeters
  }, [])

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  const handleReset = () => {
    setInputValue('100')
    setFromUnit('m')
    setToUnit('ft')
  }

  const handleQuickValue = (value: string) => {
    setInputValue(value)
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const result = convertLength(parseFloat(inputValue) || 0, fromUnit, toUnit)
    const fromUnitData = lengthUnits.find(unit => unit.symbol === fromUnit)
    const toUnitData = lengthUnits.find(unit => unit.symbol === toUnit)
    
    const data = `Length Converter Results\n\n${inputValue} ${fromUnitData?.name} (${fromUnit}) = ${result.toFixed(6)} ${toUnitData?.name} (${toUnit})\n\nConversion Factors:\n1 ${fromUnit} = ${(1 / fromUnitData!.toMeters).toFixed(6)} meters\n1 ${toUnit} = ${(1 / toUnitData!.toMeters).toFixed(6)} meters\n\nAll Units Available:\n${lengthUnits.map(unit => `${unit.name} (${unit.symbol}): ${unit.toMeters} meters`).join('\n')}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'length-converter-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const result = convertLength(parseFloat(inputValue) || 0, fromUnit, toUnit)
  const fromUnitData = lengthUnits.find(unit => unit.symbol === fromUnit)
  const toUnitData = lengthUnits.find(unit => unit.symbol === toUnit)

  const getUnitCategory = (symbol: string) => {
    return lengthUnits.find(unit => unit.symbol === symbol)?.category || ''
  }

  const formatResult = (value: number): string => {
    if (value === 0) return '0'
    if (Math.abs(value) < 0.000001) return value.toExponential(6)
    if (Math.abs(value) >= 1000000) return value.toExponential(6)
    return value.toFixed(6).replace(/\.?0+$/, '')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="w-full px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Ruler className="w-16 h-16 mr-4 text-emerald-600" />
            Length Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert between metric, imperial, and other length units. From nanometers to light years, get accurate conversions for any length measurement.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversion Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-emerald-600" />
                Convert Length
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length Value
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="100"
                    step="any"
                    min="0"
                    title="Enter the length value to convert"
                    aria-label="Length value to convert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Unit
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    title="Select the unit to convert from"
                    aria-label="Unit to convert from"
                  >
                    {lengthUnits.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Category: {getUnitCategory(fromUnit)}
                  </p>
                </div>

                {/* Swap Button */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Unit
                  </label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    title="Select the unit to convert to"
                    aria-label="Unit to convert to"
                  >
                    {lengthUnits.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Category: {getUnitCategory(toUnit)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Values */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Values</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickValue('1')}
                  className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set length to 1"
                  aria-label="Set length to 1"
                >
                  1
                </button>
                <button
                  onClick={() => handleQuickValue('10')}
                  className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set length to 10"
                  aria-label="Set length to 10"
                >
                  10
                </button>
                <button
                  onClick={() => handleQuickValue('100')}
                  className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set length to 100"
                  aria-label="Set length to 100"
                >
                  100
                </button>
                <button
                  onClick={() => handleQuickValue('1000')}
                  className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set length to 1000"
                  aria-label="Set length to 1000"
                >
                  1000
                </button>
              </div>
            </div>

            {/* Reset Button */}
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

          {/* Results and Information */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Conversion Result */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-emerald-600" />
                  Conversion Result
                </h2>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-4">
                    {inputValue} {fromUnitData?.symbol} = {formatResult(result)} {toUnitData?.symbol}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="text-sm text-emerald-600 mb-1">From Unit</div>
                      <div className="text-lg font-semibold text-emerald-800">
                        {fromUnitData?.name} ({fromUnit})
                      </div>
                      <div className="text-sm text-emerald-600">
                        1 {fromUnit} = {fromUnitData?.toMeters} meters
                      </div>
                    </div>
                    
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="text-sm text-teal-600 mb-1">To Unit</div>
                      <div className="text-lg font-semibold text-teal-800">
                        {toUnitData?.name} ({toUnit})
                      </div>
                      <div className="text-sm text-teal-600">
                        1 {toUnit} = {toUnitData?.toMeters} meters
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unit Categories */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Unit Categories</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 text-emerald-600">Metric Units</h4>
                    <div className="space-y-2">
                      {lengthUnits.filter(unit => unit.category === 'Metric').map(unit => (
                        <div key={unit.symbol} className="flex justify-between text-sm">
                          <span>{unit.name} ({unit.symbol})</span>
                          <span className="text-gray-600">{unit.toMeters} m</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 text-teal-600">Imperial Units</h4>
                    <div className="space-y-2">
                      {lengthUnits.filter(unit => unit.category === 'Imperial').map(unit => (
                        <div key={unit.symbol} className="flex justify-between text-sm">
                          <span>{unit.name} ({unit.symbol})</span>
                          <span className="text-gray-600">{unit.toMeters} m</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3 text-blue-600">Other Units</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lengthUnits.filter(unit => !['Metric', 'Imperial'].includes(unit.category)).map(unit => (
                      <div key={unit.symbol} className="flex justify-between text-sm">
                        <span>{unit.name} ({unit.symbol})</span>
                        <span className="text-gray-600">{unit.toMeters} m</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share length conversion results"
                  aria-label="Share length conversion results"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download results as text file"
                  aria-label="Download length conversion results"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Print length conversion results"
                  aria-label="Print length conversion results"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Back to Calculators */}
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

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculation={{
            expression: `${inputValue} ${fromUnitData?.symbol || fromUnit}`,
            result: `${formatResult(result)} ${toUnitData?.symbol || toUnit}`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}
