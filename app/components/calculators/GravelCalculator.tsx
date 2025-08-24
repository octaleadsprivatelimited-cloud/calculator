'use client'
import React, { useState } from 'react'
import { Calculator, Mountain, Package } from 'lucide-react'

export default function GravelCalculator() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('4')
  const [showResults, setShowResults] = useState(false)

  const calculateGravel = () => {
    const l = parseFloat(length)
    const w = parseFloat(width)
    const d = parseFloat(depth)
    
    if (!l || !w || !d) return null
    
    const area = l * w
    const volume = area * (d / 12) // Convert inches to feet
    const cubicYards = volume / 27 // Convert cubic feet to cubic yards
    const tons = cubicYards * 1.4 // 1 cubic yard = 1.4 tons
    
    return { area, volume, cubicYards, tons }
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLength('')
    setWidth('')
    setDepth('4')
    setShowResults(false)
  }

  const gravel = showResults ? calculateGravel() : null

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-gray-600 to-slate-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gravel Calculator</h1>
            <p className="text-gray-100 text-lg">Calculate gravel requirements for driveways, paths, and landscaping</p>
          </div>
          <Mountain className="w-16 h-16 text-gray-200" />
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length (feet)</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              min="0"
              step="0.1"
              title="Enter length in feet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (feet)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              min="0"
              step="0.1"
              title="Enter width in feet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Depth (inches)</label>
            <input
              type="number"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              min="1"
              max="12"
              title="Enter depth in inches"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate Gravel Needs
          </button>
        </div>

        {showResults && gravel && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Gravel Calculation Results</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-600">{gravel.area.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Square Feet</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{gravel.volume.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Cubic Feet</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{gravel.cubicYards.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Cubic Yards</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{gravel.tons.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Tons</div>
              </div>
            </div>
            <div className="mt-4">
              <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
