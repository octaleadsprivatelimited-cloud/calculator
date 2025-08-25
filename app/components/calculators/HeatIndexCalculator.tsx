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
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Heat Index Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive heat index calculator helps individuals understand the combined effect of 
              temperature and humidity on human comfort and health. This essential meteorological tool 
              provides accurate heat index calculations, safety recommendations, and health risk 
              assessments for informed outdoor activity planning.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Heat Index:</strong> "Feels like" temperature combining heat and humidity</li>
              <li><strong>Risk Categories:</strong> Caution, extreme caution, danger, extreme danger</li>
              <li><strong>Health Impact:</strong> Heat-related illness risk assessment</li>
              <li><strong>Activity Guidelines:</strong> Safe outdoor activity recommendations</li>
              <li><strong>Unit Conversion:</strong> Fahrenheit and Celsius support</li>
              <li><strong>Safety Thresholds:</strong> Critical temperature breakpoints</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Heat Index Categories</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Lower Risk Levels</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Caution (80-90°F):</strong> Fatigue possible with prolonged exposure</li>
                  <li><strong>Extreme Caution (90-103°F):</strong> Heat cramps, heat exhaustion possible</li>
                  <li><strong>Danger (103-124°F):</strong> Heat cramps, heat exhaustion likely</li>
                  <li><strong>Extreme Danger (125°F+):</strong> Heat stroke highly likely</li>
                  <li><strong>Prevention:</strong> Stay hydrated, take breaks</li>
                  <li><strong>Activities:</strong> Limit strenuous outdoor work</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Health Effects</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Heat Cramps:</strong> Muscle spasms, pain</li>
                  <li><strong>Heat Exhaustion:</strong> Fatigue, dizziness, nausea</li>
                  <li><strong>Heat Stroke:</strong> Life-threatening condition</li>
                  <li><strong>Dehydration:</strong> Fluid loss, electrolyte imbalance</li>
                  <li><strong>Sunburn:</strong> UV radiation damage</li>
                  <li><strong>Respiratory Stress:</strong> Breathing difficulties</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-1">Caution</h5>
                <p className="text-yellow-700 text-sm">80-90°F</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Extreme Caution</h5>
                <p className="text-orange-700 text-sm">90-103°F</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-1">Danger</h5>
                <p className="text-red-700 text-sm">103-124°F</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Extreme Danger</h5>
                <p className="text-purple-700 text-sm">125°F+</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the current temperature and relative humidity percentage. Select your preferred 
              temperature unit (Fahrenheit or Celsius). The calculator automatically computes the heat 
              index and provides appropriate risk category and safety recommendations.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Heat Index Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>What is Heat Index:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Combined effect of temperature and humidity</li>
                    <li>Measures how hot it "feels" to humans</li>
                    <li>Based on human physiology and comfort</li>
                    <li>Developed by National Weather Service</li>
                    <li>Used for heat advisories and warnings</li>
                    <li>Critical for public health and safety</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Why It Matters:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Human body cooling efficiency</li>
                    <li>Evaporative cooling limitations</li>
                    <li>Heat stress risk assessment</li>
                    <li>Outdoor activity planning</li>
                    <li>Emergency response planning</li>
                    <li>Workplace safety regulations</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Heat Index</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Primary Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Temperature:</strong> Air temperature in °F or °C</li>
                  <li><strong>Humidity:</strong> Relative humidity percentage</li>
                  <li><strong>Dew Point:</strong> Temperature at which air saturates</li>
                  <li><strong>Air Pressure:</strong> Atmospheric pressure effects</li>
                  <li><strong>Wind Speed:</strong> Cooling effect of air movement</li>
                  <li><strong>Solar Radiation:</strong> Direct sun exposure</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Secondary Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Clothing:</strong> Insulation and heat retention</li>
                  <li><strong>Activity Level:</strong> Metabolic heat production</li>
                  <li><strong>Acclimatization:</strong> Heat adaptation over time</li>
                  <li><strong>Age and Health:</strong> Individual vulnerability</li>
                  <li><strong>Medications:</strong> Heat sensitivity effects</li>
                  <li><strong>Time of Day:</strong> Peak heat periods</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Safety Guidelines by Category</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Caution (80-90°F):</strong> Stay hydrated, take breaks, avoid prolonged exposure</li>
              <li><strong>Extreme Caution (90-103°F):</strong> Limit outdoor activities, seek shade, drink water</li>
              <li><strong>Danger (103-124°F):</strong> Avoid strenuous activities, stay indoors if possible</li>
              <li><strong>Extreme Danger (125°F+):</strong> Stay indoors, avoid all outdoor activities</li>
              <li><strong>Universal Precautions:</strong> Wear light clothing, use sunscreen, monitor symptoms</li>
              <li><strong>Emergency Signs:</strong> Dizziness, nausea, confusion, rapid heartbeat</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Heat Index Calculation Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Steadman Formula</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Scientific Basis:</strong> Human physiology research</li>
                  <li><strong>Temperature Range:</strong> 80°F and above</li>
                  <li><strong>Humidity Range:</strong> 40-100%</li>
                  <li><strong>Accuracy:</strong> ±1.3°F in most conditions</li>
                  <li><strong>Limitations:</strong> Below 80°F or very low humidity</li>
                  <li><strong>Validation:</strong> Extensive field testing</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Alternative Methods</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Apparent Temperature:</strong> Australian heat index</li>
                  <li><strong>Humidex:</strong> Canadian heat index</li>
                  <li><strong>Wet Bulb Globe Temperature:</strong> Military and sports</li>
                  <li><strong>Universal Thermal Climate Index:</strong> Comprehensive approach</li>
                  <li><strong>Heat Stress Index:</strong> Industrial applications</li>
                  <li><strong>Comfort Index:</strong> Building design</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Prevention Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Hydration:</strong> Drink water before, during, and after outdoor activities</li>
              <li><strong>Clothing:</strong> Light, loose-fitting, light-colored clothing</li>
              <li><strong>Timing:</strong> Avoid outdoor activities during peak heat hours (10 AM - 4 PM)</li>
              <li><strong>Shade:</strong> Seek shade or air-conditioned environments</li>
              <li><strong>Acclimatization:</strong> Gradually increase heat exposure over 1-2 weeks</li>
              <li><strong>Monitoring:</strong> Watch for heat-related illness symptoms</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Heat Index Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Current Conditions:</strong> Real-time temperature and humidity data</li>
              <li><strong>Consider Local Factors:</strong> Urban heat island effects, elevation</li>
              <li><strong>Monitor Changes:</strong> Heat index varies throughout the day</li>
              <li><strong>Account for Activity:</strong> Strenuous work increases heat stress</li>
              <li><strong>Check Multiple Sources:</strong> Compare different weather services</li>
              <li><strong>Plan Ahead:</strong> Check forecasts for activity planning</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Heat Index Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ignoring Humidity:</strong> Temperature alone doesn't tell the full story</li>
              <li><strong>Using Outdated Data:</strong> Conditions change rapidly</li>
              <li><strong>Not Considering Activity:</strong> Exercise increases heat stress</li>
              <li><strong>Ignoring Personal Factors:</strong> Age, health, medications matter</li>
              <li><strong>Underestimating Risk:</strong> Heat illness can develop quickly</li>
              <li><strong>Not Planning Ahead:</strong> Check forecasts before outdoor activities</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Heat Index Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Wet Bulb Globe Temperature:</strong> Comprehensive heat stress measurement</li>
              <li><strong>Heat Stress Index:</strong> Industrial workplace applications</li>
              <li><strong>Thermal Comfort Models:</strong> Building and vehicle design</li>
              <li><strong>Heat Wave Definitions:</strong> Meteorological heat wave criteria</li>
              <li><strong>Climate Change Impact:</strong> Increasing heat index trends</li>
              <li><strong>Urban Heat Islands:</strong> City temperature amplification</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that heat index is only calculated for temperatures of 80°F (27°C) and above, 
                as this is when humidity begins to significantly impact human comfort and health. The 
                heat index represents how hot it "feels" to the human body, not the actual air temperature. 
                Always err on the side of caution - if you're feeling uncomfortable in the heat, take 
                action regardless of the calculated heat index. Pay attention to your body's signals and 
                don't wait for severe symptoms to develop. Remember that heat-related illnesses can 
                progress rapidly and become life-threatening, so prevention and early recognition are key.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
