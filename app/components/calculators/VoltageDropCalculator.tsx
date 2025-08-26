'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Zap, Cpu, AlertTriangle } from 'lucide-react'

interface VoltageDropResult {
  voltageDrop: number
  voltageDropPercent: number
  remainingVoltage: number
  wireSize: string
  maxDistance: number
  safetyLevel: string
  recommendations: string[]
}

interface WireType {
  name: string
  resistance: number
  maxCurrent: number
  description: string
  commonUse: string
}

interface CircuitType {
  name: string
  maxVoltageDrop: number
  description: string
  application: string
}

const WIRE_TYPES: WireType[] = [
  { name: '14 AWG', resistance: 2.525, maxCurrent: 15, description: 'Light duty', commonUse: 'Lighting circuits' },
  { name: '12 AWG', resistance: 1.588, maxCurrent: 20, description: 'Standard duty', commonUse: 'General purpose' },
  { name: '10 AWG', resistance: 0.9989, maxCurrent: 30, description: 'Medium duty', commonUse: 'Appliances' },
  { name: '8 AWG', resistance: 0.6282, maxCurrent: 40, description: 'Heavy duty', commonUse: 'Large appliances' },
  { name: '6 AWG', resistance: 0.3951, maxCurrent: 55, description: 'Extra heavy', commonUse: 'Subpanels' },
  { name: '4 AWG', resistance: 0.2485, maxCurrent: 70, description: 'Very heavy', commonUse: 'Main feeders' }
]

const CIRCUIT_TYPES: CircuitType[] = [
  { name: 'Lighting', maxVoltageDrop: 3, description: 'General lighting circuits', application: 'Residential lighting' },
  { name: 'Appliances', maxVoltageDrop: 5, description: 'Appliance circuits', application: 'Kitchen, laundry' },
  { name: 'Motors', maxVoltageDrop: 5, description: 'Motor circuits', application: 'HVAC, pumps' },
  { name: 'Critical', maxVoltageDrop: 2, description: 'Critical equipment', application: 'Medical, security' },
  { name: 'Industrial', maxVoltageDrop: 3, description: 'Industrial equipment', application: 'Manufacturing' }
]

const SAFETY_LEVELS = [
  { name: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100', maxDrop: 2, description: 'Very safe operation' },
  { name: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100', maxDrop: 3, description: 'Safe operation' },
  { name: 'Acceptable', color: 'text-yellow-600', bgColor: 'bg-yellow-100', maxDrop: 5, description: 'Within limits' },
  { name: 'Caution', color: 'text-orange-600', bgColor: 'bg-orange-100', maxDrop: 8, description: 'Approaching limits' },
  { name: 'Warning', color: 'text-red-600', bgColor: 'bg-red-100', maxDrop: 10, description: 'Exceeds recommendations' }
]

export default function VoltageDropCalculator() {
  const [voltage, setVoltage] = useState('')
  const [current, setCurrent] = useState('')
  const [distance, setDistance] = useState('')
  const [wireType, setWireType] = useState('12 AWG')
  const [circuitType, setCircuitType] = useState('Lighting')
  const [showResults, setShowResults] = useState(false)

  const calculateVoltageDrop = useCallback((): VoltageDropResult => {
    const v = parseFloat(voltage) || 0
    const i = parseFloat(current) || 0
    const d = parseFloat(distance) || 0
    
    if (v === 0 || i === 0 || d === 0) return {
      voltageDrop: 0,
      voltageDropPercent: 0,
      remainingVoltage: 0,
      wireSize: '',
      maxDistance: 0,
      safetyLevel: '',
      recommendations: []
    }

    const selectedWire = WIRE_TYPES.find(w => w.name === wireType)
    if (!selectedWire) return {
      voltageDrop: 0,
      voltageDropPercent: 0,
      remainingVoltage: 0,
      wireSize: '',
      maxDistance: 0,
      safetyLevel: '',
      recommendations: []
    }

    // Calculate voltage drop (V = I × R × L × 2 for round trip)
    const voltageDrop = i * (selectedWire.resistance / 1000) * d * 2
    const voltageDropPercent = (voltageDrop / v) * 100
    const remainingVoltage = v - voltageDrop
    
    // Calculate maximum safe distance
    const maxVoltageDrop = CIRCUIT_TYPES.find(c => c.name === circuitType)?.maxVoltageDrop || 3
    const maxDistance = (maxVoltageDrop / 100 * v) / (i * (selectedWire.resistance / 1000) * 2)
    
    // Determine safety level
    let safetyLevel = ''
    if (voltageDropPercent <= 2) safetyLevel = 'Excellent'
    else if (voltageDropPercent <= 3) safetyLevel = 'Good'
    else if (voltageDropPercent <= 5) safetyLevel = 'Acceptable'
    else if (voltageDropPercent <= 8) safetyLevel = 'Caution'
    else safetyLevel = 'Warning'
    
    // Generate recommendations
    const recommendations: string[] = []
    if (voltageDropPercent > maxVoltageDrop) {
      recommendations.push(`Voltage drop exceeds ${maxVoltageDrop}% limit for ${circuitType} circuits`)
      recommendations.push('Consider using larger wire size')
      recommendations.push('Reduce circuit length if possible')
    }
    if (i > selectedWire.maxCurrent) {
      recommendations.push(`Current exceeds ${selectedWire.maxCurrent}A rating for ${wireType}`)
      recommendations.push('Use larger wire size for safety')
    }
    if (voltageDropPercent > 5) {
      recommendations.push('Voltage drop may affect equipment performance')
      recommendations.push('Consider voltage drop in circuit design')
    }
    if (voltageDropPercent <= 2) {
      recommendations.push('Excellent voltage drop - circuit is well designed')
    }
    
    return {
      voltageDrop,
      voltageDropPercent,
      remainingVoltage,
      wireSize: wireType,
      maxDistance,
      safetyLevel,
      recommendations
    }
  }, [voltage, current, distance, wireType, circuitType])

  const handleCalculate = () => {
    if (voltage && current && distance) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setVoltage('')
    setCurrent('')
    setDistance('')
    setWireType('12 AWG')
    setCircuitType('Lighting')
    setShowResults(false)
  }

  const handleQuickWire = (wire: WireType) => {
    setWireType(wire.name)
  }

  const handleQuickCircuit = (circuit: CircuitType) => {
    setCircuitType(circuit.name)
  }

  const formatNumber = (num: number, decimals: number = 3) => {
    if (isNaN(num) || !isFinite(num)) return '0.000'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculateVoltageDrop()
    
    const data = `Voltage Drop Calculator Results

Circuit Parameters:
- Source Voltage: ${voltage} V
- Current: ${current} A
- Distance: ${distance} ft
- Wire Type: ${result.wireSize}
- Circuit Type: ${circuitType}

Voltage Drop Analysis:
- Voltage Drop: ${formatNumber(result.voltageDrop)} V
- Voltage Drop Percentage: ${formatNumber(result.voltageDropPercent)}%
- Remaining Voltage: ${formatNumber(result.remainingVoltage)} V
- Maximum Safe Distance: ${formatNumber(result.maxDistance)} ft

Safety Assessment:
- Safety Level: ${result.safetyLevel}
- Wire Size: ${result.wireSize}

Recommendations:
${result.recommendations.map(rec => `- ${rec}`).join('\n')}

Circuit Information:
- Circuit Type: ${circuitType}
- Max Allowed Drop: ${CIRCUIT_TYPES.find(c => c.name === circuitType)?.maxVoltageDrop}%
- Wire Resistance: ${WIRE_TYPES.find(w => w.name === result.wireSize)?.resistance} Ω/1000ft`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'voltage-drop-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateVoltageDrop()
      
      navigator.share({
        title: 'Voltage Drop Calculator Results',
        text: `Voltage Drop: ${formatNumber(result.voltageDrop)}V (${formatNumber(result.voltageDropPercent)}%)`,
        url: window.location.href
      })
    } else {
      const result = calculateVoltageDrop()
      const text = `Voltage Drop: ${formatNumber(result.voltageDrop)}V, ${result.safetyLevel} safety level`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateVoltageDrop() : { voltageDrop: 0, voltageDropPercent: 0, remainingVoltage: 0, wireSize: '', maxDistance: 0, safetyLevel: '', recommendations: [] }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Voltage Drop Calculator</h1>
            <p className="text-blue-100 text-lg">
              Calculate voltage drop in electrical circuits. Determine wire sizing, 
              safety levels, and optimize electrical system performance.
            </p>
          </div>
          <div className="hidden md:block">
            <Zap className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Wire Types */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Wire Selection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WIRE_TYPES.map((wire, index) => (
              <button
                key={index}
                onClick={() => handleQuickWire(wire)}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  wireType === wire.name
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-gray-700'
                }`}
              >
                <div className="font-semibold">{wire.name}</div>
                <div className="text-sm opacity-80">{wire.resistance} Ω/1000ft</div>
                <div className="text-xs opacity-60">{wire.description}</div>
                <div className="text-xs opacity-60 mt-1">Max: {wire.maxCurrent}A</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Circuit Types */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Circuit Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CIRCUIT_TYPES.map((circuit, index) => (
              <button
                key={index}
                onClick={() => handleQuickCircuit(circuit)}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  circuitType === circuit.name
                    ? 'bg-cyan-500 text-white border-cyan-500'
                    : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-gray-700'
                }`}
              >
                <div className="font-semibold">{circuit.name}</div>
                <div className="text-sm opacity-80">Max {circuit.maxVoltageDrop}% drop</div>
                <div className="text-xs opacity-60">{circuit.description}</div>
                <div className="text-xs opacity-60 mt-1">{circuit.application}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Circuit Parameters */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Circuit Parameters</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Voltage (V)
              </label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="120"
                min="12"
                max="480"
                step="1"
                aria-label="Source voltage in volts"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current (A)
              </label>
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15"
                min="0.1"
                max="100"
                step="0.1"
                aria-label="Circuit current in amperes"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (ft)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
                min="1"
                max="1000"
                step="1"
                aria-label="Circuit length in feet"
              />
            </div>
          </div>

          {/* Circuit Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Circuit Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wire Type
              </label>
              <select
                value={wireType}
                onChange={(e) => setWireType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select wire type"
              >
                {WIRE_TYPES.map(wire => (
                  <option key={wire.name} value={wire.name}>
                    {wire.name} - {wire.resistance} Ω/1000ft
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Circuit Type
              </label>
              <select
                value={circuitType}
                onChange={(e) => setCircuitType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select circuit type"
              >
                {CIRCUIT_TYPES.map(circuit => (
                  <option key={circuit.name} value={circuit.name}>
                    {circuit.name} - Max {circuit.maxVoltageDrop}% drop
                  </option>
                ))}
              </select>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Current Selection</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Wire: {wireType}</div>
                <div>Circuit: {circuitType}</div>
                <div>Max Drop: {CIRCUIT_TYPES.find(c => c.name === circuitType)?.maxVoltageDrop}%</div>
                <div>Wire Rating: {WIRE_TYPES.find(w => w.name === wireType)?.maxCurrent}A</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        {voltage && current && distance && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Voltage Drop</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Voltage Drop Results */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Voltage Drop Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.voltageDrop)}</div>
                  <div className="text-sm text-gray-600">Voltage Drop</div>
                  <div className="text-xs text-blue-600">Volts lost</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatNumber(result.voltageDropPercent)}%</div>
                  <div className="text-sm text-gray-600">Drop Percentage</div>
                  <div className="text-xs text-green-600">% of source voltage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatNumber(result.remainingVoltage)}</div>
                  <div className="text-sm text-gray-600">Remaining Voltage</div>
                  <div className="text-xs text-purple-600">Volts at load</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{formatNumber(result.maxDistance)}</div>
                  <div className="text-sm text-gray-600">Max Safe Distance</div>
                  <div className="text-xs text-orange-600">Feet for safe operation</div>
                </div>
              </div>
            </div>

            {/* Safety Assessment */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Safety Assessment</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Safety Level</h4>
                  <div className={`text-lg font-semibold p-3 rounded-lg ${SAFETY_LEVELS.find(s => s.name === result.safetyLevel)?.bgColor}`}>
                    <span className={SAFETY_LEVELS.find(s => s.name === result.safetyLevel)?.color}>
                      {result.safetyLevel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {SAFETY_LEVELS.find(s => s.name === result.safetyLevel)?.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Circuit Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wire Size:</span>
                      <span className="font-semibold text-blue-700">{result.wireSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Circuit Type:</span>
                      <span className="font-semibold text-green-700">{circuitType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Allowed Drop:</span>
                      <span className="font-semibold text-purple-700">
                        {CIRCUIT_TYPES.find(c => c.name === circuitType)?.maxVoltageDrop}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Voltage Drop Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This voltage drop calculator helps electrical engineers, electricians, and DIY enthusiasts 
                determine voltage drop in electrical circuits. It considers wire resistance, current, 
                distance, and circuit type to provide accurate calculations and safety recommendations. 
                Essential for proper electrical system design and troubleshooting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
