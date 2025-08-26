'use client'
import React, { useState } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Wind } from 'lucide-react'

export default function WindChillCalculator() {
  const [temperature, setTemperature] = useState('32')
  const [windSpeed, setWindSpeed] = useState('15')
  const [unit, setUnit] = useState('fahrenheit')
  const [showResults, setShowResults] = useState(false)

  const calculateWindChill = () => {
    const temp = parseFloat(temperature)
    const wind = parseFloat(windSpeed)
    
    if (unit === 'fahrenheit') {
      if (temp <= 50 && wind >= 3) {
        return 35.74 + 0.6215 * temp - 35.75 * Math.pow(wind, 0.16) + 0.4275 * temp * Math.pow(wind, 0.16)
      }
    } else {
      const tempF = (temp * 9/5) + 32
      const windMph = wind * 2.237
      if (tempF <= 50 && windMph >= 3) {
        const windChillF = 35.74 + 0.6215 * tempF - 35.75 * Math.pow(windMph, 0.16) + 0.4275 * tempF * Math.pow(windMph, 0.16)
        return (windChillF - 32) * 5/9
      }
    }
    return temp
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setTemperature('32')
    setWindSpeed('15')
    setUnit('fahrenheit')
    setShowResults(false)
  }

  const windChill = showResults ? calculateWindChill() : 0
  const isCalculable = (parseFloat(temperature) <= (unit === 'fahrenheit' ? 50 : 10)) && parseFloat(windSpeed) >= (unit === 'fahrenheit' ? 3 : 1.34)

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Wind Chill Calculator</h1>
            <p className="text-blue-100 text-lg">Calculate wind chill factor based on temperature and wind speed</p>
          </div>
          <Wind className="w-16 h-16 text-blue-200" />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Enter temperature"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wind Speed</label>
            <input
              type="number"
              value={windSpeed}
              onChange={(e) => setWindSpeed(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              title="Enter wind speed"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Select temperature unit"
          >
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="celsius">Celsius (°C)</option>
          </select>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate Wind Chill
          </button>
        </div>

        {showResults && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Wind Chill Results</h3>
            {isCalculable ? (
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {windChill.toFixed(1)}°{unit === 'fahrenheit' ? 'F' : 'C'}
              </div>
            ) : (
              <div className="text-lg text-gray-600">
                Wind chill calculation not applicable for these conditions
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
