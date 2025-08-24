'use client'

import React, { useState, useCallback } from 'react'
import { Square, Calculator, TrendingUp, Share2, Download, Printer, Ruler } from 'lucide-react'
import ShareModal from '../ShareModal'

interface FlooringType {
  name: string
  key: string
  pricePerSqM: number
  wasteFactor: number
  description: string
}

const flooringTypes: FlooringType[] = [
  { name: 'Hardwood', key: 'hardwood', pricePerSqM: 45, wasteFactor: 15, description: 'Solid wood flooring' },
  { name: 'Laminate', key: 'laminate', pricePerSqM: 25, wasteFactor: 10, description: 'Engineered wood look' },
  { name: 'Vinyl Plank', key: 'vinyl', pricePerSqM: 35, wasteFactor: 8, description: 'Waterproof synthetic' },
  { name: 'Ceramic Tile', key: 'ceramic', pricePerSqM: 40, wasteFactor: 12, description: 'Durable ceramic' },
  { name: 'Porcelain Tile', key: 'porcelain', pricePerSqM: 55, wasteFactor: 12, description: 'Premium ceramic' },
  { name: 'Carpet', key: 'carpet', pricePerSqM: 30, wasteFactor: 5, description: 'Soft textile flooring' },
  { name: 'Bamboo', key: 'bamboo', pricePerSqM: 50, wasteFactor: 10, description: 'Eco-friendly option' },
  { name: 'Cork', key: 'cork', pricePerSqM: 35, wasteFactor: 8, description: 'Natural and warm' }
]

interface Room {
  name: string
  length: number
  width: number
  area: number
}

export default function FlooringCalculator() {
  const [rooms, setRooms] = useState<Room[]>([
    { name: 'Living Room', length: 0, width: 0, area: 0 }
  ])
  const [selectedFlooring, setSelectedFlooring] = useState(0)
  const [installationCost, setInstallationCost] = useState(25)
  const [underlayment, setUnderlayment] = useState(8)
  const [showShareModal, setShowShareModal] = useState(false)

  const calculateRoomArea = useCallback((length: number, width: number): number => {
    return length * width
  }, [])

  const updateRoomArea = useCallback((index: number, length: number, width: number) => {
    const newRooms = [...rooms]
    newRooms[index] = {
      ...newRooms[index],
      length,
      width,
      area: calculateRoomArea(length, width)
    }
    setRooms(newRooms)
  }, [rooms, calculateRoomArea])

  const addRoom = useCallback(() => {
    setRooms([...rooms, { name: `Room ${rooms.length + 1}`, length: 0, width: 0, area: 0 }])
  }, [rooms])

  const removeRoom = useCallback((index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index))
    }
  }, [rooms])

  const updateRoomName = useCallback((index: number, name: string) => {
    const newRooms = [...rooms]
    newRooms[index] = { ...newRooms[index], name }
    setRooms(newRooms)
  }, [rooms])

  const getTotalArea = useCallback((): number => {
    return rooms.reduce((total, room) => total + room.area, 0)
  }, [rooms])

  const calculateMaterials = useCallback(() => {
    const totalArea = getTotalArea()
    const flooring = flooringTypes[selectedFlooring]
    
    if (!flooring || totalArea === 0) return null

    const wasteArea = totalArea * (flooring.wasteFactor / 100)
    const totalAreaWithWaste = totalArea + wasteArea
    const flooringCost = totalAreaWithWaste * flooring.pricePerSqM
    const underlaymentCost = totalArea * underlayment
    const installationCostTotal = totalArea * installationCost
    const totalCost = flooringCost + underlaymentCost + installationCostTotal

    return {
      totalArea: Math.round(totalArea * 100) / 100,
      wasteArea: Math.round(wasteArea * 100) / 100,
      totalAreaWithWaste: Math.round(totalAreaWithWaste * 100) / 100,
      flooringCost: Math.round(flooringCost * 100) / 100,
      underlaymentCost: Math.round(underlaymentCost * 100) / 100,
      installationCost: Math.round(installationCostTotal * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100
    }
  }, [getTotalArea, selectedFlooring, underlayment, installationCost])

  const handleShare = () => setShowShareModal(true)
  const handlePrint = () => window.print()
  const handleDownload = () => {
    const materials = calculateMaterials()
    
    const data = `Flooring Calculator Results\n\nFlooring: ${flooringTypes[selectedFlooring].name}\nTotal Area: ${materials?.totalArea} m²\nWaste Area: ${materials?.wasteArea} m²\nTotal with Waste: ${materials?.totalAreaWithWaste} m²\n\nCosts:\nFlooring: $${materials?.flooringCost}\nUnderlayment: $${materials?.underlaymentCost}\nInstallation: $${materials?.installationCost}\nTotal: $${materials?.totalCost}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flooring-calculator-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const materials = calculateMaterials()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Square className="w-16 h-16 mr-4 text-green-600" />
            Flooring Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate flooring materials, costs, and waste for multiple rooms. Get accurate estimates for hardwood, laminate, tile, and other flooring types.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-green-600" />
                Flooring Type
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flooring Material</label>
                  <select
                    value={selectedFlooring}
                    onChange={(e) => setSelectedFlooring(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    title="Select the flooring material"
                    aria-label="Flooring material"
                  >
                    {flooringTypes.map((flooring, index) => (
                      <option key={index} value={index}>
                        {flooring.name} - ${flooring.pricePerSqM}/m²
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {flooringTypes[selectedFlooring]?.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Installation Cost ($/m²)</label>
                  <input
                    type="number"
                    value={installationCost}
                    onChange={(e) => setInstallationCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    min="0"
                    step="1"
                    title="Enter installation cost per square meter"
                    aria-label="Installation cost per square meter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Underlayment ($/m²)</label>
                  <input
                    type="number"
                    value={underlayment}
                    onChange={(e) => setUnderlayment(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    min="0"
                    step="1"
                    title="Enter underlayment cost per square meter"
                    aria-label="Underlayment cost per square meter"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Quick Examples</h3>
                <button
                  onClick={addRoom}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  title="Add a new room"
                  aria-label="Add a new room"
                >
                  + Add Room
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setRooms([
                      { name: 'Living Room', length: 5, width: 4, area: 20 },
                      { name: 'Bedroom', length: 4, width: 3, area: 12 },
                      { name: 'Kitchen', length: 3, width: 3, area: 9 }
                    ])
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: 3 rooms"
                  aria-label="Set example: 3 rooms"
                >
                  🏠 3 Room Example (Living, Bedroom, Kitchen)
                </button>
                <button
                  onClick={() => {
                    setRooms([
                      { name: 'Open Plan', length: 8, width: 6, area: 48 }
                    ])
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: large open plan"
                  aria-label="Set example: large open plan"
                >
                  🏗️ Large Open Plan (8m × 6m)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Ruler className="w-6 h-6 mr-2 text-green-600" />
                  Room Dimensions
                </h2>
                
                <div className="space-y-4">
                  {rooms.map((room, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => updateRoomName(index, e.target.value)}
                          className="text-lg font-semibold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-green-200 rounded px-2"
                          title="Edit room name"
                          aria-label="Edit room name"
                        />
                        {rooms.length > 1 && (
                          <button
                            onClick={() => removeRoom(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            title="Remove this room"
                            aria-label="Remove this room"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
                          <input
                            type="number"
                            value={room.length || ''}
                            onChange={(e) => updateRoomArea(index, parseFloat(e.target.value) || 0, room.width)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            title="Enter room length in meters"
                            aria-label="Room length in meters"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Width (m)</label>
                          <input
                            type="number"
                            value={room.width || ''}
                            onChange={(e) => updateRoomArea(index, room.length, parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            title="Enter room width in meters"
                            aria-label="Room width in meters"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3 text-right">
                        <span className="text-sm text-gray-600">Area: </span>
                        <span className="font-semibold text-green-600">{room.area.toFixed(2)} m²</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                  Calculation Results
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Area Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-600">Total Area:</span>
                        <span className="font-semibold text-green-800">{materials?.totalArea || 0} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Waste Area:</span>
                        <span className="font-semibold text-green-800">{materials?.wasteArea || 0} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Total with Waste:</span>
                        <span className="font-semibold text-green-800">{materials?.totalAreaWithWaste || 0} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Flooring Type:</span>
                        <span className="font-semibold text-green-800">{flooringTypes[selectedFlooring]?.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4">Cost Breakdown</h3>
                    {materials ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-emerald-600">Flooring:</span>
                          <span className="font-semibold text-emerald-800">${materials.flooringCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-600">Underlayment:</span>
                          <span className="font-semibold text-emerald-800">${materials.underlaymentCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-600">Installation:</span>
                          <span className="font-semibold text-emerald-800">${materials.installationCost}</span>
                        </div>
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between">
                            <span className="text-emerald-800 font-semibold">Total Cost:</span>
                            <span className="text-emerald-800 font-bold text-lg">${materials.totalCost}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-emerald-600">Enter room dimensions to calculate costs</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Waste factor accounts for cuts, pattern matching, and installation errors</li>
                    <li>• Consider buying extra material for future repairs</li>
                    <li>• Installation costs vary by region and complexity</li>
                    <li>• Underlayment improves comfort and extends flooring life</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share flooring calculator results"
                  aria-label="Share flooring calculator results"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download results as text file"
                  aria-label="Download flooring calculator results"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Print flooring calculator results"
                  aria-label="Print flooring calculator results"
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
            expression: `${flooringTypes[selectedFlooring]?.name} Flooring`,
            result: `${materials?.totalArea} m² - $${materials?.totalCost} total cost`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}
