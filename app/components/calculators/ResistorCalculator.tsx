'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Zap, Palette, Cpu } from 'lucide-react'

interface ResistorResult {
  totalResistance: number
  totalCurrent: number
  totalPower: number
  voltageDrop: number
  powerDissipation: number
  tolerance: number
  colorCode: string[]
}

interface ResistorValue {
  value: number
  tolerance: number
  powerRating: number
  description: string
}

const RESISTOR_VALUES: ResistorValue[] = [
  { value: 10, tolerance: 5, powerRating: 0.25, description: 'Common value' },
  { value: 100, tolerance: 5, powerRating: 0.25, description: 'Standard' },
  { value: 1000, tolerance: 5, powerRating: 0.25, description: '1K ohm' },
  { value: 10000, tolerance: 5, powerRating: 0.25, description: '10K ohm' },
  { value: 100000, tolerance: 5, powerRating: 0.25, description: '100K ohm' },
  { value: 1000000, tolerance: 5, powerRating: 0.25, description: '1M ohm' }
]

const COLOR_BANDS = [
  { color: 'Black', value: 0, multiplier: 1, tolerance: null },
  { color: 'Brown', value: 1, multiplier: 10, tolerance: 1 },
  { color: 'Red', value: 2, multiplier: 100, tolerance: 2 },
  { color: 'Orange', value: 3, multiplier: 1000, tolerance: null },
  { color: 'Yellow', value: 4, multiplier: 10000, tolerance: null },
  { color: 'Green', value: 5, multiplier: 100000, tolerance: 0.5 },
  { color: 'Blue', value: 6, multiplier: 1000000, tolerance: 0.25 },
  { color: 'Violet', value: 7, multiplier: 10000000, tolerance: 0.1 },
  { color: 'Gray', value: 8, multiplier: 100000000, tolerance: 0.05 },
  { color: 'White', value: 9, multiplier: 1000000000, tolerance: null },
  { color: 'Gold', value: null, multiplier: 0.1, tolerance: 5 },
  { color: 'Silver', value: null, multiplier: 0.01, tolerance: 10 }
]

const CIRCUIT_TYPES = [
  { name: 'Series', description: 'Resistors in line', formula: 'R_total = R1 + R2 + R3...' },
  { name: 'Parallel', description: 'Resistors side by side', formula: '1/R_total = 1/R1 + 1/R2 + 1/R3...' },
  { name: 'Mixed', description: 'Combination of series and parallel', formula: 'Calculate sections separately' }
]

export default function ResistorCalculator() {
  const [circuitType, setCircuitType] = useState('Series')
  const [resistors, setResistors] = useState<string[]>([''])
  const [voltage, setVoltage] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateResistance = useCallback((): ResistorResult => {
    const validResistors = resistors
      .map(r => parseFloat(r))
      .filter(r => !isNaN(r) && r > 0)
    
    if (validResistors.length === 0) return {
      totalResistance: 0,
      totalCurrent: 0,
      totalPower: 0,
      voltageDrop: 0,
      powerDissipation: 0,
      tolerance: 0,
      colorCode: []
    }

    let totalResistance = 0
    
    if (circuitType === 'Series') {
      totalResistance = validResistors.reduce((sum, r) => sum + r, 0)
    } else if (circuitType === 'Parallel') {
      totalResistance = 1 / validResistors.reduce((sum, r) => sum + (1 / r), 0)
    }
    
    const voltageValue = parseFloat(voltage) || 0
    const totalCurrent = voltageValue > 0 ? voltageValue / totalResistance : 0
    const totalPower = voltageValue > 0 ? (voltageValue * voltageValue) / totalResistance : 0
    
    // Calculate voltage drop across each resistor (for series)
    let voltageDrop = 0
    if (circuitType === 'Series' && voltageValue > 0) {
      voltageDrop = voltageValue / validResistors.length
    }
    
    // Calculate power dissipation
    const powerDissipation = totalPower / validResistors.length
    
    // Estimate tolerance (average of typical values)
    const tolerance = 5 // Default 5% tolerance
    
    // Generate color code for total resistance
    const colorCode = generateColorCode(totalResistance)

    return {
      totalResistance,
      totalCurrent,
      totalPower,
      voltageDrop,
      powerDissipation,
      tolerance,
      colorCode
    }
  }, [resistors, circuitType, voltage])

  const generateColorCode = (resistance: number): string[] => {
    if (resistance === 0) return []
    
    const colors: string[] = []
    let value = resistance
    
    // Find the appropriate multiplier
    let multiplier = 1
    let multiplierColor = ''
    
    if (value >= 1000000) {
      multiplier = 1000000
      multiplierColor = 'Blue'
    } else if (value >= 100000) {
      multiplier = 100000
      multiplierColor = 'Green'
    } else if (value >= 10000) {
      multiplier = 10000
      multiplierColor = 'Orange'
    } else if (value >= 1000) {
      multiplier = 1000
      multiplierColor = 'Red'
    } else if (value >= 100) {
      multiplier = 100
      multiplierColor = 'Brown'
    } else if (value >= 10) {
      multiplier = 10
      multiplierColor = 'Black'
    } else if (value >= 1) {
      multiplier = 1
      multiplierColor = 'Black'
    } else if (value >= 0.1) {
      multiplier = 0.1
      multiplierColor = 'Gold'
    } else {
      multiplier = 0.01
      multiplierColor = 'Silver'
    }
    
    // Normalize to get the base value
    const baseValue = Math.round(value / multiplier)
    
    // Convert to digits
    const digits = baseValue.toString().padStart(2, '0').split('').map(d => parseInt(d))
    
    // First digit
    if (digits[0] > 0) {
      const firstColor = COLOR_BANDS.find(c => c.value === digits[0])
      if (firstColor) colors.push(firstColor.color)
    }
    
    // Second digit
    if (digits[1] >= 0) {
      const secondColor = COLOR_BANDS.find(c => c.value === digits[1])
      if (secondColor) colors.push(secondColor.color)
    }
    
    // Multiplier
    colors.push(multiplierColor)
    
    // Tolerance (default to Gold 5%)
    colors.push('Gold')
    
    return colors
  }

  const addResistor = () => {
    setResistors([...resistors, ''])
  }

  const removeResistor = (index: number) => {
    if (resistors.length > 1) {
      setResistors(resistors.filter((_, i) => i !== index))
    }
  }

  const updateResistor = (index: number, value: string) => {
    const newResistors = [...resistors]
    newResistors[index] = value
    setResistors(newResistors)
  }

  const handleCalculate = () => {
    const validResistors = resistors.filter(r => r.trim() !== '')
    if (validResistors.length > 0) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setResistors([''])
    setVoltage('')
    setCircuitType('Series')
    setShowResults(false)
  }

  const handleQuickResistor = (resistor: ResistorValue) => {
    setResistors([resistor.value.toString()])
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const formatResistance = (resistance: number): string => {
    if (resistance >= 1000000) {
      return `${(resistance / 1000000).toFixed(2)} MΩ`
    } else if (resistance >= 1000) {
      return `${(resistance / 1000).toFixed(2)} kΩ`
    } else {
      return `${resistance.toFixed(2)} Ω`
    }
  }

  const downloadResults = () => {
    const result = calculateResistance()
    
    const data = `Resistor Calculator Results

Circuit Type: ${circuitType}
Voltage: ${voltage} V

Resistor Values: ${resistors.filter(r => r.trim() !== '').join(', ')} Ω

Results:
- Total Resistance: ${formatResistance(result.totalResistance)}
- Total Current: ${formatNumber(result.totalCurrent)} A
- Total Power: ${formatNumber(result.totalPower)} W
- Voltage Drop per Resistor: ${formatNumber(result.voltageDrop)} V
- Power Dissipation per Resistor: ${formatNumber(result.powerDissipation)} W
- Tolerance: ${result.tolerance}%
- Color Code: ${result.colorCode.join(' - ')}

Circuit Analysis:
- ${circuitType} circuit configuration
- Power calculations based on voltage and resistance
- Color code represents total resistance value
- Consider power ratings for component selection`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resistor-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateResistance()
      
      navigator.share({
        title: 'Resistor Calculator Results',
        text: `Total Resistance: ${formatResistance(result.totalResistance)}, Current: ${formatNumber(result.totalCurrent)}A`,
        url: window.location.href
      })
    } else {
      const result = calculateResistance()
      const text = `Resistance: ${formatResistance(result.totalResistance)}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateResistance() : { totalResistance: 0, totalCurrent: 0, totalPower: 0, voltageDrop: 0, powerDissipation: 0, tolerance: 0, colorCode: [] }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resistor Calculator</h1>
            <p className="text-purple-100 text-lg">
              Calculate total resistance, current, and power for series and parallel circuits. 
              Includes color code generation and power analysis for electronics projects.
            </p>
          </div>
          <div className="hidden md:block">
            <Cpu className="w-16 h-16 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Circuit Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Circuit Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CIRCUIT_TYPES.map((circuit, index) => (
              <button
                key={index}
                onClick={() => setCircuitType(circuit.name)}
                className={`p-4 rounded-lg font-medium transition-colors text-center ${
                  circuitType === circuit.name
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="font-semibold">{circuit.name}</div>
                <div className="text-sm opacity-80">{circuit.description}</div>
                <div className="text-xs opacity-60 mt-1">{circuit.formula}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Resistor Values */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Resistor Values</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {RESISTOR_VALUES.map((resistor, index) => (
              <button
                key={index}
                onClick={() => handleQuickResistor(resistor)}
                className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-sm text-center"
              >
                <div className="font-medium text-purple-800">{formatResistance(resistor.value)}</div>
                <div className="text-purple-600">±{resistor.tolerance}%</div>
                <div className="text-xs text-purple-500">{resistor.powerRating}W</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Resistor Values */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Resistor Values (Ω)</h3>
            {resistors.map((resistor, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="number"
                  value={resistor}
                  onChange={(e) => updateResistor(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1000"
                  min="0.1"
                  max="10000000"
                  step="0.1"
                  aria-label={`Resistor ${index + 1} value in ohms`}
                />
                {resistors.length > 1 && (
                  <button
                    onClick={() => removeResistor(index)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    aria-label={`Remove resistor ${index + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addResistor}
              className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors font-medium"
            >
              + Add Resistor
            </button>
          </div>

          {/* Voltage Input */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Power Supply</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voltage (V)
              </label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="12"
                min="0.1"
                max="1000"
                step="0.1"
                aria-label="Power supply voltage in volts"
              />
              <p className="text-xs text-gray-500 mt-1">Optional: for current and power calculations</p>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        {resistors.some(r => r.trim() !== '') && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Circuit</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Circuit Results */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Circuit Calculation Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatResistance(result.totalResistance)}</div>
                  <div className="text-sm text-gray-600">Total Resistance</div>
                  <div className="text-xs text-purple-600">{circuitType} circuit</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.totalCurrent)} A</div>
                  <div className="text-sm text-gray-600">Total Current</div>
                  <div className="text-xs text-blue-600">At {voltage}V</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatNumber(result.totalPower)} W</div>
                  <div className="text-sm text-gray-600">Total Power</div>
                  <div className="text-xs text-green-600">Dissipated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{formatNumber(result.voltageDrop)} V</div>
                  <div className="text-sm text-gray-600">Voltage Drop</div>
                  <div className="text-xs text-orange-600">Per resistor</div>
                </div>
              </div>
            </div>

            {/* Color Code */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resistor Color Code</h3>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-3">Color bands for {formatResistance(result.totalResistance)}</div>
                <div className="flex justify-center space-x-2">
                  {result.colorCode.map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-8 rounded border-2 border-gray-300 flex items-center justify-center text-xs font-medium"
                      style={{
                        backgroundColor: getColorValue(color),
                        color: getTextColor(color)
                      }}
                    >
                      {color}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {result.colorCode.join(' - ')} (±{result.tolerance}%)
                </div>
              </div>
            </div>

            {/* Power Analysis */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Power Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Circuit Power</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Power:</span>
                      <span className="font-semibold">{formatNumber(result.totalPower)} W</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Power per Resistor:</span>
                      <span className="font-semibold">{formatNumber(result.powerDissipation)} W</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Current Flow</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Current:</span>
                      <span className="font-semibold">{formatNumber(result.totalCurrent)} A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voltage Drop:</span>
                      <span className="font-semibold">{formatNumber(result.voltageDrop)} V</span>
                    </div>
                  </div>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Resistor Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive resistor calculator is designed for electronics engineers, hobbyists, and students to 
                analyze electrical circuits containing resistors. It calculates total resistance, current flow, power 
                dissipation, and voltage distribution for series, parallel, and mixed circuit configurations.
              </p>
              <p className="text-gray-700">
                The calculator automatically generates standard 4-band color codes for resistance values and provides 
                detailed power analysis to ensure safe component selection and circuit operation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Electrical Circuit Fundamentals</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Series Circuits</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Current flows through each resistor sequentially</li>
                    <li>Total resistance = R1 + R2 + R3 + ...</li>
                    <li>Same current flows through all resistors</li>
                    <li>Voltage divides across each resistor</li>
                    <li>Power dissipation varies by resistance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Parallel Circuits</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Current divides among parallel branches</li>
                    <li>1/R_total = 1/R1 + 1/R2 + 1/R3 + ...</li>
                    <li>Same voltage across all resistors</li>
                    <li>Total current = sum of branch currents</li>
                    <li>Lower total resistance than individual</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Calculations Explained</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Total Resistance:</strong> Effective resistance of the entire circuit configuration</li>
                <li><strong>Current Flow:</strong> Total current drawn from the voltage source (I = V/R)</li>
                <li><strong>Power Dissipation:</strong> Electrical power converted to heat in each resistor (P = I²R)</li>
                <li><strong>Voltage Drop:</strong> Voltage across individual resistors in series circuits</li>
                <li><strong>Color Code:</strong> Standard 4-band resistor color coding system</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Resistor Color Code System</h3>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-gray-800 mb-2">4-Band Color Code</h4>
                <div className="grid md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p><strong>Band 1:</strong> First significant digit</p>
                    <p><strong>Band 2:</strong> Second significant digit</p>
                  </div>
                  <div>
                    <p><strong>Band 3:</strong> Multiplier (power of 10)</p>
                    <p><strong>Band 4:</strong> Tolerance percentage</p>
                  </div>
                  <div>
                    <p><strong>Example:</strong> Brown-Black-Red-Gold</p>
                    <p><strong>Value:</strong> 10 × 100 = 1,000Ω ±5%</p>
                  </div>
                  <div>
                    <p><strong>Common Tolerances:</strong></p>
                    <p>Gold: ±5%, Silver: ±10%</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Practical Applications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Electronics Design</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Voltage divider circuits</li>
                    <li>Current limiting applications</li>
                    <li>Load matching and impedance</li>
                    <li>Signal conditioning</li>
                    <li>Power supply design</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Educational & Learning</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Circuit theory understanding</li>
                    <li>Ohm's Law applications</li>
                    <li>Power calculations</li>
                    <li>Circuit analysis skills</li>
                    <li>Component selection</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Safety Considerations</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Power Rating:</strong> Ensure resistors can handle calculated power dissipation</li>
                <li><strong>Voltage Rating:</strong> Check maximum voltage ratings for high-voltage circuits</li>
                <li><strong>Temperature Rise:</strong> Monitor for excessive heat generation</li>
                <li><strong>Current Limits:</strong> Verify current ratings for high-current applications</li>
                <li><strong>Circuit Protection:</strong> Include fuses or circuit breakers where appropriate</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Component Selection Guidelines</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Resistance Value</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Choose standard E12/E24 series values</li>
                    <li>Consider tolerance requirements</li>
                    <li>Account for temperature effects</li>
                    <li>Use precision resistors for critical circuits</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Power Rating</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Select power rating 2x calculated dissipation</li>
                    <li>Consider ambient temperature effects</li>
                    <li>Account for mounting and ventilation</li>
                    <li>Use heat sinks for high-power applications</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Mistakes to Avoid</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Power Rating:</strong> Underestimating power dissipation requirements</li>
                <li><strong>Voltage Rating:</strong> Exceeding maximum voltage ratings</li>
                <li><strong>Temperature Effects:</strong> Ignoring resistance changes with temperature</li>
                <li><strong>Paralleling:</strong> Incorrectly calculating parallel resistance</li>
                <li><strong>Color Code:</strong> Misreading resistor color bands</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Always derate power ratings by 50% for reliable operation</li>
                <li>• Use precision resistors (1% tolerance) for measurement circuits</li>
                <li>• Consider temperature coefficient for precision applications</li>
                <li>• Verify calculations with multimeter measurements</li>
                <li>• Use appropriate wire gauge for high-current circuits</li>
                <li>• Document your circuit design and component selections</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get color values for display
function getColorValue(color: string): string {
  const colorMap: { [key: string]: string } = {
    'Black': '#000000',
    'Brown': '#8B4513',
    'Red': '#FF0000',
    'Orange': '#FFA500',
    'Yellow': '#FFFF00',
    'Green': '#008000',
    'Blue': '#0000FF',
    'Violet': '#800080',
    'Gray': '#808080',
    'White': '#FFFFFF',
    'Gold': '#FFD700',
    'Silver': '#C0C0C0'
  }
  return colorMap[color] || '#FFFFFF'
}

function getTextColor(color: string): string {
  const darkColors = ['Black', 'Blue', 'Violet', 'Brown']
  return darkColors.includes(color) ? '#FFFFFF' : '#000000'
}
