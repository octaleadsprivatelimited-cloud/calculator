'use client'
import React, { useState } from 'react'
import { Calculator, Thermometer, Download, Share2, Printer, RotateCcw } from 'lucide-react'

export default function HeatIndexCalculator() {
  const [temperature, setTemperature] = useState('90')
  const [humidity, setHumidity] = useState('60')
  const [unit, setUnit] = useState('fahrenheit')
  const [showResults, setShowResults] = useState(false)

  const calculateHeatIndex = () => {
    const temp = parseFloat(temperature)
    const hum = parseFloat(humidity)
    
    if (unit === 'fahrenheit') {
      if (temp >= 80) {
        const c1 = -42.379
        const c2 = 2.04901523
        const c3 = 10.14333127
        const c4 = -0.22475541
        const c5 = -6.83783e-3
        const c6 = -5.481717e-2
        const c7 = 1.22874e-3
        const c8 = 8.5282e-4
        const c9 = -1.99e-6
        
        const T = temp
        const R = hum
        
        return c1 + c2*T + c3*R + c4*T*R + c5*T*T + c6*R*R + c7*T*T*R + c8*T*R*R + c9*T*T*R*R
      }
    } else {
      const tempF = (temp * 9/5) + 32
      if (tempF >= 80) {
        const c1 = -42.379
        const c2 = 2.04901523
        const c3 = 10.14333127
        const c4 = -0.22475541
        const c5 = -6.83783e-3
        const c6 = -5.481717e-2
        const c7 = 1.22874e-3
        const c8 = 8.5282e-4
        const c9 = -1.99e-6
        
        const T = tempF
        const R = hum
        
        const heatIndexF = c1 + c2*T + c3*R + c4*T*R + c5*T*T + c6*R*R + c7*T*T*R + c8*T*R*R + c9*T*T*R*R
        return (heatIndexF - 32) * 5/9
      }
    }
    return temp
  }

  const getHeatIndexCategory = (heatIndex: number) => {
    if (unit === 'celsius') {
      if (heatIndex < 27) return { level: 'Caution', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
      if (heatIndex < 32) return { level: 'Extreme Caution', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
      if (heatIndex < 41) return { level: 'Danger', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
      return { level: 'Extreme Danger', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' }
    } else {
      if (heatIndex < 80) return { level: 'Caution', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
      if (heatIndex < 90) return { level: 'Extreme Caution', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
      if (heatIndex < 103) return { level: 'Danger', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
      if (heatIndex < 124) return { level: 'Extreme Danger', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' }
      return { level: 'Extreme Danger', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' }
    }
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setTemperature('90')
    setHumidity('60')
    setUnit('fahrenheit')
    setShowResults(false)
  }

  const heatIndex = showResults ? calculateHeatIndex() : 0
  const category = showResults ? getHeatIndexCategory(heatIndex) : null
  const isCalculable = parseFloat(temperature) >= (unit === 'fahrenheit' ? 80 : 27)

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Heat Index Calculator</h1>
            <p className="text-red-100 text-lg">Calculate heat index based on temperature and humidity</p>
          </div>
          <Thermometer className="w-16 h-16 text-red-200" />
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Enter temperature"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relative Humidity (%)</label>
            <input
              type="number"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              min="0"
              max="100"
              title="Enter humidity percentage"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Select temperature unit"
          >
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="celsius">Celsius (°C)</option>
          </select>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate Heat Index
          </button>
        </div>

        {showResults && (
          <div className={`${category?.bg} p-6 rounded-lg border ${category?.border} text-center`}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Heat Index Results</h3>
            {isCalculable ? (
              <>
                <div className={`text-3xl font-bold ${category?.color} mb-2`}>
                  {heatIndex.toFixed(1)}°{unit === 'fahrenheit' ? 'F' : 'C'}
                </div>
                <div className={`text-lg font-semibold ${category?.color} mb-4`}>
                  {category?.level}
                </div>
              </>
            ) : (
              <div className="text-lg text-gray-600">
                Heat index calculation not applicable for these conditions
              </div>
            )}
            <div className="mt-4">
              <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
