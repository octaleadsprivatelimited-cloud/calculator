'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info } from 'lucide-react'

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

const SHOE_SIZE_CHART: Record<string, number[]> = {
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
            <Calculator className="w-16 h-16 text-purple-200" />
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

        {/* Comprehensive Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Shoe Size Conversion</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive shoe size converter helps you navigate between different international sizing systems 
                used around the world. Whether you're shopping online from international retailers, traveling abroad, 
                or simply need to understand size equivalents, this tool provides accurate conversions across all major systems.
              </p>
              <p className="text-gray-700">
                The converter handles US, UK, European, and metric measurements with precision, accounting for the 
                subtle differences between sizing standards and providing interpolated values for sizes not in the standard chart.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">International Shoe Sizing Systems</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">US Sizing System</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Range:</strong> 1-15 (men's sizes)</li>
                    <li><strong>Increment:</strong> 1 full size</li>
                    <li><strong>Base:</strong> Barleycorn measurement (1/3 inch)</li>
                    <li><strong>Usage:</strong> United States and Canada</li>
                    <li><strong>Note:</strong> Women's sizes typically +1.5 to men's</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">UK Sizing System</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Range:</strong> 0.5-14.5</li>
                    <li><strong>Increment:</strong> 1 full size</li>
                    <li><strong>Base:</strong> Barleycorn measurement (1/3 inch)</li>
                    <li><strong>Usage:</strong> United Kingdom and Commonwealth</li>
                    <li><strong>Note:</strong> Starts at 0.5, not 0</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">European & Metric Systems</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">European Sizing (EU)</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Range:</strong> 33-47</li>
                    <li><strong>Increment:</strong> 2/3 centimeter</li>
                    <li><strong>Base:</strong> Paris point (2/3 cm)</li>
                    <li><strong>Usage:</strong> Continental Europe</li>
                    <li><strong>Note:</strong> Most precise metric-based system</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Metric Measurements</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Centimeters:</strong> 20.8-32.0 cm</li>
                    <li><strong>Inches:</strong> 8.2-12.6 inches</li>
                    <li><strong>Precision:</strong> Most accurate for fitting</li>
                    <li><strong>Usage:</strong> Scientific and medical applications</li>
                    <li><strong>Note:</strong> Direct foot measurement</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Size Conversion Methodology</h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-gray-800 mb-2">How Conversions Work</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Exact Matches:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Direct chart lookup</li>
                      <li>Standard size equivalents</li>
                      <li>Most common sizes</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Interpolation:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Between chart values</li>
                      <li>Mathematical calculation</li>
                      <li>Accurate intermediate sizes</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700 mt-3 text-sm">
                  <strong>Note:</strong> The converter uses advanced interpolation algorithms to provide accurate 
                  conversions for sizes not explicitly listed in the conversion chart.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Regional Size Variations</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>North America:</strong> US and Canadian sizing, typically whole numbers</li>
                <li><strong>United Kingdom:</strong> UK sizing with half-size increments starting at 0.5</li>
                <li><strong>Continental Europe:</strong> EU sizing based on Paris point measurement</li>
                <li><strong>Asia:</strong> Often uses EU sizing or local variations</li>
                <li><strong>Australia:</strong> Primarily UK sizing with some US influence</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Practical Applications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Online Shopping</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>International retailers</li>
                    <li>Cross-border purchases</li>
                    <li>Size verification</li>
                    <li>Return policy compliance</li>
                    <li>Brand size differences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Travel & International Use</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Local shoe shopping</li>
                    <li>Emergency replacements</li>
                    <li>Cultural understanding</li>
                    <li>Size communication</li>
                    <li>Brand familiarity</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Size Fitting Considerations</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Brand Variations:</strong> Different brands may fit differently even with same size</li>
                <li><strong>Style Differences:</strong> Boots, sneakers, and dress shoes may have different fits</li>
                <li><strong>Width Considerations:</strong> Length is only part of proper fit</li>
                <li><strong>Time of Day:</strong> Feet swell throughout the day</li>
                <li><strong>Seasonal Changes:</strong> Temperature affects foot size</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Measurement Best Practices</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Accurate Measurement</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Measure in afternoon/evening</li>
                    <li>Stand on flat surface</li>
                    <li>Use proper measuring tools</li>
                    <li>Measure both feet</li>
                    <li>Account for socks</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Professional Fitting</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Visit shoe stores</li>
                    <li>Use Brannock device</li>
                    <li>Professional consultation</li>
                    <li>Multiple brand testing</li>
                    <li>Comfort over size</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Always measure your feet in the afternoon when they're at their largest</li>
                <li>• Consider ordering multiple sizes when shopping online internationally</li>
                <li>• Remember that EU sizes are typically the most precise for metric measurements</li>
                <li>• Don't rely solely on size conversion - consider brand-specific sizing charts</li>
                <li>• When in doubt, size up rather than down for comfort</li>
                <li>• Keep a record of your sizes in different systems for future reference</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
