'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Square, Ruler, Home } from 'lucide-react'

interface AreaResult {
  squareFeet: number
  squareMeters: number
  squareYards: number
  acres: number
  cost: number
}

interface Room {
  id: string
  name: string
  shape: 'rectangle' | 'circle' | 'triangle' | 'lshape'
  dimensions: {
    length?: number
    width?: number
    radius?: number
    base?: number
    height?: number
    l1?: number
    l2?: number
    w1?: number
    w2?: number
  }
  area: number
}

const SHAPE_OPTIONS = [
  { value: 'rectangle', label: 'Rectangle', icon: Square },
  { value: 'circle', label: 'Circle', icon: Square },
  { value: 'triangle', label: 'Triangle', icon: Square },
  { value: 'lshape', label: 'L-Shape', icon: Square }
]

const COMMON_ROOM_SIZES = [
  { name: 'Small Bedroom', length: 10, width: 12 },
  { name: 'Master Bedroom', length: 14, width: 16 },
  { name: 'Living Room', length: 16, width: 20 },
  { name: 'Kitchen', length: 12, width: 15 },
  { name: 'Bathroom', length: 8, width: 10 },
  { name: 'Dining Room', length: 12, width: 14 }
]

export default function SquareFootageCalculator() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [costPerSqFt, setCostPerSqFt] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateArea = useCallback((room: Room): number => {
    const { shape, dimensions } = room
    
    switch (shape) {
      case 'rectangle':
        return (dimensions.length || 0) * (dimensions.width || 0)
      case 'circle':
        return Math.PI * Math.pow(dimensions.radius || 0, 2)
      case 'triangle':
        return 0.5 * (dimensions.base || 0) * (dimensions.height || 0)
      case 'lshape':
        const area1 = (dimensions.l1 || 0) * (dimensions.w1 || 0)
        const area2 = (dimensions.l2 || 0) * (dimensions.w2 || 0)
        return area1 + area2
      default:
        return 0
    }
  }, [])

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: `Room ${rooms.length + 1}`,
      shape: 'rectangle',
      dimensions: { length: 0, width: 0 },
      area: 0
    }
    setRooms([...rooms, newRoom])
  }

  const removeRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id))
  }

  const updateRoom = (id: string, field: keyof Room, value: any) => {
    setRooms(rooms.map(room => {
      if (room.id === id) {
        const updatedRoom = { ...room, [field]: value }
        updatedRoom.area = calculateArea(updatedRoom)
        return updatedRoom
      }
      return room
    }))
  }

  const updateRoomDimension = (id: string, dimension: string, value: number) => {
    setRooms(rooms.map(room => {
      if (room.id === id) {
        const updatedRoom = {
          ...room,
          dimensions: { ...room.dimensions, [dimension]: value }
        }
        updatedRoom.area = calculateArea(updatedRoom)
        return updatedRoom
      }
      return room
    }))
  }

  const calculateTotalArea = useCallback((): AreaResult => {
    const totalSqFt = rooms.reduce((sum, room) => sum + room.area, 0)
    const sqMeters = totalSqFt * 0.092903
    const sqYards = totalSqFt * 0.111111
    const acres = totalSqFt / 43560
    const cost = totalSqFt * (parseFloat(costPerSqFt) || 0)

    return {
      squareFeet: totalSqFt,
      squareMeters: sqMeters,
      squareYards: sqYards,
      acres: acres,
      cost: cost
    }
  }, [rooms, costPerSqFt])

  const handleCalculate = () => {
    if (rooms.length > 0) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setRooms([])
    setCostPerSqFt('')
    setShowResults(false)
  }

  const handleQuickRoom = (roomSize: { name: string, length: number, width: number }) => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: roomSize.name,
      shape: 'rectangle',
      dimensions: { length: roomSize.length, width: roomSize.width },
      area: roomSize.length * roomSize.width
    }
    setRooms([...rooms, newRoom])
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculateTotalArea()
    
    const data = `Square Footage Calculator Results

Rooms:
${rooms.map((room, index) => 
  `${room.name}: ${formatNumber(room.area)} sq ft (${room.shape})`
).join('\n')}

Total Results:
- Square Feet: ${formatNumber(result.squareFeet)}
- Square Meters: ${formatNumber(result.squareMeters)}
- Square Yards: ${formatNumber(result.sqYards)}
- Acres: ${formatNumber(result.acres)}
${costPerSqFt ? `- Total Cost: $${formatNumber(result.cost)}` : ''}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'square-footage-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateTotalArea()
      
      navigator.share({
        title: 'Square Footage Calculator Results',
        text: `Total area: ${formatNumber(result.squareFeet)} sq ft`,
        url: window.location.href
      })
    } else {
      const result = calculateTotalArea()
      const text = `Square Footage: ${formatNumber(result.squareFeet)} sq ft`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateTotalArea() : { squareFeet: 0, squareMeters: 0, squareYards: 0, acres: 0, cost: 0 }

  const renderDimensionInputs = (room: Room) => {
    const { shape, dimensions } = room
    
    switch (shape) {
      case 'rectangle':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Length (ft)</label>
              <input
                type="number"
                value={dimensions.length || ''}
                onChange={(e) => updateRoomDimension(room.id, 'length', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Width (ft)</label>
              <input
                type="number"
                value={dimensions.width || ''}
                onChange={(e) => updateRoomDimension(room.id, 'width', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        )
      
      case 'circle':
        return (
          <div>
            <label className="block text-xs text-gray-600 mb-1">Radius (ft)</label>
            <input
              type="number"
              value={dimensions.radius || ''}
              onChange={(e) => updateRoomDimension(room.id, 'radius', parseFloat(e.target.value) || 0)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
        )
      
      case 'triangle':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Base (ft)</label>
              <input
                type="number"
                value={dimensions.base || ''}
                onChange={(e) => updateRoomDimension(room.id, 'base', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Height (ft)</label>
              <input
                type="number"
                value={dimensions.height || ''}
                onChange={(e) => updateRoomDimension(room.id, 'height', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        )
      
      case 'lshape':
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">L1 (ft)</label>
              <input
                type="number"
                value={dimensions.l1 || ''}
                onChange={(e) => updateRoomDimension(room.id, 'l1', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">W1 (ft)</label>
              <input
                type="number"
                value={dimensions.w1 || ''}
                onChange={(e) => updateRoomDimension(room.id, 'w1', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">L2 (ft)</label>
              <input
                type="number"
                value={dimensions.l2 || ''}
                onChange={(e) => updateRoomDimension(room.id, 'l2', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">W2 (ft)</label>
              <input
                type="number"
                value={dimensions.w2 || ''}
                onChange={(e) => updateRoomDimension(room.id, 'w2', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Square Footage Calculator</h1>
            <p className="text-blue-100 text-lg">
              Calculate the total square footage of your space with multiple room shapes. 
              Perfect for real estate, construction, and home improvement projects.
            </p>
          </div>
          <div className="hidden md:block">
            <Home className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Room Sizes */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Room Sizes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COMMON_ROOM_SIZES.map((roomSize, index) => (
              <button
                key={index}
                onClick={() => handleQuickRoom(roomSize)}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-sm text-left"
              >
                <div className="font-medium text-blue-800">{roomSize.name}</div>
                <div className="text-blue-600">{roomSize.length}' × {roomSize.width}'</div>
              </button>
            ))}
          </div>
        </div>

        {/* Room Management */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Add Room */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Room</h3>
            <button
              onClick={addRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Add Room
            </button>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>• Add multiple rooms to calculate total area</p>
              <p>• Choose from rectangle, circle, triangle, or L-shape</p>
              <p>• All measurements in feet</p>
            </div>
          </div>

          {/* Cost Calculator */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cost Calculator (Optional)</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost per Square Foot ($)
              </label>
              <input
                type="number"
                value={costPerSqFt}
                onChange={(e) => setCostPerSqFt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">Enter cost per sq ft for total cost calculation</p>
            </div>
          </div>
        </div>

        {/* Room List */}
        {rooms.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Rooms ({rooms.length})</h3>
            <div className="space-y-4">
              {rooms.map((room, index) => (
                <div key={room.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                                             <input
                         type="text"
                         value={room.name}
                         onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                         className="font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1"
                         placeholder="Room name"
                         aria-label="Room name"
                       />
                                             <select
                         value={room.shape}
                         onChange={(e) => updateRoom(room.id, 'shape', e.target.value)}
                         className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                         aria-label="Select room shape"
                       >
                        {SHAPE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {formatNumber(room.area)} sq ft
                      </span>
                      <button
                        onClick={() => removeRoom(room.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {renderDimensionInputs(room)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculate Button */}
        {rooms.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Total Area</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Area Results */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Total Area Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.squareFeet)}</div>
                  <div className="text-sm text-gray-600">Square Feet</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.squareMeters)}</div>
                  <div className="text-sm text-gray-600">Square Meters</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.squareYards)}</div>
                  <div className="text-sm text-gray-600">Square Yards</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.acres)}</div>
                  <div className="text-sm text-gray-600">Acres</div>
                </div>
              </div>
              
              {costPerSqFt && (
                <div className="mt-6 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    ${formatNumber(result.cost)}
                  </div>
                  <div className="text-sm text-gray-600">Total Cost</div>
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
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Square Footage Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator helps you determine the total square footage of your space by adding up individual room areas. 
                You can calculate areas for rectangles, circles, triangles, and L-shaped rooms. The calculator automatically 
                converts between different area units and can estimate total costs if you provide a cost per square foot. 
                Perfect for real estate professionals, contractors, and homeowners planning renovations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
