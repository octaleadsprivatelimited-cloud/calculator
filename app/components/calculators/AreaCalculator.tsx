'use client'

import React, { useState, useCallback } from 'react'
import { Square, Calculator as CalculatorIcon, RotateCcw, Ruler } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface AreaResult {
  area: number
  perimeter?: number
  circumference?: number
  units: string
}

export default function AreaCalculator() {
  const [selectedShape, setSelectedShape] = useState('rectangle')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    radius: '',
    base: '',
    side1: '',
    side2: '',
    side3: '',
    diagonal: ''
  })
  const [units, setUnits] = useState('m')

  const calculateArea = useCallback((): AreaResult => {
    const length = parseFloat(dimensions.length) || 0
    const width = parseFloat(dimensions.width) || 0
    const height = parseFloat(dimensions.height) || 0
    const radius = parseFloat(dimensions.radius) || 0
    const base = parseFloat(dimensions.base) || 0
    const side1 = parseFloat(dimensions.side1) || 0
    const side2 = parseFloat(dimensions.side2) || 0
    const side3 = parseFloat(dimensions.side3) || 0
    const diagonal = parseFloat(dimensions.diagonal) || 0

    let area = 0
    let perimeter: number | undefined
    let circumference: number | undefined

    switch (selectedShape) {
      case 'rectangle':
        area = length * width
        perimeter = 2 * (length + width)
        break
      case 'square':
        area = length * length
        perimeter = 4 * length
        break
      case 'circle':
        area = Math.PI * radius * radius
        circumference = 2 * Math.PI * radius
        break
      case 'triangle':
        // Heron's formula for any triangle
        const s = (side1 + side2 + side3) / 2
        area = Math.sqrt(s * (s - side1) * (s - side2) * (s - side3))
        perimeter = side1 + side2 + side3
        break
      case 'right-triangle':
        area = (base * height) / 2
        const hypotenuse = Math.sqrt(base * base + height * height)
        perimeter = base + height + hypotenuse
        break
      case 'trapezoid':
        area = ((side1 + side2) * height) / 2
        perimeter = side1 + side2 + side3 + side3
        break
      case 'parallelogram':
        area = base * height
        perimeter = 2 * (side1 + side2)
        break
      case 'rhombus':
        area = (diagonal * diagonal) / 2
        perimeter = 4 * side1
        break
      case 'ellipse':
        area = Math.PI * length * width
        // Approximation of perimeter
        const a = Math.max(length, width) / 2
        const b = Math.min(length, width) / 2
        circumference = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))
        break
      case 'hexagon':
        area = (3 * Math.sqrt(3) * side1 * side1) / 2
        perimeter = 6 * side1
        break
      case 'octagon':
        area = 2 * (1 + Math.sqrt(2)) * side1 * side1
        perimeter = 8 * side1
        break
    }

    return {
      area: Math.round(area * 1000000) / 1000000,
      perimeter: perimeter ? Math.round(perimeter * 1000000) / 1000000 : undefined,
      circumference: circumference ? Math.round(circumference * 1000000) / 1000000 : undefined,
      units
    }
  }, [selectedShape, dimensions, units])

  const getShapeDescription = () => {
    switch (selectedShape) {
      case 'rectangle': return 'A quadrilateral with four right angles'
      case 'square': return 'A quadrilateral with four equal sides and four right angles'
      case 'circle': return 'A perfectly round shape with all points equidistant from center'
      case 'triangle': return 'A polygon with three sides and three angles'
      case 'right-triangle': return 'A triangle with one 90-degree angle'
      case 'trapezoid': return 'A quadrilateral with at least one pair of parallel sides'
      case 'parallelogram': return 'A quadrilateral with opposite sides parallel'
      case 'rhombus': return 'A quadrilateral with all sides equal length'
      case 'ellipse': return 'An oval shape with two focal points'
      case 'hexagon': return 'A six-sided polygon'
      case 'octagon': return 'An eight-sided polygon'
      default: return ''
    }
  }

  const getDimensionsSummary = (): string => {
    switch (selectedShape) {
      case 'rectangle':
        return `L: ${dimensions.length || 0}${units}, W: ${dimensions.width || 0}${units}`
      case 'square':
        return `Side: ${dimensions.length || 0}${units}`
      case 'circle':
        return `Radius: ${dimensions.radius || 0}${units}`
      case 'triangle':
        return `Sides: ${dimensions.side1 || 0}${units}, ${dimensions.side2 || 0}${units}, ${dimensions.side3 || 0}${units}`
      case 'right-triangle':
        return `Base: ${dimensions.base || 0}${units}, Height: ${dimensions.height || 0}${units}`
      case 'trapezoid':
        return `Sides: ${dimensions.side1 || 0}${units}, ${dimensions.side2 || 0}${units}, Height: ${dimensions.height || 0}${units}`
      case 'parallelogram':
        return `Base: ${dimensions.base || 0}${units}, Height: ${dimensions.height || 0}${units}`
      case 'rhombus':
        return `Side: ${dimensions.side1 || 0}${units}, Diagonal: ${dimensions.diagonal || 0}${units}`
      case 'ellipse':
        return `Major: ${dimensions.length || 0}${units}, Minor: ${dimensions.width || 0}${units}`
      case 'hexagon':
        return `Side: ${dimensions.side1 || 0}${units}`
      case 'octagon':
        return `Side: ${dimensions.side1 || 0}${units}`
      default:
        return 'Dimensions not specified'
    }
  }

  const getRequiredFields = () => {
    switch (selectedShape) {
      case 'rectangle':
        return ['length', 'width']
      case 'square':
        return ['length']
      case 'circle':
        return ['radius']
      case 'triangle':
        return ['side1', 'side2', 'side3']
      case 'right-triangle':
        return ['base', 'height']
      case 'trapezoid':
        return ['side1', 'side2', 'height']
      case 'parallelogram':
        return ['base', 'height', 'side1', 'side2']
      case 'rhombus':
        return ['diagonal', 'side1']
      case 'ellipse':
        return ['length', 'width']
      case 'hexagon':
        return ['side1']
      case 'octagon':
        return ['side1']
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
      side1: '',
      side2: '',
      side3: '',
      diagonal: ''
    })
    setUnits('m')
  }

  const result = calculateArea()
  const requiredFields = getRequiredFields()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Square className="w-12 h-12 mr-3 text-emerald-600" />
            Area Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate areas of various geometric shapes
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-emerald-600" />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  aria-label="Shape selection"
                  title="Select geometric shape"
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="square">Square</option>
                  <option value="circle">Circle</option>
                  <option value="triangle">Triangle (Any)</option>
                  <option value="right-triangle">Right Triangle</option>
                  <option value="trapezoid">Trapezoid</option>
                  <option value="parallelogram">Parallelogram</option>
                  <option value="rhombus">Rhombus</option>
                  <option value="ellipse">Ellipse</option>
                  <option value="hexagon">Regular Hexagon</option>
                  <option value="octagon">Regular Octagon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Units
                </label>
                <select
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        placeholder="0"
                        step="any"
                        title="Enter base"
                        aria-label="Base value"
                      />
                    </div>
                  )}

                  {requiredFields.includes('side1') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Side 1
                      </label>
                      <input
                        type="number"
                        value={dimensions.side1}
                        onChange={(e) => setDimensions({...dimensions, side1: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        placeholder="0"
                        step="any"
                        title="Enter side 1"
                        aria-label="Side 1 value"
                      />
                    </div>
                  )}

                  {requiredFields.includes('side2') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Side 2
                      </label>
                      <input
                        type="number"
                        value={dimensions.side2}
                        onChange={(e) => setDimensions({...dimensions, side2: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        placeholder="0"
                        step="any"
                        title="Enter side 2"
                        aria-label="Side 2 value"
                      />
                    </div>
                  )}

                  {requiredFields.includes('side3') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Side 3
                      </label>
                      <input
                        type="number"
                        value={dimensions.side3}
                        onChange={(e) => setDimensions({...dimensions, side3: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        placeholder="0"
                        step="any"
                        title="Enter side 3"
                        aria-label="Side 3 value"
                      />
                    </div>
                  )}

                  {requiredFields.includes('diagonal') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagonal
                      </label>
                      <input
                        type="number"
                        value={dimensions.diagonal}
                        onChange={(e) => setDimensions({...dimensions, diagonal: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        placeholder="0"
                        step="any"
                        title="Enter diagonal"
                        aria-label="Diagonal value"
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
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
              <ResultSharing
                title="Area Calculation Result"
                inputs={[
                  { label: "Shape", value: selectedShape.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) },
                  { label: "Units", value: units },
                  { label: "Dimensions", value: getDimensionsSummary() }
                ]}
                result={{ 
                  label: "Area", 
                  value: result.area.toString(),
                  unit: `${units}²`
                }}
                calculatorName="Area Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Ruler className="w-6 h-6 mr-2 text-emerald-600" />
                Calculation Results
              </h2>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {result.area}
                </div>
                <p className="text-gray-600">square {units}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Shape</span>
                  <span className="font-semibold capitalize">
                    {selectedShape.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Area</span>
                  <span className="font-semibold text-emerald-600">
                    {result.area} {units}²
                  </span>
                </div>
                {result.perimeter && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Perimeter</span>
                    <span className="font-semibold text-blue-600">
                      {result.perimeter} {units}
                    </span>
                  </div>
                )}
                {result.circumference && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Circumference</span>
                    <span className="font-semibold text-purple-600">
                      {result.circumference} {units}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Shape Information</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="font-semibold text-gray-800">
                  {selectedShape.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p>{getShapeDescription()}</p>
                <p>• <strong>Area:</strong> The amount of space inside the shape</p>
                <p>• <strong>Perimeter:</strong> The total length around the shape</p>
                <p>• <strong>Circumference:</strong> The perimeter of a circle</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-emerald-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Area Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Rectangle/Square:</strong> Length × Width</p>
                <p>• <strong>Circle:</strong> π × Radius²</p>
                <p>• <strong>Triangle:</strong> ½ × Base × Height</p>
                <p>• <strong>Regular Polygons:</strong> Use specific formulas for accuracy</p>
                <p>• <strong>Units:</strong> Always use consistent units for calculations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Description Section */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Area Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive area calculator helps students, professionals, and DIY enthusiasts 
              calculate the area of various geometric shapes quickly and accurately. This essential 
              mathematical tool provides precise area calculations for common shapes, helping with 
              homework, construction projects, landscaping, and professional applications.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Area:</strong> Space enclosed within geometric shapes</li>
              <li><strong>Perimeter:</strong> Total length around shapes</li>
              <li><strong>Circumference:</strong> Perimeter of circular shapes</li>
              <li><strong>Multiple Shapes:</strong> 11 different geometric forms</li>
              <li><strong>Unit Conversions:</strong> 8 different measurement units</li>
              <li><strong>Shape Properties:</strong> Mathematical characteristics</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Supported Geometric Shapes</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Basic Shapes</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Rectangle:</strong> Length × Width</li>
                <li><strong>Square:</strong> Side²</li>
                <li><strong>Circle:</strong> π × Radius²</li>
                <li><strong>Triangle:</strong> ½ × Base × Height</li>
                <li><strong>Right Triangle:</strong> ½ × Base × Height</li>
                <li><strong>Trapezoid:</strong> ½ × (Base1 + Base2) × Height</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Advanced Shapes</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Parallelogram:</strong> Base × Height</li>
                <li><strong>Rhombus:</strong> ½ × Diagonal1 × Diagonal2</li>
                <li><strong>Ellipse:</strong> π × Semi-major × Semi-minor</li>
                <li><strong>Regular Hexagon:</strong> 3√3/2 × Side²</li>
                <li><strong>Regular Octagon:</strong> 2(1+√2) × Side²</li>
                <li><strong>Custom Shapes:</strong> Complex geometry support</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <h5 className="font-semibold text-emerald-800 mb-1">Area</h5>
              <p className="text-emerald-700 text-sm">Space inside shape</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-1">Perimeter</h5>
              <p className="text-blue-700 text-sm">Length around shape</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-1">Circumference</h5>
              <p className="text-purple-700 text-sm">Circle perimeter</p>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
          <p className="text-gray-700 mb-4">
            Select your desired geometric shape, choose your preferred measurement units, and enter 
            the required dimensions. The calculator will automatically compute the area, perimeter, 
            and other relevant measurements, providing instant results for your calculations.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Measurement Units</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Metric System</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Millimeters (mm):</strong> Precise small measurements</li>
                <li><strong>Centimeters (cm):</strong> Common household measurements</li>
                <li><strong>Meters (m):</strong> Standard metric unit</li>
                <li><strong>Kilometers (km):</strong> Large area measurements</li>
                <li><strong>Square Units:</strong> mm², cm², m², km²</li>
                <li><strong>International Standard:</strong> Scientific applications</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Imperial System</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Inches (in):</strong> Precise small measurements</li>
                <li><strong>Feet (ft):</strong> Common construction unit</li>
                <li><strong>Yards (yd):</strong> Landscaping measurements</li>
                <li><strong>Miles (mi):</strong> Large area measurements</li>
                <li><strong>Square Units:</strong> in², ft², yd², mi²</li>
                <li><strong>US Standard:</strong> Construction and real estate</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Area Calculation Formulas</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Rectangle & Square:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Area = Length × Width</li>
                  <li>Square: Area = Side²</li>
                  <li>Perimeter = 2(Length + Width)</li>
                  <li>Square: Perimeter = 4 × Side</li>
                  <li>Most common shape</li>
                  <li>Easy to calculate</li>
                </ul>
              </div>
              <div>
                <p><strong>Circle:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Area = π × Radius²</li>
                  <li>Circumference = 2π × Radius</li>
                  <li>π ≈ 3.14159</li>
                  <li>Perfect symmetry</li>
                  <li>No corners or edges</li>
                  <li>Maximum area efficiency</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Triangle Calculations</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>General Triangle:</strong> Area = ½ × Base × Height</li>
            <li><strong>Right Triangle:</strong> Area = ½ × Base × Height</li>
            <li><strong>Heron's Formula:</strong> Area = √(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2</li>
            <li><strong>Perimeter:</strong> Sum of all three sides</li>
            <li><strong>Height Calculation:</strong> Perpendicular distance from base to opposite vertex</li>
            <li><strong>Special Cases:</strong> Equilateral, isosceles, scalene triangles</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Practical Applications</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Construction & Building</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Floor Plans:</strong> Room area calculations</li>
                <li><strong>Material Estimates:</strong> Paint, flooring, carpet</li>
                <li><strong>Landscaping:</strong> Garden and yard areas</li>
                <li><strong>Roofing:</strong> Shingle and material needs</li>
                <li><strong>Fencing:</strong> Perimeter calculations</li>
                <li><strong>Concrete:</strong> Foundation and slab areas</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Academic & Professional</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Mathematics:</strong> Geometry and trigonometry</li>
                <li><strong>Engineering:</strong> Structural calculations</li>
                <li><strong>Architecture:</strong> Building design</li>
                <li><strong>Surveying:</strong> Land measurements</li>
                <li><strong>Physics:</strong> Surface area calculations</li>
                <li><strong>Chemistry:</strong> Molecular surface areas</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Area Calculation Tips</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Consistent Units:</strong> Always use the same unit system throughout</li>
            <li><strong>Precision:</strong> More decimal places for smaller measurements</li>
            <li><strong>Shape Recognition:</strong> Identify the correct geometric shape first</li>
            <li><strong>Formula Selection:</strong> Choose the appropriate formula for your shape</li>
            <li><strong>Double-Check:</strong> Verify your measurements and calculations</li>
            <li><strong>Unit Conversion:</strong> Convert units if necessary before calculating</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Calculation Mistakes</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Unit Confusion:</strong> Mixing metric and imperial units</li>
            <li><strong>Formula Errors:</strong> Using wrong formula for shape</li>
            <li><strong>Measurement Errors:</strong> Incorrect dimension values</li>
            <li><strong>Rounding Errors:</strong> Too early or too late rounding</li>
            <li><strong>Shape Misidentification:</strong> Wrong geometric classification</li>
            <li><strong>Missing Dimensions:</strong> Incomplete shape information</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Area Concepts</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Composite Shapes:</strong> Break complex shapes into simple ones</li>
            <li><strong>Irregular Shapes:</strong> Use approximation methods</li>
            <li><strong>Surface Area:</strong> 3D object surface calculations</li>
            <li><strong>Volume Calculations:</strong> 3D space calculations</li>
            <li><strong>Integration Methods:</strong> Calculus-based area calculations</li>
            <li><strong>Numerical Methods:</strong> Computer-aided calculations</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
            <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
            <p className="text-gray-700 text-sm">
              When working with area calculations, always start by identifying the geometric shape 
              and ensuring you have all the required dimensions. For complex shapes, break them down 
              into simpler geometric forms and calculate each area separately before combining. 
              Remember that area is always expressed in square units, and perimeter/circumference 
              in linear units. For maximum accuracy, use consistent units throughout your calculations 
              and consider the precision needed for your specific application.
            </p>
          </div>
        </div>
      </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Area Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
