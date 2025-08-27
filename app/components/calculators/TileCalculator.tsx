'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Square } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface TileMaterial {
  name: string
  key: string
  pricePerSqFt: number
  wasteFactor: number
  description: string
  groutPerSqFt: number
}

interface Room {
  name: string
  length: number
  width: number
  height: number
  hasBacksplash: boolean
  backsplashHeight: number
}

interface TileResult {
  totalArea: number
  tileArea: number
  groutArea: number
  wasteArea: number
  totalWithWaste: number
  totalCost: number
  groutCost: number
  totalProjectCost: number
}

const tileMaterials: TileMaterial[] = [
  { name: 'Ceramic Tile', key: 'ceramic', pricePerSqFt: 2.50, wasteFactor: 10, description: 'Affordable and durable', groutPerSqFt: 0.15 },
  { name: 'Porcelain Tile', key: 'porcelain', pricePerSqFt: 4.00, wasteFactor: 12, description: 'Premium ceramic, very durable', groutPerSqFt: 0.15 },
  { name: 'Natural Stone', key: 'stone', pricePerSqFt: 8.00, wasteFactor: 15, description: 'Luxury natural material', groutPerSqFt: 0.20 },
  { name: 'Glass Tile', key: 'glass', pricePerSqFt: 12.00, wasteFactor: 20, description: 'Modern, translucent finish', groutPerSqFt: 0.25 },
  { name: 'Mosaic Tile', key: 'mosaic', pricePerSqFt: 6.00, wasteFactor: 25, description: 'Small tiles, artistic patterns', groutPerSqFt: 0.30 }
]

const groutTypes = [
  { name: 'Standard Cement Grout', price: 0.50 },
  { name: 'Epoxy Grout', price: 2.00 },
  { name: 'Urethane Grout', price: 1.50 }
]

export default function TileCalculator() {
  const [rooms, setRooms] = useState<Room[]>([
    { name: 'Kitchen', length: 12, width: 10, height: 8, hasBacksplash: true, backsplashHeight: 18 }
  ])
  const [selectedMaterial, setSelectedMaterial] = useState(0)
  const [selectedGrout, setSelectedGrout] = useState(0)
  const [groutPrice, setGroutPrice] = useState(0.50)
  const [showResults, setShowResults] = useState(false)

  const calculateTileNeeds = useCallback((): TileResult => {
    let totalArea = 0
    let totalBacksplashArea = 0

    rooms.forEach(room => {
      const floorArea = room.length * room.width
      totalArea += floorArea

      if (room.hasBacksplash) {
        const backsplashArea = (room.length + room.width) * 2 * (room.backsplashHeight / 12)
        totalBacksplashArea += backsplashArea
      }
    })

    const material = tileMaterials[selectedMaterial]
    const totalTileArea = totalArea + totalBacksplashArea
    const wasteArea = (totalTileArea * material.wasteFactor) / 100
    const totalWithWaste = totalTileArea + wasteArea
    const tileCost = totalWithWaste * material.pricePerSqFt
    const groutCost = totalTileArea * material.groutPerSqFt * groutPrice
    const totalProjectCost = tileCost + groutCost

    return {
      totalArea,
      tileArea: totalTileArea,
      groutArea: totalTileArea * material.groutPerSqFt,
      wasteArea,
      totalWithWaste,
      totalCost: tileCost,
      groutCost,
      totalProjectCost
    }
  }, [rooms, selectedMaterial, groutPrice])

  const addRoom = () => {
    setRooms(prev => [...prev, { 
      name: `Room ${prev.length + 1}`, 
      length: 10, 
      width: 8, 
      height: 8, 
      hasBacksplash: false, 
      backsplashHeight: 18 
    }])
  }

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateRoom = (index: number, field: keyof Room, value: any) => {
    setRooms(prev => prev.map((room, i) => 
      i === index ? { ...room, [field]: value } : room
    ))
  }

  const handleCalculate = () => {
    setShowResults(true)
  }

  const handleReset = () => {
    setRooms([{ name: 'Kitchen', length: 12, width: 10, height: 8, hasBacksplash: true, backsplashHeight: 18 }])
    setSelectedMaterial(0)
    setSelectedGrout(0)
    setGroutPrice(0.50)
    setShowResults(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatNumber = (num: number, decimals: number = 1) => {
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculateTileNeeds()
    const material = tileMaterials[selectedMaterial]
    
    const data = `Tile Calculator Results

Selected Material: ${material.name}
Price per sq ft: ${formatCurrency(material.pricePerSqFt)}
Waste factor: ${material.wasteFactor}%

Room Details:
${rooms.map(room => 
  `${room.name}: ${room.length}' × ${room.width}' (${room.length * room.width} sq ft)${room.hasBacksplash ? ` + ${room.backsplashHeight}" backsplash` : ''}`
).join('\n')}

Calculations:
- Total floor area: ${formatNumber(result.totalArea)} sq ft
- Total tile area (with backsplash): ${formatNumber(result.tileArea)} sq ft
- Waste area: ${formatNumber(result.wasteArea)} sq ft
- Total area with waste: ${formatNumber(result.totalWithWaste)} sq ft
- Grout area: ${formatNumber(result.groutArea)} sq ft

Cost Breakdown:
- Tile cost: ${formatCurrency(result.totalCost)}
- Grout cost: ${formatCurrency(result.groutCost)}
- Total project cost: ${formatCurrency(result.totalProjectCost)}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tile-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateTileNeeds()
      const material = tileMaterials[selectedMaterial]
      
      navigator.share({
        title: 'Tile Calculator Results',
        text: `Tile project: ${formatNumber(result.totalWithWaste)} sq ft of ${material.name}, total cost: ${formatCurrency(result.totalProjectCost)}.`,
        url: window.location.href
      })
    } else {
      const text = `Tile Calculator Results - ${formatNumber(calculateTileNeeds().totalWithWaste)} sq ft, ${formatCurrency(calculateTileNeeds().totalProjectCost)} total cost`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateTileNeeds() : null

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tile Calculator</h1>
            <p className="text-green-100 text-lg">
              Calculate tile materials, costs, and waste for multiple rooms. Get accurate estimates for ceramic, porcelain, stone, and other tile types.
            </p>
          </div>
          <div className="hidden md:block">
            <Square className="w-16 h-16 text-green-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Material Selection */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tile Material</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tile Type
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                title="Select tile material type"
              >
                {tileMaterials.map((material, index) => (
                  <option key={material.key} value={index}>
                    {material.name} - {formatCurrency(material.pricePerSqFt)}/sq ft
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {tileMaterials[selectedMaterial]?.description} • {tileMaterials[selectedMaterial]?.wasteFactor}% waste factor
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grout Price per sq ft
              </label>
              <input
                type="number"
                value={groutPrice}
                onChange={(e) => setGroutPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.01"
                title="Enter grout price per square foot"
              />
            </div>
          </div>
        </div>

        {/* Room Inputs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Room Dimensions</h3>
            <button
              onClick={addRoom}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Add Room
            </button>
          </div>
          
          <div className="space-y-4">
            {rooms.map((room, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">{room.name}</h4>
                  {rooms.length > 1 && (
                    <button
                      onClick={() => removeRoom(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Name
                    </label>
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) => updateRoom(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Enter room name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length (ft)
                    </label>
                    <input
                      type="number"
                      value={room.length}
                      onChange={(e) => updateRoom(index, 'length', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="1"
                      step="0.1"
                      title="Enter room length in feet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (ft)
                    </label>
                    <input
                      type="number"
                      value={room.width}
                      onChange={(e) => updateRoom(index, 'width', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="1"
                      step="0.1"
                      title="Enter room width in feet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (ft)
                    </label>
                    <input
                      type="number"
                      value={room.height}
                      onChange={(e) => updateRoom(index, 'height', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="1"
                      step="0.1"
                      title="Enter room height in feet"
                    />
                  </div>
                </div>
                
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`backsplash-${index}`}
                      checked={room.hasBacksplash}
                      onChange={(e) => updateRoom(index, 'hasBacksplash', e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      title="Include backsplash for this room"
                    />
                    <label htmlFor={`backsplash-${index}`} className="text-sm font-medium text-gray-700">
                      Include Backsplash
                    </label>
                  </div>
                  
                  {room.hasBacksplash && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backsplash Height (inches)
                      </label>
                      <input
                        type="number"
                        value={room.backsplashHeight}
                        onChange={(e) => updateRoom(index, 'backsplashHeight', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1"
                        max="48"
                        title="Enter backsplash height in inches"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
          >
            <Calculator className="w-5 h-5" />
            <span>Calculate Tile Requirements</span>
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <ResultSharing
                title="Tile Calculation Result"
                inputs={[
                  { label: "Tile Material", value: tileMaterials[selectedMaterial]?.name },
                  { label: "Number of Rooms", value: `${rooms.length} rooms` },
                  { label: "Total Floor Area", value: `${formatNumber(result.totalArea)} sq ft` },
                  { label: "Grout Price", value: `${formatCurrency(groutPrice)}/sq ft` }
                ]}
                result={{ 
                  label: "Total Project Cost", 
                  value: formatCurrency(result.totalProjectCost),
                  unit: ""
                }}
                calculatorName="Tile Calculator"
                className="mb-0"
              />
            </div>

            {/* Summary */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Project Summary</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-700">{formatNumber(result.totalArea)}</div>
                  <div className="text-sm text-gray-600">Total Floor Area (sq ft)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">{formatNumber(result.tileArea)}</div>
                  <div className="text-sm text-gray-600">Tile Area (sq ft)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">{formatNumber(result.totalWithWaste)}</div>
                  <div className="text-sm text-gray-600">With Waste (sq ft)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">{formatCurrency(result.totalProjectCost)}</div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Material Requirements</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floor tiles needed:</span>
                    <span className="font-semibold">{formatNumber(result.totalWithWaste)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waste allowance:</span>
                    <span className="font-semibold">{formatNumber(result.wasteArea)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grout needed:</span>
                    <span className="font-semibold">{formatNumber(result.groutArea)} sq ft</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Cost Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tile cost:</span>
                    <span className="font-semibold">{formatCurrency(result.totalCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grout cost:</span>
                    <span className="font-semibold">{formatCurrency(result.groutCost)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-medium">Total project:</span>
                    <span className="font-bold text-lg">{formatCurrency(result.totalProjectCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                title="Download results as text file"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={shareResults}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                title="Share results"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={printResults}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                title="Print results"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                title="Reset calculator"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Comprehensive Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Tile Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive tile calculator helps homeowners, contractors, and designers accurately 
                estimate materials, costs, and waste for tiling projects. It handles complex layouts including 
                multiple rooms, backsplashes, and different tile materials to provide precise project planning.
              </p>
              <p className="text-gray-700">
                The calculator automatically accounts for waste factors, grout requirements, and material 
                costs to give you a complete project estimate.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Tile Material Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Ceramic & Porcelain</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Ceramic:</strong> Affordable, durable, easy to install</li>
                    <li><strong>Porcelain:</strong> Premium ceramic, very low water absorption</li>
                    <li><strong>Best For:</strong> Kitchens, bathrooms, high-traffic areas</li>
                    <li><strong>Maintenance:</strong> Easy to clean, stain-resistant</li>
                    <li><strong>Cost:</strong> $2.50-4.00 per sq ft</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Natural & Specialty</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Natural Stone:</strong> Marble, granite, travertine</li>
                    <li><strong>Glass Tile:</strong> Modern, translucent, artistic</li>
                    <li><strong>Mosaic:</strong> Small tiles, intricate patterns</li>
                    <li><strong>Best For:</strong> Accent walls, artistic installations</li>
                    <li><strong>Cost:</strong> $6.00-12.00+ per sq ft</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Project Planning Considerations</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-2">Room Measurements</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Floor Tiling:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Measure length × width</li>
                      <li>Account for permanent fixtures</li>
                      <li>Consider tile pattern direction</li>
                      <li>Plan for expansion joints</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Wall Tiling:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Include backsplash areas</li>
                      <li>Measure to ceiling height</li>
                      <li>Account for windows/doors</li>
                      <li>Plan for electrical outlets</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Waste Factor Calculations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Why Waste Factors Matter</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Cuts & Trims:</strong> Tiles need cutting for edges</li>
                    <li><strong>Pattern Matching:</strong> Aligning patterns requires extra</li>
                    <li><strong>Breakage:</strong> Some tiles break during installation</li>
                    <li><strong>Future Repairs:</strong> Keep extras for maintenance</li>
                    <li><strong>Installation Errors:</strong> Account for mistakes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Recommended Waste Factors</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Ceramic:</strong> 10% - Standard installation</li>
                    <li><strong>Porcelain:</strong> 12% - Harder to cut</li>
                    <li><strong>Natural Stone:</strong> 15% - Irregular shapes</li>
                    <li><strong>Glass Tile:</strong> 20% - Fragile material</li>
                    <li><strong>Mosaic:</strong> 25% - Complex patterns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Grout Selection & Application</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Standard Cement Grout:</strong> Affordable, easy to apply, requires sealing</li>
                <li><strong>Epoxy Grout:</strong> Stain-resistant, waterproof, more expensive</li>
                <li><strong>Urethane Grout:</strong> Flexible, crack-resistant, moderate cost</li>
                <li><strong>Grout Spacing:</strong> 1/8" to 1/4" typical for floor tiles</li>
                <li><strong>Color Selection:</strong> Match or contrast with tile color</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Installation Tips</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Preparation</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Ensure subfloor is level and stable</li>
                    <li>Use proper underlayment materials</li>
                    <li>Plan tile layout before starting</li>
                    <li>Mix mortar to correct consistency</li>
                    <li>Have all tools ready</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Installation</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Start from center and work outward</li>
                    <li>Use tile spacers for consistent joints</li>
                    <li>Check level frequently</li>
                    <li>Clean excess mortar immediately</li>
                    <li>Allow proper curing time</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Always buy 10-15% more tile than calculated to account for waste</li>
                <li>• Consider tile size - larger tiles show fewer grout lines but are harder to install</li>
                <li>• Plan your layout to minimize cuts and waste</li>
                <li>• Use the same batch numbers for consistent color matching</li>
                <li>• Factor in underlayment and adhesive costs in your budget</li>
                <li>• Remember that professional installation may cost 2-3x the material cost</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
