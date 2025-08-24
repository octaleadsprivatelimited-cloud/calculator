'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Fuel, Car, DollarSign } from 'lucide-react'

interface MileageResult {
  mpg: number
  l100km: number
  costPerMile: number
  costPerKm: number
  totalCost: number
  fuelEfficiency: string
  savings: number
}

interface FuelType {
  name: string
  price: number
  efficiency: number
  color: string
}

const FUEL_TYPES: FuelType[] = [
  { name: 'Regular Gasoline', price: 3.50, efficiency: 1.0, color: 'bg-blue-500' },
  { name: 'Premium Gasoline', price: 4.00, efficiency: 0.95, color: 'bg-purple-500' },
  { name: 'Diesel', price: 3.80, efficiency: 1.2, color: 'bg-green-500' },
  { name: 'E85 Ethanol', price: 2.80, efficiency: 0.75, color: 'bg-yellow-500' },
  { name: 'Electric (kWh)', price: 0.15, efficiency: 3.0, color: 'bg-teal-500' },
  { name: 'Hybrid', price: 3.50, efficiency: 1.5, color: 'bg-emerald-500' }
]

const VEHICLE_TYPES = [
  { name: 'Compact Car', avgMpg: 30, description: 'Small, fuel-efficient vehicles' },
  { name: 'Sedan', avgMpg: 25, description: 'Standard family cars' },
  { name: 'SUV', avgMpg: 20, description: 'Sport utility vehicles' },
  { name: 'Truck', avgMpg: 18, description: 'Pickup trucks and work vehicles' },
  { name: 'Hybrid', avgMpg: 45, description: 'Gas-electric hybrid vehicles' },
  { name: 'Electric', avgMpg: 100, description: 'All-electric vehicles (MPGe)' }
]

const DRIVING_CONDITIONS = [
  { name: 'Highway', multiplier: 1.1, description: 'Steady speed, good efficiency' },
  { name: 'City', multiplier: 0.8, description: 'Stop and go, lower efficiency' },
  { name: 'Mixed', multiplier: 1.0, description: 'Combination of city and highway' },
  { name: 'Heavy Traffic', multiplier: 0.7, description: 'Congested conditions' },
  { name: 'Mountain', multiplier: 0.6, description: 'Hilly terrain, lower efficiency' }
]

export default function GasMileageCalculator() {
  const [calculationType, setCalculationType] = useState<'mpg' | 'cost' | 'trip'>('mpg')
  const [distance, setDistance] = useState('')
  const [fuelUsed, setFuelUsed] = useState('')
  const [fuelCost, setFuelCost] = useState('')
  const [fuelType, setFuelType] = useState('Regular Gasoline')
  const [vehicleType, setVehicleType] = useState('Sedan')
  const [drivingCondition, setDrivingCondition] = useState('Mixed')
  const [showResults, setShowResults] = useState(false)

  const calculateMileage = useCallback((): MileageResult => {
    const dist = parseFloat(distance) || 0
    const fuel = parseFloat(fuelUsed) || 0
    const cost = parseFloat(fuelCost) || 0
    
    if (dist === 0 || fuel === 0) return {
      mpg: 0,
      l100km: 0,
      costPerMile: 0,
      costPerKm: 0,
      totalCost: 0,
      fuelEfficiency: '',
      savings: 0
    }

    // Calculate MPG and L/100km
    const mpg = dist / fuel
    const l100km = (fuel * 3.78541) / (dist * 1.60934) * 100

    // Calculate costs
    const costPerMile = cost / dist
    const costPerKm = cost / (dist * 1.60934)
    const totalCost = cost

    // Determine fuel efficiency rating
    let fuelEfficiency = ''
    if (mpg >= 40) fuelEfficiency = 'Excellent'
    else if (mpg >= 30) fuelEfficiency = 'Very Good'
    else if (mpg >= 25) fuelEfficiency = 'Good'
    else if (mpg >= 20) fuelEfficiency = 'Fair'
    else fuelEfficiency = 'Poor'

    // Calculate potential savings vs average
    const avgMpg = VEHICLE_TYPES.find(v => v.name === vehicleType)?.avgMpg || 25
    const savings = ((avgMpg - mpg) / avgMpg) * 100

    return {
      mpg,
      l100km,
      costPerMile,
      costPerKm,
      totalCost,
      fuelEfficiency,
      savings
    }
  }, [distance, fuelUsed, fuelCost, vehicleType])

  const calculateTripCost = useCallback((tripDistance: number): number => {
    const selectedFuel = FUEL_TYPES.find(f => f.name === fuelType) || FUEL_TYPES[0]
    const vehicle = VEHICLE_TYPES.find(v => v.name === vehicleType) || VEHICLE_TYPES[1]
    const condition = DRIVING_CONDITIONS.find(d => d.name === drivingCondition) || DRIVING_CONDITIONS[2]
    
    const adjustedMpg = vehicle.avgMpg * condition.multiplier
    const gallonsNeeded = tripDistance / adjustedMpg
    const totalCost = gallonsNeeded * selectedFuel.price
    
    return totalCost
  }, [fuelType, vehicleType, drivingCondition])

  const handleCalculate = () => {
    if (distance && fuelUsed) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setDistance('')
    setFuelUsed('')
    setFuelCost('')
    setFuelType('Regular Gasoline')
    setVehicleType('Sedan')
    setDrivingCondition('Mixed')
    setShowResults(false)
  }

  const handleQuickTrip = (miles: number) => {
    setDistance(miles.toString())
    setShowResults(true)
  }

  const handleFuelTypeChange = (selectedFuel: string) => {
    setFuelType(selectedFuel)
    const fuel = FUEL_TYPES.find(f => f.name === selectedFuel)
    if (fuel) {
      setFuelCost(fuel.price.toString())
    }
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const formatCurrency = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const downloadResults = () => {
    const result = calculateMileage()
    
    const data = `Gas Mileage Calculator Results

Calculation Type: ${calculationType === 'mpg' ? 'MPG Calculation' : calculationType === 'cost' ? 'Cost Analysis' : 'Trip Planning'}
Distance: ${distance} miles
Fuel Used: ${fuelUsed} gallons
Fuel Cost: ${formatCurrency(parseFloat(fuelCost) || 0)}
Fuel Type: ${fuelType}
Vehicle Type: ${vehicleType}
Driving Condition: ${drivingCondition}

Results:
- MPG: ${formatNumber(result.mpg)}
- L/100km: ${formatNumber(result.l100km)}
- Cost per Mile: ${formatCurrency(result.costPerMile)}
- Cost per Kilometer: ${formatCurrency(result.costPerKm)}
- Total Cost: ${formatCurrency(result.totalCost)}
- Fuel Efficiency: ${result.fuelEfficiency}
- Efficiency vs Average: ${formatNumber(result.savings)}%`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gas-mileage-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateMileage()
      
      navigator.share({
        title: 'Gas Mileage Calculator Results',
        text: `MPG: ${formatNumber(result.mpg)}, Cost per mile: ${formatCurrency(result.costPerMile)}`,
        url: window.location.href
      })
    } else {
      const result = calculateMileage()
      const text = `Gas Mileage: ${formatNumber(result.mpg)} MPG`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateMileage() : { mpg: 0, l100km: 0, costPerMile: 0, costPerKm: 0, totalCost: 0, fuelEfficiency: '', savings: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gas Mileage Calculator</h1>
            <p className="text-orange-100 text-lg">
              Calculate fuel efficiency, cost per mile, and plan your trips. 
              Perfect for drivers, fleet managers, and cost-conscious travelers.
            </p>
          </div>
          <div className="hidden md:block">
            <Fuel className="w-16 h-16 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Calculation Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">What would you like to calculate?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'mpg', label: 'MPG Calculation', description: 'Calculate fuel efficiency' },
              { key: 'cost', label: 'Cost Analysis', description: 'Fuel costs and savings' },
              { key: 'trip', label: 'Trip Planning', description: 'Plan fuel costs for trips' }
            ].map(({ key, label, description }) => (
              <button
                key={key}
                onClick={() => setCalculationType(key as any)}
                className={`p-4 rounded-lg font-medium transition-colors text-center ${
                  calculationType === key
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="font-semibold">{label}</div>
                <div className="text-sm opacity-80">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle and Fuel Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Vehicle Type */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Select vehicle type"
                >
                  {VEHICLE_TYPES.map(vehicle => (
                    <option key={vehicle.name} value={vehicle.name}>
                      {vehicle.name} (Avg: {vehicle.avgMpg} MPG)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driving Condition
                </label>
                <select
                  value={drivingCondition}
                  onChange={(e) => setDrivingCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Select driving condition"
                >
                  {DRIVING_CONDITIONS.map(condition => (
                    <option key={condition.name} value={condition.name}>
                      {condition.name} ({condition.multiplier}x efficiency)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fuel Type */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Fuel Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => handleFuelTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Select fuel type"
                >
                  {FUEL_TYPES.map(fuel => (
                    <option key={fuel.name} value={fuel.name}>
                      {fuel.name} - ${fuel.price}/unit
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Cost per Unit
                </label>
                <input
                  type="number"
                  value={fuelCost}
                  onChange={(e) => setFuelCost(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="3.50"
                  min="0"
                  step="0.01"
                  aria-label="Fuel cost per unit"
                />
                <p className="text-xs text-gray-500 mt-1">Price per gallon, kWh, or unit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Distance and Fuel */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Trip Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (miles)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="100"
                  min="0"
                  step="0.1"
                  aria-label="Distance in miles"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Used (gallons/units)
                </label>
                <input
                  type="number"
                  value={fuelUsed}
                  onChange={(e) => setFuelUsed(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="4.5"
                  min="0"
                  step="0.1"
                  aria-label="Fuel used"
                />
              </div>
            </div>
          </div>

          {/* Quick Trip Distances */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Trip Distances</h3>
            <div className="grid grid-cols-2 gap-3">
              {[25, 50, 100, 200, 300, 500].map((miles) => (
                <button
                  key={miles}
                  onClick={() => handleQuickTrip(miles)}
                  className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors text-sm text-center"
                >
                  <div className="font-medium text-orange-800">{miles} miles</div>
                  <div className="text-orange-600">${formatCurrency(calculateTripCost(miles))}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        {distance && fuelUsed && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Mileage</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Mileage Results */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">Fuel Efficiency Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-700">{formatNumber(result.mpg)}</div>
                  <div className="text-sm text-gray-600">MPG</div>
                  <div className="text-xs text-orange-600">{result.fuelEfficiency}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{formatNumber(result.l100km)}</div>
                  <div className="text-sm text-gray-600">L/100km</div>
                  <div className="text-xs text-orange-600">Metric</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{formatCurrency(result.costPerMile)}</div>
                  <div className="text-sm text-gray-600">Cost per Mile</div>
                  <div className="text-xs text-orange-600">Fuel cost</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatCurrency(result.totalCost)}</div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                  <div className="text-xs text-green-600">For this trip</div>
                </div>
              </div>
              
              {result.savings !== 0 && (
                <div className="mt-6 text-center">
                  <div className={`text-lg font-semibold ${result.savings > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {result.savings > 0 ? '+' : ''}{formatNumber(result.savings)}% vs {vehicleType} average
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.savings > 0 ? 'Better than average efficiency' : 'Below average efficiency'}
                  </div>
                </div>
              )}
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
              <h4 className="font-semibold text-gray-800 mb-2">About Gas Mileage Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator helps you determine your vehicle's fuel efficiency (MPG), calculate fuel costs per mile, 
                and plan trips with accurate fuel cost estimates. It considers different vehicle types, fuel types, 
                and driving conditions to provide realistic calculations. The calculator also compares your efficiency 
                to vehicle averages and helps you understand the true cost of your driving. Perfect for budget planning, 
                fleet management, and eco-conscious driving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
