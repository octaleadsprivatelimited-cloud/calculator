'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Scale } from 'lucide-react'

export default function DensityCalculator() {
  const [calculationType, setCalculationType] = useState<'density' | 'mass' | 'volume'>('density')
  const [density, setDensity] = useState('')
  const [mass, setMass] = useState('')
  const [volume, setVolume] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateDensity = useCallback(() => {
    if (calculationType === 'density') {
      const massValue = parseFloat(mass) || 0
      const volumeValue = parseFloat(volume) || 0
      return massValue > 0 && volumeValue > 0 ? massValue / volumeValue : 0
    } else if (calculationType === 'mass') {
      const densityValue = parseFloat(density) || 0
      const volumeValue = parseFloat(volume) || 0
      return densityValue > 0 && volumeValue > 0 ? densityValue * volumeValue : 0
    } else {
      const densityValue = parseFloat(density) || 0
      const massValue = parseFloat(mass) || 0
      return densityValue > 0 && massValue > 0 ? massValue / densityValue : 0
    }
  }, [calculationType, density, mass, volume])

  const handleCalculate = () => {
    const result = calculateDensity()
    if (result > 0) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setDensity('')
    setMass('')
    setVolume('')
    setShowResults(false)
  }

  const formatNumber = (num: number) => {
    return isNaN(num) || !isFinite(num) ? '0.00' : num.toFixed(4)
  }

  const result = showResults ? calculateDensity() : 0

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Density Calculator</h1>
            <p className="text-indigo-100 text-lg">
              Calculate density, mass, and volume with multiple unit conversions.
            </p>
          </div>
          <div className="hidden md:block">
            <Scale className="w-16 h-16 text-indigo-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Calculation Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['density', 'mass', 'volume'].map((type) => (
              <button
                key={type}
                onClick={() => setCalculationType(type as any)}
                className={`p-4 rounded-lg font-medium transition-colors ${
                  calculationType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Calculate {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            {calculationType !== 'density' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Density</h3>
                <input
                  type="number"
                  value={density}
                  onChange={(e) => setDensity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter density"
                  min="0"
                  step="0.001"
                />
              </div>
            )}
            {calculationType !== 'mass' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mass</h3>
                <input
                  type="number"
                  value={mass}
                  onChange={(e) => setMass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter mass"
                  min="0"
                  step="0.001"
                />
              </div>
            )}
            {calculationType !== 'volume' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Volume</h3>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter volume"
                  min="0"
                  step="0.001"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Densities</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Water:</span>
                <span className="font-semibold">1.00 g/cm³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aluminum:</span>
                <span className="font-semibold">2.70 g/cm³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Iron:</span>
                <span className="font-semibold">7.87 g/cm³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gold:</span>
                <span className="font-semibold">19.32 g/cm³</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
          >
            <Calculator className="w-5 h-5" />
            <span>Calculate</span>
          </button>
        </div>

        {showResults && (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">Result</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-700">{formatNumber(result)}</div>
                <div className="text-sm text-gray-600">
                  {calculationType === 'density' ? 'g/cm³' : calculationType === 'mass' ? 'g' : 'cm³'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
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

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Density Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Calculate density (mass/volume), mass (density × volume), or volume (mass/density) 
                when you know two of the three values. Perfect for science experiments and material analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
