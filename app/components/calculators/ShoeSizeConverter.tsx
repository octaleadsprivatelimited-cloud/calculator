'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Shoe } from 'lucide-react'

interface ShoeSize {
  us: number
  uk: number
  eu: number
  cm: number
  inches: number
}

interface ShoeSizeResult {
  us: number
  uk: number
  eu: number
  cm: number
  inches: number
}

const SHOE_SIZE_CHART = {
  us: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  uk: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5],
  eu: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  cm: [20.8, 21.6, 22.4, 23.2, 24.0, 24.8, 25.6, 26.4, 27.2, 28.0, 28.8, 29.6, 30.4, 31.2, 32.0],
  inches: [8.2, 8.5, 8.8, 9.1, 9.4, 9.8, 10.1, 10.4, 10.7, 11.0, 11.3, 11.7, 12.0, 12.3, 12.6]
}

export default function ShoeSizeConverter() {
  const [fromSystem, setFromSystem] = useState<'us' | 'uk' | 'eu' | 'cm' | 'inches'>('us')
  const [fromValue, setFromValue] = useState('8')
  const [showResults, setShowResults] = useState(false)

  const convertShoeSize = useCallback((value: number, from: string): ShoeSizeResult => {
    const numValue = parseFloat(value.toString())
    if (isNaN(numValue)) return { us: 0, uk: 0, eu: 0, cm: 0, inches: 0 }

    let index = -1
    switch (from) {
      case 'us':
        index = SHOE_SIZE_CHART.us.indexOf(numValue)
        break
      case 'uk':
        index = SHOE_SIZE_CHART.uk.indexOf(numValue)
        break
      case 'eu':
        index = SHOE_SIZE_CHART.eu.indexOf(numValue)
        break
      case 'cm':
        index = SHOE_SIZE_CHART.cm.findIndex(cm => Math.abs(cm - numValue) < 0.5)
        break
      case 'inches':
        index = SHOE_SIZE_CHART.inches.findIndex(inch => Math.abs(inch - numValue) < 0.1)
        break
    }

    if (index === -1) {
      // Interpolate between sizes
      return interpolateSize(numValue, from)
    }

    return {
      us: SHOE_SIZE_CHART.us[index],
      uk: SHOE_SIZE_CHART.uk[index],
      eu: SHOE_SIZE_CHART.eu[index],
      cm: SHOE_SIZE_CHART.cm[index],
      inches: SHOE_SIZE_CHART.inches[index]
    }
  }, [])

  const interpolateSize = (value: number, from: string): ShoeSizeResult => {
    let baseIndex = 0
    let nextIndex = 0

    switch (from) {
      case 'us':
        baseIndex = SHOE_SIZE_CHART.us.findIndex(size => size > value) - 1
        nextIndex = Math.min(baseIndex + 1, SHOE_SIZE_CHART.us.length - 1)
        break
      case 'uk':
        baseIndex = SHOE_SIZE_CHART.uk.findIndex(size => size > value) - 1
        nextIndex = Math.min(baseIndex + 1, SHOE_SIZE_CHART.uk.length - 1)
        break
      case 'eu':
        baseIndex = SHOE_SIZE_CHART.eu.findIndex(size => size > value) - 1
        nextIndex = Math.min(baseIndex + 1, SHOE_SIZE_CHART.eu.length - 1)
        break
      case 'cm':
        baseIndex = SHOE_SIZE_CHART.cm.findIndex(size => size > value) - 1
        nextIndex = Math.min(baseIndex + 1, SHOE_SIZE_CHART.cm.length - 1)
        break
      case 'inches':
        baseIndex = SHOE_SIZE_CHART.inches.findIndex(size => size > value) - 1
        nextIndex = Math.min(baseIndex + 1, SHOE_SIZE_CHART.inches.length - 1)
        break
    }

    if (baseIndex < 0) baseIndex = 0
    if (nextIndex < 0) nextIndex = 0

    const baseValue = SHOE_SIZE_CHART[from][baseIndex]
    const nextValue = SHOE_SIZE_CHART[from][nextIndex]
    const ratio = (value - baseValue) / (nextValue - baseValue)

    return {
      us: SHOE_SIZE_CHART.us[baseIndex] + (SHOE_SIZE_CHART.us[nextIndex] - SHOE_SIZE_CHART.us[baseIndex]) * ratio,
      uk: SHOE_SIZE_CHART.uk[baseIndex] + (SHOE_SIZE_CHART.uk[nextIndex] - SHOE_SIZE_CHART.uk[baseIndex]) * ratio,
      eu: SHOE_SIZE_CHART.eu[baseIndex] + (SHOE_SIZE_CHART.eu[nextIndex] - SHOE_SIZE_CHART.eu[baseIndex]) * ratio,
      cm: SHOE_SIZE_CHART.cm[baseIndex] + (SHOE_SIZE_CHART.cm[nextIndex] - SHOE_SIZE_CHART.cm[baseIndex]) * ratio,
      inches: SHOE_SIZE_CHART.inches[baseIndex] + (SHOE_SIZE_CHART.inches[nextIndex] - SHOE_SIZE_CHART.inches[baseIndex]) * ratio
    }
  }

  const handleCalculate = () => {
    if (fromValue && !isNaN(parseFloat(fromValue))) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setFromSystem('us')
    setFromValue('8')
    setShowResults(false)
  }

  const formatNumber = (num: number, decimals: number = 1) => {
    if (isNaN(num) || !isFinite(num)) return '0.0'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = convertShoeSize(parseFloat(fromValue), fromSystem)
    
    const data = `Shoe Size Converter Results

Input: ${fromValue} ${fromSystem.toUpperCase()}

Converted Sizes:
- US: ${formatNumber(result.us)}
- UK: ${formatNumber(result.uk)}
- EU: ${formatNumber(result.eu)}
- CM: ${formatNumber(result.cm)}
- Inches: ${formatNumber(result.inches)}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shoe-size-converter-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = convertShoeSize(parseFloat(fromValue), fromSystem)
      
      navigator.share({
        title: 'Shoe Size Converter Results',
        text: `${fromValue} ${fromSystem.toUpperCase()} = US: ${formatNumber(result.us)}, UK: ${formatNumber(result.uk)}, EU: ${formatNumber(result.eu)}`,
        url: window.location.href
      })
    } else {
      const text = `Shoe Size: ${fromValue} ${fromSystem.toUpperCase()}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? convertShoeSize(parseFloat(fromValue), fromSystem) : { us: 0, uk: 0, eu: 0, cm: 0, inches: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shoe Size Converter</h1>
            <p className="text-purple-100 text-lg">
              Convert between US, UK, EU, CM, and Inches shoe sizing systems. 
              Perfect for international shopping or understanding different size charts.
            </p>
          </div>
          <div className="hidden md:block">
            <Shoe className="w-16 h-16 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Convert Shoe Size</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From System
              </label>
              <select
                value={fromSystem}
                onChange={(e) => setFromSystem(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Select shoe size system"
              >
                <option value="us">US Sizes</option>
                <option value="uk">UK Sizes</option>
                <option value="eu">EU Sizes</option>
                <option value="cm">Centimeters</option>
                <option value="inches">Inches</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size Value
              </label>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                step="0.5"
                placeholder="8"
              />
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
          >
            <Calculator className="w-5 h-5" />
            <span>Convert Size</span>
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Converted Sizes</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-700">{formatNumber(result.us)}</div>
                  <div className="text-sm text-gray-600">US</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">{formatNumber(result.uk)}</div>
                  <div className="text-sm text-gray-600">UK</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">{formatNumber(result.eu)}</div>
                  <div className="text-sm text-gray-600">EU</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">{formatNumber(result.cm)}</div>
                  <div className="text-sm text-gray-600">CM</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">{formatNumber(result.inches)}</div>
                  <div className="text-sm text-gray-600">Inches</div>
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
            <Info className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Shoe Size Conversion</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This converter helps you translate between different international shoe sizing systems. 
                US sizes typically range from 1-15, UK sizes from 0.5-14.5, EU sizes from 33-47, 
                and measurements in centimeters (20.8-32.0) and inches (8.2-12.6).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
