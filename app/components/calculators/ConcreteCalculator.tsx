'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Home } from 'lucide-react'

export default function ConcreteCalculator() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateConcrete = useCallback(() => {
    const l = parseFloat(length) || 0
    const w = parseFloat(width) || 0
    const h = parseFloat(height) || 0
    
    if (l === 0 || w === 0 || h === 0) return { volume: 0, weight: 0, bags: 0 }
    
    const volume = l * w * h
    const volumeYards = volume / 27 // Convert to cubic yards
    const weight = volumeYards * 150 // 150 lbs per cubic yard
    const bags = Math.ceil(weight / 80) // 80 lb bags
    
    return { volume: volumeYards, weight, bags }
  }, [length, width, height])

  const handleCalculate = () => {
    if (length && width && height) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setLength('')
    setWidth('')
    setHeight('')
    setShowResults(false)
  }

  const result = showResults ? calculateConcrete() : { volume: 0, weight: 0, bags: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Concrete Calculator</h1>
            <p className="text-gray-100 text-lg">
              Calculate concrete requirements for construction projects.
            </p>
          </div>
          <div className="hidden md:block">
            <Home className="w-16 h-16 text-gray-300" />
          </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="20"
              min="0.1"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (feet)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="15"
              min="0.1"
              step="0.1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height/Depth (feet)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="0.5"
              min="0.1"
              step="0.1"
            />
          </div>
        </div>

        {length && width && height && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Calculate Concrete Requirements
            </button>
          </div>
        )}

        {showResults && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Concrete Requirements</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-700">{result.volume.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Cubic Yards</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{result.weight.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Total Weight (lbs)</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.bags}</div>
                  <div className="text-sm text-gray-600">80 lb Bags</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
