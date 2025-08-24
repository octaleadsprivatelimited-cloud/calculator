'use client'

import React, { useState, useCallback } from 'react'
import { Palette, Calculator, TrendingUp, Share2, Download, Printer, Ruler } from 'lucide-react'
import ShareModal from '../ShareModal'

interface Surface {
  name: string
  key: string
  inputs: string[]
  calculation: (dims: any) => number
}

const surfaces: Surface[] = [
  {
    name: 'Wall',
    key: 'wall',
    inputs: ['Length', 'Height'],
    calculation: (dims) => dims.length * dims.height
  },
  {
    name: 'Ceiling',
    key: 'ceiling',
    inputs: ['Length', 'Width'],
    calculation: (dims) => dims.length * dims.width
  },
  {
    name: 'Room (4 walls + ceiling)',
    key: 'room',
    inputs: ['Length', 'Width', 'Height'],
    calculation: (dims) => (2 * (dims.length + dims.width) * dims.height) + (dims.length * dims.width)
  },
  {
    name: 'Door',
    key: 'door',
    inputs: ['Width', 'Height'],
    calculation: (dims) => dims.width * dims.height
  },
  {
    name: 'Window',
    key: 'window',
    inputs: ['Width', 'Height'],
    calculation: (dims) => dims.width * dims.height
  },
  {
    name: 'Custom Area',
    key: 'custom',
    inputs: ['Area'],
    calculation: (dims) => dims.area
  }
]

const paintTypes = [
  { name: 'Interior Wall Paint', coverage: 12, unit: 'm²/L', price: 25 },
  { name: 'Exterior Paint', coverage: 10, unit: 'm²/L', price: 35 },
  { name: 'Ceiling Paint', coverage: 14, unit: 'm²/L', price: 20 },
  { name: 'Primer', coverage: 15, unit: 'm²/L', price: 15 },
  { name: 'High-Quality Paint', coverage: 8, unit: 'm²/L', price: 45 }
]

export default function PaintCalculator() {
  const [selectedSurface, setSelectedSurface] = useState('wall')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    area: ''
  })
  const [selectedPaint, setSelectedPaint] = useState(0)
  const [coats, setCoats] = useState(2)
  const [wastage, setWastage] = useState(10)
  const [showShareModal, setShowShareModal] = useState(false)

  const calculateArea = useCallback((): number => {
    const surface = surfaces.find(s => s.key === selectedSurface)
    if (!surface) return 0

    const dims = {
      length: parseFloat(dimensions.length) || 0,
      width: parseFloat(dimensions.width) || 0,
      height: parseFloat(dimensions.height) || 0,
      area: parseFloat(dimensions.area) || 0
    }

    return surface.calculation(dims)
  }, [selectedSurface, dimensions])

  const calculatePaintNeeded = useCallback(() => {
    const area = calculateArea()
    const paint = paintTypes[selectedPaint]
    
    if (!paint || area === 0) return null

    const totalArea = area * coats
    const paintLiters = (totalArea / paint.coverage) * (1 + wastage / 100)
    const paintGallons = paintLiters * 0.264172
    const totalCost = paintLiters * paint.price

    return {
      paintLiters: Math.round(paintLiters * 100) / 100,
      paintGallons: Math.round(paintGallons * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      coverage: paint.coverage,
      unit: paint.unit
    }
  }, [calculateArea, selectedPaint, coats, wastage])

  const handleDimensionChange = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
  }

  const handleShare = () => setShowShareModal(true)
  const handlePrint = () => window.print()
  const handleDownload = () => {
    const area = calculateArea()
    const paint = calculatePaintNeeded()
    
    const data = `Paint Calculator Results\n\nSurface: ${surfaces.find(s => s.key === selectedSurface)?.name}\nArea: ${area.toFixed(2)} m²\nCoats: ${coats}\nWastage: ${wastage}%\n\nPaint: ${paintTypes[selectedPaint].name}\nCoverage: ${paintTypes[selectedPaint].coverage} ${paintTypes[selectedPaint].unit}\n\nPaint Needed:\n${paint?.paintLiters} L (${paint?.paintGallons} gallons)\nTotal Cost: $${paint?.totalCost}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'paint-calculator-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const area = calculateArea()
  const paint = calculatePaintNeeded()

  const getSurfaceInputs = () => {
    const surface = surfaces.find(s => s.key === selectedSurface)
    if (!surface) return []

    return surface.inputs.map(input => {
      const field = input.toLowerCase().replace(/\s+/g, '')
      const value = dimensions[field as keyof typeof dimensions] || ''
      
      return { label: input, field, value }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Palette className="w-16 h-16 mr-4 text-blue-600" />
            Paint Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate paint needed for walls, ceilings, rooms, and other surfaces. Get accurate estimates for paint quantity and cost based on area and paint type.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                Surface Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surface Type</label>
                  <select
                    value={selectedSurface}
                    onChange={(e) => setSelectedSurface(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    title="Select the surface type to paint"
                    aria-label="Surface type to paint"
                  >
                    {surfaces.map(surface => (
                      <option key={surface.key} value={surface.key}>
                        {surface.name}
                      </option>
                    ))}
                  </select>
                </div>

                {getSurfaceInputs().map(({ label, field, value }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label} (meters)
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleDimensionChange(field, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      title={`Enter ${label.toLowerCase()} in meters`}
                      aria-label={`${label} in meters`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Paint Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paint Type</label>
                  <select
                    value={selectedPaint}
                    onChange={(e) => setSelectedPaint(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    title="Select the paint type"
                    aria-label="Paint type"
                  >
                    {paintTypes.map((paint, index) => (
                      <option key={index} value={index}>
                        {paint.name} - {paint.coverage} {paint.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Coats</label>
                  <input
                    type="number"
                    value={coats}
                    onChange={(e) => setCoats(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    min="1"
                    max="5"
                    title="Enter the number of paint coats needed"
                    aria-label="Number of paint coats"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wastage (%)</label>
                  <input
                    type="number"
                    value={wastage}
                    onChange={(e) => setWastage(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    min="0"
                    max="50"
                    step="5"
                    title="Enter the percentage of paint wastage expected"
                    aria-label="Paint wastage percentage"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 10-15%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Examples</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedSurface('room')
                    setDimensions({
                      ...dimensions,
                      length: '4',
                      width: '3',
                      height: '2.4'
                    })
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: 4m x 3m x 2.4m room"
                  aria-label="Set example: 4m x 3m x 2.4m room"
                >
                  🏠 Bedroom (4m × 3m × 2.4m)
                </button>
                <button
                  onClick={() => {
                    setSelectedSurface('wall')
                    setDimensions({
                      ...dimensions,
                      length: '5',
                      height: '2.4'
                    })
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: 5m x 2.4m wall"
                  aria-label="Set example: 5m x 2.4m wall"
                >
                  🧱 Wall (5m × 2.4m)
                </button>
                <button
                  onClick={() => {
                    setSelectedSurface('ceiling')
                    setDimensions({
                      ...dimensions,
                      length: '6',
                      width: '4'
                    })
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: 6m x 4m ceiling"
                  aria-label="Set example: 6m x 4m ceiling"
                >
                  🏗️ Ceiling (6m × 4m)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                  Calculation Results
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Surface Area</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-600">Total Area:</span>
                        <span className="font-semibold text-blue-800">{area.toFixed(2)} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">With Coats:</span>
                        <span className="font-semibold text-blue-800">{(area * coats).toFixed(2)} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600">Paint Type:</span>
                        <span className="font-semibold text-blue-800">{paintTypes[selectedPaint].name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4">Paint Needed</h3>
                    {paint ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-indigo-600">Paint (Liters):</span>
                          <span className="font-semibold text-indigo-800">{paint.paintLiters} L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-600">Paint (Gallons):</span>
                          <span className="font-semibold text-indigo-800">{paint.paintGallons} gal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-600">Coverage:</span>
                          <span className="font-semibold text-indigo-800">{paint.coverage} {paint.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-600">Total Cost:</span>
                          <span className="font-semibold text-indigo-800">${paint.totalCost}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-indigo-600">Enter dimensions to calculate paint needed</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">💡 Tips</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Always buy slightly more paint than calculated to account for touch-ups</li>
                    <li>• Consider the surface texture - rough surfaces need more paint</li>
                    <li>• Dark colors may require more coats for good coverage</li>
                    <li>• Factor in drying time between coats</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share paint calculator results"
                  aria-label="Share paint calculator results"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download results as text file"
                  aria-label="Download paint calculator results"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Print paint calculator results"
                  aria-label="Print paint calculator results"
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
            expression: `${surfaces.find(s => s.key === selectedSurface)?.name}`,
            result: `${area.toFixed(2)} m² - ${paint?.paintLiters}L paint needed`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}
