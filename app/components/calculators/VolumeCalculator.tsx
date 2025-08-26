'use client'

import React, { useState, useCallback } from 'react'
import { Box, Calculator as CalculatorIcon, RotateCcw, Ruler } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface VolumeResult {
  volume: number
  surfaceArea?: number
  lateralArea?: number
  units: string
}

export default function VolumeCalculator() {
  const [selectedShape, setSelectedShape] = useState('cube')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    radius: '',
    base: '',
    side: '',
    diagonal: ''
  })
  const [units, setUnits] = useState('m')

  const calculateVolume = useCallback((): VolumeResult => {
    const length = parseFloat(dimensions.length) || 0
    const width = parseFloat(dimensions.width) || 0
    const height = parseFloat(dimensions.height) || 0
    const radius = parseFloat(dimensions.radius) || 0
    const base = parseFloat(dimensions.base) || 0
    const side = parseFloat(dimensions.side) || 0
    const diagonal = parseFloat(dimensions.diagonal) || 0

    let volume = 0
    let surfaceArea: number | undefined
    let lateralArea: number | undefined

    switch (selectedShape) {
      case 'cube':
        volume = side * side * side
        surfaceArea = 6 * side * side
        break
      case 'rectangular-prism':
        volume = length * width * height
        surfaceArea = 2 * (length * width + length * height + width * height)
        break
      case 'sphere':
        volume = (4/3) * Math.PI * radius * radius * radius
        surfaceArea = 4 * Math.PI * radius * radius
        break
      case 'cylinder':
        volume = Math.PI * radius * radius * height
        surfaceArea = 2 * Math.PI * radius * (radius + height)
        lateralArea = 2 * Math.PI * radius * height
        break
      case 'cone':
        volume = (1/3) * Math.PI * radius * radius * height
        const slantHeight = Math.sqrt(radius * radius + height * height)
        surfaceArea = Math.PI * radius * (radius + slantHeight)
        lateralArea = Math.PI * radius * slantHeight
        break
      case 'pyramid':
        volume = (1/3) * base * height
        // Approximate surface area for regular pyramid
        const baseArea = base * base
        const lateralHeight = Math.sqrt(height * height + (base/2) * (base/2))
        lateralArea = 4 * (1/2) * base * lateralHeight
        surfaceArea = baseArea + lateralArea
        break
      case 'triangular-prism':
        volume = (1/2) * base * height * length
        const triangleArea = (1/2) * base * height
        const rectangleArea = length * (base + height + Math.sqrt(base * base + height * height))
        surfaceArea = 2 * triangleArea + rectangleArea
        break
      case 'torus':
        const majorRadius = radius
        const minorRadius = height
        volume = 2 * Math.PI * Math.PI * majorRadius * minorRadius * minorRadius
        surfaceArea = 4 * Math.PI * Math.PI * majorRadius * minorRadius
        break
      case 'ellipsoid':
        const a = length / 2
        const b = width / 2
        const c = height / 2
        volume = (4/3) * Math.PI * a * b * c
        // Approximation of surface area
        const p = 1.6075
        surfaceArea = 4 * Math.PI * Math.pow((Math.pow(a * b, p) + Math.pow(a * c, p) + Math.pow(b * c, p)) / 3, 1/p)
        break
      case 'hexagonal-prism':
        volume = (3 * Math.sqrt(3) * side * side * height) / 2
        const hexagonArea = (3 * Math.sqrt(3) * side * side) / 2
        const hexagonPerimeter = 6 * side
        surfaceArea = 2 * hexagonArea + hexagonPerimeter * height
        break
    }

    return {
      volume: Math.round(volume * 1000000) / 1000000,
      surfaceArea: surfaceArea ? Math.round(surfaceArea * 1000000) / 1000000 : undefined,
      lateralArea: lateralArea ? Math.round(lateralArea * 1000000) / 1000000 : undefined,
      units
    }
  }, [selectedShape, dimensions, units])

  const getShapeDescription = () => {
    switch (selectedShape) {
      case 'cube': return 'A six-faced solid with all sides equal and all angles 90°'
      case 'rectangular-prism': return 'A six-faced solid with opposite faces equal and all angles 90°'
      case 'sphere': return 'A perfectly round 3D shape with all points equidistant from center'
      case 'cylinder': return 'A solid with circular bases and straight sides'
      case 'cone': return 'A solid with circular base tapering to a point'
      case 'pyramid': return 'A solid with polygonal base and triangular faces meeting at apex'
      case 'triangular-prism': return 'A solid with triangular bases and rectangular sides'
      case 'torus': return 'A doughnut-shaped solid formed by rotating a circle'
      case 'ellipsoid': return 'A 3D oval shape with three different axes'
      case 'hexagonal-prism': return 'A solid with hexagonal bases and rectangular sides'
      default: return ''
    }
  }

  const getDimensionsSummary = (): string => {
    switch (selectedShape) {
      case 'cube':
        return `Side: ${dimensions.side || 0}${units}`
      case 'rectangular-prism':
        return `L: ${dimensions.length || 0}${units}, W: ${dimensions.width || 0}${units}, H: ${dimensions.height || 0}${units}`
      case 'sphere':
        return `Radius: ${dimensions.radius || 0}${units}`
      case 'cylinder':
        return `Radius: ${dimensions.radius || 0}${units}, Height: ${dimensions.height || 0}${units}`
      case 'cone':
        return `Radius: ${dimensions.radius || 0}${units}, Height: ${dimensions.height || 0}${units}`
      case 'pyramid':
        return `Base: ${dimensions.base || 0}${units}, Height: ${dimensions.height || 0}${units}`
      case 'triangular-prism':
        return `Base: ${dimensions.base || 0}${units}, Height: ${dimensions.height || 0}${units}, Length: ${dimensions.length || 0}${units}`
      case 'torus':
        return `Major Radius: ${dimensions.radius || 0}${units}, Minor Radius: ${dimensions.height || 0}${units}`
      case 'ellipsoid':
        return `X: ${dimensions.length || 0}${units}, Y: ${dimensions.width || 0}${units}, Z: ${dimensions.height || 0}${units}`
      case 'hexagonal-prism':
        return `Side: ${dimensions.side || 0}${units}, Height: ${dimensions.height || 0}${units}`
      default:
        return 'Dimensions not specified'
    }
  }

  const getRequiredFields = () => {
    switch (selectedShape) {
      case 'cube':
        return ['side']
      case 'rectangular-prism':
        return ['length', 'width', 'height']
      case 'sphere':
        return ['radius']
      case 'cylinder':
        return ['radius', 'height']
      case 'cone':
        return ['radius', 'height']
      case 'pyramid':
        return ['base', 'height']
      case 'triangular-prism':
        return ['base', 'height', 'length']
      case 'torus':
        return ['radius', 'height']
      case 'ellipsoid':
        return ['length', 'width', 'height']
      case 'hexagonal-prism':
        return ['side', 'height']
      default:
        return []
    }
  }

  const reset = () => {
    setDimensions({
      length: '',
      width: '',
      height: '',
      radius: '',
      base: '',
      side: '',
      diagonal: ''
    })
    setUnits('m')
  }

  const result = calculateVolume()
  const requiredFields = getRequiredFields()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-4">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Box className="w-12 h-12 mr-3 text-violet-600" />
            Volume Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate volumes of various 3D geometric shapes
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-violet-600" />
              Shape & Dimensions
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Shape
                </label>
                <select
                  value={selectedShape}
                  onChange={(e) => setSelectedShape(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  aria-label="Shape selection"
                  title="Select 3D geometric shape"
                >
                  <option value="cube">Cube</option>
                  <option value="rectangular-prism">Rectangular Prism</option>
                  <option value="sphere">Sphere</option>
                  <option value="cylinder">Cylinder</option>
                  <option value="cone">Cone</option>
                  <option value="pyramid">Pyramid (Square Base)</option>
                  <option value="triangular-prism">Triangular Prism</option>
                  <option value="torus">Torus (Doughnut)</option>
                  <option value="ellipsoid">Ellipsoid</option>
                  <option value="hexagonal-prism">Hexagonal Prism</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Units
                </label>
                <select
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  aria-label="Unit selection"
                  title="Select measurement unit"
                >
                  <option value="mm">Millimeters (mm)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="m">Meters (m)</option>
                  <option value="km">Kilometers (km)</option>
                  <option value="in">Inches (in)</option>
                  <option value="ft">Feet (ft)</option>
                  <option value="yd">Yards (yd)</option>
                  <option value="mi">Miles (mi)</option>
                </select>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Required Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {requiredFields.includes('length') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Length
                      </label>
                      <input
                        type="number"
                        value={dimensions.length}
                        onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        placeholder="0"
                        step="any"
                        title="Enter length"
                        aria-label="Length value"
                      />
                    </div>
                  )}

                  {requiredFields.includes('width') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width
                      </label>
                      <input
                        type="number"
                        value={dimensions.width}
                        onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        placeholder="0"
                        step="any"
                        title="Enter width"
                        aria-label="Width value"
                      />
                    </div>
                  )}

                  {requiredFields.includes('height') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height
                      </label>
                      <input
                        type="number"
                        value={dimensions.height}
                        onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        placeholder="0"
                        step="any"
                        title="Enter height"
                        aria-label="Height value"
                      />
                    </div>
                  )}

                  {requiredFields.includes('radius') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Radius
                      </label>
                      <input
                        type="number"
                        value={dimensions.radius}
                        onChange={(e) => setDimensions({...dimensions, radius: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        placeholder="0"
                        step="any"
                        title="Enter radius"
                        aria-label="Radius value"
                      />
                    </div>
                  )}

                  {requiredFields.includes('base') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base
                      </label>
                      <input
                        type="number"
                        value={dimensions.base}
                        onChange={(e) => setDimensions({...dimensions, base: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        placeholder="0"
                        step="any"
                        title="Enter base"
                        aria-label="Base value"
                      />
                    </div>
                  )}

                  {requiredFields.includes('side') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Side
                      </label>
                      <input
                        type="number"
                        value={dimensions.side}
                        onChange={(e) => setDimensions({...dimensions, side: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        placeholder="0"
                        step="any"
                        title="Enter side"
                        aria-label="Side value"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={reset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Share Options - Moved to Top */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
              <ResultSharing
                title="Volume Calculation Result"
                inputs={[
                  { label: "Shape", value: selectedShape.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) },
                  { label: "Units", value: units },
                  { label: "Dimensions", value: getDimensionsSummary() }
                ]}
                result={{ 
                  label: "Volume", 
                  value: result.volume.toString(),
                  unit: `${units}³`
                }}
                calculatorName="Volume Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Ruler className="w-6 h-6 mr-2 text-violet-600" />
                Calculation Results
              </h2>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-violet-600 mb-2">
                  {result.volume}
                </div>
                <p className="text-gray-600">cubic {units}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Shape</span>
                  <span className="font-semibold capitalize">
                    {selectedShape.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-semibold text-violet-600">
                    {result.volume} {units}³
                  </span>
                </div>
                {result.surfaceArea && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Surface Area</span>
                    <span className="font-semibold text-blue-600">
                      {result.surfaceArea} {units}²
                    </span>
                  </div>
                )}
                {result.lateralArea && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Lateral Area</span>
                    <span className="font-semibold text-green-600">
                      {result.lateralArea} {units}²
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Shape Information</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="font-semibold text-gray-800">
                  {selectedShape.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p>{getShapeDescription()}</p>
                <p>• <strong>Volume:</strong> The amount of 3D space inside the shape</p>
                <p>• <strong>Surface Area:</strong> The total area of all faces</p>
                <p>• <strong>Lateral Area:</strong> The area of side faces only</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-violet-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Volume Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Cube:</strong> Side³</p>
                <p>• <strong>Sphere:</strong> (4/3) × π × Radius³</p>
                <p>• <strong>Cylinder:</strong> π × Radius² × Height</p>
                <p>• <strong>Cone:</strong> (1/3) × π × Radius² × Height</p>
                <p>• <strong>Units:</strong> Always use consistent units for calculations</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Volume Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
