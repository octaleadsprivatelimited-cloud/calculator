'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Fuel, MapPin, Car } from 'lucide-react'

interface MileageData {
  distance: number
  fuelUsed: number
  fuelCost: number
  mpg: number
  costPerMile: number
  totalCost: number
}

interface TripData {
  startLocation: string
  endLocation: string
  distance: number
  fuelEfficiency: number
  fuelPrice: number
}

export default function MileageCalculator() {
  const [tripData, setTripData] = useState<TripData>({
    startLocation: '',
    endLocation: '',
    distance: 0,
    fuelEfficiency: 25,
    fuelPrice: 3.50
  })
  const [fuelUsed, setFuelUsed] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [calculationType, setCalculationType] = useState<'trip' | 'efficiency'>('trip')

  const calculateMileage = useCallback((): MileageData => {
    if (calculationType === 'trip') {
      const distance = tripData.distance
      const fuelUsed = distance / tripData.fuelEfficiency
      const fuelCost = fuelUsed * tripData.fuelPrice
      const mpg = tripData.fuelEfficiency
      const costPerMile = fuelCost / distance
      const totalCost = fuelCost

      return {
        distance,
        fuelUsed,
        fuelCost,
        mpg,
        costPerMile,
        totalCost
      }
    } else {
      const distance = parseFloat(fuelUsed) * tripData.fuelEfficiency
      const fuelUsedValue = parseFloat(fuelUsed)
      const fuelCost = fuelUsedValue * tripData.fuelPrice
      const mpg = tripData.fuelEfficiency
      const costPerMile = fuelCost / distance
      const totalCost = fuelCost

      return {
        distance,
        fuelUsed: fuelUsedValue,
        fuelCost,
        mpg,
        costPerMile,
        totalCost
      }
    }
  }, [tripData, fuelUsed, calculationType])

  const handleCalculate = () => {
    if (calculationType === 'trip') {
      if (tripData.distance > 0 && tripData.fuelEfficiency > 0) {
        setShowResults(true)
      }
    } else {
      if (fuelUsed && parseFloat(fuelUsed) > 0 && tripData.fuelEfficiency > 0) {
        setShowResults(true)
      }
    }
  }

  const handleReset = () => {
    setTripData({
      startLocation: '',
      endLocation: '',
      distance: 0,
      fuelEfficiency: 25,
      fuelPrice: 3.50
    })
    setFuelUsed('')
    setShowResults(false)
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const downloadResults = () => {
    const result = calculateMileage()
    
    const data = `Mileage Calculator Results

${calculationType === 'trip' ? 'Trip Details:' : 'Fuel Efficiency Calculation:'}
${tripData.startLocation ? `Start: ${tripData.startLocation}` : ''}
${tripData.endLocation ? `End: ${tripData.endLocation}` : ''}
Distance: ${formatNumber(result.distance)} miles
Fuel Efficiency: ${formatNumber(result.mpg)} MPG
Fuel Price: ${formatCurrency(tripData.fuelPrice)}/gallon

Results:
- Fuel Used: ${formatNumber(result.fuelUsed)} gallons
- Fuel Cost: ${formatCurrency(result.fuelCost)}
- Cost per Mile: ${formatCurrency(result.costPerMile)}
- Total Cost: ${formatCurrency(result.totalCost)}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mileage-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateMileage()
      
      navigator.share({
        title: 'Mileage Calculator Results',
        text: `${formatNumber(result.distance)} miles, ${formatNumber(result.mpg)} MPG, Cost: ${formatCurrency(result.totalCost)}`,
        url: window.location.href
      })
    } else {
      const result = calculateMileage()
      const text = `Mileage: ${formatNumber(result.distance)} miles, ${formatNumber(result.mpg)} MPG`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateMileage() : { distance: 0, fuelUsed: 0, fuelCost: 0, mpg: 0, costPerMile: 0, totalCost: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mileage Calculator</h1>
            <p className="text-blue-100 text-lg">
              Calculate fuel efficiency, trip costs, and mileage tracking. 
              Perfect for road trips, business travel, and fuel cost analysis.
            </p>
          </div>
          <div className="hidden md:block">
            <Car className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Calculation Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Calculation Type</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setCalculationType('trip')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                calculationType === 'trip'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Trip Planning
            </button>
            <button
              onClick={() => setCalculationType('efficiency')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                calculationType === 'efficiency'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Fuel className="w-4 h-4 inline mr-2" />
              Fuel Efficiency
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Trip Details */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trip Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Location
                  </label>
                  <input
                    type="text"
                    value={tripData.startLocation}
                    onChange={(e) => setTripData(prev => ({ ...prev, startLocation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Starting point"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Location
                  </label>
                  <input
                    type="text"
                    value={tripData.endLocation}
                    onChange={(e) => setTripData(prev => ({ ...prev, endLocation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Destination"
                  />
                </div>
                {calculationType === 'trip' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance (miles)
                    </label>
                    <input
                      type="number"
                      value={tripData.distance || ''}
                      onChange={(e) => setTripData(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="100"
                      min="0"
                      step="0.1"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuel Used (gallons)
                    </label>
                    <input
                      type="number"
                      value={fuelUsed}
                      onChange={(e) => setFuelUsed(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5.5"
                      min="0"
                      step="0.1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle & Fuel */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle & Fuel</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Efficiency (MPG)
                  </label>
                  <input
                    type="number"
                    value={tripData.fuelEfficiency}
                    onChange={(e) => setTripData(prev => ({ ...prev, fuelEfficiency: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25"
                    min="0"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical: 20-30 MPG for cars, 15-25 MPG for trucks</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Price per Gallon
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={tripData.fuelPrice}
                      onChange={(e) => setTripData(prev => ({ ...prev, fuelPrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="3.50"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            disabled={
              (calculationType === 'trip' && tripData.distance <= 0) ||
              (calculationType === 'efficiency' && (!fuelUsed || parseFloat(fuelUsed) <= 0)) ||
              tripData.fuelEfficiency <= 0
            }
            className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 ${
              (calculationType === 'trip' && tripData.distance <= 0) ||
              (calculationType === 'efficiency' && (!fuelUsed || parseFloat(fuelUsed) <= 0)) ||
              tripData.fuelEfficiency <= 0
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Calculate Mileage</span>
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Mileage Results</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-semibold">{formatNumber(result.distance)} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Efficiency:</span>
                    <span className="font-semibold text-blue-600">{formatNumber(result.mpg)} MPG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Used:</span>
                    <span className="font-semibold text-blue-600">{formatNumber(result.fuelUsed)} gallons</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Cost:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(result.fuelCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost per Mile:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(result.costPerMile)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Total Cost:</span>
                    <span className="text-blue-700">{formatCurrency(result.totalCost)}</span>
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
              <h4 className="font-semibold text-gray-800 mb-2">About Mileage Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator helps you track fuel efficiency and calculate trip costs. 
                Use trip planning mode to estimate costs for future journeys, or fuel efficiency 
                mode to calculate distance traveled based on fuel consumption. Perfect for business 
                expense tracking and personal budgeting.
              </p>
            </div>
          </div>
        </div>
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Mileage Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive mileage calculator helps drivers, businesses, and travelers 
              understand fuel efficiency, trip costs, and mileage tracking. This essential 
              tool provides accurate calculations for trip planning, fuel cost analysis, 
              and business expense tracking, enabling informed decisions about transportation.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Trip Distance:</strong> Total miles or kilometers traveled</li>
              <li><strong>Fuel Efficiency:</strong> Miles per gallon (MPG) or L/100km</li>
              <li><strong>Fuel Consumption:</strong> Total fuel used for the trip</li>
              <li><strong>Cost Analysis:</strong> Fuel costs and cost per mile</li>
              <li><strong>Total Expenses:</strong> Complete trip cost breakdown</li>
              <li><strong>Efficiency Tracking:</strong> Performance monitoring over time</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Modes</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Trip Planning Mode</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Purpose:</strong> Estimate costs for future journeys</li>
                  <li><strong>Inputs:</strong> Distance, fuel price, vehicle MPG</li>
                  <li><strong>Outputs:</strong> Estimated fuel cost and total expenses</li>
                  <li><strong>Use Case:</strong> Budget planning and cost estimation</li>
                  <li><strong>Benefits:</strong> Financial preparation for trips</li>
                  <li><strong>Accuracy:</strong> Based on known vehicle efficiency</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Fuel Efficiency Mode</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Purpose:</strong> Calculate actual distance from fuel used</li>
                  <li><strong>Inputs:</strong> Fuel consumed, fuel price, total cost</li>
                  <li><strong>Outputs:</strong> Distance traveled and efficiency metrics</li>
                  <li><strong>Use Case:</strong> Actual trip analysis and tracking</li>
                  <li><strong>Benefits:</strong> Real performance measurement</li>
                  <li><strong>Accuracy:</strong> Based on actual consumption data</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Distance</h5>
                <p className="text-blue-700 text-sm">Total miles traveled</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">MPG</h5>
                <p className="text-green-700 text-sm">Fuel efficiency rating</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Fuel Used</h5>
                <p className="text-purple-700 text-sm">Gallons consumed</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Total Cost</h5>
                <p className="text-orange-700 text-sm">Complete trip expense</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Select your calculation mode (Trip Planning or Fuel Efficiency), enter the required 
              information including locations, distances, fuel prices, and vehicle efficiency. 
              The calculator will provide comprehensive results including fuel consumption, 
              cost analysis, and efficiency metrics for informed decision-making.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fuel Efficiency Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>MPG Calculation:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>MPG = Distance ÷ Fuel Used</li>
                    <li>Higher MPG = Better efficiency</li>
                    <li>Lower MPG = More fuel consumption</li>
                    <li>City vs. Highway differences</li>
                    <li>Seasonal variations</li>
                    <li>Driving style impact</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Cost per Mile:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Cost per Mile = Fuel Cost ÷ Distance</li>
                    <li>Lower cost = Better value</li>
                    <li>Fuel price sensitivity</li>
                    <li>Efficiency improvements</li>
                    <li>Vehicle comparison tool</li>
                    <li>Budget planning metric</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Fuel Efficiency</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Vehicle Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Engine Size:</strong> Larger engines use more fuel</li>
                  <li><strong>Vehicle Weight:</strong> Heavier vehicles less efficient</li>
                  <li><strong>Aerodynamics:</strong> Wind resistance affects efficiency</li>
                  <li><strong>Tire Pressure:</strong> Underinflated tires reduce MPG</li>
                  <li><strong>Maintenance:</strong> Regular service improves efficiency</li>
                  <li><strong>Age:</strong> Older vehicles may be less efficient</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Driving Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Speed:</strong> Optimal speed for efficiency</li>
                  <li><strong>Acceleration:</strong> Smooth driving saves fuel</li>
                  <li><strong>Braking:</strong> Anticipatory driving reduces waste</li>
                  <li><strong>Idling:</strong> Turn off engine when stopped</li>
                  <li><strong>Route Choice:</strong> Avoid traffic and hills</li>
                  <li><strong>Load:</strong> Remove unnecessary weight</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Business Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Expense Tracking:</strong> Monitor business travel costs</li>
              <li><strong>Fleet Management:</strong> Track multiple vehicle efficiency</li>
              <li><strong>Cost Allocation:</strong> Assign expenses to projects</li>
              <li><strong>Budget Planning:</strong> Forecast transportation costs</li>
              <li><strong>Tax Deductions:</strong> Document business mileage</li>
              <li><strong>Performance Analysis:</strong> Compare driver efficiency</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Personal Finance Benefits</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Budget Management:</strong> Plan for transportation costs</li>
              <li><strong>Vehicle Comparison:</strong> Evaluate different car options</li>
              <li><strong>Fuel Cost Monitoring:</strong> Track spending over time</li>
              <li><strong>Efficiency Improvements:</strong> Identify savings opportunities</li>
              <li><strong>Trip Planning:</strong> Budget for vacations and travel</li>
              <li><strong>Cost Awareness:</strong> Make informed driving decisions</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Environmental Considerations</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Carbon Footprint</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Fuel Consumption:</strong> Direct emissions impact</li>
                  <li><strong>Efficiency Gains:</strong> Reduce environmental impact</li>
                  <li><strong>Alternative Fuels:</strong> Consider cleaner options</li>
                  <li><strong>Driving Habits:</strong> Eco-friendly practices</li>
                  <li><strong>Vehicle Choice:</strong> Select efficient models</li>
                  <li><strong>Maintenance:</strong> Keep vehicles running cleanly</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Sustainability</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Resource Conservation:</strong> Reduce fuel consumption</li>
                  <li><strong>Cost Savings:</strong> Financial and environmental benefits</li>
                  <li><strong>Future Planning:</strong> Consider electric vehicles</li>
                  <li><strong>Public Transport:</strong> Alternative transportation</li>
                  <li><strong>Carpooling:</strong> Share rides when possible</li>
                  <li><strong>Walking/Cycling:</strong> Short distance alternatives</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mileage Tracking Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Consistent Recording:</strong> Track every trip for accuracy</li>
              <li><strong>Fuel Receipts:</strong> Keep all fuel purchase records</li>
              <li><strong>Odometer Readings:</strong> Record start and end mileage</li>
              <li><strong>Regular Updates:</strong> Update calculations monthly</li>
              <li><strong>Multiple Vehicles:</strong> Track each vehicle separately</li>
              <li><strong>Digital Tools:</strong> Use apps for automatic tracking</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Calculation Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Incorrect MPG:</strong> Using outdated efficiency ratings</li>
              <li><strong>Fuel Price Errors:</strong> Using wrong fuel cost per gallon</li>
              <li><strong>Distance Miscalculations:</strong> Route vs. straight-line distance</li>
              <li><strong>Unit Confusion:</strong> Mixing miles and kilometers</li>
              <li><strong>Missing Costs:</strong> Forgetting maintenance and depreciation</li>
              <li><strong>Seasonal Variations:</strong> Not accounting for weather impact</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Mileage Analysis</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Trend Analysis:</strong> Monitor efficiency over time</li>
              <li><strong>Comparative Studies:</strong> Compare different vehicles</li>
              <li><strong>Route Optimization:</strong> Find most efficient paths</li>
              <li><strong>Cost Projections:</strong> Forecast future expenses</li>
              <li><strong>Efficiency Benchmarks:</strong> Compare to industry standards</li>
              <li><strong>Maintenance Impact:</strong> Track service effect on MPG</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Track your mileage consistently for at least a month to get accurate baseline 
                efficiency numbers. Consider factors like seasonal changes, driving conditions, 
                and vehicle maintenance that can affect fuel efficiency. Use this data to make 
                informed decisions about vehicle purchases, route planning, and driving habits. 
                Remember that small improvements in efficiency can lead to significant cost 
                savings over time, especially for high-mileage drivers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
