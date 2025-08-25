'use client'

import React, { useState, useCallback } from 'react'
import { Zap, Calculator, TrendingUp, Share2, Download, Printer, Plus, Trash2 } from 'lucide-react'
import ShareModal from '../ShareModal'

interface ElectricalAppliance {
  name: string
  watts: number
  hours: number
  quantity: number
}

const commonAppliances: ElectricalAppliance[] = [
  { name: 'LED Light Bulb', watts: 9, hours: 4, quantity: 1 },
  { name: 'Refrigerator', watts: 150, hours: 24, quantity: 1 },
  { name: 'Microwave', watts: 1100, hours: 0.5, quantity: 1 },
  { name: 'Coffee Maker', watts: 900, hours: 0.25, quantity: 1 },
  { name: 'Toaster', watts: 850, hours: 0.1, quantity: 1 },
  { name: 'Dishwasher', watts: 1800, hours: 1, quantity: 1 },
  { name: 'Washing Machine', watts: 500, hours: 1, quantity: 1 },
  { name: 'Dryer', watts: 3000, hours: 1, quantity: 1 },
  { name: 'TV (LED)', watts: 100, hours: 4, quantity: 1 },
  { name: 'Computer', watts: 200, hours: 6, quantity: 1 },
  { name: 'Phone Charger', watts: 5, hours: 2, quantity: 1 },
  { name: 'Air Conditioner', watts: 1500, hours: 8, quantity: 1 }
]

export default function ElectricalCalculator() {
  const [appliances, setAppliances] = useState<ElectricalAppliance[]>([
    { name: 'LED Light Bulb', watts: 9, hours: 4, quantity: 1 }
  ])
  const [voltage, setVoltage] = useState(120)
  const [powerFactor, setPowerFactor] = useState(0.9)
  const [showShareModal, setShowShareModal] = useState(false)

  const addAppliance = useCallback(() => {
    setAppliances([...appliances, { name: 'Custom Appliance', watts: 100, hours: 1, quantity: 1 }])
  }, [appliances])

  const removeAppliance = useCallback((index: number) => {
    if (appliances.length > 1) {
      setAppliances(appliances.filter((_, i) => i !== index))
    }
  }, [appliances])

  const updateAppliance = useCallback((index: number, field: keyof ElectricalAppliance, value: string | number) => {
    const newAppliances = [...appliances]
    newAppliances[index] = { ...newAppliances[index], [field]: value }
    setAppliances(newAppliances)
  }, [appliances])

  const addCommonAppliance = useCallback((appliance: ElectricalAppliance) => {
    setAppliances([...appliances, { ...appliance }])
  }, [appliances])

  const calculateLoads = useCallback(() => {
    let totalWatts = 0
    let totalKWh = 0
    let maxWatts = 0
    let totalAmps = 0

    appliances.forEach(appliance => {
      const watts = appliance.watts * appliance.quantity
      const kwh = (watts * appliance.hours) / 1000
      
      totalWatts += watts
      totalKWh += kwh
      maxWatts = Math.max(maxWatts, watts)
      totalAmps += (watts / voltage) * appliance.quantity
    })

    const powerFactorAmps = totalAmps / powerFactor
    const monthlyKWh = totalKWh * 30
    const estimatedMonthlyCost = monthlyKWh * 0.12 // $0.12 per kWh average

    return {
      totalWatts: Math.round(totalWatts),
      totalKWh: Math.round(totalKWh * 100) / 100,
      maxWatts: Math.round(maxWatts),
      totalAmps: Math.round(totalAmps * 100) / 100,
      powerFactorAmps: Math.round(powerFactorAmps * 100) / 100,
      monthlyKWh: Math.round(monthlyKWh * 100) / 100,
      estimatedMonthlyCost: Math.round(estimatedMonthlyCost * 100) / 100
    }
  }, [appliances, voltage, powerFactor])

  const handleShare = () => setShowShareModal(true)
  const handlePrint = () => window.print()
  const handleDownload = () => {
    const loads = calculateLoads()
    
    const data = `Electrical Load Calculator Results\n\nVoltage: ${voltage}V\nPower Factor: ${powerFactor}\n\nLoad Summary:\nTotal Watts: ${loads.totalWatts}W\nTotal kWh/day: ${loads.totalKWh}kWh\nMax Single Load: ${loads.maxWatts}W\nTotal Amps: ${loads.totalAmps}A\nPower Factor Amps: ${loads.powerFactorAmps}A\n\nMonthly Usage:\nMonthly kWh: ${loads.monthlyKWh}kWh\nEstimated Cost: $${loads.estimatedMonthlyCost}\n\nAppliances:\n${appliances.map(app => `${app.name}: ${app.watts}W × ${app.hours}h × ${app.quantity} = ${(app.watts * app.hours * app.quantity / 1000).toFixed(2)}kWh/day`).join('\n')}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'electrical-calculator-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const loads = calculateLoads()

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Zap className="w-16 h-16 mr-4 text-yellow-600" />
            Electrical Load Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate electrical loads, power consumption, and energy costs for your home or business. Track daily usage and estimate monthly electricity bills.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-yellow-600" />
                Electrical Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voltage (V)</label>
                  <select
                    value={voltage}
                    onChange={(e) => setVoltage(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                    title="Select the voltage system"
                    aria-label="Voltage system"
                  >
                    <option value={120}>120V (US Standard)</option>
                    <option value={230}>230V (European Standard)</option>
                    <option value={240}>240V (UK Standard)</option>
                    <option value={110}>110V (Japan Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Power Factor</label>
                  <input
                    type="number"
                    value={powerFactor}
                    onChange={(e) => setPowerFactor(parseFloat(e.target.value) || 0.9)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                    min="0.5"
                    max="1"
                    step="0.05"
                    title="Enter the power factor (0.5 to 1.0)"
                    aria-label="Power factor"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical: 0.9 for residential</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Appliances</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {commonAppliances.map((appliance, index) => (
                  <button
                    key={index}
                    onClick={() => addCommonAppliance(appliance)}
                    className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                    title={`Add ${appliance.name} to your list`}
                    aria-label={`Add ${appliance.name} to your list`}
                  >
                    <div className="font-medium">{appliance.name}</div>
                    <div className="text-xs text-gray-600">
                      {appliance.watts}W • {appliance.hours}h • {appliance.quantity}×
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Quick Examples</h3>
                <button
                  onClick={addAppliance}
                  className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                  title="Add a custom appliance"
                  aria-label="Add a custom appliance"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setAppliances([
                      { name: 'LED Light Bulb', watts: 9, hours: 4, quantity: 6 },
                      { name: 'Refrigerator', watts: 150, hours: 24, quantity: 1 },
                      { name: 'TV (LED)', watts: 100, hours: 4, quantity: 1 },
                      { name: 'Computer', watts: 200, hours: 6, quantity: 1 }
                    ])
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: basic home setup"
                  aria-label="Set example: basic home setup"
                >
                  🏠 Basic Home Setup
                </button>
                <button
                  onClick={() => {
                    setAppliances([
                      { name: 'LED Light Bulb', watts: 9, hours: 6, quantity: 12 },
                      { name: 'Refrigerator', watts: 150, hours: 24, quantity: 2 },
                      { name: 'Air Conditioner', watts: 1500, hours: 8, quantity: 2 },
                      { name: 'Washing Machine', watts: 500, hours: 1, quantity: 1 },
                      { name: 'Dryer', watts: 3000, hours: 1, quantity: 1 }
                    ])
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: large home setup"
                  aria-label="Set example: large home setup"
                >
                  🏗️ Large Home Setup
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-yellow-600" />
                  Appliance List
                </h2>
                
                <div className="space-y-4">
                  {appliances.map((appliance, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={appliance.name}
                          onChange={(e) => updateAppliance(index, 'name', e.target.value)}
                          className="text-lg font-semibold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-yellow-200 rounded px-2"
                          title="Edit appliance name"
                          aria-label="Edit appliance name"
                        />
                        {appliances.length > 1 && (
                          <button
                            onClick={() => removeAppliance(index)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove this appliance"
                            aria-label="Remove this appliance"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Watts</label>
                          <input
                            type="number"
                            value={appliance.watts}
                            onChange={(e) => updateAppliance(index, 'watts', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                            placeholder="0"
                            min="0"
                            title="Enter power consumption in watts"
                            aria-label="Power consumption in watts"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hours/Day</label>
                          <input
                            type="number"
                            value={appliance.hours}
                            onChange={(e) => updateAppliance(index, 'hours', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                            placeholder="0"
                            min="0"
                            step="0.1"
                            title="Enter daily usage hours"
                            aria-label="Daily usage hours"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                          <input
                            type="number"
                            value={appliance.quantity}
                            onChange={(e) => updateAppliance(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                            placeholder="1"
                            min="1"
                            title="Enter quantity of this appliance"
                            aria-label="Quantity of appliance"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3 text-right">
                        <span className="text-sm text-gray-600">Daily Usage: </span>
                        <span className="font-semibold text-yellow-600">
                          {((appliance.watts * appliance.hours * appliance.quantity) / 1000).toFixed(2)} kWh
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-600" />
                  Load Summary
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4">Power & Energy</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Total Watts:</span>
                        <span className="font-semibold text-yellow-800">{loads.totalWatts}W</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Daily kWh:</span>
                        <span className="font-semibold text-yellow-800">{loads.totalKWh} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Max Single Load:</span>
                        <span className="font-semibold text-yellow-800">{loads.maxWatts}W</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Monthly kWh:</span>
                        <span className="font-semibold text-yellow-800">{loads.monthlyKWh} kWh</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-amber-800 mb-4">Current & Cost</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-amber-600">Total Amps:</span>
                        <span className="font-semibold text-amber-800">{loads.totalAmps}A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-600">Power Factor Amps:</span>
                        <span className="font-semibold text-amber-800">{loads.powerFactorAmps}A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-600">Voltage:</span>
                        <span className="font-semibold text-amber-800">{voltage}V</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-600">Est. Monthly Cost:</span>
                        <span className="font-semibold text-amber-800">${loads.estimatedMonthlyCost}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Circuit breakers should be rated higher than your calculated load</li>
                    <li>• Consider peak usage times when sizing electrical systems</li>
                    <li>• Energy-efficient appliances can significantly reduce costs</li>
                    <li>• Monitor seasonal variations in electrical usage</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share electrical calculator results"
                  aria-label="Share electrical calculator results"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download results as text file"
                  aria-label="Download electrical calculator results"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Print electrical calculator results"
                  aria-label="Print electrical calculator results"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Electrical Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive electrical calculator helps homeowners, electricians, and engineers 
              analyze electrical loads, calculate power consumption, and estimate energy costs. This 
              essential tool provides detailed electrical analysis for residential and commercial 
              applications, helping optimize electrical systems and reduce energy expenses.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Power Consumption:</strong> Watts, kilowatts, and kilowatt-hours</li>
              <li><strong>Electrical Loads:</strong> Current draw and circuit requirements</li>
              <li><strong>Energy Costs:</strong> Monthly and annual electricity expenses</li>
              <li><strong>Circuit Analysis:</strong> Breaker sizing and load distribution</li>
              <li><strong>Efficiency Metrics:</strong> Power factor and energy optimization</li>
              <li><strong>Appliance Management:</strong> Individual device power tracking</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Types</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Power Calculations</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Watts:</strong> Instantaneous power consumption</li>
                  <li><strong>Kilowatts:</strong> Power in thousands of watts</li>
                  <li><strong>Kilowatt-hours:</strong> Energy consumption over time</li>
                  <li><strong>Daily Usage:</strong> 24-hour energy consumption</li>
                  <li><strong>Monthly Usage:</strong> 30-day energy totals</li>
                  <li><strong>Annual Usage:</strong> Yearly energy consumption</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Electrical Analysis</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Current Draw:</strong> Amperage requirements</li>
                  <li><strong>Circuit Loading:</strong> Breaker capacity analysis</li>
                  <li><strong>Power Factor:</strong> Efficiency of power usage</li>
                  <li><strong>Voltage Drop:</strong> Line loss calculations</li>
                  <li><strong>Load Balancing:</strong> Circuit distribution</li>
                  <li><strong>Safety Factors:</strong> Overload protection</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-1">Power</h5>
                <p className="text-yellow-700 text-sm">Watts and kilowatts</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Energy</h5>
                <p className="text-blue-700 text-sm">Daily/monthly kWh</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <h5 className="font-semibold text-amber-800 mb-1">Current</h5>
                <p className="text-amber-700 text-sm">Amperage draw</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Cost</h5>
                <p className="text-green-700 text-sm">Monthly expenses</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Add appliances with their power ratings (watts), daily usage hours, and quantities. 
              The calculator automatically computes total power consumption, energy usage, current 
              requirements, and estimated monthly costs. Use common appliance presets or create custom 
              entries for specific devices.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Electrical Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Power Relationships:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Power (W) = Voltage (V) × Current (A)</li>
                    <li>Energy (kWh) = Power (kW) × Time (h)</li>
                    <li>Current (A) = Power (W) ÷ Voltage (V)</li>
                    <li>Power Factor = Real Power ÷ Apparent Power</li>
                    <li>Efficiency = Output Power ÷ Input Power</li>
                    <li>Cost = Energy (kWh) × Rate ($/kWh)</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Electrical Units:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Watt (W): Unit of power</li>
                    <li>Kilowatt (kW): 1,000 watts</li>
                    <li>Kilowatt-hour (kWh): Unit of energy</li>
                    <li>Ampere (A): Unit of current</li>
                    <li>Volt (V): Unit of voltage</li>
                    <li>Power Factor: Efficiency ratio</li>
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
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Electrical System Design</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Circuit Planning</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Load Calculation:</strong> Total power requirements</li>
                  <li><strong>Breaker Sizing:</strong> Circuit protection rating</li>
                  <li><strong>Wire Gauge:</strong> Conductor size selection</li>
                  <li><strong>Voltage Drop:</strong> Line loss analysis</li>
                  <li><strong>Load Balancing:</strong> Circuit distribution</li>
                  <li><strong>Safety Factors:</strong> Overload protection</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Energy Management</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Peak Usage:</strong> Maximum demand periods</li>
                  <li><strong>Load Shifting:</strong> Off-peak operation</li>
                  <li><strong>Efficiency Upgrades:</strong> Energy-saving devices</li>
                  <li><strong>Smart Controls:</strong> Automated management</li>
                  <li><strong>Monitoring Systems:</strong> Real-time tracking</li>
                  <li><strong>Cost Optimization:</strong> Rate-based usage</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Power Factor Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Definition:</strong> Ratio of real power to apparent power</li>
              <li><strong>Ideal Value:</strong> 1.0 (100% efficient)</li>
              <li><strong>Typical Values:</strong> 0.8-0.95 for most loads</li>
              <li><strong>Inductive Loads:</strong> Motors, transformers, fluorescent lights</li>
              <li><strong>Capacitive Loads:</strong> Capacitors, some electronics</li>
              <li><strong>Correction Methods:</strong> Capacitor banks, power factor controllers</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Energy Cost Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cost Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Electricity Rate:</strong> Cost per kilowatt-hour</li>
                  <li><strong>Usage Patterns:</strong> Daily and seasonal variations</li>
                  <li><strong>Time-of-Use:</strong> Peak vs. off-peak rates</li>
                  <li><strong>Demand Charges:</strong> Peak power costs</li>
                  <li><strong>Taxes and Fees:</strong> Additional charges</li>
                  <li><strong>Rate Changes:</strong> Seasonal adjustments</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Savings Strategies</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Energy Efficiency:</strong> High-efficiency appliances</li>
                  <li><strong>Load Management:</strong> Off-peak operation</li>
                  <li><strong>Smart Thermostats:</strong> Automated control</li>
                  <li><strong>LED Lighting:</strong> Low-power alternatives</li>
                  <li><strong>Insulation:</strong> Reduced heating/cooling needs</li>
                  <li><strong>Renewable Energy:</strong> Solar and wind power</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Electrical Safety Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Circuit Overloading:</strong> Never exceed breaker capacity</li>
              <li><strong>Wire Sizing:</strong> Use appropriate conductor sizes</li>
              <li><strong>Grounding:</strong> Proper electrical grounding</li>
              <li><strong>Arc Fault Protection:</strong> AFCI breakers for bedrooms</li>
              <li><strong>GFCI Protection:</strong> Ground fault protection for wet areas</li>
              <li><strong>Professional Installation:</strong> Hire licensed electricians</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Electrical Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Realistic Hours:</strong> Actual daily usage patterns</li>
              <li><strong>Consider Seasonal Changes:</strong> Heating and cooling variations</li>
              <li><strong>Account for Standby Power:</strong> Phantom loads and standby modes</li>
              <li><strong>Include All Devices:</strong> Don't forget small appliances</li>
              <li><strong>Update Regularly:</strong> Recalculate as usage changes</li>
              <li><strong>Compare Scenarios:</strong> Analyze different usage patterns</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Electrical Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Underestimating Usage:</strong> Not accounting for all devices</li>
              <li><strong>Ignoring Power Factor:</strong> Not considering efficiency</li>
              <li><strong>Overloading Circuits:</strong> Exceeding breaker capacity</li>
              <li><strong>Poor Load Distribution:</strong> Uneven circuit loading</li>
              <li><strong>Ignoring Safety Codes:</strong> Not following electrical standards</li>
              <li><strong>DIY Electrical Work:</strong> Attempting complex installations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Electrical Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Three-Phase Power:</strong> Commercial and industrial systems</li>
              <li><strong>Harmonic Distortion:</strong> Non-linear load effects</li>
              <li><strong>Power Quality:</strong> Voltage and frequency stability</li>
              <li><strong>Demand Response:</strong> Load reduction programs</li>
              <li><strong>Microgrids:</strong> Local power generation</li>
              <li><strong>Smart Grid Technology:</strong> Advanced power management</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When analyzing electrical loads, always include a safety margin of 20-25% above your 
                calculated requirements. This accounts for future additions, peak usage periods, and 
                ensures your electrical system can handle unexpected loads safely. Remember that 
                continuous loads (running 3+ hours) should not exceed 80% of circuit capacity. Use 
                this calculator to identify energy-intensive appliances and develop strategies to 
                reduce your electrical consumption and costs. Consider upgrading to energy-efficient 
                devices and implementing smart controls for significant long-term savings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculation={{
            expression: `${appliances.length} appliances`,
            result: `${loads.totalWatts}W - ${loads.totalKWh}kWh/day - $${loads.estimatedMonthlyCost}/month`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}
