'use client'
import React, { useState } from 'react'
import { Calculator, Droplets } from 'lucide-react'

export default function DewPointCalculator() {
  const [temperature, setTemperature] = useState('75')
  const [humidity, setHumidity] = useState('60')
  const [unit, setUnit] = useState('fahrenheit')
  const [showResults, setShowResults] = useState(false)

  const calculateDewPoint = () => {
    const temp = parseFloat(temperature)
    const hum = parseFloat(humidity)
    
    if (unit === 'fahrenheit') {
      const tempC = (temp - 32) * 5/9
      const a = 17.27
      const b = 237.7
      const alpha = ((a * tempC) / (b + tempC)) + Math.log(hum / 100)
      const dewPointC = (b * alpha) / (a - alpha)
      return (dewPointC * 9/5) + 32
    } else {
      const a = 17.27
      const b = 237.7
      const alpha = ((a * temp) / (b + temp)) + Math.log(hum / 100)
      return (b * alpha) / (a - alpha)
    }
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setTemperature('75')
    setHumidity('60')
    setUnit('fahrenheit')
    setShowResults(false)
  }

  const dewPoint = showResults ? calculateDewPoint() : 0

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dew Point Calculator</h1>
            <p className="text-blue-100 text-lg">Calculate dew point temperature from temperature and humidity</p>
          </div>
          <Droplets className="w-16 h-16 text-blue-200" />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Relative Humidity (%)</label>
            <input
              type="number"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Calculate Dew Point
          </button>
        </div>

        {showResults && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Dew Point Results</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {dewPoint.toFixed(1)}°{unit === 'fahrenheit' ? 'F' : 'C'}
            </div>
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
