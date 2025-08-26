'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, User, Ruler } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function HeightCalculator() {
  const [inputHeight, setInputHeight] = useState('')
  const [inputUnit, setInputUnit] = useState('feet')
  const [showResults, setShowResults] = useState(false)

  const calculateHeight = useCallback(() => {
    const height = parseFloat(inputHeight) || 0

    if (height === 0) return {
      feet: 0,
      inches: 0,
      centimeters: 0,
      meters: 0,
      comparison: ''
    }

    let feet = 0
    let inches = 0
    let centimeters = 0
    let meters = 0

    // Convert from input unit to all other units
    if (inputUnit === 'feet') {
      feet = Math.floor(height)
      inches = Math.round((height - feet) * 12)
      centimeters = height * 30.48
      meters = height * 0.3048
    } else if (inputUnit === 'inches') {
      feet = Math.floor(height / 12)
      inches = height % 12
      centimeters = height * 2.54
      meters = height * 0.0254
    } else if (inputUnit === 'centimeters') {
      feet = Math.floor(height / 30.48)
      inches = Math.round((height / 2.54) % 12)
      centimeters = height
      meters = height / 100
    } else if (inputUnit === 'meters') {
      feet = Math.floor(height / 0.3048)
      inches = Math.round((height / 0.0254) % 12)
      centimeters = height * 100
      meters = height
    }

    // Determine height category
    let comparison = ''
    if (centimeters >= 200) comparison = 'Very Tall - Above 6\'7"'
    else if (centimeters >= 190) comparison = 'Tall - 6\'3" to 6\'7"'
    else if (centimeters >= 180) comparison = 'Above Average - 5\'11" to 6\'3"'
    else if (centimeters >= 170) comparison = 'Average - 5\'7" to 5\'11"'
    else if (centimeters >= 160) comparison = 'Below Average - 5\'3" to 5\'7"'
    else if (centimeters >= 150) comparison = 'Short - 5\'0" to 5\'3"'
    else comparison = 'Very Short - Below 5\'0"'

    return {
      feet,
      inches,
      centimeters,
      meters,
      comparison
    }
  }, [inputHeight, inputUnit])

  const handleCalculate = () => {
    if (inputHeight) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setInputHeight('')
    setInputUnit('feet')
    setShowResults(false)
  }

  const result = showResults ? calculateHeight() : { feet: 0, inches: 0, centimeters: 0, meters: 0, comparison: '' }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Height Calculator</h1>
            <p className="text-teal-100 text-lg">
              Convert height between feet, inches, centimeters, and meters.
            </p>
          </div>
          <div className="hidden md:block">
            <User className="w-16 h-16 text-teal-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height Value
              </label>
              <input
                type="number"
                value={inputHeight}
                onChange={(e) => setInputHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                placeholder="5.9"
                min="0"
                max="1000"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Unit
              </label>
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Select height unit"
              >
                <option value="feet">Feet (decimal)</option>
                <option value="inches">Inches</option>
                <option value="centimeters">Centimeters</option>
                <option value="meters">Meters</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Height Categories</h3>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-800">Very Short</div>
                <div className="text-sm text-gray-600">Below 5 feet</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-800">Short</div>
                <div className="text-sm text-gray-600">5 feet to 5'3"</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-800">Average</div>
                <div className="text-sm text-gray-600">5'7" to 5'11"</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-medium text-gray-800">Tall</div>
                <div className="text-sm text-gray-600">6'3" to 6'7"</div>
              </div>
            </div>
          </div>
        </div>

        {inputHeight && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Calculate Height
            </button>
          </div>
        )}

        {showResults && (
          <div className="space-y-6">
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-teal-200">
              <ResultSharing
                title="Height Conversion Result"
                inputs={[
                  { label: "Input Height", value: `${inputHeight} ${inputUnit}` },
                  { label: "Calculation Type", value: "Height Conversion" },
                  { label: "Unit System", value: inputUnit === 'feet' || inputUnit === 'inches' ? 'Imperial' : 'Metric' }
                ]}
                result={{ 
                  label: "Height in Feet & Inches", 
                  value: `${result.feet}'${result.inches}"`,
                  unit: ""
                }}
                calculatorName="Height Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">Height Conversion Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-teal-700">{result.feet}'{result.inches}"</div>
                  <div className="text-sm text-gray-600">Feet & Inches</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{result.centimeters.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Centimeters</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.meters.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Meters</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{result.comparison}</div>
                  <div className="text-sm text-gray-600">Category</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Height Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive height calculator helps individuals convert between different height 
              measurement systems and understand height categories. This essential measurement tool 
              provides accurate conversions between feet, inches, centimeters, and meters, along with 
              height classification for personal reference and planning purposes.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Height Conversions:</strong> Feet, inches, centimeters, meters</li>
              <li><strong>Height Categories:</strong> Very short, short, average, tall, very tall</li>
              <li><strong>Unit Flexibility:</strong> Input in any common height unit</li>
              <li><strong>Precise Measurements:</strong> Decimal accuracy for all conversions</li>
              <li><strong>Comparative Analysis:</strong> Height relative to population averages</li>
              <li><strong>International Standards:</strong> Metric and imperial system support</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Height Measurement Systems</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Imperial System (US/UK)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Feet:</strong> Primary unit (1 foot = 12 inches)</li>
                  <li><strong>Inches:</strong> Secondary unit for precision</li>
                  <li><strong>Format:</strong> 5'9" (5 feet, 9 inches)</li>
                  <li><strong>Common Use:</strong> United States, United Kingdom</li>
                  <li><strong>Advantages:</strong> Familiar to many users</li>
                  <li><strong>Limitations:</strong> Complex fractions, conversions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Metric System (International)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Centimeters:</strong> Primary unit for human height</li>
                  <li><strong>Meters:</strong> Larger measurements</li>
                  <li><strong>Format:</strong> 175.3 cm or 1.75 m</li>
                  <li><strong>Common Use:</strong> Most countries worldwide</li>
                  <li><strong>Advantages:</strong> Decimal-based, easy conversions</li>
                  <li><strong>Precision:</strong> Accurate to 0.1 cm</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                <h5 className="font-semibold text-teal-800 mb-1">Feet & Inches</h5>
                <p className="text-teal-700 text-sm">Imperial measurement</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Centimeters</h5>
                <p className="text-blue-700 text-sm">Metric precision</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Meters</h5>
                <p className="text-green-700 text-sm">Metric standard</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Category</h5>
                <p className="text-purple-700 text-sm">Height classification</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your height in any unit (feet, inches, centimeters, or meters) and select the 
              corresponding input unit. The calculator automatically converts your height to all other 
              units and provides a height category classification based on population averages.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Height Category System</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Very Short:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Below 5 feet (152.4 cm)</li>
                    <li>Bottom 2.5% of population</li>
                    <li>Specialized clothing needs</li>
                    <li>Vehicle and furniture considerations</li>
                    <li>Health monitoring important</li>
                    <li>Genetic or medical factors</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Short:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>5 feet to 5'3" (152.4-160 cm)</li>
                    <li>Bottom 16% of population</li>
                    <li>Common in many populations</li>
                    <li>Standard clothing available</li>
                    <li>Minor ergonomic adjustments</li>
                    <li>Generally healthy range</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Height Conversion Factors</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Imperial to Metric</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>1 foot = 30.48 centimeters</strong></li>
                  <li><strong>1 inch = 2.54 centimeters</strong></li>
                  <li><strong>1 foot = 0.3048 meters</strong></li>
                  <li><strong>1 yard = 0.9144 meters</strong></li>
                  <li><strong>Precision:</strong> ±0.1 cm accuracy</li>
                  <li><strong>Rounding:</strong> Standard mathematical rules</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Metric to Imperial</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>1 centimeter = 0.3937 inches</strong></li>
                  <li><strong>1 meter = 3.2808 feet</strong></li>
                  <li><strong>1 meter = 39.37 inches</strong></li>
                  <li><strong>Decimal feet:</strong> 5.75 feet = 5'9"</li>
                  <li><strong>Precision:</strong> ±0.01 inch accuracy</li>
                  <li><strong>Format:</strong> Feet' inches"</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Height Categories Explained</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Average Heights</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Average (5'7"-5'11"):</strong> 68% of population</li>
                  <li><strong>Tall (6'3"-6'7"):</strong> Top 2.5% of population</li>
                  <li><strong>Very Tall (6'7"+):</strong> Top 0.1% of population</li>
                  <li><strong>Population Basis:</strong> US adult population</li>
                  <li><strong>Gender Differences:</strong> Separate male/female averages</li>
                  <li><strong>Age Considerations:</strong> Height changes with age</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Practical Applications</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Clothing Sizing:</strong> Proper fit and proportions</li>
                  <li><strong>Furniture Selection:</strong> Ergonomic considerations</li>
                  <li><strong>Vehicle Safety:</strong> Seat and mirror adjustments</li>
                  <li><strong>Sports Equipment:</strong> Proper sizing for performance</li>
                  <li><strong>Medical Assessments:</strong> Growth and development</li>
                  <li><strong>Design Planning:</strong> Accessibility and ergonomics</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Height Measurement Best Practices</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Consistent Time:</strong> Measure at the same time of day</li>
              <li><strong>Proper Posture:</strong> Stand straight, feet together</li>
              <li><strong>Barefoot:</strong> Remove shoes for accurate measurement</li>
              <li><strong>Flat Surface:</strong> Stand on hard, level ground</li>
              <li><strong>Professional Equipment:</strong> Use calibrated measuring devices</li>
              <li><strong>Multiple Measurements:</strong> Take several readings for accuracy</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Height Conversion Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Precise Values:</strong> Enter exact measurements for accuracy</li>
              <li><strong>Check Units:</strong> Verify input unit selection</li>
              <li><strong>Round Appropriately:</strong> Consider precision needs</li>
              <li><strong>Compare Results:</strong> Verify conversions make sense</li>
              <li><strong>Save Common Values:</strong> Note frequently used conversions</li>
              <li><strong>Update Regularly:</strong> Re-measure periodically</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Height Conversion Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Unit Confusion:</strong> Mixing feet and inches incorrectly</li>
              <li><strong>Decimal Errors:</strong> Incorrect decimal point placement</li>
              <li><strong>Rounding Issues:</strong> Over-rounding or under-rounding</li>
              <li><strong>Formula Errors:</strong> Using wrong conversion factors</li>
              <li><strong>Input Mistakes:</strong> Entering wrong numbers</li>
              <li><strong>Unit Selection:</strong> Choosing incorrect input unit</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Height Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Percentile Rankings:</strong> Height relative to population</li>
              <li><strong>Growth Charts:</strong> Pediatric height development</li>
              <li><strong>Genetic Factors:</strong> Family height patterns</li>
              <li><strong>Nutritional Impact:</strong> Diet effects on growth</li>
              <li><strong>Medical Conditions:</strong> Height-related health issues</li>
              <li><strong>Anthropometric Data:</strong> Scientific body measurements</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When converting between height units, remember that precision matters. A height of 5'9" 
                is exactly 69 inches, which converts to 175.26 centimeters. For most practical purposes, 
                rounding to 175.3 cm or 1.75 m is appropriate. However, for medical or scientific 
                applications, maintain the full precision. Also, remember that height can vary slightly 
                throughout the day due to spinal compression - you're typically tallest in the morning 
                and shortest in the evening. For consistent measurements, always measure at the same time 
                of day and under similar conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


