'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Fuel, Car, DollarSign, MapPin } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface FuelResult {
  totalCost: number
  costPerMile: number
  costPerKm: number
  fuelNeeded: number
  efficiency: string
  savings: number
  recommendations: string[]
}

interface FuelType {
  name: string
  price: number
  efficiency: number
  description: string
}

interface VehicleType {
  name: string
  avgMpg: number
  category: string
  description: string
}

const FUEL_TYPES: FuelType[] = [
  { name: 'Regular Gasoline', price: 3.50, efficiency: 1.0, description: 'Standard unleaded fuel' },
  { name: 'Premium Gasoline', price: 4.00, efficiency: 1.05, description: 'Higher octane fuel' },
  { name: 'Diesel', price: 3.80, efficiency: 1.15, description: 'Diesel fuel for diesel engines' },
  { name: 'E85 Ethanol', price: 3.20, efficiency: 0.85, description: '85% ethanol blend' },
  { name: 'Electric', price: 0.12, efficiency: 3.0, description: 'Electric charging (per kWh)' },
  { name: 'Hybrid', price: 3.50, efficiency: 1.3, description: 'Hybrid vehicle fuel' }
]

const VEHICLE_TYPES: VehicleType[] = [
  { name: 'Compact Car', avgMpg: 35, category: 'Economy', description: 'Small, fuel-efficient' },
  { name: 'Sedan', avgMpg: 28, category: 'Standard', description: 'Mid-size family car' },
  { name: 'SUV', avgMpg: 22, category: 'Large', description: 'Sport utility vehicle' },
  { name: 'Truck', avgMpg: 18, category: 'Heavy', description: 'Pickup truck' },
  { name: 'Motorcycle', avgMpg: 45, category: 'Two-wheel', description: 'Motorcycle or scooter' },
  { name: 'Electric Vehicle', avgMpg: 100, category: 'Electric', description: 'Battery electric vehicle' }
]

const QUICK_TRIPS = [
  { name: 'Work Commute', distance: 25, description: 'Daily work trip' },
  { name: 'Grocery Run', distance: 8, description: 'Local shopping' },
  { name: 'Weekend Trip', distance: 150, description: 'Out of town visit' },
  { name: 'Airport Run', distance: 45, description: 'Airport transportation' },
  { name: 'Road Trip', distance: 500, description: 'Long distance travel' }
]

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState('')
  const [fuelPrice, setFuelPrice] = useState('')
  const [mpg, setMpg] = useState('')
  const [selectedFuelType, setSelectedFuelType] = useState('Regular Gasoline')
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateFuelCost = useCallback((): FuelResult => {
    const dist = parseFloat(distance) || 0
    const price = parseFloat(fuelPrice) || 0
    const efficiency = parseFloat(mpg) || 0
    
    if (dist === 0 || price === 0 || efficiency === 0) return {
      totalCost: 0,
      costPerMile: 0,
      costPerKm: 0,
      fuelNeeded: 0,
      efficiency: '',
      savings: 0,
      recommendations: []
    }

    // Calculate fuel needed
    const fuelNeeded = dist / efficiency
    
    // Calculate total cost
    const totalCost = fuelNeeded * price
    
    // Calculate cost per mile/kilometer
    const costPerMile = totalCost / dist
    const costPerKm = costPerMile * 0.621371 // Convert miles to km
    
    // Determine efficiency rating
    let efficiencyRating = ''
    if (efficiency >= 40) efficiencyRating = 'Excellent - Very fuel efficient'
    else if (efficiency >= 30) efficiencyRating = 'Good - Above average efficiency'
    else if (efficiency >= 25) efficiencyRating = 'Average - Standard efficiency'
    else if (efficiency >= 20) efficiencyRating = 'Below Average - Higher fuel consumption'
    else efficiencyRating = 'Poor - Very high fuel consumption'
    
    // Calculate potential savings
    const avgEfficiency = 25 // National average
    const avgCost = (dist / avgEfficiency) * price
    const savings = avgCost - totalCost
    
    // Generate recommendations
    const recommendations: string[] = []
    if (efficiency < 25) recommendations.push('Consider a more fuel-efficient vehicle')
    if (price > 4.00) recommendations.push('Look for lower fuel prices or alternative fuels')
    if (dist > 100) recommendations.push('Plan routes to minimize distance')
    if (efficiency < 20) recommendations.push('Maintain vehicle for better efficiency')
    if (savings > 0) recommendations.push('Your vehicle is more efficient than average')
    
    return {
      totalCost,
      costPerMile,
      costPerKm,
      fuelNeeded,
      efficiency: efficiencyRating,
      savings,
      recommendations
    }
  }, [distance, fuelPrice, mpg])

  const handleCalculate = () => {
    if (distance && fuelPrice && mpg) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setDistance('')
    setFuelPrice('')
    setMpg('')
    setSelectedFuelType('Regular Gasoline')
    setSelectedVehicle('')
    setShowResults(false)
  }

  const handleQuickFuel = (fuel: FuelType) => {
    setSelectedFuelType(fuel.name)
    setFuelPrice(fuel.price.toString())
  }

  const handleQuickVehicle = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle.name)
    setMpg(vehicle.avgMpg.toString())
  }

  const handleQuickTrip = (trip: { name: string, distance: number }) => {
    setDistance(trip.distance.toString())
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculateFuelCost()
    
    const data = `Fuel Cost Calculator Results

Trip Details:
- Distance: ${distance} miles
- Fuel Price: ${formatCurrency(parseFloat(fuelPrice))} per gallon
- MPG: ${mpg} miles per gallon

Cost Breakdown:
- Total Fuel Cost: ${formatCurrency(result.totalCost)}
- Cost per Mile: ${formatCurrency(result.costPerMile)}
- Cost per Kilometer: ${formatCurrency(result.costPerKm)}
- Fuel Needed: ${formatNumber(result.fuelNeeded)} gallons

Efficiency Analysis:
- Efficiency Rating: ${result.efficiency}
- Potential Savings: ${formatCurrency(result.savings)}

Recommendations:
${result.recommendations.map(rec => `- ${rec}`).join('\n')}

Vehicle Information:
- Selected Vehicle: ${selectedVehicle || 'Custom MPG'}
- Fuel Type: ${selectedFuelType}

Cost Comparison:
- Your Trip Cost: ${formatCurrency(result.totalCost)}
- Average Vehicle Cost: ${formatCurrency(result.totalCost + result.savings)}
- Savings: ${formatCurrency(result.savings)}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fuel-cost-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateFuelCost()
      
      navigator.share({
        title: 'Fuel Cost Calculator Results',
        text: `${distance} miles = ${formatCurrency(result.totalCost)}, ${formatNumber(result.costPerMile)}/mile`,
        url: window.location.href
      })
    } else {
      const result = calculateFuelCost()
      const text = `Fuel Cost: ${formatCurrency(result.totalCost)} for ${distance} miles`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateFuelCost() : { totalCost: 0, costPerMile: 0, costPerKm: 0, fuelNeeded: 0, efficiency: '', savings: 0, recommendations: [] }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Fuel Cost Calculator</h1>
            <p className="text-orange-100 text-lg">
              Calculate fuel costs, efficiency, and trip expenses. Compare different fuel types 
              and vehicle efficiencies to optimize your transportation costs.
            </p>
          </div>
          <div className="hidden md:block">
            <Fuel className="w-16 h-16 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Fuel Types */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Fuel Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FUEL_TYPES.map((fuel, index) => (
              <button
                key={index}
                onClick={() => handleQuickFuel(fuel)}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  selectedFuelType === fuel.name
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-gray-700'
                }`}
              >
                <div className="font-semibold">{fuel.name}</div>
                <div className="text-sm opacity-80">{formatCurrency(fuel.price)}/gallon</div>
                <div className="text-xs opacity-60">{fuel.description}</div>
                <div className="text-xs opacity-60 mt-1">Efficiency: {fuel.efficiency}x</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Vehicle Types */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Vehicle Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VEHICLE_TYPES.map((vehicle, index) => (
              <button
                key={index}
                onClick={() => handleQuickVehicle(vehicle)}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  selectedVehicle === vehicle.name
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-red-50 hover:bg-red-100 border-red-200 text-gray-700'
                }`}
              >
                <div className="font-semibold">{vehicle.name}</div>
                <div className="text-sm opacity-80">{vehicle.avgMpg} MPG</div>
                <div className="text-xs opacity-60">{vehicle.description}</div>
                <div className="text-xs opacity-60 mt-1">{vehicle.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Trip Distances */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Trip Distances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_TRIPS.map((trip, index) => (
              <button
                key={index}
                onClick={() => handleQuickTrip(trip)}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left"
              >
                <div className="font-semibold text-gray-800">{trip.name}</div>
                <div className="text-sm text-gray-600">{trip.distance} miles</div>
                <div className="text-xs text-gray-500">{trip.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Trip Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Trip Details</h3>
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
                min="0.1"
                step="0.1"
                aria-label="Trip distance in miles"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Price (per gallon)
              </label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="3.50"
                min="0.01"
                step="0.01"
                aria-label="Fuel price per gallon"
              />
            </div>
          </div>

          {/* Vehicle Efficiency */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Vehicle Efficiency</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miles Per Gallon (MPG)
              </label>
              <input
                type="number"
                value={mpg}
                onChange={(e) => setMpg(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="25"
                min="1"
                step="0.1"
                aria-label="Vehicle fuel efficiency in MPG"
              />
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">Current Selection</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <div>Fuel Type: {selectedFuelType}</div>
                <div>Vehicle: {selectedVehicle || 'Custom MPG'}</div>
                <div>Distance: {distance || '0'} miles</div>
                <div>Price: {fuelPrice ? `$${fuelPrice}` : '$0'} per gallon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        {distance && fuelPrice && mpg && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Fuel Costs</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <ResultSharing
                title="Fuel Cost Calculation Result"
                inputs={[
                  { label: "Distance", value: `${distance} miles` },
                  { label: "Fuel Price", value: `$${fuelPrice}/gallon` },
                  { label: "MPG", value: mpg }
                ]}
                result={{ 
                  label: "Total Fuel Cost", 
                  value: formatCurrency(result.totalCost),
                  unit: ""
                }}
                calculatorName="Fuel Cost Calculator"
                className="mb-0"
              />
            </div>

            {/* Cost Results */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">Fuel Cost Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-700">{formatCurrency(result.totalCost)}</div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                  <div className="text-xs text-orange-600">For entire trip</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatCurrency(result.costPerMile)}</div>
                  <div className="text-sm text-gray-600">Cost per Mile</div>
                  <div className="text-xs text-blue-600">Per mile traveled</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatNumber(result.fuelNeeded)}</div>
                  <div className="text-sm text-gray-600">Gallons Needed</div>
                  <div className="text-xs text-green-600">Fuel consumption</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatCurrency(result.savings)}</div>
                  <div className="text-sm text-gray-600">Savings vs Average</div>
                  <div className="text-xs text-purple-600">Compared to 25 MPG</div>
                </div>
              </div>
            </div>

            {/* Efficiency Analysis */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Efficiency Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Efficiency Rating</h4>
                  <div className="text-lg font-semibold text-orange-700">{result.efficiency}</div>
                  <p className="text-sm text-gray-600 mt-1">Based on your vehicle's MPG</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Cost per Kilometer</h4>
                  <div className="text-lg font-semibold text-blue-700">{formatCurrency(result.costPerKm)}</div>
                  <p className="text-sm text-gray-600 mt-1">Metric equivalent</p>
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
            <Info className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Fuel Cost Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This comprehensive fuel cost calculator helps you estimate trip expenses, compare fuel types, 
                and analyze vehicle efficiency. It provides cost breakdowns, efficiency ratings, and 
                recommendations to optimize your transportation costs. Perfect for trip planning, 
                vehicle comparison, and budget management.
              </p>
            </div>
          </div>
        </div>
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Fuel Cost Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive fuel cost calculator helps drivers, travelers, and fleet managers 
              estimate transportation expenses, compare fuel efficiency, and optimize travel costs. 
              This essential tool provides detailed cost analysis, efficiency ratings, and 
              recommendations for cost-effective transportation planning.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Total Fuel Cost:</strong> Complete trip fuel expenses</li>
              <li><strong>Cost per Mile:</strong> Per-mile transportation cost</li>
              <li><strong>Cost per Kilometer:</strong> Metric cost analysis</li>
              <li><strong>Fuel Consumption:</strong> Gallons/liters needed</li>
              <li><strong>Efficiency Rating:</strong> Vehicle performance assessment</li>
              <li><strong>Cost Savings:</strong> Comparison to average vehicles</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Types</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cost Calculations</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Total Cost:</strong> Distance × fuel price ÷ MPG</li>
                  <li><strong>Cost per Mile:</strong> Fuel price ÷ MPG</li>
                  <li><strong>Cost per Kilometer:</strong> Cost per mile × 0.621</li>
                  <li><strong>Fuel Needed:</strong> Distance ÷ MPG</li>
                  <li><strong>Round Trip:</strong> Double the one-way cost</li>
                  <li><strong>Monthly Costs:</strong> Daily commute × 22 days</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Efficiency Analysis</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>MPG Rating:</strong> Miles per gallon efficiency</li>
                  <li><strong>Fuel Economy:</strong> Cost per distance traveled</li>
                  <li><strong>Efficiency Comparison:</strong> vs. average vehicles</li>
                  <li><strong>Savings Calculation:</strong> Cost difference analysis</li>
                  <li><strong>Break-even Analysis:</strong> Fuel vs. vehicle cost</li>
                  <li><strong>Environmental Impact:</strong> CO2 emissions</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Total Cost</h5>
                <p className="text-orange-700 text-sm">Complete fuel expense</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Cost per Mile</h5>
                <p className="text-green-700 text-sm">Per-mile expense</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Fuel Needed</h5>
                <p className="text-blue-700 text-sm">Gallons required</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Efficiency</h5>
                <p className="text-purple-700 text-sm">Performance rating</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your trip distance, select fuel type and price, and input your vehicle's MPG. 
              The calculator automatically computes total fuel costs, cost per mile, fuel consumption, 
              and efficiency ratings. Use the recommendations to optimize your transportation costs.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fuel Type Considerations</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Gasoline Types:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Regular (87 octane): Standard fuel</li>
                    <li>Mid-grade (89 octane): Enhanced performance</li>
                    <li>Premium (91-93 octane): High-performance engines</li>
                    <li>E85: 85% ethanol blend</li>
                    <li>E10: 10% ethanol blend</li>
                    <li>Flex-fuel: Variable ethanol content</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Alternative Fuels:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Diesel: Higher efficiency, higher cost</li>
                    <li>Electric: Cost per kWh analysis</li>
                    <li>Hybrid: Combined fuel efficiency</li>
                    <li>Natural Gas: Compressed or liquefied</li>
                    <li>Biodiesel: Renewable diesel alternative</li>
                    <li>Hydrogen: Fuel cell vehicles</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">MPG and Efficiency Factors</h4>
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
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Cost Optimization Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Fuel Price Shopping:</strong> Compare local station prices</li>
              <li><strong>Loyalty Programs:</strong> Gas station reward programs</li>
              <li><strong>Credit Card Rewards:</strong> Gas cashback cards</li>
              <li><strong>Bulk Purchases:</strong> Costco and warehouse clubs</li>
              <li><strong>Timing:</strong> Fill up on lower-price days</li>
              <li><strong>Alternative Routes:</strong> Avoid high-price areas</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Trip Planning Considerations</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Route Planning</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Distance Optimization:</strong> Shortest efficient route</li>
                  <li><strong>Traffic Avoidance:</strong> Reduce idling time</li>
                  <li><strong>Terrain Consideration:</strong> Hills affect MPG</li>
                  <li><strong>Fuel Stops:</strong> Plan refueling locations</li>
                  <li><strong>Weather Impact:</strong> Cold weather reduces efficiency</li>
                  <li><strong>Altitude Effects:</strong> High elevation impacts</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cost Management</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Budget Planning:</strong> Set fuel cost limits</li>
                  <li><strong>Alternative Transportation:</strong> Public transit options</li>
                  <li><strong>Carpooling:</strong> Share fuel costs</li>
                  <li><strong>Combining Trips:</strong> Reduce total mileage</li>
                  <li><strong>Fuel Efficiency:</strong> Choose efficient vehicles</li>
                  <li><strong>Maintenance Costs:</strong> Include in total cost</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Environmental Impact</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Carbon Footprint:</strong> CO2 emissions per mile</li>
              <li><strong>Fuel Efficiency:</strong> Lower MPG = higher emissions</li>
              <li><strong>Alternative Fuels:</strong> Renewable energy sources</li>
              <li><strong>Electric Vehicles:</strong> Zero tailpipe emissions</li>
              <li><strong>Hybrid Technology:</strong> Reduced fuel consumption</li>
              <li><strong>Sustainable Driving:</strong> Eco-friendly practices</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fuel Cost Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Real MPG:</strong> Actual driving conditions</li>
              <li><strong>Include All Costs:</strong> Fuel, maintenance, depreciation</li>
              <li><strong>Consider Alternatives:</strong> Public transit, biking, walking</li>
              <li><strong>Plan Efficiently:</strong> Combine multiple errands</li>
              <li><strong>Monitor Prices:</strong> Track fuel cost trends</li>
              <li><strong>Calculate Round Trip:</strong> Include return journey</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Fuel Cost Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Using EPA MPG:</strong> Not real-world conditions</li>
              <li><strong>Ignoring Maintenance:</strong> Poor maintenance reduces efficiency</li>
              <li><strong>Not Shopping Around:</strong> Paying premium prices</li>
              <li><strong>Forgetting Return Trip:</strong> Only calculating one way</li>
              <li><strong>Ignoring Traffic:</strong> Not accounting for delays</li>
              <li><strong>Using Premium Unnecessarily:</strong> Higher octane doesn't always help</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Fuel Analysis</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Total Cost of Ownership:</strong> Purchase + operating costs</li>
              <li><strong>Break-even Analysis:</strong> Fuel vs. vehicle cost comparison</li>
              <li><strong>Depreciation Impact:</strong> Vehicle value over time</li>
              <li><strong>Insurance Costs:</strong> Vehicle type affects rates</li>
              <li><strong>Maintenance Expenses:</strong> Regular service costs</li>
              <li><strong>Resale Value:</strong> Fuel efficiency affects resale</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When calculating fuel costs, always use your actual MPG rather than the EPA rating, as 
                real-world driving conditions typically result in 10-20% lower efficiency. Consider the 
                total cost of ownership, including fuel, maintenance, insurance, and depreciation. For 
                long-term savings, focus on improving driving habits (smooth acceleration, proper tire 
                pressure, regular maintenance) rather than just finding cheaper fuel. Remember that the 
                most expensive fuel is the fuel you don't need - efficient driving and trip planning can 
                save more money than finding the cheapest gas station.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
