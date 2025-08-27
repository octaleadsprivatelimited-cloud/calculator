'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Fuel, Car, DollarSign } from 'lucide-react'
import ResultSharing from '../ResultSharing'

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
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(2)
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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <ResultSharing
                title="Gas Mileage Calculation Result"
                inputs={[
                  { label: "Distance", value: `${distance} miles` },
                  { label: "Fuel Used", value: `${fuelUsed} gallons` },
                  { label: "Calculation Type", value: calculationType.charAt(0).toUpperCase() + calculationType.slice(1) }
                ]}
                result={{ 
                  label: "Fuel Efficiency", 
                  value: `${formatNumber(result.mpg)} MPG`,
                  unit: ""
                }}
                calculatorName="Gas Mileage Calculator"
                className="mb-0"
              />
            </div>

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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Gas Mileage Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive gas mileage calculator helps drivers, fleet managers, and cost-conscious travelers 
              understand their vehicle's fuel efficiency and optimize transportation costs. This essential tool 
              provides accurate MPG calculations, cost analysis, and trip planning capabilities for informed 
              driving decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Fuel Efficiency:</strong> Miles per gallon (MPG) and liters per 100km</li>
              <li><strong>Cost Analysis:</strong> Cost per mile, cost per kilometer, total trip cost</li>
              <li><strong>Trip Planning:</strong> Fuel requirements and cost estimates</li>
              <li><strong>Efficiency Comparison:</strong> Performance vs. vehicle averages</li>
              <li><strong>Metric Conversions:</strong> MPG to L/100km and vice versa</li>
              <li><strong>Savings Analysis:</strong> Cost savings from improved efficiency</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">MPG Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>MPG Formula:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>MPG = Distance ÷ Fuel Used</li>
                    <li>Higher MPG = Better efficiency</li>
                    <li>Lower MPG = Higher fuel consumption</li>
                    <li>Typical range: 15-50 MPG</li>
                    <li>Hybrids: 40-60 MPG</li>
                    <li>Electric: 100+ MPG equivalent</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Metric Conversion:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>L/100km = 235.214 ÷ MPG</li>
                    <li>MPG = 235.214 ÷ L/100km</li>
                    <li>Lower L/100km = Better efficiency</li>
                    <li>Typical range: 2-15 L/100km</li>
                    <li>Hybrids: 1-3 L/100km</li>
                    <li>Electric: 0 L/100km</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Gas Mileage</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Vehicle Factors:</strong> Engine size, weight, aerodynamics, tires, transmission</li>
              <li><strong>Driving Factors:</strong> Speed, acceleration, idling, route planning, maintenance</li>
              <li><strong>Weather Conditions:</strong> Cold weather, hot weather, rain/snow, wind, altitude</li>
              <li><strong>Traffic Conditions:</strong> Highway vs. city driving, traffic jams, hills</li>
              <li><strong>Fuel Type:</strong> Gasoline grades, diesel, ethanol, electric, hybrid</li>
              <li><strong>Maintenance:</strong> Regular tune-ups, tire pressure, oil changes</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Improving Gas Mileage</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Maintenance:</strong> Regular tune-ups, oil changes, air filter replacement</li>
              <li><strong>Tire Care:</strong> Proper inflation, alignment, rotation</li>
              <li><strong>Driving Habits:</strong> Smooth acceleration, coasting, avoiding idling</li>
              <li><strong>Route Planning:</strong> Avoid traffic, choose efficient routes</li>
              <li><strong>Vehicle Weight:</strong> Remove unnecessary items</li>
              <li><strong>Fuel Quality:</strong> Use recommended fuel grade</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                For the most accurate MPG calculations, use the full tank method and track your efficiency 
                over multiple fill-ups rather than relying on a single tank. Remember that your actual MPG 
                will typically be 10-20% lower than EPA ratings due to real-world driving conditions. Focus 
                on improving driving habits (smooth acceleration, proper tire pressure, regular maintenance) 
                rather than just finding cheaper fuel, as these improvements can save more money in the long run.
              </p>
            </div>
          </div>
        </div>
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Gas Mileage Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive gas mileage calculator helps drivers, fleet managers, and cost-conscious travelers 
              understand their vehicle's fuel efficiency and optimize transportation costs. This essential tool 
              provides accurate MPG calculations, cost analysis, and trip planning capabilities for informed 
              driving decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Fuel Efficiency:</strong> Miles per gallon (MPG) and liters per 100km</li>
              <li><strong>Cost Analysis:</strong> Cost per mile, cost per kilometer, total trip cost</li>
              <li><strong>Trip Planning:</strong> Fuel requirements and cost estimates</li>
              <li><strong>Efficiency Comparison:</strong> Performance vs. vehicle averages</li>
              <li><strong>Metric Conversions:</strong> MPG to L/100km and vice versa</li>
              <li><strong>Savings Analysis:</strong> Cost savings from improved efficiency</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Types</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">MPG Calculation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Basic MPG:</strong> Distance ÷ fuel used</li>
                  <li><strong>Metric Conversion:</strong> MPG to L/100km</li>
                  <li><strong>Efficiency Rating:</strong> Performance classification</li>
                  <li><strong>Comparison Analysis:</strong> vs. vehicle averages</li>
                  <li><strong>Trend Tracking:</strong> Monitor efficiency over time</li>
                  <li><strong>Fuel Type Impact:</strong> Different fuel efficiencies</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cost Analysis</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Cost per Mile:</strong> Fuel cost ÷ MPG</li>
                  <li><strong>Cost per Kilometer:</strong> Metric cost calculation</li>
                  <li><strong>Total Trip Cost:</strong> Complete fuel expense</li>
                  <li><strong>Savings Calculation:</strong> Efficiency improvements</li>
                  <li><strong>Budget Planning:</strong> Monthly fuel costs</li>
                  <li><strong>ROI Analysis:</strong> Investment in efficiency</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">MPG</h5>
                <p className="text-orange-700 text-sm">Fuel efficiency</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">L/100km</h5>
                <p className="text-blue-700 text-sm">Metric efficiency</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Cost/Mile</h5>
                <p className="text-green-700 text-sm">Per-mile expense</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Total Cost</h5>
                <p className="text-purple-700 text-sm">Trip fuel expense</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Select your calculation type (MPG, cost analysis, or trip planning), enter the required information 
              such as distance, fuel used, and fuel cost. The calculator automatically computes efficiency metrics, 
              cost breakdowns, and provides comparisons to help optimize your driving costs.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">MPG Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>MPG Formula:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>MPG = Distance ÷ Fuel Used</li>
                    <li>Higher MPG = Better efficiency</li>
                    <li>Lower MPG = Higher fuel consumption</li>
                    <li>Typical range: 15-50 MPG</li>
                    <li>Hybrids: 40-60 MPG</li>
                    <li>Electric: 100+ MPG equivalent</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Metric Conversion:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>L/100km = 235.214 ÷ MPG</li>
                    <li>MPG = 235.214 ÷ L/100km</li>
                    <li>Lower L/100km = Better efficiency</li>
                    <li>Typical range: 2-15 L/100km</li>
                    <li>Hybrids: 1-3 L/100km</li>
                    <li>Electric: 0 L/100km</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Vehicle Type Efficiency Ranges</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Passenger Vehicles</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Compact Cars:</strong> 25-35 MPG</li>
                  <li><strong>Sedans:</strong> 20-30 MPG</li>
                  <li><strong>SUVs:</strong> 15-25 MPG</li>
                  <li><strong>Trucks:</strong> 15-22 MPG</li>
                  <li><strong>Minivans:</strong> 18-25 MPG</li>
                  <li><strong>Sports Cars:</strong> 15-25 MPG</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Alternative Fuel</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Hybrids:</strong> 40-60 MPG</li>
                  <li><strong>Plug-in Hybrids:</strong> 50-100 MPG</li>
                  <li><strong>Electric:</strong> 100+ MPG equivalent</li>
                  <li><strong>Diesel:</strong> 25-35 MPG</li>
                  <li><strong>Natural Gas:</strong> 20-30 MPG</li>
                  <li><strong>Hydrogen:</strong> 60-70 MPG equivalent</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Gas Mileage</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Vehicle Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Engine Size:</strong> Larger engines use more fuel</li>
                  <li><strong>Vehicle Weight:</strong> Heavier vehicles less efficient</li>
                  <li><strong>Aerodynamics:</strong> Wind resistance impact</li>
                  <li><strong>Tire Type:</strong> Rolling resistance effects</li>
                  <li><strong>Transmission:</strong> Manual vs. automatic efficiency</li>
                  <li><strong>Drive Type:</strong> AWD vs. 2WD efficiency</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Driving Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Speed:</strong> Optimal 55-65 mph for efficiency</li>
                  <li><strong>Acceleration:</strong> Smooth driving saves fuel</li>
                  <li><strong>Idling:</strong> Turn off engine when stopped</li>
                  <li><strong>Route Planning:</strong> Avoid traffic and hills</li>
                  <li><strong>Maintenance:</strong> Regular tune-ups improve MPG</li>
                  <li><strong>Load:</strong> Remove unnecessary weight</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fuel Type Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Regular Gasoline:</strong> Standard 87 octane, typical efficiency</li>
              <li><strong>Premium Gasoline:</strong> Higher octane, may improve performance</li>
              <li><strong>Diesel:</strong> Higher efficiency, higher cost per gallon</li>
              <li><strong>E85 Ethanol:</strong> Lower MPG, lower cost per gallon</li>
              <li><strong>Electric:</strong> Cost per kWh analysis</li>
              <li><strong>Hybrid:</strong> Combined gas and electric efficiency</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Driving Conditions Impact</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Weather Conditions</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Cold Weather:</strong> 10-20% efficiency reduction</li>
                  <li><strong>Hot Weather:</strong> AC usage reduces efficiency</li>
                  <li><strong>Rain/Snow:</strong> Wet roads increase resistance</li>
                  <li><strong>Wind:</strong> Headwinds reduce efficiency</li>
                  <li><strong>Altitude:</strong> High elevation affects performance</li>
                  <li><strong>Humidity:</strong> Moisture impacts combustion</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Traffic Conditions</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Highway Driving:</strong> Most efficient (steady speed)</li>
                  <li><strong>City Driving:</strong> Stop-and-go reduces efficiency</li>
                  <li><strong>Traffic Jams:</strong> Idling wastes fuel</li>
                  <li><strong>Hills:</strong> Climbing reduces efficiency</li>
                  <li><strong>Construction:</strong> Detours increase distance</li>
                  <li><strong>Rush Hour:</strong> Peak congestion periods</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Improving Gas Mileage</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Maintenance:</strong> Regular tune-ups, oil changes, air filter replacement</li>
              <li><strong>Tire Care:</strong> Proper inflation, alignment, rotation</li>
              <li><strong>Driving Habits:</strong> Smooth acceleration, coasting, avoiding idling</li>
              <li><strong>Route Planning:</strong> Avoid traffic, choose efficient routes</li>
              <li><strong>Vehicle Weight:</strong> Remove unnecessary items</li>
              <li><strong>Fuel Quality:</strong> Use recommended fuel grade</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Cost Analysis Benefits</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Budget Planning:</strong> Accurate fuel cost estimates</li>
              <li><strong>Vehicle Comparison:</strong> Efficiency vs. cost analysis</li>
              <li><strong>Trip Planning:</strong> Fuel budget for travel</li>
              <li><strong>Fleet Management:</strong> Cost per vehicle tracking</li>
              <li><strong>ROI Calculation:</strong> Investment in efficiency improvements</li>
              <li><strong>Environmental Impact:</strong> CO2 emissions tracking</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Gas Mileage Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Full Tank Method:</strong> Fill up completely for accurate readings</li>
              <li><strong>Reset Trip Odometer:</strong> Start fresh for each calculation</li>
              <li><strong>Track Multiple Fill-ups:</strong> Average over several tanks</li>
              <li><strong>Consider Driving Conditions:</strong> Separate city vs. highway MPG</li>
              <li><strong>Account for Fuel Type:</strong> Different fuels have different efficiencies</li>
              <li><strong>Monitor Trends:</strong> Track efficiency over time</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common MPG Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Partial Fill-ups:</strong> Inaccurate fuel consumption measurement</li>
              <li><strong>Ignoring Conditions:</strong> Not accounting for weather/traffic</li>
              <li><strong>Using EPA Ratings:</strong> Not real-world driving conditions</li>
              <li><strong>Forgetting Maintenance:</strong> Poor maintenance reduces efficiency</li>
              <li><strong>Ignoring Load:</strong> Not accounting for passengers/cargo</li>
              <li><strong>Single Calculation:</strong> One tank doesn't represent average</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced MPG Analysis</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Trend Analysis:</strong> Monitor efficiency over time</li>
              <li><strong>Condition Comparison:</strong> City vs. highway efficiency</li>
              <li><strong>Seasonal Variations:</strong> Weather impact on efficiency</li>
              <li><strong>Maintenance Correlation:</strong> Service impact on MPG</li>
              <li><strong>Driver Comparison:</strong> Different driver efficiencies</li>
              <li><strong>Route Optimization:</strong> Most efficient path planning</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                For the most accurate MPG calculations, use the full tank method and track your efficiency 
                over multiple fill-ups rather than relying on a single tank. Remember that your actual MPG 
                will typically be 10-20% lower than EPA ratings due to real-world driving conditions. Focus 
                on improving driving habits (smooth acceleration, proper tire pressure, regular maintenance) 
                rather than just finding cheaper fuel, as these improvements can save more money in the long run. 
                Consider tracking your MPG in different conditions (city vs. highway, summer vs. winter) to 
                better understand your vehicle's true efficiency profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
