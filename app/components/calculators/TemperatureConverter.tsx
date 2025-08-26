'use client'

import React, { useState, useCallback } from 'react'
import { Thermometer, Calculator, TrendingUp, Share2, Download, Printer, RefreshCw } from 'lucide-react'
import ShareModal from '../ShareModal'
import ResultSharing from '../ResultSharing'

interface TemperatureResult {
  celsius: number
  fahrenheit: number
  kelvin: number
}

export default function TemperatureConverter() {
  const [inputValue, setInputValue] = useState('')
  const [fromUnit, setFromUnit] = useState('celsius')
  const [showShareModal, setShowShareModal] = useState(false)

  const convertTemperature = useCallback((): TemperatureResult | null => {
    if (!inputValue) return null

    const value = parseFloat(inputValue)
    if (isNaN(value)) return null

    let celsius: number, fahrenheit: number, kelvin: number

    switch (fromUnit) {
      case 'celsius':
        celsius = value
        fahrenheit = (value * 9/5) + 32
        kelvin = value + 273.15
        break
      case 'fahrenheit':
        celsius = (value - 32) * 5/9
        fahrenheit = value
        kelvin = (value - 32) * 5/9 + 273.15
        break
      case 'kelvin':
        celsius = value - 273.15
        fahrenheit = (value - 273.15) * 9/5 + 32
        kelvin = value
        break
      default:
        return null
    }

    return {
      celsius: Math.round(celsius * 100) / 100,
      fahrenheit: Math.round(fahrenheit * 100) / 100,
      kelvin: Math.round(kelvin * 100) / 100
    }
  }, [inputValue, fromUnit])

  const result = convertTemperature()

  const handleReset = () => {
    setInputValue('')
  }

  const handleQuickExample = (value: string, unit: string) => {
    setInputValue(value)
    setFromUnit(unit)
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (!result) return
    
    const data = `Temperature Converter Results\n\nInput: ${inputValue} ${fromUnit}\n\nResults:\nCelsius: ${result.celsius}°C\nFahrenheit: ${result.fahrenheit}°F\nKelvin: ${result.kelvin}K`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'temperature-conversion.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getTemperatureColor = (temp: number, unit: string) => {
    if (unit === 'celsius') {
      if (temp < 0) return 'text-blue-600'
      if (temp > 30) return 'text-red-600'
      return 'text-green-600'
    } else if (unit === 'fahrenheit') {
      if (temp < 32) return 'text-blue-600'
      if (temp > 86) return 'text-red-600'
      return 'text-green-600'
    } else if (unit === 'kelvin') {
      if (temp < 273.15) return 'text-blue-600'
      if (temp > 303.15) return 'text-red-600'
      return 'text-green-600'
    }
    return 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="w-full px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Thermometer className="w-16 h-16 mr-4 text-orange-600" />
            Temperature Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert between Celsius, Fahrenheit, and Kelvin. Get instant temperature conversions with precision and ease.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-orange-600" />
                Convert Temperature
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature Value
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    placeholder="25"
                    step="0.01"
                    title="Enter the temperature value to convert"
                    aria-label="Temperature value to convert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Unit
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    title="Select the temperature unit to convert from"
                    aria-label="Temperature unit to convert from"
                  >
                    <option value="celsius">Celsius (°C)</option>
                    <option value="fahrenheit">Fahrenheit (°F)</option>
                    <option value="kelvin">Kelvin (K)</option>
                  </select>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Reset the converter"
                  aria-label="Reset temperature converter"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              {/* Quick Examples */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Examples</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleQuickExample('0', 'celsius')}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm w-full"
                    title="Set example: 0°C (freezing point of water)"
                    aria-label="Set example: 0°C (freezing point of water)"
                  >
                    0°C (freezing point of water)
                  </button>
                  <button
                    onClick={() => handleQuickExample('100', 'celsius')}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm w-full"
                    title="Set example: 100°C (boiling point of water)"
                    aria-label="Set example: 100°C (boiling point of water)"
                  >
                    100°C (boiling point of water)
                  </button>
                  <button
                    onClick={() => handleQuickExample('98.6', 'fahrenheit')}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm w-full"
                    title="Set example: 98.6°F (normal body temperature)"
                    aria-label="Set example: 98.6°F (normal body temperature)"
                  >
                    98.6°F (normal body temperature)
                  </button>
                  <button
                    onClick={() => handleQuickExample('273.15', 'kelvin')}
                    className="text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm w-full"
                    title="Set example: 273.15K (absolute zero + 273.15)"
                    aria-label="Set example: 273.15K (absolute zero + 273.15)"
                  >
                    273.15K (absolute zero + 273.15)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6">
                {/* Share Options - Moved to Top */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <ResultSharing
                    title="Temperature Conversion Result"
                    inputs={[
                      { label: "Input Value", value: `${inputValue} ${fromUnit}` },
                      { label: "From Unit", value: fromUnit.charAt(0).toUpperCase() + fromUnit.slice(1) },
                      { label: "Input Type", value: "Temperature" }
                    ]}
                    result={{ 
                      label: "Converted Values", 
                      value: `${result.celsius}°C, ${result.fahrenheit}°F, ${result.kelvin}K`,
                      unit: ""
                    }}
                    calculatorName="Temperature Converter"
                    className="mb-0"
                  />
                </div>

                {/* Conversion Results */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-orange-600" />
                    Conversion Results
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getTemperatureColor(result.celsius, 'celsius')}`}>
                        {result.celsius}°C
                      </div>
                      <div className="text-sm text-gray-600">Celsius</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getTemperatureColor(result.fahrenheit, 'fahrenheit')}`}>
                        {result.fahrenheit}°F
                      </div>
                      <div className="text-sm text-gray-600">Fahrenheit</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getTemperatureColor(result.kelvin, 'kelvin')}`}>
                        {result.kelvin}K
                      </div>
                      <div className="text-sm text-gray-600">Kelvin</div>
                    </div>
                  </div>
                </div>

                {/* Temperature Scale Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Temperature Scales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Celsius (°C)</h4>
                      <p className="text-sm text-blue-700">
                        Water freezes at 0°C and boils at 100°C. Used in most countries worldwide.
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">Fahrenheit (°F)</h4>
                      <p className="text-sm text-orange-700">
                        Water freezes at 32°F and boils at 212°F. Primarily used in the United States.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Kelvin (K)</h4>
                      <p className="text-sm text-purple-700">
                        Absolute zero is 0K. Used in scientific research and calculations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Share temperature conversion results"
                    aria-label="Share temperature conversion results"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Download results as text file"
                    aria-label="Download temperature conversion results"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    title="Print temperature conversion results"
                    aria-label="Print temperature conversion results"
                  >
                    <Printer className="w-5 h-5" />
                    Print
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center py-12">
                  <Thermometer className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">
                    Enter a temperature value to convert between units
                  </p>
                </div>
              </div>
            )}
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
      {showShareModal && result && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculation={{
            expression: `${inputValue}${fromUnit}`,
            result: `${result.celsius}°C | ${result.fahrenheit}°F | ${result.kelvin}K`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}
