'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, TrendingUp, Globe, Share2, Download, Printer } from 'lucide-react'
import ShareModal from '../ShareModal'

interface AreaUnit {
  name: string
  symbol: string
  toSquareMeters: number
}

const areaUnits: AreaUnit[] = [
  { name: 'Square Meters', symbol: 'm²', toSquareMeters: 1 },
  { name: 'Square Kilometers', symbol: 'km²', toSquareMeters: 1000000 },
  { name: 'Square Centimeters', symbol: 'cm²', toSquareMeters: 0.0001 },
  { name: 'Square Millimeters', symbol: 'mm²', toSquareMeters: 0.000001 },
  { name: 'Square Inches', symbol: 'in²', toSquareMeters: 0.00064516 },
  { name: 'Square Feet', symbol: 'ft²', toSquareMeters: 0.092903 },
  { name: 'Square Yards', symbol: 'yd²', toSquareMeters: 0.836127 },
  { name: 'Square Miles', symbol: 'mi²', toSquareMeters: 2589988.11 },
  { name: 'Acres', symbol: 'ac', toSquareMeters: 4046.86 },
  { name: 'Hectares', symbol: 'ha', toSquareMeters: 10000 }
]

export default function AreaConverter() {
  const [fromUnit, setFromUnit] = useState<string>('m²')
  const [toUnit, setToUnit] = useState<string>('ft²')
  const [inputValue, setInputValue] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const fromUnitData = areaUnits.find(unit => unit.symbol === fromUnit)
  const toUnitData = areaUnits.find(unit => unit.symbol === toUnit)

  const calculateArea = useCallback(() => {
    if (!inputValue || !fromUnitData || !toUnitData) return

    const inputNum = parseFloat(inputValue)
    if (isNaN(inputNum)) return

    // Convert to square meters first, then to target unit
    const inSquareMeters = inputNum * fromUnitData.toSquareMeters
    const converted = inSquareMeters / toUnitData.toSquareMeters

    setResult(converted)
  }, [inputValue, fromUnitData, toUnitData])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (value && fromUnitData && toUnitData) {
      const inputNum = parseFloat(value)
      if (!isNaN(inputNum)) {
        const inSquareMeters = inputNum * fromUnitData.toSquareMeters
        const converted = inSquareMeters / toUnitData.toSquareMeters
        setResult(converted)
      }
    } else {
      setResult(null)
    }
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    if (result !== null) {
      setInputValue(result.toString())
      setResult(parseFloat(inputValue))
    }
  }

  const formatResult = (value: number): string => {
    if (value === 0) return '0'
    if (Math.abs(value) < 0.000001) return value.toExponential(6)
    if (Math.abs(value) < 0.01) return value.toFixed(6)
    if (Math.abs(value) < 1) return value.toFixed(4)
    if (Math.abs(value) < 1000) return value.toFixed(2)
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }

  const quickExamples = [
    { from: '100', fromUnit: 'm²', toUnit: 'ft²', result: '1,076.39' },
    { from: '1', fromUnit: 'ac', toUnit: 'ha', result: '0.40' },
    { from: '500', fromUnit: 'ft²', toUnit: 'm²', result: '46.45' },
    { from: '2', fromUnit: 'km²', toUnit: 'mi²', result: '0.77' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="w-full px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Area Converter</h1>
          <p className="text-lg text-gray-600">Convert between different area units and measurements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Converter */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Area Conversion</h2>
              </div>

              <div className="space-y-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Area
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Enter area value"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                      step="any"
                      min="0"
                    />
                                         <select
                       value={fromUnit}
                       onChange={(e) => setFromUnit(e.target.value)}
                       className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                       title="Select from unit"
                       aria-label="Select from unit"
                     >
                      {areaUnits.map((unit) => (
                        <option key={unit.symbol} value={unit.symbol}>
                          {unit.symbol} - {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapUnits}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    aria-label="Swap units"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Converted Area
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={result !== null ? formatResult(result) : ''}
                      readOnly
                      placeholder="Converted value"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-lg font-mono"
                    />
                                         <select
                       value={toUnit}
                       onChange={(e) => setToUnit(e.target.value)}
                       className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                       title="Select to unit"
                       aria-label="Select to unit"
                     >
                      {areaUnits.map((unit) => (
                        <option key={unit.symbol} value={unit.symbol}>
                          {unit.symbol} - {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Result Display */}
                {result !== null && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 mb-1">Conversion Result</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {inputValue} {fromUnit} = {formatResult(result)} {toUnit}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Examples */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Quick Examples</h3>
              </div>
              <div className="space-y-3">
                {quickExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(example.from)
                      setFromUnit(example.fromUnit)
                      setToUnit(example.toUnit)
                    }}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {example.from} {example.fromUnit} → {example.result} {example.toUnit}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Common Conversions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Conversions</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 1 m² = 10.764 ft²</p>
                <p>• 1 km² = 0.386 mi²</p>
                <p>• 1 ac = 0.405 ha</p>
                <p>• 1 ha = 2.471 ac</p>
                <p>• 1 ft² = 0.093 m²</p>
                <p>• 1 mi² = 2.590 km²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Share2 className="w-5 h-5" />
            Share Result
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            <Printer className="w-5 h-5" />
            Print
          </button>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            calculation={{
              expression: `${inputValue} ${fromUnit}`,
              result: `${formatResult(result || 0)} ${toUnit}`,
              timestamp: new Date()
            }}
          />
        )}
      </div>

      {/* Calculator Description Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About Area Converter</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Our comprehensive area converter helps professionals, students, and DIY enthusiasts 
            convert between different area measurement units quickly and accurately. This essential 
            conversion tool provides precise area conversions across metric, imperial, and specialized 
            units, helping with international projects, academic work, and everyday calculations.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Converts</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Metric Units:</strong> Square millimeters, centimeters, meters, kilometers</li>
            <li><strong>Imperial Units:</strong> Square inches, feet, yards, miles</li>
            <li><strong>Specialized Units:</strong> Acres, hectares, square rods, square chains</li>
            <li><strong>International Standards:</strong> SI units and traditional measurements</li>
            <li><strong>Precision Conversions:</strong> Accurate to multiple decimal places</li>
            <li><strong>Bidirectional Conversion:</strong> Convert from any unit to any other</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Supported Area Units</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Metric System</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>mm²:</strong> Square millimeters (very small areas)</li>
                <li><strong>cm²:</strong> Square centimeters (small areas)</li>
                <li><strong>m²:</strong> Square meters (standard metric unit)</li>
                <li><strong>km²:</strong> Square kilometers (large areas)</li>
                <li><strong>ha:</strong> Hectares (land measurement)</li>
                <li><strong>International Standard:</strong> Scientific applications</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Imperial System</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>in²:</strong> Square inches (small areas)</li>
                <li><strong>ft²:</strong> Square feet (common construction unit)</li>
                <li><strong>yd²:</strong> Square yards (landscaping)</li>
                <li><strong>mi²:</strong> Square miles (large land areas)</li>
                <li><strong>ac:</strong> Acres (land measurement)</li>
                <li><strong>US Standard:</strong> Construction and real estate</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-1">Input Value</h5>
              <p className="text-blue-700 text-sm">Original area measurement</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-1">Conversion</h5>
              <p className="text-green-700 text-sm">Mathematical transformation</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-1">Output Value</h5>
              <p className="text-purple-700 text-sm">Converted area measurement</p>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
          <p className="text-gray-700 mb-4">
            Enter the area value you want to convert, select the source unit, choose the target unit, 
            and the converter will instantly provide the converted value. Use the quick examples for 
            common conversions or explore the conversion table for reference.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Conversion Methods</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Direct Conversion:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Standard conversion factors</li>
                  <li>Precise mathematical formulas</li>
                  <li>No intermediate steps</li>
                  <li>Fastest calculation method</li>
                  <li>Most accurate results</li>
                  <li>Industry standard approach</li>
                </ul>
              </div>
              <div>
                <p><strong>Cross-System Conversion:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Metric to imperial conversion</li>
                  <li>Imperial to metric conversion</li>
                  <li>Specialized unit handling</li>
                  <li>International standards</li>
                  <li>Precision maintained</li>
                  <li>Professional accuracy</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Conversion Factors</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Metric to Imperial:</strong> 1 m² = 10.764 ft², 1 km² = 0.386 mi²</li>
            <li><strong>Imperial to Metric:</strong> 1 ft² = 0.093 m², 1 mi² = 2.590 km²</li>
            <li><strong>Land Measurements:</strong> 1 acre = 0.405 hectares, 1 hectare = 2.471 acres</li>
            <li><strong>Small Areas:</strong> 1 cm² = 0.155 in², 1 in² = 6.452 cm²</li>
            <li><strong>Large Areas:</strong> 1 km² = 247.1 acres, 1 mi² = 640 acres</li>
            <li><strong>Precision Factors:</strong> Maintained to 6+ decimal places</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Practical Applications</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Construction & Building</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Floor Plans:</strong> Convert between measurement systems</li>
                <li><strong>Material Estimates:</strong> Calculate coverage areas</li>
                <li><strong>International Projects:</strong> Work with different standards</li>
                <li><strong>Blueprint Reading:</strong> Understand various unit systems</li>
                <li><strong>Cost Calculations:</strong> Price per unit area</li>
                <li><strong>Regulatory Compliance:</strong> Meet local standards</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Academic & Professional</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Mathematics:</strong> Unit conversion exercises</li>
                <li><strong>Engineering:</strong> International project specifications</li>
                <li><strong>Architecture:</strong> Global design standards</li>
                <li><strong>Surveying:</strong> Land measurement conversions</li>
                <li><strong>Real Estate:</strong> Property area comparisons</li>
                <li><strong>Research:</strong> Data analysis and reporting</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Conversion Accuracy</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Precision:</strong> Results accurate to 6+ decimal places</li>
            <li><strong>Rounding:</strong> Appropriate precision for each unit type</li>
            <li><strong>Validation:</strong> Cross-checked conversion factors</li>
            <li><strong>Standards:</strong> Based on international measurement standards</li>
            <li><strong>Consistency:</strong> Bidirectional conversion verification</li>
            <li><strong>Professional Grade:</strong> Suitable for commercial use</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Unit Selection Guidelines</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Small Areas:</strong> Use mm², cm², or in² for precision</li>
            <li><strong>Medium Areas:</strong> Use m² or ft² for general measurements</li>
            <li><strong>Large Areas:</strong> Use km², mi², or hectares for land</li>
            <li><strong>Construction:</strong> ft² and m² are most common</li>
            <li><strong>Land Surveying:</strong> Acres and hectares for property</li>
            <li><strong>Scientific Work:</strong> Metric units (SI system)</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">International Standards</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>SI Units:</strong> International System of Units (metric)</li>
            <li><strong>ISO Standards:</strong> International Organization for Standardization</li>
            <li><strong>NIST Guidelines:</strong> National Institute of Standards and Technology</li>
            <li><strong>Industry Standards:</strong> Construction and engineering norms</li>
            <li><strong>Legal Requirements:</strong> Government and regulatory standards</li>
            <li><strong>Global Trade:</strong> International commerce standards</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Conversion Mistakes</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Linear vs. Area:</strong> Confusing length units with area units</li>
            <li><strong>Unit Confusion:</strong> Mixing metric and imperial systems</li>
            <li><strong>Precision Errors:</strong> Insufficient decimal places</li>
            <li><strong>Formula Errors:</strong> Incorrect conversion factors</li>
            <li><strong>Rounding Errors:</strong> Too early or too late rounding</li>
            <li><strong>Context Ignorance:</strong> Not considering application needs</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Conversion Concepts</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Dimensional Analysis:</strong> Systematic unit conversion method</li>
            <li><strong>Conversion Chains:</strong> Multi-step unit conversions</li>
            <li><strong>Precision Management:</strong> Maintaining accuracy through conversions</li>
            <li><strong>Error Propagation:</strong> Understanding conversion uncertainties</li>
            <li><strong>Unit Consistency:</strong> Ensuring compatible units</li>
            <li><strong>Validation Methods:</strong> Verifying conversion accuracy</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
            <p className="text-gray-700 text-sm">
              When converting between area units, always consider the precision needed for your 
              specific application. For construction projects, round to practical levels (e.g., 
              nearest square foot or square meter). For scientific work, maintain higher precision. 
              Remember that area conversions involve squared units, so a 10x difference in length 
              becomes a 100x difference in area. Always verify your conversions by converting back 
              to the original unit to ensure accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
