'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Zap, DollarSign, Gauge } from 'lucide-react'

interface ElectricityResult {
  powerConsumption: number
  dailyEnergy: number
  monthlyEnergy: number
  yearlyEnergy: number
  dailyCost: number
  monthlyCost: number
  yearlyCost: number
  carbonFootprint: number
  efficiency: string
}

interface Appliance {
  name: string
  powerRating: number
  dailyUsage: number
  description: string
  category: string
}

const APPLIANCES: Appliance[] = [
  { name: 'Refrigerator', powerRating: 150, dailyUsage: 24, description: 'Standard fridge', category: 'Kitchen' },
  { name: 'Washing Machine', powerRating: 500, dailyUsage: 1, description: 'Front load washer', category: 'Laundry' },
  { name: 'Dishwasher', powerRating: 1800, dailyUsage: 1, description: 'Standard dishwasher', category: 'Kitchen' },
  { name: 'Microwave', powerRating: 1100, dailyUsage: 0.5, description: 'Standard microwave', category: 'Kitchen' },
  { name: 'TV', powerRating: 100, dailyUsage: 4, description: 'LED TV 55"', category: 'Entertainment' },
  { name: 'Computer', powerRating: 200, dailyUsage: 8, description: 'Desktop PC', category: 'Office' },
  { name: 'Air Conditioner', powerRating: 1500, dailyUsage: 8, description: 'Window unit', category: 'HVAC' },
  { name: 'Space Heater', powerRating: 1500, dailyUsage: 6, description: 'Portable heater', category: 'HVAC' },
  { name: 'LED Light Bulb', powerRating: 10, dailyUsage: 6, description: '60W equivalent', category: 'Lighting' },
  { name: 'Gaming Console', powerRating: 150, dailyUsage: 3, description: 'PS5/Xbox', category: 'Entertainment' }
]

const ELECTRICITY_RATES = [
  { region: 'National Average', rate: 0.14, description: 'US average rate' },
  { region: 'California', rate: 0.22, description: 'High cost state' },
  { region: 'Texas', rate: 0.12, description: 'Deregulated market' },
  { region: 'New York', rate: 0.20, description: 'High cost state' },
  { region: 'Florida', rate: 0.12, description: 'Moderate cost' },
  { region: 'Washington', rate: 0.10, description: 'Low cost state' }
]

const EFFICIENCY_TIPS = [
  { tip: 'Use LED bulbs', savings: 75, description: 'Replace incandescent bulbs' },
  { tip: 'Unplug chargers', savings: 10, description: 'When not in use' },
  { tip: 'Energy Star appliances', savings: 30, description: 'Look for efficiency rating' },
  { tip: 'Smart thermostat', savings: 15, description: 'Programmable temperature control' },
  { tip: 'Seal air leaks', savings: 20, description: 'Insulate windows and doors' },
  { tip: 'Use cold water', savings: 25, description: 'For laundry when possible' }
]

export default function ElectricityCalculator() {
  const [appliances, setAppliances] = useState<Array<{ name: string; power: string; usage: string }>>([{ name: '', power: '', usage: '' }])
  const [electricityRate, setElectricityRate] = useState('0.14')
  const [customRate, setCustomRate] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateElectricity = useCallback((): ElectricityResult => {
    const rate = parseFloat(customRate) || parseFloat(electricityRate) || 0.14
    
    let totalPower = 0
    let totalDailyEnergy = 0
    
    appliances.forEach(appliance => {
      const power = parseFloat(appliance.power) || 0
      const usage = parseFloat(appliance.usage) || 0
      
      if (power > 0 && usage > 0) {
        totalPower += power
        totalDailyEnergy += (power * usage) / 1000 // Convert to kWh
      }
    })
    
    const dailyEnergy = totalDailyEnergy
    const monthlyEnergy = dailyEnergy * 30
    const yearlyEnergy = dailyEnergy * 365
    
    const dailyCost = dailyEnergy * rate
    const monthlyCost = monthlyEnergy * rate
    const yearlyCost = yearlyEnergy * rate
    
    // Carbon footprint (average US grid: 0.92 lbs CO2 per kWh)
    const carbonFootprint = yearlyEnergy * 0.92
    
    // Determine efficiency rating
    let efficiency = 'Good'
    if (yearlyEnergy > 5000) efficiency = 'High - Consider efficiency upgrades'
    else if (yearlyEnergy > 3000) efficiency = 'Moderate - Room for improvement'
    else if (yearlyEnergy > 1500) efficiency = 'Good - Efficient usage'
    else efficiency = 'Excellent - Very efficient'

    return {
      powerConsumption: totalPower,
      dailyEnergy,
      monthlyEnergy,
      yearlyEnergy,
      dailyCost,
      monthlyCost,
      yearlyCost,
      carbonFootprint,
      efficiency
    }
  }, [appliances, electricityRate, customRate])

  const handleCalculate = () => {
    const validAppliances = appliances.filter(a => a.name.trim() !== '' && a.power.trim() !== '' && a.usage.trim() !== '')
    if (validAppliances.length > 0) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setAppliances([{ name: '', power: '', usage: '' }])
    setElectricityRate('0.14')
    setCustomRate('')
    setShowResults(false)
  }

  const addAppliance = () => {
    setAppliances([...appliances, { name: '', power: '', usage: '' }])
  }

  const removeAppliance = (index: number) => {
    if (appliances.length > 1) {
      setAppliances(appliances.filter((_, i) => i !== index))
    }
  }

  const updateAppliance = (index: number, field: 'name' | 'power' | 'usage', value: string) => {
    const newAppliances = [...appliances]
    newAppliances[index][field] = value
    setAppliances(newAppliances)
  }

  const handleQuickAppliance = (appliance: Appliance) => {
    const newAppliance = { name: appliance.name, power: appliance.powerRating.toString(), usage: appliance.dailyUsage.toString() }
    setAppliances([...appliances, newAppliance])
  }

  const handleQuickRate = (rate: number) => {
    setElectricityRate(rate.toString())
    setCustomRate('')
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
    const result = calculateElectricity()
    
    const data = `Electricity Calculator Results

Electricity Rate: $${parseFloat(customRate) || parseFloat(electricityRate)} per kWh

Appliances:
${appliances.filter(a => a.name.trim() !== '').map(a => `- ${a.name}: ${a.power}W × ${a.usage}h = ${((parseFloat(a.power) || 0) * (parseFloat(a.usage) || 0) / 1000).toFixed(2)} kWh/day`).join('\n')}

Results:
- Total Power Consumption: ${result.powerConsumption} W
- Daily Energy Usage: ${formatNumber(result.dailyEnergy)} kWh
- Monthly Energy Usage: ${formatNumber(result.monthlyEnergy)} kWh
- Yearly Energy Usage: ${formatNumber(result.yearlyEnergy)} kWh

Cost Analysis:
- Daily Cost: ${formatCurrency(result.dailyCost)}
- Monthly Cost: ${formatCurrency(result.monthlyCost)}
- Yearly Cost: ${formatCurrency(result.yearlyCost)}

Environmental Impact:
- Carbon Footprint: ${formatNumber(result.carbonFootprint)} lbs CO2/year
- Efficiency Rating: ${result.efficiency}

Energy Saving Tips:
- Use LED bulbs to save up to 75% on lighting
- Unplug chargers when not in use
- Choose Energy Star rated appliances
- Use programmable thermostats
- Seal air leaks and improve insulation`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'electricity-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateElectricity()
      
      navigator.share({
        title: 'Electricity Calculator Results',
        text: `Monthly cost: ${formatCurrency(result.monthlyCost)}, Energy: ${formatNumber(result.monthlyEnergy)} kWh`,
        url: window.location.href
      })
    } else {
      const result = calculateElectricity()
      const text = `Electricity: ${formatCurrency(result.monthlyCost)}/month, ${formatNumber(result.monthlyEnergy)} kWh`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateElectricity() : { powerConsumption: 0, dailyEnergy: 0, monthlyEnergy: 0, yearlyEnergy: 0, dailyCost: 0, monthlyCost: 0, yearlyCost: 0, carbonFootprint: 0, efficiency: '' }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Electricity Calculator</h1>
            <p className="text-indigo-100 text-lg">
              Calculate power consumption, energy costs, and environmental impact. 
              Perfect for homeowners, businesses, and energy efficiency planning.
            </p>
          </div>
          <div className="hidden md:block">
            <Zap className="w-16 h-16 text-indigo-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Electricity Rate Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Electricity Rate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {ELECTRICITY_RATES.map((rate, index) => (
              <button
                key={index}
                onClick={() => handleQuickRate(rate.rate)}
                className="p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-sm text-center"
              >
                <div className="font-medium text-indigo-800">{rate.region}</div>
                <div className="text-indigo-600">${rate.rate}/kWh</div>
                <div className="text-xs text-indigo-500">{rate.description}</div>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Rate ($/kWh)
            </label>
            <input
              type="number"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.14"
              min="0.01"
              max="1.00"
              step="0.01"
              aria-label="Custom electricity rate per kilowatt-hour"
            />
          </div>
        </div>

        {/* Quick Appliance Presets */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Appliance Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {APPLIANCES.map((appliance, index) => (
              <button
                key={index}
                onClick={() => handleQuickAppliance(appliance)}
                className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-left"
              >
                <div className="font-semibold text-indigo-800">{appliance.name}</div>
                <div className="text-sm text-indigo-600">{appliance.powerRating}W, {appliance.dailyUsage}h/day</div>
                <div className="text-xs text-indigo-500">{appliance.description}</div>
                <div className="text-xs text-indigo-400 mt-1">{appliance.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Appliance Input Fields */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Appliance Details</h3>
          <div className="space-y-4">
            {appliances.map((appliance, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appliance Name
                  </label>
                  <input
                    type="text"
                    value={appliance.name}
                    onChange={(e) => updateAppliance(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Refrigerator"
                    aria-label={`Appliance ${index + 1} name`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Power Rating (W)
                  </label>
                  <input
                    type="number"
                    value={appliance.power}
                    onChange={(e) => updateAppliance(index, 'power', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="150"
                    min="1"
                    max="10000"
                    step="1"
                    aria-label={`Appliance ${index + 1} power rating in watts`}
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Usage (hours)
                    </label>
                    <input
                      type="number"
                      value={appliance.usage}
                      onChange={(e) => updateAppliance(index, 'usage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="24"
                      min="0"
                      max="24"
                      step="0.5"
                      aria-label={`Appliance ${index + 1} daily usage in hours`}
                    />
                  </div>
                  {appliances.length > 1 && (
                    <button
                      onClick={() => removeAppliance(index)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      aria-label={`Remove appliance ${index + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={addAppliance}
              className="w-full py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors font-medium"
            >
              + Add Another Appliance
            </button>
          </div>
        </div>

        {/* Energy Efficiency Tips */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Energy Efficiency Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EFFICIENCY_TIPS.map((tip, index) => (
              <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="font-semibold text-green-800">{tip.tip}</div>
                <div className="text-sm text-green-600">Save up to {tip.savings}%</div>
                <div className="text-xs text-green-500 mt-1">{tip.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        {appliances.some(a => a.name.trim() !== '' && a.power.trim() !== '' && a.usage.trim() !== '') && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Electricity Usage</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Energy Usage Results */}
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">Energy Usage Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-indigo-700">{result.powerConsumption} W</div>
                  <div className="text-sm text-gray-600">Total Power</div>
                  <div className="text-xs text-indigo-600">Peak consumption</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatNumber(result.dailyEnergy)} kWh</div>
                  <div className="text-sm text-gray-600">Daily Energy</div>
                  <div className="text-xs text-green-600">24-hour usage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.monthlyEnergy)} kWh</div>
                  <div className="text-sm text-gray-600">Monthly Energy</div>
                  <div className="text-xs text-blue-600">30-day average</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatNumber(result.yearlyEnergy)} kWh</div>
                  <div className="text-sm text-gray-600">Yearly Energy</div>
                  <div className="text-xs text-purple-600">Annual total</div>
                </div>
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Daily & Monthly Costs</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Cost:</span>
                      <span className="font-semibold text-green-700">{formatCurrency(result.dailyCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Cost:</span>
                      <span className="font-semibold text-blue-700">{formatCurrency(result.monthlyCost)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Annual & Environmental</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yearly Cost:</span>
                      <span className="font-semibold text-purple-700">{formatCurrency(result.yearlyCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carbon Footprint:</span>
                      <span className="font-semibold text-orange-700">{formatNumber(result.carbonFootprint)} lbs CO2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Efficiency Rating */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Efficiency Analysis</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-700 mb-2">{result.efficiency}</div>
                <div className="text-sm text-gray-600">Based on your total energy consumption</div>
                <div className="text-xs text-gray-500 mt-2">
                  {result.yearlyEnergy > 5000 ? 'Consider upgrading to energy-efficient appliances and implementing energy-saving practices.' :
                   result.yearlyEnergy > 3000 ? 'Your usage is moderate. Look for opportunities to reduce consumption during peak hours.' :
                   result.yearlyEnergy > 1500 ? 'Good energy efficiency! Keep up the good practices.' :
                   'Excellent energy efficiency! You\'re already very energy-conscious.'}
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
            <Info className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Electricity Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This comprehensive electricity calculator helps you understand your power consumption, energy costs, and environmental impact. 
                It calculates daily, monthly, and yearly energy usage based on appliance power ratings and daily usage patterns. 
                The calculator provides cost analysis using current electricity rates and includes carbon footprint calculations. 
                Perfect for energy efficiency planning, budgeting, and environmental awareness.
              </p>
            </div>
          </div>
        </div>
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Electricity Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive electricity calculator helps homeowners, businesses, and energy-conscious individuals 
              understand their power consumption patterns, estimate energy costs, and assess environmental impact. 
              This essential tool provides detailed analysis for energy efficiency planning, cost management, and 
              sustainability assessment.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Power Consumption:</strong> Total watts and kilowatts used</li>
              <li><strong>Energy Usage:</strong> Daily, monthly, and yearly kilowatt-hours</li>
              <li><strong>Cost Analysis:</strong> Electricity expenses across time periods</li>
              <li><strong>Environmental Impact:</strong> Carbon footprint and CO2 emissions</li>
              <li><strong>Efficiency Rating:</strong> Energy consumption assessment</li>
              <li><strong>Appliance Analysis:</strong> Individual device power tracking</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Types</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Energy Consumption</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Daily Usage:</strong> 24-hour energy consumption</li>
                  <li><strong>Monthly Usage:</strong> 30-day energy totals</li>
                  <li><strong>Yearly Usage:</strong> Annual energy consumption</li>
                  <li><strong>Peak Usage:</strong> Maximum power requirements</li>
                  <li><strong>Standby Power:</strong> Phantom load calculations</li>
                  <li><strong>Seasonal Variations:</strong> Usage pattern analysis</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cost Analysis</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Rate Variations:</strong> Different electricity pricing</li>
                  <li><strong>Time-of-Use:</strong> Peak vs. off-peak rates</li>
                  <li><strong>Demand Charges:</strong> Peak power costs</li>
                  <li><strong>Taxes and Fees:</strong> Additional charges</li>
                  <li><strong>Seasonal Rates:</strong> Variable pricing</li>
                  <li><strong>Billing Cycles:</strong> Monthly cost projections</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-1">Power</h5>
                <p className="text-indigo-700 text-sm">Total watts used</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Energy</h5>
                <p className="text-green-700 text-sm">Daily/monthly kWh</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Cost</h5>
                <p className="text-blue-700 text-sm">Monthly expenses</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Impact</h5>
                <p className="text-orange-700 text-sm">Carbon footprint</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Select your electricity rate from preset options or enter a custom rate. Add appliances with their 
              power ratings (watts) and daily usage hours. The calculator automatically computes total consumption, 
              energy costs, and environmental impact. Use the efficiency analysis to identify improvement opportunities.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Electricity Rate Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Rate Components:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Generation costs</li>
                    <li>Transmission fees</li>
                    <li>Distribution charges</li>
                    <li>Regulatory costs</li>
                    <li>Taxes and surcharges</li>
                    <li>Renewable energy credits</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Rate Types:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Fixed rates</li>
                    <li>Variable rates</li>
                    <li>Time-of-use rates</li>
                    <li>Tiered pricing</li>
                    <li>Demand charges</li>
                    <li>Seasonal rates</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Appliance Power Ratings</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Low Power Devices</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>LED Bulbs:</strong> 5-15 watts</li>
                  <li><strong>Phone Chargers:</strong> 5-25 watts</li>
                  <li><strong>Laptops:</strong> 30-100 watts</li>
                  <li><strong>Televisions:</strong> 50-400 watts</li>
                  <li><strong>Refrigerators:</strong> 100-200 watts</li>
                  <li><strong>Microwaves:</strong> 600-1,200 watts</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">High Power Devices</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Space Heaters:</strong> 1,000-1,500 watts</li>
                  <li><strong>Air Conditioners:</strong> 1,000-3,500 watts</li>
                  <li><strong>Electric Dryers:</strong> 2,000-5,000 watts</li>
                  <li><strong>Electric Ranges:</strong> 2,000-5,000 watts</li>
                  <li><strong>Water Heaters:</strong> 3,000-5,500 watts</li>
                  <li><strong>Central AC:</strong> 3,500-5,000 watts</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Energy Efficiency Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Efficiency Ratings</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Excellent:</strong> Under 1,500 kWh/year</li>
                  <li><strong>Good:</strong> 1,500-3,000 kWh/year</li>
                  <li><strong>Moderate:</strong> 3,000-5,000 kWh/year</li>
                  <li><strong>High:</strong> Over 5,000 kWh/year</li>
                  <li><strong>Factors:</strong> Home size, appliances, habits</li>
                  <li><strong>Comparisons:</strong> Regional averages</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Improvement Strategies</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Appliance Upgrades:</strong> Energy Star rated devices</li>
                  <li><strong>Smart Controls:</strong> Programmable thermostats</li>
                  <li><strong>Insulation:</strong> Better thermal performance</li>
                  <li><strong>LED Lighting:</strong> Low-power alternatives</li>
                  <li><strong>Behavior Changes:</strong> Usage habit optimization</li>
                  <li><strong>Renewable Energy:</strong> Solar panel installation</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Environmental Impact</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Carbon Footprint:</strong> CO2 emissions from electricity generation</li>
              <li><strong>Generation Mix:</strong> Coal, natural gas, nuclear, renewable sources</li>
              <li><strong>Emission Factors:</strong> CO2 per kilowatt-hour varies by region</li>
              <li><strong>Renewable Energy:</strong> Solar, wind, hydroelectric power</li>
              <li><strong>Carbon Offsets:</strong> Compensating for emissions</li>
              <li><strong>Sustainability Goals:</strong> Reducing environmental impact</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Cost Optimization Strategies</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Rate Optimization</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Time-of-Use:</strong> Shift usage to off-peak hours</li>
                  <li><strong>Demand Response:</strong> Reduce peak usage</li>
                  <li><strong>Rate Shopping:</strong> Compare utility providers</li>
                  <li><strong>Special Programs:</strong> Energy efficiency incentives</li>
                  <li><strong>Billing Analysis:</strong> Understand rate structures</li>
                  <li><strong>Negotiation:</strong> Business rate optimization</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Usage Optimization</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Peak Shaving:</strong> Reduce high-demand usage</li>
                  <li><strong>Load Balancing:</strong> Distribute usage evenly</li>
                  <li><strong>Efficiency Upgrades:</strong> High-efficiency appliances</li>
                  <li><strong>Smart Scheduling:</strong> Automated usage control</li>
                  <li><strong>Energy Audits:</strong> Professional assessments</li>
                  <li><strong>Monitoring Systems:</strong> Real-time usage tracking</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Electricity Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Realistic Hours:</strong> Actual daily usage patterns</li>
              <li><strong>Include Standby Power:</strong> Phantom loads and standby modes</li>
              <li><strong>Account for Seasons:</strong> Heating and cooling variations</li>
              <li><strong>Consider Peak Times:</strong> High-demand periods</li>
              <li><strong>Update Regularly:</strong> Recalculate as usage changes</li>
              <li><strong>Compare Scenarios:</strong> Analyze different usage patterns</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Electricity Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Underestimating Usage:</strong> Not accounting for all devices</li>
              <li><strong>Ignoring Standby Power:</strong> Phantom load calculations</li>
              <li><strong>Using Average Rates:</strong> Not considering rate variations</li>
              <li><strong>Forgetting Seasonal Changes:</strong> Heating/cooling variations</li>
              <li><strong>Ignoring Peak Charges:</strong> Demand charge implications</li>
              <li><strong>Not Monitoring Usage:</strong> Lack of real-time tracking</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Electricity Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Power Factor:</strong> Efficiency of power usage</li>
              <li><strong>Harmonic Distortion:</strong> Non-linear load effects</li>
              <li><strong>Voltage Drop:</strong> Line loss calculations</li>
              <li><strong>Demand Charges:</strong> Peak power costs</li>
              <li><strong>Load Factor:</strong> Average vs. peak usage</li>
              <li><strong>Power Quality:</strong> Voltage and frequency stability</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When analyzing your electricity usage, focus on the biggest energy consumers first - typically 
                heating, cooling, and major appliances. Small changes to these high-usage devices can have a 
                significant impact on your overall consumption and costs. Use this calculator to identify your 
                energy hotspots and develop targeted strategies for improvement. Remember that energy efficiency 
                is often more cost-effective than generating new power, and the environmental benefits extend 
                beyond just cost savings. Consider implementing a combination of behavioral changes, efficiency 
                upgrades, and smart controls for maximum impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
