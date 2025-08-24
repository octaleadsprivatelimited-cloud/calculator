'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Thermometer } from 'lucide-react'

export default function BTUCalculator() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateBTU = useCallback(() => {
    const l = parseFloat(length) || 0
    const w = parseFloat(width) || 0
    const h = parseFloat(height) || 0
    
    if (l === 0 || w === 0 || h === 0) return { heating: 0, cooling: 0 }
    
    const area = l * w
    const volume = area * h
    
    // Basic BTU calculation: 20 BTU per sq ft for heating, 25 BTU per sq ft for cooling
    const heatingBTU = area * 20
    const coolingBTU = area * 25
    
    return { heating: heatingBTU, cooling: coolingBTU }
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

  const result = showResults ? calculateBTU() : { heating: 0, cooling: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">BTU Calculator</h1>
            <p className="text-emerald-100 text-lg">
              Calculate heating and cooling requirements for any room.
            </p>
          </div>
          <div className="hidden md:block">
            <Thermometer className="w-16 h-16 text-emerald-200" />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="20"
              min="1"
              step="0.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (feet)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="15"
              min="1"
              step="0.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (feet)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="8"
              min="6"
              step="0.5"
            />
          </div>
        </div>

        {length && width && height && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Calculate BTU Requirements
            </button>
          </div>
        )}

        {showResults && (
          <div className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">BTU Requirements</h3>
              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{result.heating.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Heating BTU</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{result.cooling.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Cooling BTU</div>
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
