'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Heart } from 'lucide-react'

export default function TargetHeartRateCalculator() {
  const [age, setAge] = useState('')
  const [restingHR, setRestingHR] = useState('')
  const [method, setMethod] = useState('karvonen')
  const [showResults, setShowResults] = useState(false)

  const calculateHeartRate = useCallback(() => {
    const a = parseFloat(age) || 0
    const rhr = parseFloat(restingHR) || 0
    if (a === 0) return { 
      zones: {}, 
      maxHR: 0, 
      recommendations: [],
      methodName: ''
    }

    let maxHR = 0
    let methodName = ''

    // Calculate max heart rate using different methods
    switch (method) {
      case 'fox':
        maxHR = 220 - a
        methodName = 'Fox Formula (220 - age)'
        break
      case 'gellish':
        maxHR = 207 - (0.7 * a)
        methodName = 'Gellish Formula (207 - 0.7 × age)'
        break
      case 'gulati':
        maxHR = 206 - (0.88 * a)
        methodName = 'Gulati Formula (206 - 0.88 × age)'
        break
      case 'hunt':
        maxHR = 211 - (0.64 * a)
        methodName = 'Hunt Formula (211 - 0.64 × age)'
        break
      default:
        maxHR = 220 - a
        methodName = 'Fox Formula (220 - age)'
    }

    // Calculate heart rate zones
    const zones = {
      'Rest': { min: rhr, max: rhr, description: 'Resting heart rate' },
      'Zone 1 (Recovery)': { 
        min: Math.round((maxHR - rhr) * 0.5 + rhr), 
        max: Math.round((maxHR - rhr) * 0.6 + rhr), 
        description: 'Light activity, recovery' 
      },
      'Zone 2 (Aerobic)': { 
        min: Math.round((maxHR - rhr) * 0.6 + rhr), 
        max: Math.round((maxHR - rhr) * 0.7 + rhr), 
        description: 'Fat burning, endurance' 
      },
      'Zone 3 (Tempo)': { 
        min: Math.round((maxHR - rhr) * 0.7 + rhr), 
        max: Math.round((maxHR - rhr) * 0.8 + rhr), 
        description: 'Aerobic threshold' 
      },
      'Zone 4 (Threshold)': { 
        min: Math.round((maxHR - rhr) * 0.8 + rhr), 
        max: Math.round((maxHR - rhr) * 0.9 + rhr), 
        description: 'Lactate threshold' 
      },
      'Zone 5 (Anaerobic)': { 
        min: Math.round((maxHR - rhr) * 0.9 + rhr), 
        max: Math.round((maxHR - rhr) * 1.0 + rhr), 
        description: 'Maximum effort' 
      }
    }

    // Generate recommendations
    const recommendations = []
    if (maxHR > 0) {
      recommendations.push(`Your maximum heart rate is approximately ${maxHR} BPM`)
      recommendations.push('Zone 2-3 is ideal for most cardio workouts')
      recommendations.push('Zone 4-5 should be used sparingly for high-intensity training')
      recommendations.push('Monitor your heart rate during exercise for optimal training')
    }

    return { zones, maxHR, recommendations, methodName }
  }, [age, restingHR, method])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setRestingHR('')
    setMethod('karvonen')
    setShowResults(false)
  }

  const result = showResults ? calculateHeartRate() : { 
    zones: {}, 
    maxHR: 0, 
    recommendations: [],
    methodName: ''
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Target Heart Rate Calculator</h2>
        </div>
        <p className="text-red-100 mt-1">Calculate your heart rate training zones</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter age"
                aria-label="Age in years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resting Heart Rate (BPM)
              </label>
              <input
                type="number"
                value={restingHR}
                onChange={(e) => setRestingHR(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter resting HR"
                aria-label="Resting heart rate in BPM"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max HR Formula
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Select max heart rate formula"
            >
              <option value="fox">Fox Formula (Most Common)</option>
              <option value="gellish">Gellish Formula</option>
              <option value="gulati">Gulati Formula</option>
              <option value="hunt">Hunt Formula</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Calculator className="h-5 w-5 inline mr-2" />
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <RotateCcw className="h-5 w-5 inline mr-2" />
              Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Maximum Heart Rate</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {result.maxHR} BPM
                </div>
                <div className="text-red-700">
                  Using {result.methodName}
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Heart Rate Zones</h3>
              <div className="space-y-3">
                {Object.entries(result.zones).map(([zone, data]) => (
                  <div key={zone} className="border-l-4 border-red-300 pl-3">
                    <h4 className="font-medium text-red-700">{zone}</h4>
                    <div className="text-sm text-red-600">
                      {data.min} - {data.max} BPM
                    </div>
                    <div className="text-xs text-red-500 mt-1">{data.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-red-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
