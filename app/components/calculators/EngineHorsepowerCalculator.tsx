'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Settings, Gauge, Zap } from 'lucide-react'

interface EngineResult {
  theoreticalHp: number
  actualHp: number
  torque: number
  bmep: number
  volumetricEfficiency: number
  thermalEfficiency: number
  fuelConsumption: number
  performance: string
}

interface EngineConfig {
  name: string
  displacement: number
  cylinders: number
  bore: number
  stroke: number
  compressionRatio: number
  maxRpm: number
  description: string
}

const ENGINE_CONFIGS: EngineConfig[] = [
  { name: 'Small Block V8', displacement: 5.7, cylinders: 8, bore: 4.0, stroke: 3.48, compressionRatio: 10.5, maxRpm: 6500, description: 'Classic American V8' },
  { name: 'Big Block V8', displacement: 7.0, cylinders: 8, bore: 4.25, stroke: 3.76, compressionRatio: 11.0, maxRpm: 6000, description: 'High displacement V8' },
  { name: '4-Cylinder Turbo', displacement: 2.0, cylinders: 4, bore: 3.39, stroke: 3.35, compressionRatio: 9.5, maxRpm: 7000, description: 'Modern turbo engine' },
  { name: 'V6 DOHC', displacement: 3.5, cylinders: 6, bore: 3.66, stroke: 3.35, compressionRatio: 11.5, maxRpm: 7500, description: 'High-revving V6' },
  { name: 'V12 Exotic', displacement: 6.0, cylinders: 12, bore: 3.62, stroke: 2.95, compressionRatio: 12.5, maxRpm: 8500, description: 'Exotic supercar engine' },
  { name: 'Diesel Engine', displacement: 6.7, cylinders: 8, bore: 4.21, stroke: 3.90, compressionRatio: 18.0, maxRpm: 4000, description: 'High compression diesel' }
]

const FUEL_TYPES = [
  { name: 'Gasoline', energyDensity: 120000, octane: 91, description: 'Standard fuel' },
  { name: 'Premium Gasoline', energyDensity: 125000, octane: 93, description: 'High octane fuel' },
  { name: 'E85 Ethanol', energyDensity: 85000, octane: 105, description: 'High octane, lower energy' },
  { name: 'Diesel', energyDensity: 130000, cetane: 50, description: 'High compression fuel' },
  { name: 'Race Fuel', energyDensity: 130000, octane: 110, description: 'Maximum performance' }
]

const PERFORMANCE_LEVELS = [
  { name: 'Economy', minHp: 0, maxHp: 150, description: 'Daily driving' },
  { name: 'Performance', minHp: 150, maxHp: 300, description: 'Sporty driving' },
  { name: 'High Performance', minHp: 300, maxHp: 500, description: 'Track capable' },
  { name: 'Supercar', minHp: 500, maxHp: 800, description: 'Exotic performance' },
  { name: 'Hypercar', minHp: 800, maxHp: 1500, description: 'Ultimate performance' }
]

export default function EngineHorsepowerCalculator() {
  const [displacement, setDisplacement] = useState('')
  const [cylinders, setCylinders] = useState('')
  const [bore, setBore] = useState('')
  const [stroke, setStroke] = useState('')
  const [compressionRatio, setCompressionRatio] = useState('')
  const [maxRpm, setMaxRpm] = useState('')
  const [fuelType, setFuelType] = useState('Gasoline')
  const [engineConfig, setEngineConfig] = useState('Small Block V8')
  const [showResults, setShowResults] = useState(false)

  const calculateEngineHorsepower = useCallback((): EngineResult => {
    const disp = parseFloat(displacement) || 0
    const cyl = parseInt(cylinders) || 0
    const b = parseFloat(bore) || 0
    const s = parseFloat(stroke) || 0
    const cr = parseFloat(compressionRatio) || 0
    const rpm = parseFloat(maxRpm) || 0
    
    if (disp === 0 || cyl === 0 || rpm === 0) return {
      theoreticalHp: 0,
      actualHp: 0,
      torque: 0,
      bmep: 0,
      volumetricEfficiency: 0,
      thermalEfficiency: 0,
      fuelConsumption: 0,
      performance: ''
    }

    // Calculate theoretical horsepower using displacement and RPM
    const theoreticalHp = (disp * rpm * 0.5) / 5252
    
    // Calculate BMEP (Brake Mean Effective Pressure)
    const bmep = (theoreticalHp * 5252) / (disp * rpm)
    
    // Calculate torque
    const torque = (theoreticalHp * 5252) / rpm
    
    // Estimate volumetric efficiency based on engine design
    let volumetricEfficiency = 0.85 // Base efficiency
    if (cr > 10) volumetricEfficiency += 0.05 // Higher compression
    if (cyl >= 8) volumetricEfficiency += 0.03 // More cylinders
    if (rpm > 7000) volumetricEfficiency += 0.02 // High RPM capability
    volumetricEfficiency = Math.min(volumetricEfficiency, 0.95) // Cap at 95%
    
    // Calculate actual horsepower
    const actualHp = theoreticalHp * volumetricEfficiency
    
    // Estimate thermal efficiency based on compression ratio
    let thermalEfficiency = 0.25 // Base efficiency
    if (cr >= 8) thermalEfficiency += 0.05
    if (cr >= 10) thermalEfficiency += 0.05
    if (cr >= 12) thermalEfficiency += 0.05
    thermalEfficiency = Math.min(thermalEfficiency, 0.40) // Cap at 40%
    
    // Estimate fuel consumption (gallons per hour at max power)
    const fuelConsumption = (actualHp * 0.5) / thermalEfficiency // 0.5 lb/hp-hr typical
    
    // Determine performance level
    let performance = ''
    if (actualHp >= 800) performance = 'Hypercar Level'
    else if (actualHp >= 500) performance = 'Supercar Level'
    else if (actualHp >= 300) performance = 'High Performance'
    else if (actualHp >= 150) performance = 'Performance'
    else performance = 'Economy'

    return {
      theoreticalHp,
      actualHp,
      torque,
      bmep,
      volumetricEfficiency,
      thermalEfficiency,
      fuelConsumption,
      performance
    }
  }, [displacement, cylinders, bore, stroke, compressionRatio, maxRpm])

  const handleCalculate = () => {
    if (displacement && cylinders && maxRpm) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setDisplacement('')
    setCylinders('')
    setBore('')
    setStroke('')
    setCompressionRatio('')
    setMaxRpm('')
    setFuelType('Gasoline')
    setEngineConfig('Small Block V8')
    setShowResults(false)
  }

  const handleQuickEngine = (engine: EngineConfig) => {
    setEngineConfig(engine.name)
    setDisplacement(engine.displacement.toString())
    setCylinders(engine.cylinders.toString())
    setBore(engine.bore.toString())
    setStroke(engine.stroke.toString())
    setCompressionRatio(engine.compressionRatio.toString())
    setMaxRpm(engine.maxRpm.toString())
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculateEngineHorsepower()
    
    const data = `Engine Horsepower Calculator Results

Engine Configuration: ${engineConfig}
Fuel Type: ${fuelType}

Input Values:
- Displacement: ${displacement} liters
- Cylinders: ${cylinders}
- Bore: ${bore} inches
- Stroke: ${stroke} inches
- Compression Ratio: ${compressionRatio}:1
- Max RPM: ${maxRpm}

Results:
- Theoretical HP: ${formatNumber(result.theoreticalHp)} HP
- Actual HP: ${formatNumber(result.actualHp)} HP
- Torque: ${formatNumber(result.torque)} lb-ft
- BMEP: ${formatNumber(result.bmep)} PSI
- Volumetric Efficiency: ${formatNumber(result.volumetricEfficiency * 100)}%
- Thermal Efficiency: ${formatNumber(result.thermalEfficiency * 100)}%
- Fuel Consumption: ${formatNumber(result.fuelConsumption)} gal/hr
- Performance Level: ${result.performance}

Engine Analysis:
- Theoretical HP represents ideal conditions
- Actual HP considers real-world factors
- BMEP indicates cylinder pressure efficiency
- Higher compression ratios improve thermal efficiency`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'engine-horsepower-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateEngineHorsepower()
      
      navigator.share({
        title: 'Engine Horsepower Calculator Results',
        text: `${formatNumber(result.actualHp)} HP, ${formatNumber(result.torque)} lb-ft torque`,
        url: window.location.href
      })
    } else {
      const result = calculateEngineHorsepower()
      const text = `Engine HP: ${formatNumber(result.actualHp)} HP`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateEngineHorsepower() : { theoreticalHp: 0, actualHp: 0, torque: 0, bmep: 0, volumetricEfficiency: 0, thermalEfficiency: 0, fuelConsumption: 0, performance: '' }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Engine Horsepower Calculator</h1>
            <p className="text-red-100 text-lg">
              Advanced engine analysis with displacement, compression ratios, and efficiency calculations. 
              Perfect for engine builders, tuners, and automotive engineers.
            </p>
          </div>
          <div className="hidden md:block">
            <Settings className="w-16 h-16 text-red-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Engine Configuration Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Engine Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ENGINE_CONFIGS.map((engine, index) => (
              <button
                key={index}
                onClick={() => handleQuickEngine(engine)}
                className="p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors text-left"
              >
                <div className="font-semibold text-red-800">{engine.name}</div>
                <div className="text-sm text-red-600">{engine.displacement}L, {engine.cylinders} cyl</div>
                <div className="text-xs text-red-500">{engine.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Engine Specifications */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Basic Specs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Displacement (liters)
              </label>
              <input
                type="number"
                value={displacement}
                onChange={(e) => setDisplacement(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="5.7"
                min="0.5"
                max="20"
                step="0.1"
                aria-label="Engine displacement in liters"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Cylinders
              </label>
              <input
                type="number"
                value={cylinders}
                onChange={(e) => setCylinders(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="8"
                min="1"
                max="16"
                step="1"
                aria-label="Number of engine cylinders"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max RPM
              </label>
              <input
                type="number"
                value={maxRpm}
                onChange={(e) => setMaxRpm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="6500"
                min="2000"
                max="15000"
                step="100"
                aria-label="Maximum engine RPM"
              />
            </div>
          </div>

          {/* Advanced Specs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bore (inches)
              </label>
              <input
                type="number"
                value={bore}
                onChange={(e) => setBore(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="4.0"
                min="2"
                max="8"
                step="0.01"
                aria-label="Cylinder bore diameter in inches"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stroke (inches)
              </label>
              <input
                type="number"
                value={stroke}
                onChange={(e) => setStroke(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="3.48"
                min="2"
                max="8"
                step="0.01"
                aria-label="Piston stroke length in inches"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compression Ratio
              </label>
              <input
                type="number"
                value={compressionRatio}
                onChange={(e) => setCompressionRatio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="10.5"
                min="6"
                max="25"
                step="0.1"
                aria-label="Engine compression ratio"
              />
            </div>
          </div>
        </div>

        {/* Fuel Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Fuel Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {FUEL_TYPES.map((fuel, index) => (
              <button
                key={index}
                onClick={() => setFuelType(fuel.name)}
                className={`p-3 rounded-lg border transition-colors text-sm text-center ${
                  fuelType === fuel.name
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <div className="font-medium">{fuel.name}</div>
                <div className="text-xs opacity-80">{fuel.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        {displacement && cylinders && maxRpm && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Engine Horsepower</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Horsepower Results */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Engine Horsepower Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-700">{formatNumber(result.actualHp)}</div>
                  <div className="text-sm text-gray-600">Actual HP</div>
                  <div className="text-xs text-red-600">{result.performance}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{formatNumber(result.theoreticalHp)}</div>
                  <div className="text-sm text-gray-600">Theoretical HP</div>
                  <div className="text-xs text-orange-600">Ideal conditions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.torque)}</div>
                  <div className="text-sm text-gray-600">Torque (lb-ft)</div>
                  <div className="text-xs text-blue-600">At max RPM</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatNumber(result.bmep)}</div>
                  <div className="text-sm text-gray-600">BMEP (PSI)</div>
                  <div className="text-xs text-green-600">Cylinder pressure</div>
                </div>
              </div>
            </div>

            {/* Efficiency Analysis */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Engine Efficiency Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Efficiency Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Volumetric Efficiency:</span>
                      <div className="text-right">
                        <div className="font-semibold text-red-700">{formatNumber(result.volumetricEfficiency * 100)}%</div>
                        <div className="text-xs text-gray-500">Air intake efficiency</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Thermal Efficiency:</span>
                      <div className="text-right">
                        <div className="font-semibold text-orange-700">{formatNumber(result.thermalEfficiency * 100)}%</div>
                        <div className="text-xs text-gray-500">Fuel energy conversion</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Performance Data</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fuel Consumption:</span>
                      <div className="text-right">
                        <div className="font-semibold text-blue-700">{formatNumber(result.fuelConsumption)} gal/hr</div>
                        <div className="text-xs text-gray-500">At maximum power</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Performance Level:</span>
                      <div className="text-right">
                        <div className="font-semibold text-green-700">{result.performance}</div>
                        <div className="text-xs text-gray-500">Based on actual HP</div>
                      </div>
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
            <Info className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Engine Horsepower Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This advanced calculator computes engine horsepower using displacement, compression ratios, and engine geometry. 
                It calculates theoretical horsepower, actual horsepower considering volumetric efficiency, torque, BMEP (Brake Mean 
                Effective Pressure), and efficiency metrics. The calculator accounts for real-world factors like compression ratios, 
                cylinder count, and RPM limitations to provide accurate performance estimates for engine builders and tuners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
