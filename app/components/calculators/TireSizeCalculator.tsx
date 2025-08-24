'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, AlertCircle, CheckCircle } from 'lucide-react'

interface TireSize {
  width: number
  aspectRatio: number
  diameter: number
}

interface TireResult {
  circumference: number
  revolutionsPerMile: number
  speedometerDifference: number
  clearance: number
  sidewallHeight: number
}

export default function TireSizeCalculator() {
  const [currentTire, setCurrentTire] = useState<TireSize>({ width: 205, aspectRatio: 55, diameter: 16 })
  const [newTire, setNewTire] = useState<TireSize>({ width: 225, aspectRatio: 50, diameter: 17 })
  const [currentSpeed, setCurrentSpeed] = useState('60')
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validateInputs = (): string[] => {
    const newErrors: string[] = []
    
    if (currentTire.width < 135 || currentTire.width > 345) {
      newErrors.push('Current tire width must be between 135-345 mm')
    }
    if (currentTire.aspectRatio < 30 || currentTire.aspectRatio > 85) {
      newErrors.push('Current aspect ratio must be between 30-85%')
    }
    if (currentTire.diameter < 13 || currentTire.diameter > 24) {
      newErrors.push('Current wheel diameter must be between 13-24 inches')
    }
    
    if (newTire.width < 135 || newTire.width > 345) {
      newErrors.push('New tire width must be between 135-345 mm')
    }
    if (newTire.aspectRatio < 30 || newTire.aspectRatio > 85) {
      newErrors.push('New aspect ratio must be between 30-85%')
    }
    if (newTire.diameter < 13 || newTire.diameter > 24) {
      newErrors.push('New wheel diameter must be between 13-24 inches')
    }
    
    if (parseFloat(currentSpeed) < 1 || parseFloat(currentSpeed) > 200) {
      newErrors.push('Speed must be between 1-200 mph')
    }
    
    return newErrors
  }

  const calculateTireSpecs = useCallback((tire: TireSize): TireResult => {
    const sidewallHeight = (tire.width * tire.aspectRatio) / 100
    const diameterInMm = (tire.diameter * 25.4) + (sidewallHeight * 2)
    const circumference = diameterInMm * Math.PI
    const revolutionsPerMile = 1609344 / circumference // 1 mile = 1,609,344 mm
    const clearance = sidewallHeight
    const speedometerDifference = 0 // Will be calculated when comparing tires

    return {
      circumference,
      revolutionsPerMile,
      speedometerDifference,
      clearance,
      sidewallHeight
    }
  }, [])

  const calculateSpeedometerDifference = useCallback(() => {
    const currentSpecs = calculateTireSpecs(currentTire)
    const newSpecs = calculateTireSpecs(newTire)
    const speed = parseFloat(currentSpeed)
    
    const actualSpeed = (speed * newSpecs.circumference) / currentSpecs.circumference
    const difference = actualSpeed - speed
    
    return { actualSpeed, difference }
  }, [currentTire, newTire, currentSpeed, calculateTireSpecs])

  const handleCalculate = async () => {
    setIsLoading(true)
    setErrors([])
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const validationErrors = validateInputs()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsLoading(false)
      return
    }
    
    setShowResults(true)
    setIsLoading(false)
  }

  const handleReset = () => {
    setCurrentTire({ width: 205, aspectRatio: 55, diameter: 16 })
    setNewTire({ width: 225, aspectRatio: 50, diameter: 17 })
    setCurrentSpeed('60')
    setShowResults(false)
    setErrors([])
  }

  const formatNumber = (num: number, decimals: number = 1) => {
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const currentSpecs = calculateTireSpecs(currentTire)
    const newSpecs = calculateTireSpecs(newTire)
    const speedDiff = calculateSpeedometerDifference()
    
    const data = `Tire Size Calculator Results

Current Tire: ${currentTire.width}/${currentTire.aspectRatio}R${currentTire.diameter}
- Circumference: ${formatNumber(currentSpecs.circumference)} mm
- Revolutions per mile: ${formatNumber(currentSpecs.revolutionsPerMile)}
- Sidewall height: ${formatNumber(currentSpecs.sidewallHeight)} mm

New Tire: ${newTire.width}/${newTire.aspectRatio}R${newTire.diameter}
- Circumference: ${formatNumber(newSpecs.circumference)} mm
- Revolutions per mile: ${formatNumber(newSpecs.revolutionsPerMile)}
- Sidewall height: ${formatNumber(newSpecs.sidewallHeight)} mm

Speedometer Analysis (at ${currentSpeed} mph):
- Actual speed: ${formatNumber(speedDiff.actualSpeed)} mph
- Difference: ${formatNumber(speedDiff.difference)} mph
- Percentage: ${formatNumber((speedDiff.difference / parseFloat(currentSpeed)) * 100)}%`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tire-size-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const currentSpecs = calculateTireSpecs(currentTire)
      const newSpecs = calculateTireSpecs(newTire)
      const speedDiff = calculateSpeedometerDifference()
      
      navigator.share({
        title: 'Tire Size Calculator Results',
        text: `Current: ${currentTire.width}/${currentTire.aspectRatio}R${currentTire.diameter}, New: ${newTire.width}/${newTire.aspectRatio}R${newTire.diameter}. Speed difference: ${formatNumber(speedDiff.difference)} mph at ${currentSpeed} mph.`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      const text = `Tire Size Calculator Results - Current: ${currentTire.width}/${currentTire.aspectRatio}R${currentTire.diameter}, New: ${newTire.width}/${newTire.aspectRatio}R${newTire.diameter}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const currentSpecs = calculateTireSpecs(currentTire)
  const newSpecs = calculateTireSpecs(newTire)
  const speedDiff = showResults ? calculateSpeedometerDifference() : { actualSpeed: 0, difference: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tire Size Calculator</h1>
            <p className="text-blue-100 text-lg">
              Compare tire sizes, calculate speedometer differences, and analyze tire specifications. 
              Perfect for upgrading wheels or understanding tire dimensions.
            </p>
          </div>
          <div className="hidden md:block">
            <Calculator className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Error Display */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Current Tire */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Tire</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tire Width (mm)
                </label>
                <input
                  type="number"
                  value={currentTire.width}
                  onChange={(e) => setCurrentTire(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="135"
                  max="345"
                  title="Enter tire width in millimeters"
                />
                <p className="text-xs text-gray-500 mt-1">Range: 135-345 mm</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio (%)
                </label>
                <input
                  type="number"
                  value={currentTire.aspectRatio}
                  onChange={(e) => setCurrentTire(prev => ({ ...prev, aspectRatio: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="30"
                  max="85"
                  title="Enter aspect ratio percentage"
                />
                <p className="text-xs text-gray-500 mt-1">Range: 30-85%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wheel Diameter (inches)
                </label>
                <input
                  type="number"
                  value={currentTire.diameter}
                  onChange={(e) => setCurrentTire(prev => ({ ...prev, diameter: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="13"
                  max="24"
                  title="Enter wheel diameter in inches"
                />
                <p className="text-xs text-gray-500 mt-1">Range: 13-24 inches</p>
              </div>
            </div>
          </div>

          {/* New Tire */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">New Tire</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tire Width (mm)
                </label>
                <input
                  type="number"
                  value={newTire.width}
                  onChange={(e) => setNewTire(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="135"
                  max="345"
                  title="Enter new tire width in millimeters"
                />
                <p className="text-xs text-gray-500 mt-1">Range: 135-345 mm</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aspect Ratio (%)
                </label>
                <input
                  type="number"
                  value={newTire.aspectRatio}
                  onChange={(e) => setNewTire(prev => ({ ...prev, aspectRatio: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="30"
                  max="85"
                  title="Enter new aspect ratio percentage"
                />
                <p className="text-xs text-gray-500 mt-1">Range: 30-85%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wheel Diameter (inches)
                </label>
                <input
                  type="number"
                  value={newTire.diameter}
                  onChange={(e) => setNewTire(prev => ({ ...prev, diameter: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="13"
                  max="24"
                  title="Enter new wheel diameter in inches"
                />
                <p className="text-xs text-gray-500 mt-1">Range: 13-24 inches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Speed Input */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Speedometer Analysis</h3>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Speed (mph)
            </label>
            <input
              type="number"
              value={currentSpeed}
              onChange={(e) => setCurrentSpeed(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="200"
              title="Enter current speed in mph"
            />
            <p className="text-xs text-gray-500 mt-1">Range: 1-200 mph</p>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            disabled={isLoading}
            className={`font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center mx-auto space-x-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                <span>Calculate Tire Specifications</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Calculation completed successfully!</span>
              </div>
            </div>

            {/* Tire Specifications */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Current Tire: {currentTire.width}/{currentTire.aspectRatio}R{currentTire.diameter}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Circumference:</span>
                    <span className="font-semibold">{formatNumber(currentSpecs.circumference)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revolutions/mile:</span>
                    <span className="font-semibold">{formatNumber(currentSpecs.revolutionsPerMile)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sidewall height:</span>
                    <span className="font-semibold">{formatNumber(currentSpecs.sidewallHeight)} mm</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">New Tire: {newTire.width}/{newTire.aspectRatio}R{newTire.diameter}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Circumference:</span>
                    <span className="font-semibold">{formatNumber(newSpecs.circumference)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revolutions/mile:</span>
                    <span className="font-semibold">{formatNumber(newSpecs.revolutionsPerMile)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sidewall height:</span>
                    <span className="font-semibold">{formatNumber(newSpecs.sidewallHeight)} mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Speedometer Analysis */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">Speedometer Analysis (at {currentSpeed} mph)</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-700">{formatNumber(speedDiff.actualSpeed)}</div>
                  <div className="text-sm text-gray-600">Actual Speed (mph)</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${speedDiff.difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {speedDiff.difference >= 0 ? '+' : ''}{formatNumber(speedDiff.difference)}
                  </div>
                  <div className="text-sm text-gray-600">Speed Difference (mph)</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${speedDiff.difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {speedDiff.difference >= 0 ? '+' : ''}{formatNumber((speedDiff.difference / parseFloat(currentSpeed)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Percentage Difference</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                title="Download results as text file"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={shareResults}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                title="Share results"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={printResults}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                title="Print results"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                title="Reset calculator"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Tire Size Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator helps you compare different tire sizes and understand how they affect your vehicle's performance. 
                It calculates circumference, revolutions per mile, sidewall height, and speedometer accuracy. 
                Use it when upgrading wheels, changing tire sizes, or understanding tire specifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
