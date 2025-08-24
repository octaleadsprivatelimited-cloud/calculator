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

        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Back to all calculators"
            aria-label="Back to all calculators"
          >
            <Calculator className="w-5 h-5" />
            Back to All Calculators
          </a>
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
