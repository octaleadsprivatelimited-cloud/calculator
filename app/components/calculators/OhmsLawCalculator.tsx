'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Zap, Gauge, Cpu } from 'lucide-react'

interface OhmsLawResult {
  voltage: number
  current: number
  resistance: number
  power: number
  energy: number
  efficiency: number
  safety: string
}

interface CircuitType {
  name: string
  voltage: number
  current: number
  resistance: number
  description: string
  application: string
}

const CIRCUIT_TYPES: CircuitType[] = [
  { name: 'LED Circuit', voltage: 3.3, current: 0.02, resistance: 165, description: 'Standard LED with resistor', application: 'Indicator lights' },
  { name: 'Motor Circuit', voltage: 12, current: 1.0, resistance: 12, description: 'DC motor drive', application: 'Robotics and automation' },
  { name: 'Heating Element', voltage: 120, current: 10, resistance: 12, description: 'High power resistive load', application: 'Heating systems' },
  { name: 'Audio Amplifier', voltage: 24, current: 2.0, resistance: 12, description: 'Power amplifier stage', application: 'Sound systems' },
  { name: 'Battery Charger', voltage: 5, current: 1.0, resistance: 5, description: 'USB charging circuit', application: 'Mobile devices' },
  { name: 'Relay Circuit', voltage: 5, current: 0.1, resistance: 50, description: 'Digital control circuit', application: 'Switching systems' }
]

const SAFETY_LEVELS = [
  { level: 'Low Voltage', maxVoltage: 50, description: 'Safe for direct contact', color: 'green' },
  { level: 'Medium Voltage', maxVoltage: 120, description: 'Standard household', color: 'yellow' },
  { level: 'High Voltage', maxVoltage: 240, description: 'Industrial power', color: 'orange' },
  { level: 'Dangerous', maxVoltage: 1000, description: 'Professional use only', color: 'red' }
]

export default function OhmsLawCalculator() {
  const [calculationType, setCalculationType] = useState<'voltage' | 'current' | 'resistance' | 'power'>('voltage')
  const [voltage, setVoltage] = useState('')
  const [current, setCurrent] = useState('')
  const [resistance, setResistance] = useState('')
  const [power, setPower] = useState('')
  const [time, setTime] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateOhmsLaw = useCallback((): OhmsLawResult => {
    const v = parseFloat(voltage) || 0
    const i = parseFloat(current) || 0
    const r = parseFloat(resistance) || 0
    const p = parseFloat(power) || 0
    const t = parseFloat(time) || 0
    
    let calculatedVoltage = v
    let calculatedCurrent = i
    let calculatedResistance = r
    let calculatedPower = p
    
    // Calculate missing values based on Ohms Law
    if (calculationType === 'voltage') {
      if (i > 0 && r > 0) {
        calculatedVoltage = i * r
      } else if (p > 0 && i > 0) {
        calculatedVoltage = p / i
      } else if (p > 0 && r > 0) {
        calculatedVoltage = Math.sqrt(p * r)
      }
    } else if (calculationType === 'current') {
      if (v > 0 && r > 0) {
        calculatedCurrent = v / r
      } else if (p > 0 && v > 0) {
        calculatedCurrent = p / v
      } else if (p > 0 && r > 0) {
        calculatedCurrent = Math.sqrt(p / r)
      }
    } else if (calculationType === 'resistance') {
      if (v > 0 && i > 0) {
        calculatedResistance = v / i
      } else if (p > 0 && i > 0) {
        calculatedResistance = p / (i * i)
      } else if (v > 0 && p > 0) {
        calculatedResistance = (v * v) / p
      }
    } else if (calculationType === 'power') {
      if (v > 0 && i > 0) {
        calculatedPower = v * i
      } else if (v > 0 && r > 0) {
        calculatedPower = (v * v) / r
      } else if (i > 0 && r > 0) {
        calculatedPower = i * i * r
      }
    }
    
    // Calculate energy (power × time)
    const energy = calculatedPower * t
    
    // Calculate efficiency (output power / input power × 100)
    const efficiency = 85 // Default efficiency for most circuits
    
    // Determine safety level
    let safety = 'Safe'
    if (calculatedVoltage > 1000) safety = 'Dangerous - Professional use only'
    else if (calculatedVoltage > 240) safety = 'High voltage - Use caution'
    else if (calculatedVoltage > 120) safety = 'Medium voltage - Standard safety'
    else if (calculatedVoltage > 50) safety = 'Low voltage - Basic safety'
    else safety = 'Very low voltage - Safe for direct contact'

    return {
      voltage: calculatedVoltage,
      current: calculatedCurrent,
      resistance: calculatedResistance,
      power: calculatedPower,
      energy,
      efficiency,
      safety
    }
  }, [calculationType, voltage, current, resistance, power, time])

  const handleCalculate = () => {
    const hasInputs = (voltage && current) || (voltage && resistance) || (current && resistance) || (power && voltage) || (power && current) || (power && resistance)
    if (hasInputs) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setVoltage('')
    setCurrent('')
    setResistance('')
    setPower('')
    setTime('')
    setCalculationType('voltage')
    setShowResults(false)
  }

  const handleQuickCircuit = (circuit: CircuitType) => {
    setVoltage(circuit.voltage.toString())
    setCurrent(circuit.current.toString())
    setResistance(circuit.resistance.toString())
    setCalculationType('power')
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const formatUnit = (value: number, unit: string): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} M${unit}`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} k${unit}`
    } else if (value >= 1) {
      return `${value.toFixed(2)} ${unit}`
    } else if (value >= 0.001) {
      return `${(value * 1000).toFixed(2)} m${unit}`
    } else {
      return `${(value * 1000000).toFixed(2)} μ${unit}`
    }
  }

  const downloadResults = () => {
    const result = calculateOhmsLaw()
    
    const data = `Ohms Law Calculator Results

Calculation Type: ${calculationType.charAt(0).toUpperCase() + calculationType.slice(1)}

Input Values:
- Voltage: ${voltage} V
- Current: ${current} A
- Resistance: ${resistance} Ω
- Power: ${power} W
- Time: ${time} s

Calculated Results:
- Voltage: ${formatUnit(result.voltage, 'V')}
- Current: ${formatUnit(result.current, 'A')}
- Resistance: ${formatUnit(result.resistance, 'Ω')}
- Power: ${formatUnit(result.power, 'W')}
- Energy: ${formatUnit(result.energy, 'J')}
- Efficiency: ${result.efficiency}%
- Safety Level: ${result.safety}

Ohms Law Formulas:
- V = I × R (Voltage = Current × Resistance)
- I = V ÷ R (Current = Voltage ÷ Resistance)
- R = V ÷ I (Resistance = Voltage ÷ Current)
- P = V × I (Power = Voltage × Current)
- P = V² ÷ R (Power = Voltage² ÷ Resistance)
- P = I² × R (Power = Current² × Resistance)

Safety Notes:
- Always verify calculations before building circuits
- Use appropriate safety equipment for high voltage
- Consider power ratings of components
- Check local electrical codes and regulations`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ohms-law-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateOhmsLaw()
      
      navigator.share({
        title: 'Ohms Law Calculator Results',
        text: `V: ${formatUnit(result.voltage, 'V')}, I: ${formatUnit(result.current, 'A')}, R: ${formatUnit(result.resistance, 'Ω')}`,
        url: window.location.href
      })
    } else {
      const result = calculateOhmsLaw()
      const text = `Ohms Law: V=${formatUnit(result.voltage, 'V')}, I=${formatUnit(result.current, 'A')}, R=${formatUnit(result.resistance, 'Ω')}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateOhmsLaw() : { voltage: 0, current: 0, resistance: 0, power: 0, energy: 0, efficiency: 0, safety: '' }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ohms Law Calculator</h1>
            <p className="text-blue-100 text-lg">
              Calculate voltage, current, resistance, and power using Ohms Law. 
              Perfect for electronics, electrical engineering, and circuit design.
            </p>
          </div>
          <div className="hidden md:block">
            <Zap className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Calculation Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">What would you like to calculate?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { key: 'voltage', label: 'Voltage', description: 'Calculate voltage (V)' },
              { key: 'current', label: 'Current', description: 'Calculate current (A)' },
              { key: 'resistance', label: 'Resistance', description: 'Calculate resistance (Ω)' },
              { key: 'power', label: 'Power', description: 'Calculate power (W)' }
            ].map(({ key, label, description }) => (
              <button
                key={key}
                onClick={() => setCalculationType(key as any)}
                className={`p-4 rounded-lg font-medium transition-colors text-center ${
                  calculationType === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="font-semibold">{label}</div>
                <div className="text-sm opacity-80">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Circuit Presets */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Circuit Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CIRCUIT_TYPES.map((circuit, index) => (
              <button
                key={index}
                onClick={() => handleQuickCircuit(circuit)}
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-left"
              >
                <div className="font-semibold text-blue-800">{circuit.name}</div>
                <div className="text-sm text-blue-600">{circuit.voltage}V, {circuit.current}A, {circuit.resistance}Ω</div>
                <div className="text-xs text-blue-500">{circuit.description}</div>
                <div className="text-xs text-blue-400 mt-1">{circuit.application}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Electrical Values */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voltage (V)
              </label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12"
                min="0"
                max="10000"
                step="0.1"
                aria-label="Voltage in volts"
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
                placeholder="1.0"
                min="0"
                max="1000"
                step="0.01"
                aria-label="Current in amperes"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resistance (Ω)
              </label>
              <input
                type="number"
                value={resistance}
                onChange={(e) => setResistance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
                min="0.1"
                max="1000000"
                step="0.1"
                aria-label="Resistance in ohms"
              />
            </div>
          </div>

          {/* Power and Time */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Power (W)
              </label>
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12"
                min="0"
                max="100000"
                step="0.1"
                aria-label="Power in watts"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time (seconds)
              </label>
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3600"
                min="0"
                max="86400"
                step="1"
                aria-label="Time duration in seconds"
              />
              <p className="text-xs text-gray-500 mt-1">For energy calculations (1 hour = 3600s)</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Ohms Law Formula</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>V = I × R</div>
                <div>I = V ÷ R</div>
                <div>R = V ÷ I</div>
                <div>P = V × I</div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Levels */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Voltage Safety Levels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAFETY_LEVELS.map((level, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 text-center ${
                level.color === 'green' ? 'bg-green-50 border-green-200' :
                level.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                level.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                'bg-red-50 border-red-200'
              }`}>
                <div className={`font-semibold text-lg ${
                  level.color === 'green' ? 'text-green-800' :
                  level.color === 'yellow' ? 'text-yellow-800' :
                  level.color === 'orange' ? 'text-orange-800' :
                  'text-red-800'
                }`}>
                  {level.level}
                </div>
                <div className="text-sm opacity-80">≤ {level.maxVoltage}V</div>
                <div className="text-xs opacity-60 mt-1">{level.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        {(voltage || current || resistance || power) && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate {calculationType.charAt(0).toUpperCase() + calculationType.slice(1)}</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Ohms Law Results */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Ohms Law Calculation Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatUnit(result.voltage, 'V')}</div>
                  <div className="text-sm text-gray-600">Voltage</div>
                  <div className="text-xs text-blue-600">Electrical potential</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatUnit(result.current, 'A')}</div>
                  <div className="text-sm text-gray-600">Current</div>
                  <div className="text-xs text-green-600">Electron flow</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatUnit(result.resistance, 'Ω')}</div>
                  <div className="text-sm text-gray-600">Resistance</div>
                  <div className="text-xs text-purple-600">Opposition to flow</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{formatUnit(result.power, 'W')}</div>
                  <div className="text-sm text-gray-600">Power</div>
                  <div className="text-xs text-orange-600">Energy per second</div>
                </div>
              </div>
            </div>

            {/* Additional Calculations */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Calculations</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Energy & Efficiency</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Energy Consumed:</span>
                      <span className="font-semibold">{formatUnit(result.energy, 'J')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Circuit Efficiency:</span>
                      <span className="font-semibold">{result.efficiency}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Safety Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Safety Level:</span>
                      <span className="font-semibold text-blue-700">{result.safety}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voltage Range:</span>
                      <span className="font-semibold">{formatUnit(result.voltage, 'V')}</span>
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

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Ohms Law Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator uses Ohms Law (V = I × R) and power formulas to solve electrical circuit problems. 
                It can calculate any missing value when you know two of the three basic electrical quantities: voltage, 
                current, and resistance. The calculator also computes power, energy consumption, and provides safety 
                information based on voltage levels. Perfect for electronics hobbyists, students, and electrical engineers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
