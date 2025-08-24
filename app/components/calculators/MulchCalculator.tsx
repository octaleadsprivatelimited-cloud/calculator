'use client'
import React, { useState } from 'react'
import { Calculator, TreePine, Package } from 'lucide-react'

export default function MulchCalculator() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('3')
  const [showResults, setShowResults] = useState(false)

  const calculateMulch = () => {
    const l = parseFloat(length)
    const w = parseFloat(width)
    const d = parseFloat(depth)
    
    if (!l || !w || !d) return null
    
    const area = l * w
    const volume = area * (d / 12) // Convert inches to feet
    const cubicYards = volume / 27 // Convert cubic feet to cubic yards
    const bags = Math.ceil(volume * 13.5) // 1 cubic foot = 13.5 bags
    
    return { area, volume, cubicYards, bags }
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLength('')
    setWidth('')
    setDepth('3')
    setShowResults(false)
  }

  const mulch = showResults ? calculateMulch() : null

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mulch Calculator</h1>
            <p className="text-green-100 text-lg">Calculate mulch requirements for your garden or landscaping project</p>
          </div>
          <TreePine className="w-16 h-16 text-green-200" />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              min="1"
              max="12"
              title="Enter depth in inches"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate Mulch Needs
          </button>
        </div>

        {showResults && mulch && (
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Mulch Calculation Results</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-green-600">{mulch.area.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Square Feet</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{mulch.volume.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Cubic Feet</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{mulch.cubicYards.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Cubic Yards</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{mulch.bags}</div>
                <div className="text-sm text-gray-600">2 cu ft Bags</div>
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
