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
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Dew Point Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive dew point calculator helps meteorologists, HVAC professionals, and 
              weather enthusiasts determine the temperature at which water vapor condenses into liquid. 
              This essential tool calculates dew point from temperature and relative humidity, providing 
              crucial information for weather forecasting, comfort assessment, and moisture control.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Dew Point Temperature:</strong> Temperature at which condensation occurs</li>
              <li><strong>Condensation Threshold:</strong> Point where air becomes saturated</li>
              <li><strong>Moisture Content:</strong> Water vapor capacity analysis</li>
              <li><strong>Comfort Assessment:</strong> Human comfort level evaluation</li>
              <li><strong>Weather Conditions:</strong> Precipitation likelihood indicators</li>
              <li><strong>HVAC Requirements:</strong> Dehumidification needs assessment</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Dew Point</h5>
                <p className="text-blue-700 text-sm">Condensation temperature</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                <h5 className="font-semibold text-cyan-800 mb-1">Input Values</h5>
                <p className="text-cyan-700 text-sm">Temperature and humidity</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the current temperature and relative humidity percentage, select your preferred 
              temperature unit (Fahrenheit or Celsius), and click "Calculate Dew Point" to get the 
              temperature at which water vapor will condense. The calculator uses the Magnus formula 
              for accurate dew point determination.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Dew Point Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Definition:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Temperature at saturation</li>
                    <li>Water vapor condenses</li>
                    <li>Relative humidity = 100%</li>
                    <li>Dew forms on surfaces</li>
                    <li>Fog development point</li>
                    <li>Moisture equilibrium</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Physical Process:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Air cooling process</li>
                    <li>Vapor pressure equalization</li>
                    <li>Molecular condensation</li>
                    <li>Surface temperature matching</li>
                    <li>Energy release (latent heat)</li>
                    <li>Phase change occurrence</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Dew Point Significance</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Weather Applications</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Fog Formation:</strong> Predict fog development</li>
                  <li><strong>Precipitation:</strong> Rain and snow likelihood</li>
                  <li><strong>Visibility:</strong> Atmospheric clarity assessment</li>
                  <li><strong>Storm Development:</strong> Severe weather indicators</li>
                  <li><strong>Temperature Trends:</strong> Cooling rate analysis</li>
                  <li><strong>Humidity Changes:</strong> Moisture content tracking</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Human Comfort</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Perceived Temperature:</strong> How hot/cold it feels</li>
                  <li><strong>Heat Index:</strong> Combined temperature and humidity</li>
                  <li><strong>Comfort Zones:</strong> Optimal living conditions</li>
                  <li><strong>Health Effects:</strong> Respiratory comfort</li>
                  <li><strong>Sleep Quality:</strong> Bedroom environment</li>
                  <li><strong>Exercise Conditions:</strong> Outdoor activity planning</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Dew Point Calculation Method</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Magnus Formula:</strong> Standard meteorological equation</li>
              <li><strong>Temperature Conversion:</strong> Fahrenheit to Celsius handling</li>
              <li><strong>Humidity Input:</strong> Relative humidity percentage</li>
              <li><strong>Logarithmic Calculation:</strong> Natural log of humidity ratio</li>
              <li><strong>Constants:</strong> 17.27 and 237.7 (Magnus parameters)</li>
              <li><strong>Result Conversion:</strong> Back to preferred temperature unit</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Dew Point vs. Other Metrics</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Dew Point vs. Relative Humidity</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Dew Point:</strong> Absolute moisture measure</li>
                  <li><strong>Relative Humidity:</strong> Percentage of saturation</li>
                  <li><strong>Temperature Independent:</strong> Dew point stays constant</li>
                  <li><strong>Temperature Dependent:</strong> RH changes with temperature</li>
                  <li><strong>Direct Comparison:</strong> Same dew point = same moisture</li>
                  <li><strong>Variable Comparison:</strong> RH varies with conditions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Dew Point vs. Wet Bulb</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Dew Point:</strong> Condensation temperature</li>
                  <li><strong>Wet Bulb:</strong> Evaporative cooling temperature</li>
                  <li><strong>Condensation Process:</strong> Vapor to liquid</li>
                  <li><strong>Evaporation Process:</strong> Liquid to vapor</li>
                  <li><strong>Lower Temperature:</strong> Dew point is lower</li>
                  <li><strong>Higher Temperature:</strong> Wet bulb is higher</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Practical Applications</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Meteorology</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Weather Forecasting:</strong> Precipitation prediction</li>
                  <li><strong>Climate Studies:</strong> Long-term moisture trends</li>
                  <li><strong>Agricultural Planning:</strong> Crop moisture needs</li>
                  <li><strong>Aviation Safety:</strong> Flight condition assessment</li>
                  <li><strong>Marine Operations:</strong> Sea fog prediction</li>
                  <li><strong>Emergency Planning:</strong> Severe weather preparation</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">HVAC & Building Science</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Dehumidification:</strong> Moisture removal needs</li>
                  <li><strong>Condensation Prevention:</strong> Surface protection</li>
                  <li><strong>Energy Efficiency:</strong> Optimal temperature settings</li>
                  <li><strong>Mold Prevention:</strong> Moisture control strategies</li>
                  <li><strong>Indoor Air Quality:</strong> Comfort optimization</li>
                  <li><strong>Building Envelope:</strong> Insulation effectiveness</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Dew Point Interpretation</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Below 50°F (10°C):</strong> Very dry, comfortable conditions</li>
              <li><strong>50-60°F (10-16°C):</strong> Dry, comfortable for most people</li>
              <li><strong>60-70°F (16-21°C):</strong> Moderate humidity, generally comfortable</li>
              <li><strong>70-75°F (21-24°C):</strong> Humid, some discomfort possible</li>
              <li><strong>75-80°F (24-27°C):</strong> Very humid, uncomfortable for many</li>
              <li><strong>Above 80°F (27°C):</strong> Extremely humid, oppressive conditions</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Dew Point Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Accurate Measurements:</strong> Precise temperature and humidity</li>
              <li><strong>Consider Time of Day:</strong> Dew point varies throughout day</li>
              <li><strong>Account for Location:</strong> Indoor vs. outdoor conditions</li>
              <li><strong>Monitor Trends:</strong> Track changes over time</li>
              <li><strong>Compare with Comfort:</strong> Personal comfort preferences</li>
              <li><strong>Use for Planning:</strong> Outdoor activities and events</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Dew Point Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Confusing with Temperature:</strong> Dew point is always ≤ air temperature</li>
              <li><strong>Ignoring Humidity Changes:</strong> Dew point changes with humidity</li>
              <li><strong>Unit Confusion:</strong> Mixing Fahrenheit and Celsius</li>
              <li><strong>Measurement Errors:</strong> Inaccurate temperature or humidity</li>
              <li><strong>Location Ignorance:</strong> Not considering measurement location</li>
              <li><strong>Time Factor:</strong> Ignoring diurnal variations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Dew Point Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Frost Point:</strong> Temperature below freezing for ice formation</li>
              <li><strong>Wet Bulb Temperature:</strong> Evaporative cooling temperature</li>
              <li><strong>Virtual Temperature:</strong> Temperature of dry air with same density</li>
              <li><strong>Mixing Ratio:</strong> Mass of water vapor per mass of dry air</li>
              <li><strong>Specific Humidity:</strong> Mass of water vapor per mass of air</li>
              <li><strong>Absolute Humidity:</strong> Mass of water vapor per volume of air</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When using dew point calculations, remember that dew point is always equal to or lower 
                than the air temperature. The closer the dew point is to the air temperature, the more 
                humid and uncomfortable the conditions feel. For optimal comfort, aim for a dew point 
                below 65°F (18°C). Use this calculator to plan outdoor activities, adjust HVAC settings, 
                and understand weather conditions. Remember that dew point is more useful than relative 
                humidity for comparing moisture levels across different temperatures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
