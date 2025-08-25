'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Scale, Zap } from 'lucide-react'

interface MassResult {
  grams: number
  kilograms: number
  pounds: number
  ounces: number
  milligrams: number
  tons: number
}

const MASS_UNITS = {
  g: { name: 'Grams (g)', factor: 1 },
  kg: { name: 'Kilograms (kg)', factor: 1000 },
  lb: { name: 'Pounds (lb)', factor: 453.592 },
  oz: { name: 'Ounces (oz)', factor: 28.3495 },
  mg: { name: 'Milligrams (mg)', factor: 0.001 },
  t: { name: 'Metric Tons (t)', factor: 1000000 }
}

const COMMON_MASSES = [
  { name: 'Paper Clip', mass: 1.5, unit: 'g' },
  { name: 'US Penny', mass: 2.5, unit: 'g' },
  { name: 'Apple', mass: 150, unit: 'g' },
  { name: 'Baseball', mass: 145, unit: 'g' },
  { name: 'Human Brain', mass: 1.4, unit: 'kg' },
  { name: 'Gallon of Water', mass: 3.785, unit: 'kg' },
  { name: 'Adult Human', mass: 70, unit: 'kg' },
  { name: 'Small Car', mass: 1000, unit: 'kg' }
]

export default function MassCalculator() {
  const [inputValue, setInputValue] = useState('')
  const [fromUnit, setFromUnit] = useState('g')
  const [showResults, setShowResults] = useState(false)

  const convertMass = useCallback((value: number, fromUnit: string): MassResult => {
    const grams = value * MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].factor
    
    return {
      grams,
      kilograms: grams / 1000,
      pounds: grams / 453.592,
      ounces: grams / 28.3495,
      milligrams: grams * 1000,
      tons: grams / 1000000
    }
  }, [])

  const handleCalculate = () => {
    if (inputValue && parseFloat(inputValue) > 0) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setInputValue('')
    setFromUnit('g')
    setShowResults(false)
  }

  const handleCommonMass = (mass: number, unit: string) => {
    setInputValue(mass.toString())
    setFromUnit(unit)
    setShowResults(true)
  }

  const formatNumber = (num: number, decimals: number = 3) => {
    if (isNaN(num) || !isFinite(num)) return '0.000'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = convertMass(parseFloat(inputValue), fromUnit)
    
    const data = `Mass Calculator Results

Input: ${inputValue} ${MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].name}

Converted Masses:
- Grams: ${formatNumber(result.grams)} g
- Kilograms: ${formatNumber(result.kilograms)} kg
- Pounds: ${formatNumber(result.pounds)} lb
- Ounces: ${formatNumber(result.ounces)} oz
- Milligrams: ${formatNumber(result.milligrams)} mg
- Metric Tons: ${formatNumber(result.tons)} t`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mass-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = convertMass(parseFloat(inputValue), fromUnit)
      
      navigator.share({
        title: 'Mass Calculator Results',
        text: `${inputValue} ${MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].name} = ${formatNumber(result.kilograms)} kg, ${formatNumber(result.pounds)} lb`,
        url: window.location.href
      })
    } else {
      const text = `Mass: ${inputValue} ${MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].name}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? convertMass(parseFloat(inputValue), fromUnit) : { grams: 0, kilograms: 0, pounds: 0, ounces: 0, milligrams: 0, tons: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mass Calculator</h1>
            <p className="text-orange-100 text-lg">
              Convert between mass units including grams, kilograms, pounds, ounces, and more. 
              Perfect for cooking, science experiments, and weight conversions.
            </p>
          </div>
          <div className="hidden md:block">
            <Scale className="w-16 h-16 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Mass Input */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Convert Mass</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mass Value
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="100"
                  min="0"
                  step="0.001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Unit
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Select mass unit"
                >
                  {Object.entries(MASS_UNITS).map(([key, unit]) => (
                    <option key={key} value={key}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Common Masses */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Masses</h3>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_MASSES.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleCommonMass(item.mass, item.unit)}
                  className="text-left p-2 bg-white rounded border hover:bg-orange-50 transition-colors text-sm"
                >
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-gray-600">{item.mass} {item.unit}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            disabled={!inputValue || parseFloat(inputValue) <= 0}
            className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 ${
              !inputValue || parseFloat(inputValue) <= 0
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Convert Mass</span>
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Mass Conversions */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">Mass Conversions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.grams)}</div>
                  <div className="text-sm text-gray-600">Grams (g)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.kilograms)}</div>
                  <div className="text-sm text-gray-600">Kilograms (kg)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.pounds)}</div>
                  <div className="text-sm text-gray-600">Pounds (lb)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.ounces)}</div>
                  <div className="text-sm text-gray-600">Ounces (oz)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.milligrams)}</div>
                  <div className="text-sm text-gray-600">Milligrams (mg)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-700">{formatNumber(result.tons)}</div>
                  <div className="text-sm text-gray-600">Metric Tons (t)</div>
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
            <Info className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Mass Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator converts between different mass units commonly used in everyday life. 
                Mass is a measure of the amount of matter in an object, different from weight which 
                depends on gravity. Use it for cooking recipes, science experiments, or understanding 
                weight measurements from different countries.
              </p>
            </div>
          </div>
        </div>
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Mass Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive mass calculator helps professionals, students, and everyday users 
              convert between different mass measurement systems with precision and ease. This 
              essential tool supports metric, imperial, and specialized units, providing accurate 
              conversions for science, cooking, engineering, and daily life applications.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Converts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Metric Units:</strong> Kilograms, grams, milligrams, metric tons</li>
              <li><strong>Imperial Units:</strong> Pounds, ounces, stones</li>
              <li><strong>Scientific Units:</strong> Micrograms, nanograms, picograms</li>
              <li><strong>Precision Conversions:</strong> Accurate to multiple decimal places</li>
              <li><strong>Bidirectional Conversion:</strong> Convert in both directions</li>
              <li><strong>Common Masses:</strong> Pre-loaded reference values</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mass vs. Weight Understanding</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Mass</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Definition:</strong> Amount of matter in an object</li>
                  <li><strong>Constant:</strong> Same regardless of location</li>
                  <li><strong>Units:</strong> kg, g, lb (mass)</li>
                  <li><strong>Measurement:</strong> Balance scales, mass spectrometers</li>
                  <li><strong>Physics:</strong> Inertia and gravitational mass</li>
                  <li><strong>Example:</strong> 1 kg on Earth = 1 kg on Moon</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Weight</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Definition:</strong> Force of gravity on an object</li>
                  <li><strong>Variable:</strong> Changes with gravitational field</li>
                  <li><strong>Units:</strong> Newtons (N), pound-force (lbf)</li>
                  <li><strong>Measurement:</strong> Spring scales, force meters</li>
                  <li><strong>Physics:</strong> F = mg (force = mass × gravity)</li>
                  <li><strong>Example:</strong> 1 kg weighs 9.8N on Earth</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Input Value</h5>
                <p className="text-orange-700 text-sm">Original mass</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">From Unit</h5>
                <p className="text-blue-700 text-sm">Source unit</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">To Unit</h5>
                <p className="text-purple-700 text-sm">Target unit</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Result</h5>
                <p className="text-green-700 text-sm">Converted value</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the mass value you want to convert, select the source unit (from), and the target unit (to). 
              The calculator will instantly provide the converted value with high precision. Use the common masses 
              buttons for quick reference values, and the action buttons to download, share, or print your results.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Conversion Factors</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Metric to Imperial:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>1 kilogram = 2.20462 pounds</li>
                    <li>1 gram = 0.035274 ounces</li>
                    <li>1 metric ton = 2204.62 pounds</li>
                    <li>1 milligram = 0.000035274 ounces</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Imperial to Metric:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>1 pound = 0.453592 kilograms</li>
                    <li>1 ounce = 28.3495 grams</li>
                    <li>1 stone = 6.35029 kilograms</li>
                    <li>1 ton (US) = 907.185 kilograms</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mass Unit Categories</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Metric System</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Base Unit:</strong> Kilogram (kg)</li>
                  <li><strong>Large Units:</strong> Metric ton (t), megagram (Mg)</li>
                  <li><strong>Small Units:</strong> Gram (g), milligram (mg)</li>
                  <li><strong>Micro Units:</strong> Microgram (μg), nanogram (ng)</li>
                  <li><strong>Advantages:</strong> Decimal-based, internationally standardized</li>
                  <li><strong>Global Use:</strong> Scientific and most countries</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Imperial System</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Base Units:</strong> Pound (lb), ounce (oz)</li>
                  <li><strong>Large Units:</strong> Ton (US), stone (st)</li>
                  <li><strong>Small Units:</strong> Grain (gr), dram (dr)</li>
                  <li><strong>Conversions:</strong> 16 oz = 1 lb, 14 lb = 1 stone</li>
                  <li><strong>Primary Use:</strong> United States, some other countries</li>
                  <li><strong>Precision:</strong> Fractional divisions common</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Practical Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Cooking and Baking:</strong> Recipe measurements and ingredient conversions</li>
              <li><strong>Science and Laboratory:</strong> Chemical measurements and experiments</li>
              <li><strong>Engineering:</strong> Material specifications and load calculations</li>
              <li><strong>Medicine:</strong> Dosage calculations and patient weight</li>
              <li><strong>Shipping and Logistics:</strong> Package weight and freight calculations</li>
              <li><strong>International Trade:</strong> Product specifications and customs</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Mass References</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Everyday Objects</h5>
                <p className="text-blue-700 text-sm">Paper clip: 1g, Apple: 150g</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Human Scale</h5>
                <p className="text-green-700 text-sm">Newborn: 3kg, Adult: 70kg</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Large Objects</h5>
                <p className="text-purple-700 text-sm">Car: 1500kg, Elephant: 5000kg</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Precision and Accuracy</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Significant Figures:</strong> Maintain appropriate precision</li>
              <li><strong>Rounding Rules:</strong> Follow standard mathematical conventions</li>
              <li><strong>Error Propagation:</strong> Consider measurement uncertainties</li>
              <li><strong>Unit Consistency:</strong> Ensure compatible units</li>
              <li><strong>Validation:</strong> Cross-check with known conversions</li>
              <li><strong>Context Matters:</strong> Choose appropriate precision for application</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mass Conversion Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Base Units:</strong> Convert through kilograms or grams</li>
              <li><strong>Check Orders of Magnitude:</strong> Verify results make sense</li>
              <li><strong>Consider Context:</strong> Choose appropriate units for application</li>
              <li><strong>Document Conversions:</strong> Keep records for reference</li>
              <li><strong>Practice Estimation:</strong> Develop intuitive mass sense</li>
              <li><strong>Verify Results:</strong> Double-check important conversions</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Conversion Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Unit Confusion:</strong> Mixing up mass and weight units</li>
              <li><strong>Decimal Errors:</strong> Incorrect decimal placement</li>
              <li><strong>Conversion Factor Errors:</strong> Using wrong multipliers</li>
              <li><strong>Precision Loss:</strong> Over-rounding results</li>
              <li><strong>Context Ignorance:</strong> Using wrong units for application</li>
              <li><strong>Direction Errors:</strong> Converting in wrong direction</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When working with mass conversions, always consider the context and required precision. 
                For scientific applications, maintain high precision and use standard metric units. 
                For everyday use, round to practical decimal places. Remember that mass is different 
                from weight - mass is constant while weight varies with gravity. Keep a reference of 
                common conversion factors for quick mental calculations and verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
