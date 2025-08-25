'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Ruler, Home, AlertTriangle } from 'lucide-react'

interface StairResult {
  totalRise: number
  totalRun: number
  numberOfSteps: number
  riseHeight: number
  runDepth: number
  stringerLength: number
  angle: number
  compliance: string
  safety: string
}

interface StairType {
  name: string
  maxRise: number
  minRun: number
  description: string
  use: string
}

const STAIR_TYPES: StairType[] = [
  { name: 'Residential', maxRise: 7.75, minRun: 10, description: 'Standard home stairs', use: 'Homes and apartments' },
  { name: 'Commercial', maxRise: 7.0, minRun: 11, description: 'Public building stairs', use: 'Offices and retail' },
  { name: 'Industrial', maxRise: 8.0, minRun: 9, description: 'Factory and warehouse', use: 'Industrial facilities' },
  { name: 'Emergency', maxRise: 8.5, minRun: 8.5, description: 'Emergency exit stairs', use: 'Fire escapes' },
  { name: 'ADA Compliant', maxRise: 6.0, minRun: 12, description: 'Accessibility standards', use: 'Public access' },
  { name: 'Outdoor', maxRise: 6.0, minRun: 12, description: 'Exterior stairs', use: 'Patios and decks' }
]

const SAFETY_RULES = [
  { rule: '2R + G = 25"', description: 'Rise + Run formula for comfort' },
  { rule: 'Rise ≤ 7.75"', description: 'Maximum rise height' },
  { rule: 'Run ≥ 10"', description: 'Minimum tread depth' },
  { rule: 'Angle ≤ 37°', description: 'Maximum stair angle' },
  { rule: 'Consistent steps', description: 'All steps must be uniform' }
]

export default function StairCalculator() {
  const [stairType, setStairType] = useState('Residential')
  const [floorHeight, setFloorHeight] = useState('')
  const [floorDistance, setFloorDistance] = useState('')
  const [maxRise, setMaxRise] = useState('')
  const [minRun, setMinRun] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateStairs = useCallback((): StairResult => {
    const height = parseFloat(floorHeight) || 0
    const distance = parseFloat(floorDistance) || 0
    const rise = parseFloat(maxRise) || 0
    const run = parseFloat(minRun) || 0
    
    if (height === 0) return {
      totalRise: 0,
      totalRun: 0,
      numberOfSteps: 0,
      riseHeight: 0,
      runDepth: 0,
      stringerLength: 0,
      angle: 0,
      compliance: '',
      safety: ''
    }

    // Calculate number of steps
    const steps = Math.ceil(height / rise)
    
    // Calculate actual rise height
    const actualRise = height / steps
    
    // Calculate run depth
    const actualRun = run > 0 ? run : 10 // Default to 10 inches
    
    // Calculate total run
    const totalRun = (steps - 1) * actualRun
    
    // Calculate stringer length
    const stringerLength = Math.sqrt(Math.pow(height, 2) + Math.pow(totalRun, 2))
    
    // Calculate angle
    const angle = Math.atan(height / totalRun) * (180 / Math.PI)
    
    // Check compliance
    let compliance = 'Compliant'
    let safety = 'Safe'
    
    if (actualRise > 7.75) {
      compliance = 'Non-compliant'
      safety = 'Rise too high'
    }
    if (actualRun < 10) {
      compliance = 'Non-compliant'
      safety = 'Run too short'
    }
    if (angle > 37) {
      compliance = 'Non-compliant'
      safety = 'Angle too steep'
    }
    
    // Check comfort formula
    const comfortValue = (2 * actualRise) + actualRun
    if (comfortValue < 22 || comfortValue > 28) {
      safety = 'May be uncomfortable'
    }

    return {
      totalRise: height,
      totalRun,
      numberOfSteps: steps,
      riseHeight: actualRise,
      runDepth: actualRun,
      stringerLength,
      angle,
      compliance,
      safety
    }
  }, [floorHeight, floorDistance, maxRise, minRun])

  const handleCalculate = () => {
    if (floorHeight) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setFloorHeight('')
    setFloorDistance('')
    setMaxRise('')
    setMinRun('')
    setStairType('Residential')
    setShowResults(false)
  }

  const handleQuickStair = (stair: StairType) => {
    setStairType(stair.name)
    setMaxRise(stair.maxRise.toString())
    setMinRun(stair.minRun.toString())
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculateStairs()
    
    const data = `Stair Calculator Results

Stair Type: ${stairType}

Input Values:
- Floor Height: ${floorHeight} inches
- Floor Distance: ${floorDistance} inches
- Max Rise: ${maxRise} inches
- Min Run: ${minRun} inches

Results:
- Total Rise: ${formatNumber(result.totalRise)} inches
- Total Run: ${formatNumber(result.totalRun)} inches
- Number of Steps: ${result.numberOfSteps}
- Rise Height: ${formatNumber(result.riseHeight)} inches
- Run Depth: ${formatNumber(result.runDepth)} inches
- Stringer Length: ${formatNumber(result.stringerLength)} inches
- Stair Angle: ${formatNumber(result.angle)} degrees
- Compliance: ${result.compliance}
- Safety: ${result.safety}

Safety Notes:
- Rise should be ≤ 7.75 inches
- Run should be ≥ 10 inches
- Angle should be ≤ 37 degrees
- 2R + G should be between 22-28 inches for comfort`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stair-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateStairs()
      
      navigator.share({
        title: 'Stair Calculator Results',
        text: `${result.numberOfSteps} steps, ${formatNumber(result.riseHeight)}" rise, ${formatNumber(result.runDepth)}" run`,
        url: window.location.href
      })
    } else {
      const result = calculateStairs()
      const text = `Stairs: ${result.numberOfSteps} steps, ${formatNumber(result.riseHeight)}" rise`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateStairs() : { totalRise: 0, totalRun: 0, numberOfSteps: 0, riseHeight: 0, runDepth: 0, stringerLength: 0, angle: 0, compliance: '', safety: '' }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stair Calculator</h1>
            <p className="text-green-100 text-lg">
              Professional stair design calculator with safety compliance checks. 
              Perfect for builders, architects, and DIY enthusiasts.
            </p>
          </div>
          <div className="hidden md:block">
            <Home className="w-16 h-16 text-green-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stair Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Stair Type Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAIR_TYPES.map((stair, index) => (
              <button
                key={index}
                onClick={() => handleQuickStair(stair)}
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left"
              >
                <div className="font-semibold text-green-800">{stair.name}</div>
                <div className="text-sm text-green-600">Max Rise: {stair.maxRise}", Min Run: {stair.minRun}"</div>
                <div className="text-xs text-green-500">{stair.description}</div>
                <div className="text-xs text-green-400 mt-1">{stair.use}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Basic Measurements */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor Height (inches)
              </label>
              <input
                type="number"
                value={floorHeight}
                onChange={(e) => setFloorHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="120"
                min="24"
                max="300"
                step="0.5"
                aria-label="Total floor height in inches"
              />
              <p className="text-xs text-gray-500 mt-1">Total height from floor to floor</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor Distance (inches)
              </label>
              <input
                type="number"
                value={floorDistance}
                onChange={(e) => setFloorDistance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="180"
                min="60"
                max="500"
                step="0.5"
                aria-label="Horizontal distance between floors"
              />
              <p className="text-xs text-gray-500 mt-1">Horizontal distance available</p>
            </div>
          </div>

          {/* Stair Specifications */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Rise Height (inches)
              </label>
              <input
                type="number"
                value={maxRise}
                onChange={(e) => setMaxRise(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="7.75"
                min="4"
                max="12"
                step="0.25"
                aria-label="Maximum rise height per step"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum rise per step (≤ 7.75" recommended)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Run Depth (inches)
              </label>
              <input
                type="number"
                value={minRun}
                onChange={(e) => setMinRun(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="10"
                min="8"
                max="16"
                step="0.5"
                aria-label="Minimum tread depth per step"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum tread depth (≥ 10" recommended)</p>
            </div>
          </div>
        </div>

        {/* Safety Rules */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Safety Rules & Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAFETY_RULES.map((rule, index) => (
              <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="font-semibold text-yellow-800 text-lg">{rule.rule}</div>
                <div className="text-sm text-yellow-600">{rule.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        {floorHeight && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Stairs</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Stair Results */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Stair Calculation Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.numberOfSteps}</div>
                  <div className="text-sm text-gray-600">Total Steps</div>
                  <div className="text-xs text-green-600">Including landing</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{formatNumber(result.riseHeight)}"</div>
                  <div className="text-sm text-gray-600">Rise Height</div>
                  <div className="text-xs text-blue-600">Per step</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatNumber(result.runDepth)}"</div>
                  <div className="text-sm text-gray-600">Run Depth</div>
                  <div className="text-xs text-purple-600">Per step</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{formatNumber(result.angle)}°</div>
                  <div className="text-sm text-gray-600">Stair Angle</div>
                  <div className="text-xs text-orange-600">From horizontal</div>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Stair Dimensions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Vertical Measurements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Rise:</span>
                      <span className="font-semibold">{formatNumber(result.totalRise)} inches</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rise per Step:</span>
                      <span className="font-semibold">{formatNumber(result.riseHeight)} inches</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Horizontal Measurements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Run:</span>
                      <span className="font-semibold">{formatNumber(result.totalRun)} inches</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stringer Length:</span>
                      <span className="font-semibold">{formatNumber(result.stringerLength)} inches</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Check */}
            <div className={`p-6 rounded-lg border ${
              result.compliance === 'Compliant' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                {result.compliance === 'Compliant' ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">✓</span>
                  </div>
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                )}
                <h3 className={`text-lg font-semibold ${
                  result.compliance === 'Compliant' ? 'text-green-800' : 'text-red-800'
                }`}>
                  Compliance Status: {result.compliance}
                </h3>
              </div>
              <div className={`text-sm ${
                result.compliance === 'Compliant' ? 'text-green-700' : 'text-red-700'
              }`}>
                <strong>Safety Note:</strong> {result.safety}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={shareResults}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={printResults}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
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

        {/* Comprehensive Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Stair Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive stair calculator helps architects, builders, and homeowners design safe, 
                comfortable, and code-compliant stairs. It automatically calculates optimal dimensions while 
                ensuring adherence to building codes and safety standards across different stair types.
              </p>
              <p className="text-gray-700">
                The calculator considers ergonomic principles, building regulations, and accessibility requirements 
                to provide stair designs that are both functional and safe for all users.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Stair Design Principles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Comfort Formula</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>2R + G = 22-28 inches</strong></li>
                    <li>R = Rise height (vertical step)</li>
                    <li>G = Going/run depth (horizontal step)</li>
                    <li>Optimal range: 24-26 inches</li>
                    <li>Ensures comfortable walking rhythm</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Safety Standards</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Maximum Rise:</strong> 7.75 inches (residential)</li>
                    <li><strong>Minimum Run:</strong> 10 inches (residential)</li>
                    <li><strong>Maximum Angle:</strong> 37 degrees</li>
                    <li><strong>Consistency:</strong> All steps must be uniform</li>
                    <li><strong>Handrails:</strong> Required for safety</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Stair Types & Applications</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-2">Building Code Classifications</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Residential Stairs:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Max Rise: 7.75 inches</li>
                      <li>Min Run: 10 inches</li>
                      <li>Use: Homes and apartments</li>
                      <li>Comfort: High priority</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Commercial Stairs:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Max Rise: 7.0 inches</li>
                      <li>Min Run: 11 inches</li>
                      <li>Use: Offices and retail</li>
                      <li>Safety: Maximum priority</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Measurements Explained</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Vertical Dimensions</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Total Rise:</strong> Floor-to-floor height</li>
                    <li><strong>Rise Height:</strong> Individual step height</li>
                    <li><strong>Number of Steps:</strong> Calculated from rise</li>
                    <li><strong>Landing Height:</strong> Intermediate platforms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Horizontal Dimensions</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Total Run:</strong> Horizontal distance</li>
                    <li><strong>Run Depth:</strong> Individual step depth</li>
                    <li><strong>Stringer Length:</strong> Diagonal support beam</li>
                    <li><strong>Landing Depth:</strong> Platform dimensions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Building Code Compliance</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>International Building Code (IBC):</strong> Sets minimum safety standards</li>
                <li><strong>Americans with Disabilities Act (ADA):</strong> Accessibility requirements</li>
                <li><strong>Local Building Codes:</strong> May have additional requirements</li>
                <li><strong>Fire Safety Codes:</strong> Emergency exit stair requirements</li>
                <li><strong>Occupancy Loads:</strong> Stair capacity requirements</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Safety Considerations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Physical Safety</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Proper rise-to-run ratios</li>
                    <li>Consistent step dimensions</li>
                    <li>Adequate tread depth</li>
                    <li>Proper handrail height</li>
                    <li>Good lighting and visibility</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Accessibility</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>ADA compliance requirements</li>
                    <li>Handrail specifications</li>
                    <li>Landing requirements</li>
                    <li>Clear width requirements</li>
                    <li>Emergency egress standards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Design Mistakes</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Inconsistent Steps:</strong> Varying rise/run dimensions cause trips</li>
                <li><strong>Steep Angles:</strong> Angles over 37° are difficult to navigate</li>
                <li><strong>Inadequate Run Depth:</strong> Steps too shallow for safe footing</li>
                <li><strong>Missing Handrails:</strong> Essential for safety and accessibility</li>
                <li><strong>Poor Lighting:</strong> Inadequate visibility increases accident risk</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Always consult local building codes before finalizing stair designs</li>
                <li>• Use the comfort formula (2R + G = 24-26 inches) for optimal user experience</li>
                <li>• Consider adding intermediate landings for stairs with more than 12 steps</li>
                <li>• Ensure adequate headroom clearance (minimum 6'8" for residential)</li>
                <li>• Test stair dimensions with actual users when possible</li>
                <li>• Remember that wider stairs (36"+ clear width) are more comfortable and safer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
