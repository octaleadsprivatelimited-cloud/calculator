'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Zap, Gauge, Car } from 'lucide-react'

interface HorsepowerResult {
  horsepower: number
  kilowatts: number
  torque: number
  powerToWeight: number
  acceleration: number
  topSpeed: number
  performance: string
}

interface EngineSpecs {
  name: string
  displacement: number
  cylinders: number
  maxRpm: number
  redline: number
  description: string
}

const ENGINE_TYPES: EngineSpecs[] = [
  { name: '4-Cylinder Turbo', displacement: 2.0, cylinders: 4, maxRpm: 6500, redline: 7000, description: 'Modern turbocharged engines' },
  { name: 'V6 Naturally Aspirated', displacement: 3.5, cylinders: 6, maxRpm: 7000, redline: 7500, description: 'Smooth power delivery' },
  { name: 'V8 Performance', displacement: 5.0, cylinders: 8, maxRpm: 7500, redline: 8000, description: 'High-performance engines' },
  { name: 'V12 Exotic', displacement: 6.0, cylinders: 12, maxRpm: 8000, redline: 8500, description: 'Luxury and performance' },
  { name: 'Electric Motor', displacement: 0, cylinders: 0, maxRpm: 12000, redline: 15000, description: 'Instant torque delivery' },
  { name: 'Hybrid System', displacement: 2.5, cylinders: 4, maxRpm: 6000, redline: 6500, description: 'Combined power sources' }
]

const VEHICLE_CATEGORIES = [
  { name: 'Economy Car', weight: 2800, dragCoeff: 0.32, description: 'Fuel-efficient daily drivers' },
  { name: 'Sports Car', weight: 3200, dragCoeff: 0.28, description: 'Performance-oriented vehicles' },
  { name: 'Luxury Sedan', weight: 4000, dragCoeff: 0.30, description: 'Comfort and refinement' },
  { name: 'SUV/Truck', weight: 5000, dragCoeff: 0.40, description: 'Utility and capability' },
  { name: 'Supercar', weight: 3000, dragCoeff: 0.25, description: 'Ultra-high performance' },
  { name: 'Motorcycle', weight: 400, dragCoeff: 0.35, description: 'Lightweight performance' }
]

const PERFORMANCE_LEVELS = [
  { name: 'Economy', minHp: 0, maxHp: 150, description: 'Daily commuting' },
  { name: 'Performance', minHp: 150, maxHp: 300, description: 'Sporty driving' },
  { name: 'High Performance', minHp: 300, maxHp: 500, description: 'Track capable' },
  { name: 'Supercar', minHp: 500, maxHp: 800, description: 'Exotic performance' },
  { name: 'Hypercar', minHp: 800, maxHp: 1500, description: 'Ultimate performance' },
  { name: 'Formula 1', minHp: 1500, maxHp: 2000, description: 'Racing level' }
]

export default function HorsepowerCalculator() {
  const [calculationType, setCalculationType] = useState<'torque' | 'dyno' | 'weight'>('torque')
  const [torque, setTorque] = useState('')
  const [rpm, setRpm] = useState('')
  const [vehicleWeight, setVehicleWeight] = useState('')
  const [engineType, setEngineType] = useState('4-Cylinder Turbo')
  const [vehicleCategory, setVehicleCategory] = useState('Sports Car')
  const [showResults, setShowResults] = useState(false)

  const calculateHorsepower = useCallback((): HorsepowerResult => {
    const tq = parseFloat(torque) || 0
    const r = parseFloat(rpm) || 0
    const weight = parseFloat(vehicleWeight) || 0
    
    if (tq === 0 || r === 0) return {
      horsepower: 0,
      kilowatts: 0,
      torque: 0,
      powerToWeight: 0,
      acceleration: 0,
      topSpeed: 0,
      performance: ''
    }

    // Calculate horsepower from torque and RPM
    const hp = (tq * r) / 5252
    
    // Convert to kilowatts
    const kw = hp * 0.7457
    
    // Calculate power-to-weight ratio
    const ptw = weight > 0 ? hp / weight : 0
    
    // Estimate acceleration (0-60 mph time)
    let acceleration = 0
    if (ptw > 0) {
      if (ptw >= 0.3) acceleration = 3.0
      else if (ptw >= 0.2) acceleration = 4.5
      else if (ptw >= 0.15) acceleration = 6.0
      else if (ptw >= 0.1) acceleration = 8.0
      else if (ptw >= 0.05) acceleration = 12.0
      else acceleration = 20.0
    }
    
    // Estimate top speed based on power and weight
    let topSpeed = 0
    if (hp > 0 && weight > 0) {
      const powerFactor = hp / weight
      if (powerFactor >= 0.25) topSpeed = 200
      else if (powerFactor >= 0.2) topSpeed = 180
      else if (powerFactor >= 0.15) topSpeed = 160
      else if (powerFactor >= 0.1) topSpeed = 140
      else if (powerFactor >= 0.05) topSpeed = 120
      else topSpeed = 100
    }
    
    // Determine performance level
    let performance = ''
    if (hp >= 800) performance = 'Hypercar Level'
    else if (hp >= 500) performance = 'Supercar Level'
    else if (hp >= 300) performance = 'High Performance'
    else if (hp >= 150) performance = 'Performance'
    else if (hp >= 100) performance = 'Economy Plus'
    else performance = 'Economy'

    return {
      horsepower: hp,
      kilowatts: kw,
      torque: tq,
      powerToWeight: ptw,
      acceleration: acceleration,
      topSpeed: topSpeed,
      performance: performance
    }
  }, [torque, rpm, vehicleWeight])

  const handleCalculate = () => {
    if (torque && rpm) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setTorque('')
    setRpm('')
    setVehicleWeight('')
    setEngineType('4-Cylinder Turbo')
    setVehicleCategory('Sports Car')
    setShowResults(false)
  }

  const handleQuickEngine = (engine: EngineSpecs) => {
    setEngineType(engine.name)
    setRpm(engine.maxRpm.toString())
  }

  const handleQuickVehicle = (vehicle: { name: string, weight: number }) => {
    setVehicleCategory(vehicle.name)
    setVehicleWeight(vehicle.weight.toString())
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculateHorsepower()
    
    const data = `Horsepower Calculator Results

Calculation Type: ${calculationType === 'torque' ? 'Torque to Horsepower' : calculationType === 'dyno' ? 'Dyno Results' : 'Power to Weight'}
Engine Type: ${engineType}
Vehicle Category: ${vehicleCategory}

Input Values:
- Torque: ${torque} lb-ft
- RPM: ${rpm}
- Vehicle Weight: ${vehicleWeight} lbs

Results:
- Horsepower: ${formatNumber(result.horsepower)} HP
- Kilowatts: ${formatNumber(result.kilowatts)} kW
- Power-to-Weight: ${formatNumber(result.powerToWeight)} HP/lb
- Estimated 0-60: ${formatNumber(result.acceleration)} seconds
- Estimated Top Speed: ${formatNumber(result.topSpeed)} mph
- Performance Level: ${result.performance}

Performance Analysis:
- Power-to-weight ratio indicates vehicle performance potential
- Higher ratios typically mean better acceleration and handling
- Consider aerodynamics and gearing for real-world performance`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'horsepower-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateHorsepower()
      
      navigator.share({
        title: 'Horsepower Calculator Results',
        text: `${formatNumber(result.horsepower)} HP, ${formatNumber(result.powerToWeight)} HP/lb power-to-weight`,
        url: window.location.href
      })
    } else {
      const result = calculateHorsepower()
      const text = `Horsepower: ${formatNumber(result.horsepower)} HP`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateHorsepower() : { horsepower: 0, kilowatts: 0, torque: 0, powerToWeight: 0, acceleration: 0, topSpeed: 0, performance: '' }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Horsepower Calculator</h1>
            <p className="text-yellow-100 text-lg">
              Calculate horsepower from torque and RPM, power-to-weight ratios, and performance estimates. 
              Perfect for automotive enthusiasts, engineers, and performance tuning.
            </p>
          </div>
          <div className="hidden md:block">
            <Zap className="w-16 h-16 text-yellow-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Calculation Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">What would you like to calculate?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'torque', label: 'Torque to HP', description: 'Calculate HP from torque & RPM' },
              { key: 'dyno', label: 'Dyno Results', description: 'Analyze dyno data' },
              { key: 'weight', label: 'Power to Weight', description: 'Performance ratios' }
            ].map(({ key, label, description }) => (
              <button
                key={key}
                onClick={() => setCalculationType(key as any)}
                className={`p-4 rounded-lg font-medium transition-colors text-center ${
                  calculationType === key
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="font-semibold">{label}</div>
                <div className="text-sm opacity-80">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Engine and Vehicle Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Engine Type */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Engine Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Engine Type
                </label>
                <select
                  value={engineType}
                  onChange={(e) => setEngineType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  aria-label="Select engine type"
                >
                  {ENGINE_TYPES.map(engine => (
                    <option key={engine.name} value={engine.name}>
                      {engine.name} - {engine.displacement}L, {engine.cylinders} cyl
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RPM
                </label>
                <input
                  type="number"
                  value={rpm}
                  onChange={(e) => setRpm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="6500"
                  min="1000"
                  max="15000"
                  step="100"
                  aria-label="Engine RPM"
                />
                <p className="text-xs text-gray-500 mt-1">Engine speed in revolutions per minute</p>
              </div>
            </div>
          </div>

          {/* Vehicle Category */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Category
                </label>
                <select
                  value={vehicleCategory}
                  onChange={(e) => setVehicleCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  aria-label="Select vehicle category"
                >
                  {VEHICLE_CATEGORIES.map(vehicle => (
                    <option key={vehicle.name} value={vehicle.name}>
                      {vehicle.name} - {vehicle.weight} lbs
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Weight (lbs)
                </label>
                <input
                  type="number"
                  value={vehicleWeight}
                  onChange={(e) => setVehicleWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="3200"
                  min="500"
                  max="10000"
                  step="100"
                  aria-label="Vehicle weight in pounds"
                />
                <p className="text-xs text-gray-500 mt-1">Curb weight in pounds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Torque Input */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Torque Input</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Torque (lb-ft)
              </label>
              <input
                type="number"
                value={torque}
                onChange={(e) => setTorque(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                placeholder="300"
                min="0"
                max="2000"
                step="1"
                aria-label="Engine torque in pound-feet"
              />
              <p className="text-xs text-gray-500 mt-1">Engine torque at the specified RPM</p>
            </div>
          </div>
        </div>

        {/* Quick Engine Presets */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Engine Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {ENGINE_TYPES.map((engine, index) => (
              <button
                key={index}
                onClick={() => handleQuickEngine(engine)}
                className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors text-sm text-center"
              >
                <div className="font-medium text-yellow-800">{engine.name}</div>
                <div className="text-yellow-600">{engine.maxRpm} RPM</div>
                <div className="text-xs text-yellow-500">{engine.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Vehicle Presets */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Vehicle Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {VEHICLE_CATEGORIES.map((vehicle, index) => (
              <button
                key={index}
                onClick={() => handleQuickVehicle(vehicle)}
                className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors text-sm text-center"
              >
                <div className="font-medium text-yellow-800">{vehicle.name}</div>
                <div className="text-yellow-600">{vehicle.weight} lbs</div>
                <div className="text-xs text-yellow-500">{vehicle.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        {torque && rpm && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Horsepower</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Horsepower Results */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">Horsepower Calculation Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-yellow-700">{formatNumber(result.horsepower)}</div>
                  <div className="text-sm text-gray-600">Horsepower</div>
                  <div className="text-xs text-yellow-600">{result.performance}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-700">{formatNumber(result.kilowatts)}</div>
                  <div className="text-sm text-gray-600">Kilowatts</div>
                  <div className="text-xs text-yellow-600">Metric power</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-700">{formatNumber(result.powerToWeight)}</div>
                  <div className="text-sm text-gray-600">HP per lb</div>
                  <div className="text-xs text-yellow-600">Power-to-weight</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatNumber(result.acceleration)}</div>
                  <div className="text-sm text-gray-600">0-60 mph</div>
                  <div className="text-xs text-green-600">Estimated time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.topSpeed)}</div>
                  <div className="text-sm text-gray-600">Top Speed</div>
                  <div className="text-xs text-blue-600">Estimated mph</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatNumber(result.torque)}</div>
                  <div className="text-sm text-gray-600">Torque</div>
                  <div className="text-xs text-purple-600">lb-ft input</div>
                </div>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Power-to-Weight Ratio</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Ratio:</span>
                      <span className="font-semibold">{formatNumber(result.powerToWeight)} HP/lb</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Performance Level:</span>
                      <span className="font-semibold text-yellow-700">{result.performance}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Performance Indicators</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">0-60 mph:</span>
                      <span className="font-semibold">{formatNumber(result.acceleration)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Speed:</span>
                      <span className="font-semibold">{formatNumber(result.topSpeed)} mph</span>
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
            <Info className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Horsepower Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator computes horsepower from torque and RPM using the formula: HP = (Torque × RPM) ÷ 5252. 
                It also calculates power-to-weight ratios, estimates acceleration times, and provides performance analysis. 
                The calculator considers different engine types, vehicle categories, and driving conditions to give realistic 
                performance estimates. Perfect for automotive enthusiasts, engineers, and anyone interested in vehicle performance 
                and tuning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
