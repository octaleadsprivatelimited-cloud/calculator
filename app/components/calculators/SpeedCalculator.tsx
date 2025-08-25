'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Zap, Clock } from 'lucide-react'

interface SpeedResult {
  mph: number
  kmh: number
  ms: number
  knots: number
  fps: number
}

interface TimeDistanceResult {
  time: number
  distance: number
  speed: number
}

const SPEED_UNITS = {
  mph: { name: 'Miles per Hour (mph)', factor: 1 },
  kmh: { name: 'Kilometers per Hour (km/h)', factor: 1.60934 },
  ms: { name: 'Meters per Second (m/s)', factor: 0.44704 },
  knots: { name: 'Knots (nautical miles/h)', factor: 0.868976 },
  fps: { name: 'Feet per Second (ft/s)', factor: 1.46667 }
}

const COMMON_SPEEDS = [
  { name: 'Walking', speed: 3, unit: 'mph' },
  { name: 'Jogging', speed: 6, unit: 'mph' },
  { name: 'Running', speed: 10, unit: 'mph' },
  { name: 'City Driving', speed: 30, unit: 'mph' },
  { name: 'Highway', speed: 65, unit: 'mph' },
  { name: 'Commercial Jet', speed: 550, unit: 'mph' },
  { name: 'Speed of Sound', speed: 767, unit: 'mph' },
  { name: 'Speed of Light', speed: 670616629, unit: 'mph' }
]

export default function SpeedCalculator() {
  const [calculationType, setCalculationType] = useState<'conversion' | 'time' | 'distance'>('conversion')
  const [inputValue, setInputValue] = useState('')
  const [fromUnit, setFromUnit] = useState('mph')
  const [time, setTime] = useState('')
  const [distance, setDistance] = useState('')
  const [showResults, setShowResults] = useState(false)

  const convertSpeed = useCallback((value: number, fromUnit: string): SpeedResult => {
    const mph = value / SPEED_UNITS[fromUnit as keyof typeof SPEED_UNITS].factor
    
    return {
      mph,
      kmh: mph * 1.60934,
      ms: mph * 0.44704,
      knots: mph * 0.868976,
      fps: mph * 1.46667
    }
  }, [])

  const calculateTimeDistance = useCallback((): TimeDistanceResult => {
    if (calculationType === 'time') {
      const speed = parseFloat(inputValue) || 0
      const distanceValue = parseFloat(distance) || 0
      const timeValue = distanceValue / speed
      return { time: timeValue, distance: distanceValue, speed }
    } else {
      const speed = parseFloat(inputValue) || 0
      const timeValue = parseFloat(time) || 0
      const distanceValue = speed * timeValue
      return { time: timeValue, distance: distanceValue, speed }
    }
  }, [calculationType, inputValue, time, distance])

  const handleCalculate = () => {
    if (calculationType === 'conversion') {
      if (inputValue && parseFloat(inputValue) > 0) {
        setShowResults(true)
      }
    } else {
      if (inputValue && parseFloat(inputValue) > 0 && 
          ((calculationType === 'time' && distance && parseFloat(distance) > 0) ||
           (calculationType === 'distance' && time && parseFloat(time) > 0))) {
        setShowResults(true)
      }
    }
  }

  const handleReset = () => {
    setInputValue('')
    setFromUnit('mph')
    setTime('')
    setDistance('')
    setShowResults(false)
  }

  const handleCommonSpeed = (speed: number, unit: string) => {
    setInputValue(speed.toString())
    setFromUnit(unit)
    setCalculationType('conversion')
    setShowResults(true)
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const formatTime = (hours: number) => {
    if (hours < 1) {
      const minutes = hours * 60
      if (minutes < 1) {
        const seconds = minutes * 60
        return `${formatNumber(seconds)} seconds`
      }
      return `${formatNumber(minutes)} minutes`
    }
    return `${formatNumber(hours)} hours`
  }

  const downloadResults = () => {
    if (calculationType === 'conversion') {
      const result = convertSpeed(parseFloat(inputValue), fromUnit)
      
      const data = `Speed Calculator Results

Input: ${inputValue} ${SPEED_UNITS[fromUnit as keyof typeof SPEED_UNITS].name}

Converted Speeds:
- Miles per Hour: ${formatNumber(result.mph)} mph
- Kilometers per Hour: ${formatNumber(result.kmh)} km/h
- Meters per Second: ${formatNumber(result.ms)} m/s
- Knots: ${formatNumber(result.knots)} knots
- Feet per Second: ${formatNumber(result.fps)} ft/s`
      
      const blob = new Blob([data], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'speed-calculator-results.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      const result = calculateTimeDistance()
      
      const data = `Speed Calculator Results

Calculation Type: ${calculationType === 'time' ? 'Time' : 'Distance'}
Speed: ${inputValue} ${SPEED_UNITS[fromUnit as keyof typeof SPEED_UNITS].name}
${calculationType === 'time' ? `Distance: ${distance} miles` : `Time: ${time} hours`}

Result:
${calculationType === 'time' ? `Time: ${formatTime(result.time)}` : `Distance: ${formatNumber(result.distance)} miles`}`
      
      const blob = new Blob([data], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'speed-calculator-results.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const shareResults = () => {
    if (navigator.share) {
      if (calculationType === 'conversion') {
        const result = convertSpeed(parseFloat(inputValue), fromUnit)
        
        navigator.share({
          title: 'Speed Calculator Results',
          text: `${inputValue} ${SPEED_UNITS[fromUnit as keyof typeof SPEED_UNITS].name} = ${formatNumber(result.kmh)} km/h, ${formatNumber(result.ms)} m/s`,
          url: window.location.href
        })
      } else {
        const result = calculateTimeDistance()
        
        navigator.share({
          title: 'Speed Calculator Results',
          text: `${calculationType === 'time' ? 'Time' : 'Distance'} calculation: ${formatNumber(result.speed)} ${SPEED_UNITS[fromUnit as keyof typeof SPEED_UNITS].name}`,
          url: window.location.href
        })
      }
    } else {
      const text = `Speed: ${inputValue} ${SPEED_UNITS[fromUnit as keyof typeof SPEED_UNITS].name}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const speedResult = showResults && calculationType === 'conversion' ? convertSpeed(parseFloat(inputValue), fromUnit) : { mph: 0, kmh: 0, ms: 0, knots: 0, fps: 0 }
  const timeDistanceResult = showResults && calculationType !== 'conversion' ? calculateTimeDistance() : { time: 0, distance: 0, speed: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Speed Calculator</h1>
            <p className="text-cyan-100 text-lg">
              Convert speed units, calculate travel time, and determine distances. 
              Perfect for travel planning, sports, and physics calculations.
            </p>
          </div>
          <div className="hidden md:block">
            <Zap className="w-16 h-16 text-cyan-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Calculation Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Calculation Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'conversion', label: 'Speed Conversion', icon: Zap },
              { key: 'time', label: 'Calculate Time', icon: Clock },
              { key: 'distance', label: 'Calculate Distance', icon: Clock }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCalculationType(key as any)}
                className={`p-4 rounded-lg font-medium transition-colors text-center ${
                  calculationType === key
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Speed Input */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Speed</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speed Value
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="60"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speed Unit
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    aria-label="Select speed unit"
                  >
                    {Object.entries(SPEED_UNITS).map(([key, unit]) => (
                      <option key={key} value={key}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {calculationType === 'time' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Distance</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (miles)
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="100"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            )}

            {calculationType === 'distance' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Time</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time (hours)
                  </label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="2.5"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Common Speeds */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Speeds</h3>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_SPEEDS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleCommonSpeed(item.speed, item.unit)}
                  className="text-left p-2 bg-white rounded border hover:bg-cyan-50 transition-colors text-sm"
                >
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-gray-600">{item.speed} {item.unit}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            disabled={
              !inputValue || parseFloat(inputValue) <= 0 ||
              (calculationType === 'time' && (!distance || parseFloat(distance) <= 0)) ||
              (calculationType === 'distance' && (!time || parseFloat(time) <= 0))
            }
            className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 ${
              !inputValue || parseFloat(inputValue) <= 0 ||
              (calculationType === 'time' && (!distance || parseFloat(distance) <= 0)) ||
              (calculationType === 'distance' && (!time || parseFloat(time) <= 0))
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Calculate</span>
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {calculationType === 'conversion' ? (
              <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <h3 className="text-lg font-semibold text-cyan-800 mb-4">Speed Conversions</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-700">{formatNumber(speedResult.mph)}</div>
                    <div className="text-sm text-gray-600">mph</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-700">{formatNumber(speedResult.kmh)}</div>
                    <div className="text-sm text-gray-600">km/h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-700">{formatNumber(speedResult.ms)}</div>
                    <div className="text-sm text-gray-600">m/s</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-700">{formatNumber(speedResult.knots)}</div>
                    <div className="text-sm text-gray-600">knots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-700">{formatNumber(speedResult.fps)}</div>
                    <div className="text-sm text-gray-600">ft/s</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <h3 className="text-lg font-semibold text-cyan-800 mb-4">Calculation Result</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-700">
                    {calculationType === 'time' 
                      ? formatTime(timeDistanceResult.time)
                      : `${formatNumber(timeDistanceResult.distance)} miles`
                    }
                  </div>
                  <div className="text-sm text-gray-600">
                    {calculationType === 'time' ? 'Travel Time' : 'Distance Traveled'}
                  </div>
                </div>
              </div>
            )}

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
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Speed Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive speed calculator helps you convert between different speed units and 
                perform time-distance calculations. Whether you're planning a trip, analyzing athletic 
                performance, or working on physics problems, this tool provides accurate conversions 
                and calculations across multiple measurement systems.
              </p>
              <p className="text-gray-700">
                The calculator handles speed conversions, travel time calculations, and distance 
                computations, making it versatile for various real-world applications.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Speed Units Explained</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Imperial Units</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Miles per Hour (mph):</strong> Standard US speed measurement</li>
                    <li><strong>Feet per Second (ft/s):</strong> Used in engineering and physics</li>
                    <li><strong>Knots:</strong> Nautical miles per hour, used in aviation and maritime</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Metric Units</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Kilometers per Hour (km/h):</strong> International standard</li>
                    <li><strong>Meters per Second (m/s):</strong> Scientific and engineering use</li>
                    <li><strong>Centimeters per Second:</strong> For very slow movements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Speed References</h3>
              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <h4 className="font-semibold text-gray-800 mb-2">Everyday Speeds</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Human Movement:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Walking: 3-4 mph</li>
                      <li>Jogging: 5-7 mph</li>
                      <li>Running: 8-12 mph</li>
                      <li>Sprinting: 15-20 mph</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Transportation:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>City driving: 25-35 mph</li>
                      <li>Highway: 55-75 mph</li>
                      <li>Commercial jet: 500-600 mph</li>
                      <li>Speed of sound: 767 mph</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Calculation Methods</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Speed Conversion</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Base Unit:</strong> mph (miles per hour)</li>
                    <li><strong>Conversion Factors:</strong> Mathematical multipliers</li>
                    <li><strong>Precision:</strong> Accurate to multiple decimal places</li>
                    <li><strong>Range:</strong> Handles very slow to very fast speeds</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Time-Distance Calculations</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Speed = Distance ÷ Time</strong></li>
                    <li><strong>Time = Distance ÷ Speed</strong></li>
                    <li><strong>Distance = Speed × Time</strong></li>
                    <li><strong>Units:</strong> Automatically handled</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Practical Applications</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Travel Planning:</strong> Estimate driving times and arrival times</li>
                <li><strong>Athletic Training:</strong> Analyze running, cycling, and swimming speeds</li>
                <li><strong>Physics Education:</strong> Learn about motion and velocity concepts</li>
                <li><strong>Engineering:</strong> Calculate machine and vehicle performance</li>
                <li><strong>Navigation:</strong> Plan routes and estimate travel duration</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Use mph for US travel planning and km/h for international destinations</li>
                <li>• Remember that knots are used in aviation and maritime navigation</li>
                <li>• For precise scientific calculations, use meters per second (m/s)</li>
                <li>• Consider traffic conditions when planning travel times</li>
                <li>• Use the calculator to compare different transportation options</li>
                <li>• Factor in rest stops and breaks for long-distance travel planning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
