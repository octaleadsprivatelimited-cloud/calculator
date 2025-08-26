'use client'

import React, { useState, useCallback } from 'react'
import { Triangle, Calculator as CalculatorIcon, RotateCcw, Ruler } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface TriangleData {
  sideA: number
  sideB: number
  sideC: number
  angleA: number
  angleB: number
  angleC: number
  area: number
  perimeter: number
  height: number
  type: string
}

export default function TriangleCalculator() {
  const [sideA, setSideA] = useState('5')
  const [sideB, setSideB] = useState('4')
  const [sideC, setSideC] = useState('3')
  const [calculationType, setCalculationType] = useState<'sides' | 'angles'>('sides')
  const [result, setResult] = useState<TriangleData | null>(null)

  const calculateTriangle = useCallback(() => {
    const a = parseFloat(sideA)
    const b = parseFloat(sideB)
    const c = parseFloat(sideC)

    if (a <= 0 || b <= 0 || c <= 0) {
      alert('All sides must be positive numbers')
      return
    }

    // Check if triangle is valid (sum of any two sides > third side)
    if (a + b <= c || a + c <= b || b + c <= a) {
      alert('Invalid triangle: sum of any two sides must be greater than the third side')
      return
    }

    const perimeter = a + b + c
    const s = perimeter / 2 // semi-perimeter
    
    // Calculate area using Heron's formula
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c))
    
    // Calculate angles using cosine law
    const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * (180 / Math.PI)
    const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI)
    const angleC = Math.acos((a * a + b * b - c * c) / (2 * a * b)) * (180 / Math.PI)
    
    // Calculate height (altitude) from side A
    const height = (2 * area) / a
    
    // Determine triangle type
    let type = 'Scalene'
    if (a === b && b === c) {
      type = 'Equilateral'
    } else if (a === b || b === c || a === c) {
      type = 'Isosceles'
    }
    
    // Check if right triangle
    if (Math.abs(angleA - 90) < 0.1 || Math.abs(angleB - 90) < 0.1 || Math.abs(angleC - 90) < 0.1) {
      type += ' (Right)'
    }

    setResult({
      sideA: a,
      sideB: b,
      sideC: c,
      angleA: Math.round(angleA * 100) / 100,
      angleB: Math.round(angleB * 100) / 100,
      angleC: Math.round(angleC * 100) / 100,
      area: Math.round(area * 100) / 100,
      perimeter: Math.round(perimeter * 100) / 100,
      height: Math.round(height * 100) / 100,
      type
    })
  }, [sideA, sideB, sideC])

  const formatNumber = (num: number): string => {
    return num.toFixed(2)
  }

  const formatAngle = (angle: number): string => {
    return `${formatNumber(angle)}°`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Triangle className="w-12 h-12 mr-3 text-indigo-600" />
            Triangle Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate triangle properties, area, perimeter, and angles
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-indigo-600" />
              Triangle Dimensions
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side A</label>
                <input
                  type="number"
                  step="0.01"
                  value={sideA}
                  onChange={(e) => setSideA(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="5"
                  title="Enter length of side A"
                  aria-label="Side A length"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side B</label>
                <input
                  type="number"
                  step="0.01"
                  value={sideB}
                  onChange={(e) => setSideB(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="4"
                  title="Enter length of side B"
                  aria-label="Side B length"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side C</label>
                <input
                  type="number"
                  step="0.01"
                  value={sideC}
                  onChange={(e) => setSideC(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="3"
                  title="Enter length of side C"
                  aria-label="Side C length"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={calculateTriangle}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  title="Calculate triangle properties"
                  aria-label="Calculate triangle properties"
                >
                  Calculate
                </button>
                <button
                  onClick={() => {
                    setSideA('5')
                    setSideB('4')
                    setSideC('3')
                    setResult(null)
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-800 mb-2">Quick Examples</h3>
              <div className="space-y-2 text-sm text-indigo-600">
                <p>• <strong>Right Triangle:</strong> 3, 4, 5</p>
                <p>• <strong>Equilateral:</strong> 5, 5, 5</p>
                <p>• <strong>Isosceles:</strong> 5, 5, 3</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {result && (
              <>
                {/* Share Options - Moved to Top */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
                  <ResultSharing
                    title="Triangle Calculation Result"
                    inputs={[
                      { label: "Side A", value: `${formatNumber(result.sideA)} units` },
                      { label: "Side B", value: `${formatNumber(result.sideB)} units` },
                      { label: "Side C", value: `${formatNumber(result.sideC)} units` }
                    ]}
                    result={{ 
                      label: "Area", 
                      value: formatNumber(result.area),
                      unit: "square units"
                    }}
                    calculatorName="Triangle Calculator"
                    className="mb-0"
                  />
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Triangle className="w-6 h-6 mr-2 text-indigo-600" />
                    Triangle Properties
                  </h2>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      {result.type}
                    </div>
                    <p className="text-gray-600">Triangle Classification</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Area</span>
                      <span className="font-semibold text-green-600">{formatNumber(result.area)} square units</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Perimeter</span>
                      <span className="font-semibold text-blue-600">{formatNumber(result.perimeter)} units</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Height (from side A)</span>
                      <span className="font-semibold text-purple-600">{formatNumber(result.height)} units</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Side Lengths</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Side A</span>
                      <span className="font-semibold">{formatNumber(result.sideA)} units</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Side B</span>
                      <span className="font-semibold">{formatNumber(result.sideB)} units</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Side C</span>
                      <span className="font-semibold">{formatNumber(result.sideC)} units</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Ruler className="w-6 h-6 mr-2 text-indigo-600" />
                    Angles
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Angle A (opposite side A)</span>
                      <span className="font-semibold text-red-600">{formatAngle(result.angleA)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Angle B (opposite side B)</span>
                      <span className="font-semibold text-orange-600">{formatAngle(result.angleB)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Angle C (opposite side C)</span>
                      <span className="font-semibold text-yellow-600">{formatAngle(result.angleC)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold text-green-600">{formatAngle(result.angleA + result.angleB + result.angleC)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Triangle Facts</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Sum of angles</strong> always equals 180°</p>
                <p>• <strong>Triangle inequality:</strong> sum of any two sides &gt; third side</p>
                <p>• <strong>Right triangle:</strong> one angle equals 90°</p>
                <p>• <strong>Equilateral:</strong> all sides and angles equal</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Triangle Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
