'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Home } from 'lucide-react'
import ResultSharing from '../ResultSharing'

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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <ResultSharing
                title="Concrete Calculation Result"
                inputs={[
                  { label: "Length", value: `${length} feet` },
                  { label: "Width", value: `${width} feet` },
                  { label: "Height/Depth", value: `${height} feet` }
                ]}
                result={{ 
                  label: "Concrete Needed", 
                  value: `${result.volume.toFixed(2)} cubic yards`,
                  unit: ""
                }}
                calculatorName="Concrete Calculator"
                className="mb-0"
              />
            </div>

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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Concrete Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our concrete calculator helps you determine the exact amount of concrete needed for your construction projects. 
              Whether you're building a foundation, patio, driveway, or any concrete structure, this tool provides accurate 
              volume calculations and material requirements.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Volume:</strong> Concrete needed in cubic yards</li>
              <li><strong>Weight:</strong> Total weight of concrete required</li>
              <li><strong>Bag Count:</strong> Number of 80-pound concrete bags needed</li>
              <li><strong>Dimensions:</strong> Length, width, and depth calculations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Concrete Projects</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Residential Projects</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Driveways and walkways</li>
                  <li>Patios and decks</li>
                  <li>Foundation slabs</li>
                  <li>Retaining walls</li>
                  <li>Garden borders</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Commercial Projects</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Parking lots</li>
                  <li>Warehouse floors</li>
                  <li>Industrial foundations</li>
                  <li>Road construction</li>
                  <li>Bridge supports</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the length, width, and height/depth of your concrete project in feet. The calculator will automatically 
              compute the volume in cubic yards, total weight in pounds, and the number of 80-pound concrete bags you'll need.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Concrete Mix Information</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Standard Mix</h5>
                <p className="text-blue-700 text-sm">1:2:3 ratio (cement:sand:gravel)</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">High Strength</h5>
                <p className="text-green-700 text-sm">1:1.5:2.5 ratio for heavy loads</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Foundation Mix</h5>
                <p className="text-orange-700 text-sm">1:2.5:3.5 ratio for stability</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Always order 10-15% more concrete than calculated to account for spillage, uneven surfaces, and formwork. 
                Consider weather conditions and curing time when planning your concrete project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
